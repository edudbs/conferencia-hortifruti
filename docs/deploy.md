# docs/deploy.md

# Deploy

## Frontend — Cloudflare Pages

O frontend é publicado automaticamente a partir do GitHub.

Branch de produção:

```text
main
```

A cada `git push` na branch `main`, o Cloudflare Pages publica uma nova versão.

## Backend — Google Apps Script

O arquivo `Code_API.gs` no GitHub é apenas uma cópia versionada.

O código real precisa ser atualizado manualmente no editor do Google Apps Script.

Após alterar o Apps Script:

1. salvar o código;
2. clicar em `Implantar`;
3. ir em `Gerenciar implantações`;
4. editar a implantação atual;
5. selecionar `Nova versão`;
6. clicar em `Implantar`.

## Atenção

O deploy do Cloudflare não atualiza automaticamente o Apps Script.
