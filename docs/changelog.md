# docs/changelog.md

# Changelog

Registro simples das principais alterações do projeto.

## v0.9.8

* Preparação do projeto para hospedagem no Cloudflare Pages.
* Separação lógica entre frontend e backend.
* Inclusão do arquivo `Code_API.gs` como versão documentada do backend Apps Script.
* Ajuste dos metadados do HTML para controle de versão e ambiente.
* Criação do mock local para testes fora da produção.
* Inclusão do fluxo de revisão antes do envio.
* Criação do modal de lançamento por peso.
* Criação do modal de lançamento unitário.
* Ajuste do modal para abrir mais próximo do topo da tela.
* Ajuste do botão `Adicionar Caixa` para permanecer visível durante lançamentos por peso.
* Inclusão da coluna `pesos_caixas`.
* Preparação da documentação inicial do repositório.

## Próximas melhorias possíveis

* Automatizar deploy do Apps Script com `clasp`.
* Criar autenticação de usuário.
* Melhorar tratamento de erro no envio.
* Migrar banco principal para Supabase, se necessário.
* Criar relatórios operacionais.
* Criar painel de consulta por data/produto.
