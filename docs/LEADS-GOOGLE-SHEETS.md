# Captura de leads em planilha do Google

Guia para fazer cada lead do site virar uma linha em uma planilha do Google,
usando Google Apps Script como webhook. É gratuito, não exige servidor e não
precisa de conta em serviço de automação.

Tempo estimado: **5 minutos**.

---

## 1. Crie a planilha

1. Abra https://sheets.new
2. Dê um nome, por exemplo **Leads Deeptax**.

## 2. Abra o editor de script

1. Na planilha, menu **Extensões → Apps Script**.
2. Apague todo o conteúdo do arquivo `Código.gs`.
3. Cole o código abaixo **inteiro**.

```javascript
/**
 * Webhook de leads do site da Deeptax.
 * Recebe POST em JSON do /api/leads e grava uma linha na planilha.
 */

// Troque por um segredo seu. O mesmo valor vai na URL do webhook na Vercel.
// Deixe vazio ("") para desativar a checagem.
const TOKEN = "troque-por-um-segredo-longo-e-aleatorio";

const SHEET_NAME = "Leads";

// Opcional: se o script estiver ligado à própria planilha, deixe vazio.
const SPREADSHEET_ID = "";

const CABECALHO = [
  "Recebido em",
  "Nome",
  "Empresa",
  "E-mail",
  "Telefone / WhatsApp",
  "Serviço de interesse",
  "Mensagem",
  "Origem",
  "ID do lead",
];

function doPost(e) {
  try {
    const token = (e && e.parameter && e.parameter.token) || "";
    if (TOKEN && token !== TOKEN) {
      return responder({ ok: false, error: "token invalido" });
    }

    const corpo = (e && e.postData && e.postData.contents) || "{}";
    const dados = JSON.parse(corpo);

    // Ignora qualquer coisa que não seja um lead do nosso site.
    if (dados.type !== "novo_lead" || !dados.name) {
      return responder({ ok: false, error: "payload invalido" });
    }

    const planilha = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    let aba = planilha.getSheetByName(SHEET_NAME);
    if (!aba) {
      aba = planilha.insertSheet(SHEET_NAME);
      aba.appendRow(CABECALHO);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    }

    aba.appendRow([
      new Date(),
      dados.name || "",
      dados.company || "",
      dados.email || "",
      dados.phone || "",
      dados.service || "",
      dados.message || "",
      dados.source || "",
      dados.id || "",
    ]);

    return responder({ ok: true });
  } catch (erro) {
    return responder({ ok: false, error: String(erro) });
  }
}

/** Permite testar no navegador se o webhook está publicado. */
function doGet() {
  return responder({ ok: true, mensagem: "Webhook de leads da Deeptax ativo." });
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Clique no ícone de disquete (**Salvar**).

> **Importante:** no passo 3, troque `troque-por-um-segredo-longo-e-aleatorio`
> por um segredo seu. Sem isso, qualquer pessoa que descubra a URL pode escrever
> linhas na sua planilha.

## 3. Publique como aplicativo web

1. Botão azul **Implantar → Nova implantação**.
2. Clique na engrenagem ⚙ ao lado de "Selecionar tipo" e escolha **Aplicativo da Web**.
3. Preencha:
   - **Descrição:** Webhook de leads
   - **Executar como:** **Eu** (seu e-mail)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique em **Implantar**.
5. O Google vai pedir autorização: **Autorizar acesso → escolha sua conta →
   "Avançado" → "Acessar (não seguro)"** (é o seu próprio script, por isso o aviso).
6. Copie a **URL do aplicativo da Web**. Ela termina em `/exec`.

> A opção "Quem pode acessar" **precisa** ser "Qualquer pessoa". Se ficar como
> "Somente eu", o servidor da Vercel não conseguirá enviar os leads e o
> formulário vai falhar.

## 4. Teste o webhook

Cole a URL no navegador e adicione `?token=SEU_SEGREDO`:

```
https://script.google.com/macros/s/AKfy.../exec?token=SEU_SEGREDO
```

Você deve ver:

```json
{"ok":true,"mensagem":"Webhook de leads da Deeptax ativo."}
```

Se aparecer erro de token, o segredo na URL não bate com o do script.

## 5. Configure na Vercel

Em **Settings → Environment Variables**, adicione:

| Nome | Valor |
| --- | --- |
| `LEAD_WEBHOOK_URL` | `https://script.google.com/macros/s/AKfy.../exec?token=SEU_SEGREDO` |

Marque os ambientes **Production**, **Preview** e **Development**, salve e faça
um **Redeploy** (a variável só passa a valer em um deploy novo).

## 6. Confirme de ponta a ponta

1. Abra o site publicado.
2. Preencha o formulário do hero e envie.
3. Confira se a linha apareceu na aba **Leads** da planilha.

Se não aparecer, veja os logs em **Vercel → seu projeto → Logs** filtrando por
`[leads]`. O código registra ali o motivo exato da falha.

---

## Observações

- **Linhas duplicadas:** o Apps Script pode reexecutar um envio em caso de falha
  de rede. Use a coluna **ID do lead** para identificar duplicatas.
- **Volume:** planilhas do Google suportam bem algumas centenas de leads por dia.
  Se o volume crescer muito, migre para um CRM ou banco de dados.
- **Segurança:** a URL com token é o único segredo. Não publique a planilha como
  "qualquer pessoa com o link pode editar".
- **Notificação por e-mail:** no Apps Script, use
  `MailApp.sendEmail("atendimento@deeptax.com.br", "Novo lead pelo site", texto)`
  dentro do `doPost` para ser avisado a cada lead, além de gravar na planilha.
