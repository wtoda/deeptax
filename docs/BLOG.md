# Blog da Deeptax

O blog vive em **https://www.deeptax.com.br/blog** — dentro do domínio
principal, e não em subdomínio.

O antigo `blog.deeptax.com.br` era WordPress, foi descontinuado e **não tem mais
registro DNS**. Os links do menu e do rodapé que apontavam para lá passaram a
apontar para `/blog`; a configuração `blogUrl` do conteúdo foi removida para não
sobrar um campo que ninguém deve preencher de novo.

---

## Por que no domínio principal

O Google trata subdomínio como site separado: o que o blog conquista não soma
para o domínio institucional. Em `/blog`, cada artigo publicado reforça o mesmo
domínio, entra no mesmo `sitemap.xml` e herda a autoridade das páginas de
serviço. Custa uma decisão a menos (não há segundo certificado, nem segundo
DNS) e um painel só.

---

## Como escrever e publicar

Painel em **https://www.deeptax.com.br/admin/login** → aba **Blog**.

1. **+ Novo** cria um artigo.
2. **Título** define o endereço automaticamente (o campo *Endereço* pode ser
   editado depois: vira `deeptax.com.br/blog/<endereço>`).
3. **Resumo** é o texto que aparece na lista e na descrição do Google — até 300
   caracteres.
4. **Conteúdo** é montado em blocos: parágrafo, título, lista (com ou sem
   numeração), citação e imagem. Cada bloco é preenchido no seu campo; não há
   marcação para digitar. Os blocos podem ser reordenados com ↑ ↓.
5. **Manter como rascunho** deixa o artigo fora do site, da busca e do sitemap.
   Desmarque para publicar.
6. **Salvar** grava e dispara a reconstrução automática (~1 minuto).

### Formatação dentro de um bloco

Opcional, e só o básico: `**negrito**`, `*itálico*` e `[texto](https://…)` para
link. O texto é sempre renderizado como texto — um post não consegue injetar
marcação na página.

### Imagens

*Enviar imagem* no próprio painel. Aceita **JPG, PNG e WebP até 4 MB**; o
formato é conferido pelos bytes do arquivo, não pela extensão. **SVG é recusado
de propósito** — é um formato que pode executar código.

Toda imagem precisa de **descrição** (texto alternativo): é o que o leitor de
tela anuncia e o que o Google usa para entender a imagem. O painel não deixa
salvar sem ela.

As imagens ficam em `arquivos/midia/`, **fora de `public/`**: o Next congela a
lista de arquivos públicos quando o servidor sobe, então uma imagem enviada
depois responderia 404 até reiniciar. São servidas pela rota `/midia/<arquivo>`
com cache de um ano (o nome é o hash do conteúdo, então o endereço nunca muda
para o mesmo arquivo).

> **Backup:** `arquivos/midia/` é o único conteúdo que **não** está no Git.
> Inclua essa pasta no backup do servidor. Se ela se perder, os posts continuam
> publicados, mas as imagens somem.

---

## Onde o conteúdo mora

```
content/posts.json      todos os posts (o painel grava o arquivo inteiro)
arquivos/midia/         imagens enviadas pelo painel (não versionado)
src/lib/blog.ts         modelo, validação, ordenação e formatação
src/components/blog/    cartão da lista e renderização do corpo
```

Um post tem esta forma:

```json
{
  "slug": "reforma-tributaria-2026",
  "titulo": "O que muda na apuração em 2026",
  "resumo": "…até 300 caracteres…",
  "autor": "Deeptax",
  "data": "2026-11-06",
  "atualizadoEm": "2026-12-01",
  "tags": ["reforma tributária", "IBS"],
  "capa": { "src": "/midia/a4bcd7b80c65e14e.png", "alt": "descrição" },
  "rascunho": false,
  "blocos": [
    { "tipo": "paragrafo", "texto": "Texto." },
    { "tipo": "titulo", "nivel": 2, "texto": "Seção" },
    { "tipo": "lista", "ordenada": false, "itens": ["um", "dois"] },
    { "tipo": "citacao", "texto": "…", "autor": "Quem disse" },
    { "tipo": "imagem", "src": "/midia/…", "alt": "…", "legenda": "…" }
  ]
}
```

A validação (`validarPosts`) roda **antes de gravar** e no build. Se algo estiver
errado, o painel recusa o salvamento com a lista de problemas e o site continua
na versão anterior — em vez de publicar uma página quebrada. Os casos cobertos:

- título, resumo, endereço e data obrigatórios; data precisa existir no calendário;
- endereço em minúsculas com hífen, e **sem repetir** outro post;
- tipo de bloco desconhecido;
- imagem sem descrição;
- mais de 6 temas.

---

## SEO

- `/blog` e cada artigo têm `title`, `description`, `canonical` e Open Graph
  próprios.
- `BlogPosting` + `BreadcrumbList` em JSON-LD em cada artigo, e `Article` no
  Open Graph com data de publicação e de atualização.
- **Rascunho não existe publicado**: não entra em `generateStaticParams`, então o
  endereço responde 404 e nada aparece no sitemap.
- Feed em **`/blog/rss.xml`** (RSS 2.0 com o corpo completo).
- **Blog vazio não é indexado**: enquanto não há artigo publicado, `/blog`
  responde com `noindex, follow` e fica fora do sitemap. No instante em que o
  primeiro artigo é publicado, passa a ser indexável.
- Artigos com tema em comum se linkam automaticamente ("Continue lendo").

---

## Publicação

Salvar no painel grava `content/posts.json`. O observador do sistema
(`deeptax-reconstruir.path`) percebe a mudança e reconstrói o site em uma pasta
separada, trocando de forma atômica — sem janela de erro. Ver
[`DEPLOY-VPS.md`](./DEPLOY-VPS.md).

Para publicar código (e não conteúdo), o procedimento é o do mesmo documento —
com atenção ao `chown` depois do `tar`.

---

## Limitações conhecidas

- **Não há página por tema.** As tags aparecem no artigo e na lista, mas não
  viram endereço próprio. É deliberado: com poucos artigos, páginas de tema
  ficariam vazias e prejudicariam mais do que ajudariam. Quando houver volume,
  vale criar — o modelo já tem `postsPorTag`.
- **Não há agendamento.** A data é informativa; o artigo é publicado no
  momento em que você salva sem a marca de rascunho.
- **Não há tabela** entre os blocos. Para comparativos, use lista ou imagem.
- **A imagem não é redimensionada** no servidor (não há `sharp` instalado). Envie
  já no tamanho de uso, até 1200 px de largura — o limite de 4 MB existe para
  isso.
