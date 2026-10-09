# Deeptax — site institucional

Site institucional do escritório contábil **Deeptax**, com quatro subpáginas de
serviço (auditoria, consultoria, serviços contábeis e perícia contábil) e captura
de leads integrada a WhatsApp e API própria.

Construído com **Next.js 15** (App Router), **React 19**, **TypeScript** e
**Tailwind CSS 4**.

---

## 1. Como rodar

```bash
# o npm deste ambiente não está no PATH por padrão:
export PATH="/root/.nvm/versions/node/v22.23.2/bin:$PATH"

npm install          # instalar dependências
npm run dev          # ambiente de desenvolvimento em http://localhost:3000
npm run build        # build de produção
npm start            # servir o build de produção
```

> O cache do npm está configurado em `.npm-cache/` dentro do projeto (arquivo
> `.npmrc`) porque neste ambiente o sandbox não permite escrita em `/root/.npm`.
> Esse `.npmrc` é local e **não** é versionado — um clone normal usa o cache
> padrão do npm e não precisa dele.

---

## 2. Editar o conteúdo (painel)

Os textos e dados do site ficam em `content/` — arquivos de **dados**, não de
código:

| Arquivo | Conteúdo |
| --- | --- |
| `content/site.json` | Dados do escritório: contato, endereço, identificação, diferenciais, FAQ |
| `content/services.json` | As seis áreas e todo o conteúdo das páginas internas |
| `content/paginas.json` | Textos das páginas: inicial, sobre, contato, serviços e política |

Há duas formas de editá-los:

**Pelo painel** (recomendado, sem mexer em código): **/admin/login** no site.
Ele mostra o conteúdo em formulário, valida e grava no repositório; a Vercel
publica sozinha. Configuração e uso em
[`docs/PAINEL-DE-CONTEUDO.md`](docs/PAINEL-DE-CONTEUDO.md).

**Editando o JSON**: altere `content/site.json` ou `content/services.json` e
publique. Serve para mudanças em lote ou quando o painel não estiver
configurado.

> O painel precisa de `ADMIN_PASSWORD` e `GITHUB_TOKEN` na Vercel. Sem eles ele
> abre apenas com o aviso do que falta — não fica aberto nem falha em silêncio.

---

## 3. Onde trocar os dados do escritório

**Um único arquivo:** `src/lib/site.ts`

Ele concentra marca, CNPJ, CRC, telefone, WhatsApp, e-mail, endereço, horário,
redes sociais, números, diferenciais, depoimentos e FAQ. Todos os campos que
precisam de dado real estão marcados com `<<< >>>`.

### Atenção especial a dois campos

| Campo | Formato | Usado em |
| --- | --- | --- |
| `contact.whatsappNumber` | **apenas dígitos**, com `55` + DDD + número. Ex.: `5511987654321` | links `wa.me` de todo o site |
| `url` | domínio final, com `https://` | SEO, sitemap, canonical, Open Graph |

Se `whatsappNumber` ficar com parênteses, traços ou espaços, os botões de
WhatsApp quebram.

---

## 4. Conteúdo dos serviços

**Arquivo:** `src/lib/services.ts`

Cada serviço é um objeto com hero, introdução, público-alvo, escopo detalhado,
metodologia, entregáveis, FAQ, CTA e metadados de SEO. As subpáginas são geradas
automaticamente a partir desse arquivo pela rota dinâmica
`src/app/servicos/[slug]/page.tsx`.

Para **adicionar um quinto serviço**, basta incluir um novo objeto no array
`services`. A navegação, o rodapé, o sitemap, os cards e a rota são atualizados
sozinhos.

Para **renomear a URL** de um serviço, altere o campo `slug` (ele controla o
endereço `/servicos/<slug>`).

---

## 5. Deploy na Vercel

O deploy é direto: a Vercel detecta Next.js automaticamente, sem build command
customizado e **sem nenhuma variável de ambiente obrigatória**. Cada `git push`
na branch `main` gera um deploy automático (leva ~50 segundos).

### Confirmar qual build está no ar

```bash
curl -s https://www.deeptax.com.br/api/version | jq .
```

Responde o commit publicado, a branch, o ambiente e a região. Existe porque
verificar deploy por comportamento engana: alterações só no servidor não mudam
o HTML, e mensagens de erro podem ser idênticas entre builds diferentes.

### Depois do deploy

- O domínio `deeptax.com.br` aponta para a Vercel (A `216.198.79.1`) e o apex
  redireciona 308 para `https://www.deeptax.com.br`.
- Para trocar o domínio canônico sem mexer em código, defina
  `NEXT_PUBLIC_SITE_URL` em *Settings → Environment Variables*.

