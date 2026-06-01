
## 4. `docs/apps-script.md`

```md
# Google Apps Script

## Funções principais

### `doGet(e)`

Usado para:

- verificar se a API está ativa;
- retornar produtos ativos com `action=produtos`.

### `doPost(e)`

Usado para:

- receber conferências;
- validar payload;
- chamar `salvarConferencia(payload)`.

### `getProdutos()`

Lê a aba `PRODUTOS` e retorna apenas produtos com `ativo = SIM`.

### `salvarConferencia(payload)`

Grava os itens preenchidos na aba `CONFERENCIAS`.

## Observação importante

Sempre que o código do Apps Script for alterado, é necessário criar uma nova versão da implantação.
