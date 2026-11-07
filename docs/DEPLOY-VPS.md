# Deploy no VPS de produção

O site roda no VPS da Hostinger, sob controle do escritório, e não depende da
Vercel. Este documento registra como está montado e como operar.

| | |
| --- | --- |
| Servidor | `srv2009269` — Hostinger KVM 1 |
| IP | `187.127.60.53` |
| Sistema | Ubuntu 26.04 LTS, 1 vCPU, 3.8 GB RAM, 48 GB disco |
| Aplicação | `/opt/deeptax/app` (usuário `deeptax`) |
| Porta interna | `127.0.0.1:3100` (não exposta na internet) |
| Proxy | nginx → `/etc/nginx/sites-available/deeptax.com.br` |
| Serviços | `deeptax.service` (site) e `deeptax-reconstruir.path` (observador) |
| Logs | `/opt/deeptax/logs/app.log`, `error.log`, `build.log` |

> O servidor também hospeda outros projetos (`autoezek`, `papirux.autoezek.com.br`,
> `toda.adv.br`). Nada do Deeptax interfere neles: porta própria, serviço
> próprio e site próprio no nginx.

---

## Como o conteúdo chega ao site

O painel em `/admin/login` grava os arquivos de `content/` **direto no disco**
(não usa GitHub nem token). Um observador do sistema percebe a mudança e
reconstrói o site sozinho:

```
painel salva  →  content/*.json
              →  systemd detecta a alteração
              →  npm run build em .next-build
              →  troca atômica com .next  +  reinício do serviço
              →  nova versão no ar (~70 segundos)
```

A construção acontece numa pasta separada (`.next-build`) e só é promovida
depois de terminar com sucesso. Consequências:

- **o site continua no ar** durante a reconstrução, servindo a versão anterior;
- **se o build falhar**, nada é trocado e a versão no ar permanece — o log
  registra `BUILD FALHOU`;
- não há janela de erro para o visitante.

Se o token do GitHub estiver configurado, o painel **também** registra cada
alteração como commit (histórico e backup). Sem token, o conteúdo vive apenas no
servidor.

---

## Variáveis e credenciais

Ficam em `/opt/deeptax/deeptax.env` (permissão `600`, dono `deeptax`):

```bash
ADMIN_PASSWORD=...      # senha do painel em /admin/login
# GITHUB_TOKEN=...      # opcional: registra as alterações no GitHub
# GITHUB_REPO=wtoda/deeptax
```

Depois de alterar: `systemctl restart deeptax`.

> Para trocar a senha pelo terminal:
> ```bash
> nano /opt/deeptax/deeptax.env      # edite ADMIN_PASSWORD
> systemctl restart deeptax
> ```

---

## Operação do dia a dia

```bash
systemctl status deeptax                 # o site está rodando?
systemctl restart deeptax                # reiniciar (após mudar .env)
journalctl -u deeptax -n 50 --no-pager   # o que aconteceu
tail -n 40 /opt/deeptax/logs/build.log   # últimas reconstruções
```

Atualizar o **código** (não o conteúdo):

```bash
# na máquina de desenvolvimento
#
# ATENÇÃO ao que NÃO vai no pacote:
#   content/   → o painel escreve esses arquivos DIRETO no servidor. Mandar a
#                versão local apagaria todo texto e todo artigo publicado.
#   arquivos/  → imagens enviadas pelo painel; só existem no servidor.
# Só inclua content/ na PRIMEIRA instalação, quando o servidor está vazio.
tar czf - --exclude=node_modules --exclude=.next --exclude=.git --exclude=.npmrc \
         --exclude=content --exclude=arquivos . \
  | ssh root@187.127.60.53 'tar xzf - -C /opt/deeptax/app'

# O tar roda como root e o arquivo carrega o dono do ambiente de origem: sem o
# chown, os arquivos ficam root:root (package.json já apareceu como 600) e o
# `npm run build` do usuário deeptax morre com EACCES.
ssh root@187.127.60.53 'chown -R deeptax:deeptax /opt/deeptax/app'

ssh root@187.127.60.53 'su -s /bin/bash deeptax -c "cd /opt/deeptax/app \
  && HOME=/opt/deeptax npm run build"'
ssh root@187.127.60.53 'systemctl restart deeptax && sleep 4 && systemctl is-active deeptax'
```

> **Nunca canalize o build por `| tail`.** O status da pipeline passa a ser o do
> `tail`, então um build que falhou segue adiante e o `systemctl restart` roda
> com `.next` inexistente — foi assim que o site ficou fora do ar uma vez.
> Redirecione para um arquivo e confira o código de saída:
> ```bash
> ... npm run build > /tmp/build.log 2>&1; echo "exit=$?"; tail -6 /tmp/build.log
> ```


---

## Certificado SSL

```bash
certbot --nginx -d deeptax.com.br -d www.deeptax.com.br
```

Só funciona com o DNS **já apontando** para `187.127.60.53`. A renovação é
automática (timer do certbot).

---

## Cuidados que já custaram tempo

- **`.npmrc` não deve ser copiado do ambiente de desenvolvimento.** Ele aponta
  para um cache local que não existe aqui e faz o `npm ci` falhar.
- **Nunca construa sobre um `.next` inconsistente.** Se um build for
  interrompido, apague a pasta antes: `rm -rf /opt/deeptax/app/.next`.
- **A senha de 6+ caracteres é obrigatória**; abaixo disso o painel se recusa a
  abrir, de propósito.
- **O cookie de sessão tem a flag `Secure`**: o painel só autentica em **HTTPS**.
  Testar por HTTP dá 401 — não é defeito.
- **`tar` como root troca o dono dos arquivos.** Sem `chown -R deeptax:deeptax`
  depois de extrair, o `npm run build` falha com `EACCES` em `package.json` — e,
  se o `.next` tiver sido apagado antes, o serviço entra em laço de reinício.
  Extraia, faça o `chown`, construa, confirme o `exit=0` e só então reinicie.
- **Canalizar o build por `| tail` esconde a falha.** O status passa a ser o do
  `tail` e o `&& systemctl restart` executa mesmo com o build quebrado.
- **O deploy de código não pode levar `content/` nem `arquivos/`.** Esses dois
  diretórios são escritos pelo painel **no servidor**; mandar a versão do
  ambiente de desenvolvimento sobrescreve o que o escritório publicou. É o
  caminho mais curto entre "atualizei o site" e "sumiram os artigos".
