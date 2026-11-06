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
/reforma-tributaria/                  → 880 palavras no HTML
/reforma-tributaria/cronograma/       → 1.009
/reforma-tributaria/calculadora/      → 291
/reforma-tributaria/legislacao/       → 4.291
/reforma-tributaria/documentos/       → 2.074
```

O app continua funcionando normalmente sobre a página pré-renderizada.

## Como construir e publicar

```bash
node build.mjs          # gera dist/ (13 páginas + assets)

# publicar no VPS
tar czf - -C dist . | ssh root@187.127.60.53 \
  'mkdir -p /opt/deeptax/portal && tar xzf - -C /opt/deeptax/portal \
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

## Estrutura

```
portal/
├── index.html          shell da aplicação (vira a base de todas as páginas)
├── seo.json            título/descrição/canonical de cada tela
├── build.mjs           pré-renderização + SEO
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
