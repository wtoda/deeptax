# Painel de edição de conteúdo

Ferramenta para alterar textos, telefone, e-mail, endereço, áreas e perguntas
frequentes do site **sem mexer em código**.

Endereço: **https://www.deeptax.com.br/admin**

---

## Como funciona

O painel lê o conteúdo atual do repositório, mostra em formulário e, ao salvar,
grava a alteração no GitHub. A Vercel detecta o push e publica sozinha — o site
costuma atualizar em cerca de 1 minuto.

Consequências úteis desse desenho:

- **Todo ajuste fica registrado**: cada salvamento vira um commit com data, autor
  e a alteração exata. Dá para ver o histórico e desfazer qualquer mudança.
- **Nada é alterado direto no site**: o repositório é a fonte única da verdade,
  então o que está no ar é sempre o que está versionado.
- **Se algo der errado, é reversível**: como cada salvamento é um commit, voltar
  atrás é reverter o commit no GitHub.

---

## Configuração (uma vez, ~10 minutos)

Enquanto isto não estiver feito, o painel abre mostrando o que falta — ele não
funciona sem essas proteções.

### 1. Criar o token do GitHub

1. Acesse https://github.com/settings/personal-access-tokens/new
   (GitHub → foto de perfil → *Settings* → *Developer settings* →
   *Personal access tokens* → *Fine-grained tokens* → *Generate new token*)
2. Preencha:
   - **Token name:** `painel-deeptax`
   - **Expiration:** o mais longo que fizer sentido — veja o aviso abaixo
   - **Repository access:** *Only select repositories* → `wtoda/deeptax`
   - **Permissions** → *Repository permissions* → **Contents: Read and write**
     (é a única permissão necessária)
3. **Generate token** e copie o valor (começa com `github_pat_...`).
   O GitHub só mostra o token uma vez.

> **⚠️ Atenção à validade do token.** Quando ele expira, o painel para de salvar
> e mostra erro. Anote a data em algum lugar e renove antes. Se preferir não ter
> essa manutenção, escolha *No expiration* — o token só dá acesso a este
> repositório, e pode ser revogado a qualquer momento na mesma tela.

### 2. Cadastrar as variáveis na Vercel

Em **Vercel → projeto deeptax → Settings → Environment Variables**, adicione:

| Nome | Valor | Observação |
|---|---|---|
| `ADMIN_PASSWORD` | uma senha sua, com 10+ caracteres | é o que protege o painel |
| `GITHUB_TOKEN` | o token criado no passo 1 | começa com `github_pat_` |
| `GITHUB_REPO` | `wtoda/deeptax` | opcional, este já é o padrão |
| `GITHUB_BRANCH` | `main` | opcional, este já é o padrão |

Marque os três ambientes (**Production**, **Preview** e **Development**), salve e
faça um **Redeploy** — variável nova só passa a valer em um deploy novo.

### 3. Entrar

Acesse **https://www.deeptax.com.br/admin** e informe a senha que você cadastrou.

---

## Como usar

O painel tem quatro abas:

| Aba | O que edita |
|---|---|
| **Contato e endereço** | Telefone, WhatsApp, e-mail, horário, endereço completo, redes sociais e o link do blog |
| **Identificação e SEO** | Marca, razão social, nome fantasia, CNPJ, CRC, assinatura e a descrição que aparece no Google |
| **Página inicial** | Diferenciais, etapas do atendimento, números, depoimentos e perguntas frequentes |
| **Áreas (páginas internas)** | O conteúdo das seis áreas: Deep Systems, DeepTax, DeepCont, DeepPericia, DeepConsult e DeepCompliance |

Ao alterar qualquer campo, a barra inferior avisa que há alterações pendentes e o
botão **Salvar e publicar** é habilitado. Depois de salvar, aparece o link do
commit criado.

### Cuidados

- **Número do WhatsApp:** o campo *"Número do WhatsApp nos links"* aceita
  **somente dígitos**, com `55` + DDD + número (`5511932362770`). É ele que monta
  todos os botões de WhatsApp do site. Se colocar parêntese, traço ou espaço, os
  botões param de funcionar — e o painel recusa o salvamento avisando disso.
- **Listas vazias:** deixar *Números do escritório* ou *Depoimentos* sem itens faz
  a seção correspondente desaparecer do site. Só publique números e depoimentos
  reais.
- **Blocos em JSON:** dentro de cada área, as listas longas (escopo, metodologia,
  entregáveis, FAQ) são editadas em JSON. Se houver erro de vírgula ou aspas, o
  painel marca o campo em vermelho e **bloqueia o salvamento** até corrigir.
- **Sessão:** dura 12 horas. Depois disso, é preciso entrar de novo.
- **Senha esquecida:** troque o valor de `ADMIN_PASSWORD` na Vercel e faça um
  redeploy. Não há recuperação por e-mail.

---

## Segurança

- A senha é comparada em **tempo constante** (evita descobrir caracteres pelo
  tempo de resposta) e o painel bloqueia após **8 tentativas** em 15 minutos.
- A sessão é um cookie **assinado** com HMAC, `httpOnly` e `secure`, sem estado
  no servidor.
- O token do GitHub **nunca chega ao navegador**: todas as chamadas acontecem no
  servidor.
- O painel é marcado com `noindex` e bloqueado no `robots.txt`.
- **Validação antes de gravar:** conteúdo inválido é recusado com mensagem
  explicativa em vez de ser gravado. Isso importa porque um conteúdo quebrado
  faria o build da Vercel falhar — e o site ficaria parado na versão anterior sem
  ninguém entender por quê.

Para desativar o painel a qualquer momento, apague `ADMIN_PASSWORD` ou
`GITHUB_TOKEN` na Vercel e faça um redeploy. Ele volta a mostrar apenas o aviso de
que precisa de configuração.
