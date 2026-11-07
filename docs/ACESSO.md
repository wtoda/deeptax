# Acesso ao painel

Cada pessoa do escritório tem **a sua própria conta** — e-mail e senha. Não existe
mais uma senha única compartilhada: é a conta que identifica quem alterou cada
texto.

| | |
| --- | --- |
| Login | https://www.deeptax.com.br/admin/login |
| Recuperação | https://www.deeptax.com.br/admin/recuperar |
| Contas | `dados/usuarios.json` (fora do Git, permissão 600) |
| Gerir contas | `node scripts/gerenciar-usuarios.mjs` no servidor |

---

## Como a senha é guardada

A senha **nunca é gravada**. O arquivo guarda só o resultado do **scrypt** —
derivação lenta, com sal próprio por usuário, 16 mil iterações. Quem ler o
arquivo não consegue voltar à senha, e duas pessoas com a mesma senha geram
hashes diferentes.

A comparação no login é feita em tempo constante, para que o tempo de resposta
não revele quantos caracteres estavam certos.

## Sessão

Cookie assinado com HMAC, válido por **12 horas**, com o e-mail de quem entrou
dentro do token. O segredo da assinatura é próprio do servidor
(`dados/segredo-sessao`, gerado na primeira execução) — não deriva da senha de
ninguém, então trocar a senha de um usuário **não derruba** a sessão dos outros,
nem a própria.

---

## Gerenciar contas (no servidor)

Sempre como o usuário dono da aplicação, senão o arquivo nasce com dono errado e
o painel não consegue lê-lo:

```bash
ssh -i /root/.ssh/autoezek_hostinger_brasil root@187.127.60.53 \
  'su -s /bin/bash deeptax -c "cd /opt/deeptax/app && node scripts/gerenciar-usuarios.mjs listar"'
```

| Comando | O que faz |
| --- | --- |
| `listar` | mostra as contas e quando a senha foi alterada |
| `criar` | cria uma conta (pergunta e-mail, nome e senha) |
| `senha <email>` | define nova senha para uma conta |
| `remover <email>` | remove a conta (nunca a última) |

Deixar e-mail e senha fora da linha de comando é mais seguro: o que vai como
argumento fica no histórico do shell e na lista de processos.

**Não mexa no arquivo à mão.** O hash tem formato versionado
(`scrypt$N$r$p$sal$hash`); editado errado, o login passa a falhar sem explicação.

### Contas atuais

Ao criar as contas, usei a mesma senha nas duas, como pedido. Vale registrar o
efeito: com senhas iguais, o painel ainda mostra quem entrou, mas não consegue
distinguir autoria se a senha for compartilhada. O próprio comando avisa:

```
Atenção: contas com a MESMA senha anulam a vantagem de ter contas separadas
```

Para diferenciar depois: `senha william@deeptax.com.br`.

---

## Trocar a senha pelo painel

Painel → aba **Minha conta** → informa a senha atual, a nova e a repetição.

Exige a senha atual mesmo com a sessão aberta: a sessão dura 12 horas, e um
navegador destravado não pode valer como autorização para trocar a senha.

Regra única: **mínimo de 10 caracteres**. Sem exigência de símbolo — comprimento
protege mais, e regra complicada acaba virando senha anotada no papel.

---

## Recuperação de senha

**Acesso:** link "Esqueci a senha" na tela de login, ou `/admin/recuperar`.

O funcionamento depende de uma configuração do servidor:

### Com envio de e-mail configurado (recomendado)

A pessoa informa o e-mail, recebe um link válido por **30 minutos** e cria a nova
senha. O link serve uma única vez.

Para ativar, acrescente ao `/opt/deeptax/deeptax.env` e reinicie
(`systemctl restart deeptax`):

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contato@deeptax.com.br
SMTP_PASS=a-senha-da-caixa-de-e-mail
SMTP_FROM=Deeptax <contato@deeptax.com.br>
```

A senha é a da **caixa de e-mail** `contato@deeptax.com.br` (a mesma do webmail
da Hostinger), não a do painel. Enquanto essas linhas não existirem, a
recuperação funciona pelo caminho abaixo.

### Sem envio de e-mail

O link não é devolvido pela rede — isso seria um atalho para trocar a senha de
qualquer conta. Ele fica no log do servidor:

```bash
journalctl -u deeptax -n 40 | grep redefinir
```

Quem administra copia o endereço e entrega à pessoa por um canal confiável. A
tela de recuperação avisa que é assim que funciona, para ninguém ficar esperando
um e-mail que não vem.

> O token também nunca é gravado em texto puro: o arquivo `dados/tokens-senha.json`
> guarda apenas o SHA-256 dele. Link vencido ou já usado é removido na próxima
> emissão.

---

## Proteções

- **Limite de tentativas:** 8 por 15 minutos, contando IP **e** conta — ataque a
  uma conta não tranca o acesso de outra pessoa na mesma rede.
- **Sem revelar quem tem conta:** senha errada e e-mail inexistente respondem a
  mesma coisa no login; o pedido de recuperação responde igual exista ou não a
  conta. A única diferença de resposta é sobre a configuração do servidor
  (envia e-mail ou não), nunca sobre a pessoa.
- **Link inutilizável após o uso**, com validade curta e consumo antes da
  gravação — se algo falhar no meio, pede-se outro em vez de deixar um link
  reaproveitável em circulação.
- **Cookie `Secure`:** o painel só autentica em HTTPS. Testar por HTTP dá 401 e
  não é defeito.
- **`/admin` fora do `robots.txt`** e com `noindex`: não aparece em busca.

---

## O que mudou

- `ADMIN_PASSWORD` **não é mais usada para entrar**. Ela continua no
  `/opt/deeptax/deeptax.env` sem efeito; pode ser removida quando quiser.
- Se o painel disser *"nenhum usuário cadastrado"*, é porque
  `dados/usuarios.json` não existe ou está vazio — crie a conta pelo comando
  acima. É o único caminho de recuperação por SSH, e leva segundos.

## Backup

`dados/` guarda as contas e o segredo de sessão, e **não está no Git**. Entra no
mesmo backup do conteúdo:

```bash
ssh -i /root/.ssh/autoezek_hostinger_brasil root@187.127.60.53 \
  'tar czf /opt/deeptax/backups/conteudo-$(date +%F).tgz -C /opt/deeptax/app content arquivos dados'
```

Sem esse backup, um servidor reinstalado perde as contas — e a saída seria
recriá-las pelo comando, o que exige acesso SSH.