> **⚠️ Cuidado com e-mail ao apontar o domínio.** O MX **não pode** apontar
> para o próprio domínio (`deeptax.com.br`), porque ele passaria a depender do
> registro **A** — que aponta para a Vercel, e a Vercel não recebe SMTP. Foi
> exatamente o que aconteceu aqui e derrubou o e-mail até o MX ser corrigido.
> A configuração correta, com o site na Vercel e o e-mail na Hostinger, é:
>
> | Tipo | Nome | Valor |
> | --- | --- | --- |
> | A | `@` | `216.198.79.1` (Vercel — o site) |
> | CNAME | `www` | `deeptax.com.br` |
> | MX | `@` | `mx1.hostinger.com` (prioridade 5) |
> | MX | `@` | `mx2.hostinger.com` (prioridade 10) |
> | TXT | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` (apenas um) |

## 6. Como os leads são capturados

**Tudo pelo WhatsApp, sem backend.** O formulário não envia nada para o nosso
servidor: ele monta a mensagem no navegador do visitante e abre a conversa no
WhatsApp do escritório já preenchida.

Fluxo:

1. O visitante preenche o formulário (`src/components/LeadForm.tsx`).
2. Validação no próprio navegador (`src/lib/lead-whatsapp.ts` monta o texto).
3. Ao enviar, abre o WhatsApp com nome, empresa, telefone, e-mail (opcional),
   serviço de interesse e a mensagem — mais a origem (qual página).
4. A tela de confirmação oferece o link novamente, caso o navegador bloqueie a
   abertura automática.

### O que isso implica

- **Não existe** banco de dados, API de contato, webhook, e-mail automático,
  planilha ou arquivo de leads. Não há nada para configurar nem para monitorar.
- Nenhum dado é gravado durante o preenchimento. O lead existe apenas na
  conversa de WhatsApp, depois que o visitante decide enviar.
- Não há falha de servidor possível no envio: o visitante sempre sai do
  formulário com um canal aberto.
- A Política de Privacidade reflete exatamente isso — inclusive a ausência de
  registro de IP e de cookies de rastreamento.

O número de destino vem de `contact.whatsappNumber` em `src/lib/site.ts`
(somente dígitos, com `55` + DDD).

### O e-mail no site é apenas informativo

O e-mail do escritório aparece no topo, no rodapé, na página de contato, na
chamada final e na Política de Privacidade — sempre como `mailto:`, ou seja,
abrindo o programa de e-mail do visitante. **O site nunca envia e-mail**: não
há disparo automático, notificação nem resposta por e-mail em nenhum fluxo.

A comunicação do escritório é feita pelo WhatsApp. Se algum dia for necessário
voltar a receber leads por e-mail, o caminho é reintroduzir um destino no
servidor — e nesse caso vale reler a observação sobre MX e registro A na
seção de deploy, porque o e-mail do domínio depende disso.

## 7. Estrutura de páginas

| Rota | Arquivo | Conteúdo |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Hero com formulário, serviços, diferenciais, números, processo, depoimentos, FAQ, CTA |
| `/servicos` | `src/app/servicos/page.tsx` | Visão geral e comparativo das quatro frentes |
| `/servicos/auditoria` | `src/app/servicos/[slug]/page.tsx` | Auditoria contábil |
| `/servicos/consultoria` | idem | Consultoria contábil e tributária |
| `/servicos/servicos-contabeis` | idem | Serviços contábeis e departamento pessoal |
| `/servicos/pericia-contabil` | idem | Perícia contábil |
| `/sobre` | `src/app/sobre/page.tsx` | História, valores, time, dados do escritório |
| `/contato` | `src/app/contato/page.tsx` | Canais de contato, formulário completo e FAQ |
| `/politica-de-privacidade` | `src/app/politica-de-privacidade/page.tsx` | LGPD |
| `/api/version` | `src/app/api/version/route.ts` | Identifica o commit publicado (verificação de deploy) |
| `/admin/login` | `src/app/admin/login/page.tsx` | Acesso ao painel |
| `/admin` | `src/app/admin/page.tsx` | Painel de edição de conteúdo (ver [`docs/PAINEL-DE-CONTEUDO.md`](docs/PAINEL-DE-CONTEUDO.md)) |

O link **Blog** (`https://blog.deeptax.com.br`) aparece em dois lugares: no
menu do topo, entre "Sobre" e "Contato", e na coluna "Escritório" do rodapé.
É link externo: abre em nova aba com `rel="noopener noreferrer"`, com ícone de
link externo e texto para leitor de tela ("abre em nova aba"). A URL fica em
`blogUrl` (`src/lib/site.ts`).

SEO já configurado: metadados por página, Open Graph, Twitter Card, dados
estruturados (`AccountingService`, `Service` e `FAQPage`), `sitemap.xml` e
`robots.txt` gerados automaticamente.

---

## 8. Scripts de verificação (opcional)

A pasta `scripts/` traz três utilitários de QA usados para validar o site. Eles
dependem de `playwright-core` (já instalado como dependência de desenvolvimento)
e de um navegador Chromium disponível na máquina.

