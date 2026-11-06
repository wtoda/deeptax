# Configuração de DNS da deeptax.com.br

Registro da configuração de DNS do domínio, para que uma perda de zona — como a
que aconteceu — possa ser reconstruída sem depender da memória de ninguém.

> **Situação do site e do e-mail:** o site roda no **VPS de produção**
> (`187.127.60.53`, Hostinger KVM) e o e-mail na **Hostinger**. O domínio é
> gerenciado no **hospedameusite.com.br**, que é o registrador e o provedor de
> DNS (nameservers `nsp1` a `nsp4`).
>
> Detalhes do deploy em [`DEPLOY-VPS.md`](DEPLOY-VPS.md). A Vercel continua
> configurada como ambiente alternativo, mas o domínio aponta para o VPS.

---

## Registros necessários

### Site (VPS de produção)

| Tipo | Nome | Valor | Para quê |
| --- | --- | --- | --- |
| `A` | `@` | `187.127.60.53` | aponta o domínio raiz para o VPS |
| `A` | `www` | `187.127.60.53` | o site responde em `www` |

> O endereço canônico fica em `content/site.json` (campo `url`) e é
> `https://www.deeptax.com.br`. Depois de o DNS apontar para o VPS, o
> certificado é emitido com `certbot --nginx -d deeptax.com.br -d www.deeptax.com.br`.

### E-mail (Hostinger)

| Tipo | Nome | Valor / prioridade |
| --- | --- | --- |
| `MX` | `@` | `mx1.hostinger.com` (prioridade 5) |
| `MX` | `@` | `mx2.hostinger.com` (prioridade 10) |
| `TXT` | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` |
| `TXT` | `default._domainkey` | chave DKIM — ver abaixo |
| `TXT` | `_dmarc` | `v=DMARC1; p=none;` |

**Regra que já causou problema uma vez:** deve existir **um único** registro SPF.
Dois registros SPF no mesmo domínio fazem a verificação resultar em
`permerror` (RFC 7208 §4.5) e **nenhum** dos dois vale — o que prejudica o envio.

**Regra que causou o e-mail cair:** o `MX` **não pode** apontar para o próprio
domínio (`deeptax.com.br`), porque aí ele passa a depender do registro `A` — que
aponta para a Vercel, e a Vercel não recebe SMTP. Com site e e-mail em
provedores diferentes, o `A` serve o site e o `MX` leva o e-mail.

### Chave DKIM

O valor é longo e costuma ser exibido em pedaços; no DNS ele entra como **uma
única string**, sem quebras de linha. Guardado aqui porque o provedor de e-mail
pode não exibir de novo:

```
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAylP4LCR8YucfQiMiEioCEwbry8DnkU+fUuG1nlQfYm8aKOSmoB9zzekHrI7vYL+Rifd5rj/KP/G175rHclTEM2X4PJrcQIdbmflOgvez8EkYfSxSavmZUgDVHzn5CKIJ+T3cJraunHaHJbmVnQimLHRKAkJVU/wugVGSXtpfmYc7tu/o0cI1Com2DQDi9phEBulfRlJtAJPxK0XnHRqe+9Eu55CjHDVIUBaBwVjKlj/saLDu08iCmxU6kd6PZkqETl0vbk3BHbHZh43s5CwYaetrreEYEbTfkoDKlIoT/kAhVddAZQh6jSWaoA6xUUjzhcEvJxVkN5b0AL2VI9BlcQIDAQAB
```

> Se o e-mail for reconfigurado na Hostinger, o painel deles gera um DKIM novo —
> nesse caso use o valor gerado por lá e atualize este arquivo.

---

## Como verificar (sem depender do painel do provedor)

```bash
# o domínio resolve?
dig +short deeptax.com.br A          # esperado: 187.127.60.53
dig +short www.deeptax.com.br A      # esperado: 187.127.60.53

# o e-mail está roteado para a Hostinger?
dig +short deeptax.com.br MX         # esperado: mx1 e mx2.hostinger.com

# existe exatamente um SPF?
dig +short deeptax.com.br TXT | grep -c spf1    # esperado: 1

# o site responde?
curl -sI https://www.deeptax.com.br | head -1
```

E o estado da publicação:

```bash
curl -s https://www.deeptax.com.br/api/version
```

## Se o domínio parar de resolver

Sintoma: `curl` no domínio devolve erro de conexão, mas o servidor responde
quando consultado com o cabeçalho `Host`:

```bash
curl -sI -H "Host: deeptax.com.br" http://187.127.60.53/
```

Se isso responde 200, o problema é **DNS**, não a hospedagem.

```bash
# quem o registro .br diz que deve responder pelo domínio?
dig @a.dns.br deeptax.com.br NS

# esses servidores respondem pela zona?
dig @nsp1.hospedameusite.com.br deeptax.com.br A
```

Se a resposta for `REFUSED` ou `SERVFAIL`, a zona foi perdida no provedor de DNS
e precisa ser recriada com os registros da tabela acima.
