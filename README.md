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

## 2. Onde trocar os dados do escritório

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

## 3. Conteúdo dos serviços

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

## 4. Deploy na Vercel

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

> **⚠️ Cuidado com e-mail ao apontar o domínio.** O registro MX da
> `deeptax.com.br` aponta para o próprio domínio, então ele depende do registro
> **A**. Ao apontar o A para a Vercel, o e-mail para de funcionar, porque a
> Vercel não recebe SMTP. Mantenha um hostname dedicado de e-mail (por exemplo
> `mail.deeptax.com.br` com A para o servidor de e-mail) e aponte o MX para ele.

## 5. Como os leads são capturados

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

## 6. Estrutura de páginas

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

SEO já configurado: metadados por página, Open Graph, Twitter Card, dados
estruturados (`AccountingService`, `Service` e `FAQPage`), `sitemap.xml` e
`robots.txt` gerados automaticamente.

---

## 7. Scripts de verificação (opcional)

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

## 8. Design system

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
| E-mail | atendimento@deeptax.com.br |
| CNPJ | 45.691.496/0001-25 |

### Pendências antes de publicar

Campos sem dado real ficam como `""` em `src/lib/site.ts` e **não são
renderizados** — o site nunca exibe dado inventado. Procure por `PENDENTE`:

- [x] **CRC e CEP** — decisão de não publicar por ora. Ficam vazios em
      `src/lib/site.ts` e a interface simplesmente não os exibe.
- [ ] **Complemento** (sala/conjunto/andar), se houver.
- [ ] **E-mail do domínio fora do ar** — o MX de `deeptax.com.br` aponta para o
      próprio domínio e depende do registro A, que agora aponta para a Vercel.
      Não afeta o site (a comunicação é por WhatsApp), mas afeta quem escreve
      para `atendimento@deeptax.com.br`. Ver o alerta na seção de deploy.
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