```bash
# captura telas de todas as páginas (desktop e mobile) e reporta erros de console
node scripts/screenshot.mjs http://localhost:3000

# verifica rolagem horizontal, h1 único, ids duplicados, imagens sem alt e
# links sem texto acessível em 4 larguras de tela
node scripts/check-layout.mjs http://localhost:3000

# testa a captura de lead nos DOIS formulários da home, no navegador real:
# valida os campos e confere que o WhatsApp abre com a mensagem montada
npx next start -p 3200 &
node scripts/test-forms.mjs http://localhost:3200

# investiga a causa raiz de um overflow horizontal em uma rota específica
node scripts/diagnose-overflow.mjs /servicos/auditoria
```

Se o Chromium estiver em outro caminho, defina `CHROME_PATH`:

```bash
CHROME_PATH=/usr/bin/chromium node scripts/check-layout.mjs
```

As telas são salvas em `.screenshots/`. Para remover essa ferramenta do projeto:

```bash
npm uninstall playwright-core && rm -rf scripts
```

---

## 9. Design system

- **Cores:** definidas em `src/app/globals.css` no bloco `@theme`
  (`brand` = azul institucional, `accent` = verde de conversão, `gold` = detalhe).
- **Tipografia:** Sora (títulos) e Inter (texto), via `next/font`.
- **Utilitários próprios:** `container-x`, `text-gradient`, `bg-ink`, `bg-grid`,
  `glass`.

### Dados já aplicados

| Dado | Valor |
| --- | --- |
| Endereço | Avenida Paulista, 1636 — São Paulo/SP |
| Telefone / WhatsApp | (11) 93236-2770 |
| Número para links `wa.me` | 5511932362770 |
| E-mail | contato@deeptax.com.br |
| CNPJ | 45.691.496/0001-25 |

### Pendências antes de publicar

Campos sem dado real ficam como `""` em `src/lib/site.ts` e **não são
renderizados** — o site nunca exibe dado inventado. Procure por `PENDENTE`:

- [x] **CRC** — CRC-SP 2SP045819/O-4, exibido no topo, no rodapé e no bloco de
      dados do escritório.
- [x] **CEP** — 01310-200, exibido no endereço completo e no `postalCode` do
      JSON-LD.
- [x] **Complemento e bairro** — Conjunto 1504, Bela Vista.
- [x] **Razão social** — o site exibe o registro **vigente**
      ("Forty Five Consultoria Fiscal Contabilidade Tecnologia Ltda"), porque
      o contrato social ainda será alterado. O escritório adotará
      "DeepTax Estratégia Contabilidade Tecnologia Ltda" — quando a alteração
      estiver averbada na Junta Comercial e refletida no CNPJ e no CRC, trocar
      apenas `legalName` em `src/lib/site.ts`.
- [x] **Copyright do rodapé** — usa a marca (`site.name`), não a razão social:
      "© 2026 Deeptax. Todos os direitos reservados." Os dois campos são
      independentes de propósito, para o copyright não acompanhar uma troca de
      razão social.
- [ ] **CONFERIR o nome fantasia** — "DeepAdvisory Estratégia Empresarial" não
      consta no registro consultado; confirmar se deve ser exibido, já que a
      marca e a razão social agora são "Deeptax".
- [ ] **Complemento** (sala/conjunto/andar), se houver.
- [x] **E-mail do domínio** — resolvido. O MX passou a apontar para os
      servidores da Hostinger (`mx1.hostinger.com` prioridade 5 e
      `mx2.hostinger.com` prioridade 10), independentes do registro A, que
      segue na Vercel para o site. Verificado por conexão SMTP: a caixa
      `contato@deeptax.com.br` aceita mensagens. DKIM configurado (seletor
      `default`) e DMARC em `p=none`.
- [ ] **SPF duplicado** — existem hoje **dois** registros TXT de SPF no domínio:
      o antigo (`v=spf1 +a +mx +ip4:51.161.115.176 ~all`, do servidor anterior)
      e o da Hostinger (`v=spf1 include:_spf.mail.hostinger.com ~all`).
      Pela RFC 7208, mais de um registro SPF faz a verificação resultar em
      `permerror` — ou seja, **nenhum** dos dois vale, e mensagens enviadas
      pelo domínio tendem a cair em spam. Ação: apagar o registro antigo e
      manter apenas o da Hostinger.
- [ ] **Domínio** — `deeptax.com.br` já aponta para a Vercel (A `216.198.79.1`)
      e o apex redireciona 308 para `https://www.deeptax.com.br`, que é o
      canônico definido em `src/lib/site.ts`. Para trocar o canônico sem mexer
      em código, defina `NEXT_PUBLIC_SITE_URL` na Vercel.
- [ ] **Números reais** (`stats`) — a faixa de números está **oculta** até você
      informar dados verificáveis. Formato no comentário do arquivo.
- [ ] **Depoimentos reais autorizados** (`testimonials`) — a seção está
      **oculta** até haver relatos reais com autorização do cliente.
- [ ] **LinkedIn / Instagram** (`social`) — ícones ocultos enquanto vazios.
- [ ] Inserir a **logo oficial** (a atual é uma marca provisória em
      `src/components/Logo.tsx`) e uma imagem de Open Graph.
- [ ] Revisar a **Política de Privacidade** com o responsável jurídico e datar.

