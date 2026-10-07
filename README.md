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

## 4. Como os leads são capturados

Fluxo:

1. O visitante preenche o formulário (`src/components/LeadForm.tsx`).
2. Validação no navegador → `POST /api/leads` (`src/app/api/leads/route.ts`).
3. Validação no servidor (`src/lib/leads.ts`) e descarte de bots por honeypot.
4. Persistência: grava em `data/leads.jsonl` **e/ou** envia para
   `LEAD_WEBHOOK_URL`, se configurada.
5. A tela de sucesso oferece um botão de WhatsApp já com a mensagem preenchida.

### Onde ficam armazenados

- **Arquivo local:** `data/leads.jsonl` — um JSON por linha. Funciona em VPS ou
  container com disco persistente.
- **Webhook:** defina `LEAD_WEBHOOK_URL` no `.env.local`. Recomendado para
  Vercel/Netlify, onde o disco é efêmero. Aceita qualquer destino que receba
  `POST` com JSON (Slack, n8n, Make, Zapier, Apps Script, CRM).

Proteções já incluídas: honeypot anti-spam, limite de 5 envios por IP a cada 10
minutos e validação de todos os campos também no servidor.

Para ler os leads gravaos no arquivo:

```bash
wc -l data/leads.jsonl                       # quantos leads
tail -n 5 data/leads.jsonl | jq .            # últimos 5, formatados
```

---

## 5. Estrutura de páginas

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

## 5.1 Scripts de verificação (opcional)

A pasta `scripts/` traz três utilitários de QA usados para validar o site. Eles
dependem de `playwright-core` (já instalado como dependência de desenvolvimento)
e de um navegador Chromium disponível na máquina.

```bash
# captura telas de todas as páginas (desktop e mobile) e reporta erros de console
node scripts/screenshot.mjs http://localhost:3000

# verifica rolagem horizontal, h1 único, ids duplicados, imagens sem alt e
# links sem texto acessível em 4 larguras de tela
node scripts/check-layout.mjs http://localhost:3000

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

## 6. Design system

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
- [ ] **Domínio final** (`url`) — hoje `https://www.deeptax.com.br`, inferido do
      e-mail; precisa bater com o domínio real (afeta canonical, sitemap e OG).
- [ ] **Números reais** (`stats`) — a faixa de números está **oculta** até você
      informar dados verificáveis. Formato no comentário do arquivo.
- [ ] **Depoimentos reais autorizados** (`testimonials`) — a seção está
      **oculta** até haver relatos reais com autorização do cliente.
- [ ] **LinkedIn / Instagram** (`social`) — ícones ocultos enquanto vazios.
- [ ] Inserir a **logo oficial** (a atual é uma marca provisória em
      `src/components/Logo.tsx`) e uma imagem de Open Graph.
- [ ] Configurar `LEAD_WEBHOOK_URL` em produção.
- [ ] Revisar a **Política de Privacidade** com o responsável jurídico e datar.

