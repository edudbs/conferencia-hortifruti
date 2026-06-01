# Estrutura das planilhas

## Visão geral

O Google Sheets funciona como banco de dados inicial do projeto.

A planilha precisa conter, no mínimo, as abas:

* `PRODUTOS`
* `CONFERENCIAS`

## Aba `PRODUTOS`

A aba `PRODUTOS` armazena os produtos disponíveis para conferência.

### Colunas esperadas

```text
codigo | produto | ativo | unidade
```

### Exemplo

```text
001 | Banana Prata | SIM | kg
002 | Alface Crespa | SIM | maço
003 | Morango | SIM | bandeja
004 | Coco Verde | SIM | un
```

## Regras da aba `PRODUTOS`

* Apenas produtos com `ativo = SIM` aparecem no aplicativo.
* A coluna `unidade` define se o produto será tratado como peso ou item unitário.
* Produtos com unidade `kg` abrem o modal de lançamento por peso.
* Produtos com outras unidades abrem o modal de lançamento unitário.

## Aba `CONFERENCIAS`

A aba `CONFERENCIAS` recebe os dados enviados pelo aplicativo.

### Colunas esperadas

```text
data_conferencia | data_envio | codigo | produto | caixas | qtd_peso | unidade | pesos_caixas | observacao | usuario | observacao_geral
```

## Coluna `pesos_caixas`

A coluna `pesos_caixas` armazena o detalhe por caixa em formato JSON.

### Exemplo para produto por peso

```json
[20,18,21]
```

Significa:

```text
Caixa 1 = 20 kg
Caixa 2 = 18 kg
Caixa 3 = 21 kg
```

### Exemplo para produto unitário

```json
[12,12,12]
```

Significa:

```text
3 caixas com 12 itens cada
```

## Finalidade da coluna `pesos_caixas`

Essa coluna permite:

* auditoria operacional;
* cálculo de média por caixa;
* rastreabilidade da conferência;
* análise futura de padrão de fornecedores;
* conferência detalhada dos lançamentos.
