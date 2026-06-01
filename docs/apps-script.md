# Google Apps Script

## Visão geral

O Google Apps Script funciona como backend/API do projeto.

Ele recebe requisições do frontend hospedado no Cloudflare Pages e grava os dados na planilha Google Sheets.

## Arquivo versionado

No repositório GitHub, o arquivo correspondente é:

```text
Code_API.gs
```

Esse arquivo serve como cópia versionada do código usado no Apps Script.

## Importante

O arquivo `Code_API.gs` no GitHub não é implantado automaticamente no Google Apps Script.

O código real precisa estar copiado no editor do Apps Script.

## Funções principais

### `doGet(e)`

Usado para:

* verificar se a API está ativa;
* retornar produtos ativos com `action=produtos`.

### `doPost(e)`

Usado para:

* receber conferências enviadas pelo frontend;
* validar o payload;
* chamar `salvarConferencia(payload)`.

### `getProdutos()`

Lê a aba `PRODUTOS` e retorna apenas produtos com:

```text
ativo = SIM
```

### `salvarConferencia(payload)`

Grava os itens preenchidos na aba `CONFERENCIAS`.

Também registra:

* data da conferência;
* data/hora do envio;
* código do produto;
* nome do produto;
* caixas;
* quantidade/peso;
* unidade;
* pesos por caixa;
* observação;
* conferente;
* observação geral.

## Nova implantação

Sempre que o código do Apps Script for alterado, é necessário criar uma nova versão da implantação.

Caminho:

```text
Implantar
→ Gerenciar implantações
→ Editar
→ Nova versão
→ Implantar
```

Se esse passo não for feito, a URL do Web App continuará executando a versão antiga.
