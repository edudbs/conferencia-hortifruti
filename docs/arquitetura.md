# Arquitetura

## Visão geral

O sistema é dividido em três partes:

1. Frontend hospedado no Cloudflare Pages
2. Backend em Google Apps Script
3. Dados armazenados no Google Sheets

## Responsabilidades

### Frontend

Arquivo: `index.html`

Responsável por:

- exibir produtos ativos;
- permitir lançamento de caixas e quantidade/peso;
- abrir modais de lançamento;
- montar o payload;
- enviar dados para o Apps Script.

### Backend

Arquivo versionado: `Code_API.gs`

Código real executado no Google Apps Script.

Responsável por:

- retornar lista de produtos;
- receber conferências;
- validar payload;
- gravar dados na aba `CONFERENCIAS`.

### Banco de dados

Google Sheets com as abas:

- `PRODUTOS`
- `CONFERENCIAS`
