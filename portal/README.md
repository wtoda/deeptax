# Reforma Tributária — portal da Deeptax

Portal de referência, simulação e divulgação da **Reforma Tributária do
Consumo** (IBS, CBS e Imposto Seletivo), construído sobre a EC 132/2023, a
LC 214/2025 e material oficial da Receita Federal.

Publicado em **https://www.deeptax.com.br/reforma-tributaria/**

Origem: adaptação do sistema Harness Tax (Autoezek), com identidade, marca,
roteamento e SEO refeitos para a Deeptax.

---

## Por que o build existe

O app é uma SPA em JavaScript puro. Servido como está, o Google veria **uma
única página** com HTML vazio — o conteúdo só aparece depois que o JavaScript
executa. Isso anularia o objetivo de atrair tráfego orgânico.

`build.mjs` resolve isso: abre cada tela num navegador real, captura o HTML já
renderizado e grava **uma página estática por rota**, com título, descrição,
canonical e dados estruturados próprios.

```
/reforma-tributaria/                  →   880 palavras no HTML
/reforma-tributaria/legislacao/       → 4.291
/reforma-tributaria/documentos/       → 2.102
/reforma-tributaria/entenda/          → 2.071
/reforma-tributaria/cronograma/       → 1.009
/reforma-tributaria/calculadora/      → 1.433
/reforma-tributaria/aprender/         →   530
```

O app continua funcionando normalmente sobre a página pré-renderizada.

## Como construir e publicar

```bash
node build.mjs              # gera dist/ (13 páginas + assets)
node verificar-links.mjs    # confere que todo link interno resolve
node testar-apoio.mjs       # confere o bloco de apoio no navegador

# publicar no VPS
tar czf - -C dist . | ssh root@187.127.60.53 \
  'tar xzf - -C /opt/deeptax/portal \
   && chown -R www-data:www-data /opt/deeptax/portal'
```

O nginx serve `/reforma-tributaria/` direto de `/opt/deeptax/portal` — sem
Node, sem `proxy_pass`, sem reinício do site institucional. Configuração em
`/etc/nginx/sites-available/deeptax.com.br`.

Depois de publicar, confira:

```bash
curl -sI https://www.deeptax.com.br/reforma-tributaria/ | head -1
```

## Conteúdo

13 telas: painel, cronograma 2026→2033, entenda o modelo, antes e depois,
legislação com análise de impacto, calculadora com memória de cálculo,
documentos fiscais, DeRE, conformidade, kit de divulgação, glossário, quiz e
fontes.

## SEO

- Cada rota tem `<title>`, `description`, `canonical` e `og:*` próprios, em
  `seo.json` — é ali que se ajusta o que o Google lê.
- Todas as 13 URLs entram no sitemap do site principal
  (`src/app/sitemap.ts`), que é a única fonte de URLs do domínio.
- O portal **não** tem `robots.txt` próprio: rastreadores só leem o da raiz.
- Links internos vêm do menu, do rodapé e de uma seção na home do site
  institucional — é o que transfere autoridade para as páginas do portal.

### Conteúdo de apoio (`seo-extra.json`)

Telas que são ferramentas (calculadora, comparativo, quiz) têm pouco texto: o
valor está na interação, não em parágrafos. Para não ficarem rasas aos olhos do
rastreador, `seo-extra.json` acrescenta a cada tela, **abaixo do app**:

- parágrafos que explicam o que a ferramenta faz e como ler o resultado;
- perguntas frequentes (com `FAQPage` em JSON-LD);
- três links para telas relacionadas (malha interna).

O bloco entra **depois do `<main>`**, e não dentro dele: o app faz
`main.innerHTML = ""` a cada navegação e apagaria o conteúdo injetado. O build
grava o bloco de cada tela no HTML estático; `app.js` reescreve o mesmo bloco ao
navegar sem recarregar, para a página nunca exibir o texto da tela anterior.

Resultado medido (texto total da página):

| tela | antes | depois |
| --- | --- | --- |
| calculadora | 1.044 | 1.558 (+49%) |
| comparativo | 608 | 981 (+61%) |
| divulgação | 743 | 994 (+34%) |
| glossário | 672 | 888 (+32%) |
| conformidade | 604 | 838 (+39%) |
| aprender | 459 | 651 (+42%) |

As telas que já tinham texto próprio (legislação, documentos, entenda,
cronograma, DeRE, fontes) ficaram **idênticas** — o bloco só entra onde falta
substância, e não como enchimento uniforme.

## Armadilhas do build

- **`String.replace` com string de substituição interpreta `$`.** O conteúdo tem
  valores como `R$&nbsp;374,57`, e `$&` significa "o match inteiro": a injeção
  do `<main>` cuspia tags no meio das tabelas de valores e corrompia o HTML que
  o rastreador lia. Toda substituição que injeta conteúdo usa **função**.
  O build agora falha se a página não tiver exatamente um `<main>`.
- **O painel é a raiz do portal** (`/reforma-tributaria/`), não
  `/reforma-tributaria/painel/`. O nginx redireciona 301 o endereço antigo.
  `verificar-links.mjs` existe porque esse link quebrado passou despercebido:
  clicar dentro do app funcionava (o router intercepta), mas nova aba e
  rastreador recebiam 404.

## Estrutura

```
portal/
├── index.html          shell da aplicação (vira a base de todas as páginas)
├── seo.json            título/descrição/canonical de cada tela
├── seo-extra.json      texto de apoio, FAQ e links por tela
├── build.mjs           pré-renderização + SEO + dados estruturados
├── verificar-links.mjs confere os links internos de dist/
├── testar-apoio.mjs    testa o bloco de apoio no navegador
├── assets/
│   ├── css/estilo.css  identidade visual Deeptax (variáveis no :root)
│   └── js/
│       ├── app.js      roteador (caminhos reais, sem hash)
│       ├── dados.js    base de conteúdo editorial
│       ├── motor.js    motor de cálculo IBS/CBS/IS
│       └── views/      13 telas
└── dist/               saída do build (não versionar)
```

> **Roteamento:** os links são caminhos reais (`/reforma-tributaria/<tela>/`),
> não hash. É o que permite indexar e compartilhar cada tela. O nginx faz o
> fallback para `index.html` das rotas de tela.
