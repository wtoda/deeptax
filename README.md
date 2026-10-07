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

### ⚠️ Leia isto antes de publicar

**Na Vercel o formulário só grava leads se `LEAD_WEBHOOK_URL` estiver configurada.**

O sistema de arquivos das funções serverless é somente leitura e `/tmp` é
descartado entre execuções — não existe persistência local possível. O código
detecta esse cenário e, sem a variável:

- a API responde **503** (não finge sucesso);
- grava um erro explícito no log da função explicando a causa;
- o formulário mostra o botão **“Enviar pelo WhatsApp”** com todos os dados já
  preenchidos — o lead é preservado, mas não fica registrado no sistema.

Com `LEAD_WEBHOOK_URL` configurada, o lead é enviado por POST em JSON para o
destino escolhido (Slack, n8n, Make, Zapier, Google Apps Script, CRM).

### Passo a passo

1. **Importe o repositório** em https://vercel.com/new — o projeto é Next.js e a
   Vercel detecta tudo automaticamente (sem build command customizado).
2. **Configure a variável de ambiente** em *Settings → Environment Variables*:
   - `LEAD_WEBHOOK_URL` = URL do seu webhook de destino (obrigatória)
3. **Deploy.** A partir daí, cada `git push` na branch `main` gera um deploy
   automático.

### Alternativa por linha de comando

```bash
npm i -g vercel
vercel login
vercel --prod
vercel env add LEAD_WEBHOOK_URL production
```

### Depois do deploy

- Aponte o domínio em *Settings → Domains* e atualize `site.url` em
  `src/lib/site.ts` para o domínio final (afeta canonical, sitemap e Open Graph).
- Teste o formulário publicado e confirme que o lead chegou no destino.

---

## 5. Como os leads são capturados

Fluxo:

1. O visitante preenche o formulário (`src/components/LeadForm.tsx`).
2. Validação no navegador → `POST /api/leads` (`src/app/api/leads/route.ts`).
3. Validação no servidor (`src/lib/leads.ts`) e descarte de bots por honeypot.
4. Persistência: envia para `LEAD_WEBHOOK_URL` (destino durável em serverless)
   e/ou grava em `data/leads.jsonl` (durável em VPS/container).
5. A tela de sucesso oferece um botão de WhatsApp já com a mensagem preenchida.
6. **Se nenhum destino durável estiver disponível**, a API responde 503 e a tela
   de erro oferece o botão “Enviar pelo WhatsApp” com os dados já preenchidos —
   o lead é encaminhado em vez de ser perdido em silêncio.

### Destino dos leads (padrão: e-mail via FormSubmit)

Sem nenhuma variável configurada, os leads são entregues **por e-mail** em
`atendimento@deeptax.com.br` (ou no endereço de `LEAD_EMAIL_TO`), usando o
[FormSubmit](https://formsubmit.co). Não exige conta, servidor nem planilha —
apenas **ativar o endereço uma vez**, clicando no link que o FormSubmit envia no
primeiro envio. Sem essa ativação nenhum lead é entregue, e nesse caso o
formulário avisa o visitante e oferece o WhatsApp (não há perda silenciosa).

Para usar um destino próprio (planilha do Google, Slack, n8n, Zapier, CRM),
defina `LEAD_WEBHOOK_URL` — ela tem precedência sobre o FormSubmit. O guia da
planilha está em `docs/LEADS-GOOGLE-SHEETS.md`.

> **Cuidado ao integrar destinos novos:** eles precisam sinalizar falha no
> **status HTTP**. Serviços que respondem `HTTP 200` com um erro no corpo
> quebram a detecção de sucesso. O FormSubmit é exatamente assim, por isso
> `destinoAceitou()` inspeciona o corpo (`success`/`ok`/`sucesso`) em vez de
> confiar no `response.ok`. Sem isso, um lead recusado passaria por entregue.

### Onde ficam armazenados

- **E-mail (padrão):** entregue pelo FormSubmit em `LEAD_EMAIL_TO`.
- **Webhook (`LEAD_WEBHOOK_URL`):** qualquer endpoint que receba `POST` JSON.
- **Arquivo local:** `data/leads.jsonl` — um JSON por linha. Funciona em VPS ou
  container com disco persistente. Ignorado pelo Git (contém dados de clientes).
  Na Vercel não existe: o disco da função é somente leitura.

Proteções já incluídas: honeypot anti-spam, limite de 5 envios por IP a cada 10
minutos (configurável por `LEAD_RATE_LIMIT_MAX`) e validação de todos os campos
também no servidor.

> **Por que não usamos o FormSubmit.** Ele foi testado e descartado: exige um
> cabeçalho `Origin` de página web (não aceita POST de servidor sem ele), pede
> ativação manual por endereço de e-mail e — o motivo decisivo — **responde HTTP
> 200 mesmo quando falha**, com `"success":"false"` no corpo. Como `saveLead`
> considera sucesso pelo `response.ok`, uma falha do FormSubmit seria lida como
> sucesso e o lead se perderia sem qualquer aviso. Qualquer destino novo precisa
> sinalizar falha com status HTTP de erro.

O campo **e-mail é opcional** de propósito: o formulário do hero coleta apenas
nome, empresa e telefone/WhatsApp — se o servidor exigisse e-mail, esse
formulário seria rejeitado em um campo que nem aparece na tela. O telefone é
obrigatório e é o canal primário de contato.

Para ler os leads gravados no arquivo:

```bash
wc -l data/leads.jsonl                       # quantos leads
tail -n 5 data/leads.jsonl | jq .            # últimos 5, formatados
```

---

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
| `/api/leads` | `src/app/api/leads/route.ts` | Endpoint de captura de leads |

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

# testa a captura de lead de ponta a ponta nos DOIS formulários da home,
# no navegador real (sucesso + validação de e-mail)
LEAD_RATE_LIMIT_MAX=1000 npx next start -p 3200 &
node scripts/test-forms.mjs http://localhost:3200

# testa o caminho de FALHA: a API não registra e o formulário precisa oferecer
# o envio pelo WhatsApp com os dados preenchidos
VERCEL=1 npx next start -p 3201 &
node scripts/test-form-fallback.mjs http://localhost:3201

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

- [ ] **CEP** do endereço (`contact.address.zip`) — hoje o CEP não aparece e é
      omitido do schema JSON-LD.
- [ ] **Complemento** (sala/conjunto/andar), se houver.
- [ ] **Registro no CRC** (`crc`) — enquanto vazio, some do topo e do rodapé.
- [ ] **Razão social completa** (`legalName`) — hoje exibe apenas "Deeptax".
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
- [ ] Configurar `LEAD_WEBHOOK_URL` em produção.
- [ ] Revisar a **Política de Privacidade** com o responsável jurídico e datar.

