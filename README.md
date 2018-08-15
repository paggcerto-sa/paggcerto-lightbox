# Paggcerto Lightbox
Plugin JavaScript que permite efetuar pagamentos usando uma janela que se sobrepõe ao aplicativo do vendedor.

## Opções disponíveis para instalação

- Instalar com [NPM](https://www.npmjs.com/): `npm install paggcerto-lightbox`
- Baixar a última versão no [repositório do GitHub](https://github.com/paggcerto-sa/paggcerto-lightbox/releases/)
- Clonar repositório: `git clone git@github.com:paggcerto-sa/paggcerto-lightbox.git`

## Como utilizar o lightbox

O lightbox é iniciado ao invocar o método `paggcerto.lightbox()` passando sua configuração por parâmetro:

```js
paggcerto.lightbox({
  environment: 'sandbox',
  token: 'AccessToken',
  payment: {
    amount: 189.9,
    bankSlipEnabled: true,
    creditEnabled: true,
    debitEnabled: true,
    payers: [{
      sellingKey: null,
      fullName: 'Maria dos Santos',
      taxDocument: '123.123.123-87'
    }]
  },
  abort: function () {
    // Your magic when lightbox is closed before completing the payment
  },
  success: function (paymentResult) {
    // Your magic when payment processing is successfully completed
  },
  fail: function (paymentResult) {
    // Your magic when payment processing fails
  }
})
```

### Acesso ao ambiente

| Propriedade   | Descrição                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------- |
| `environment` | Define o ambiente: `sandbox` (ambiente de teste) ou `production` (ambiente de produção).  |
| `token`       | Token do usuário gerado após a [autenticação](https://desenvolvedor.paggcerto.com.br/v2/account/#operation/autenticar-com-credenciais). |

### Valor do pagamento

| Propriedade | Descrição                                            |
| ----------- | ---------------------------------------------------- |
| `amount`    | Quando `null` habilita o campo de valor para edição. |

### Método do pagamento

| Propriedade       | Descrição                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `bankSlipEnabled` | Exibe (`true`) ou oculta (`false`) a opção de pagamento com boleto.  Mínimo R$ 10,00.          |
| `creditEnabled`   | Exibe (`true`) ou oculta (`false`) a opção de pagamento com cartão de crédito. Mínimo R$ 1,00. |
| `debitEnabled`    | Exibe (`true`) ou oculta (`false`) a opção de pagamento com cartão de débito. Mínimo R$ 1,00.  |

Comportamento do lightbox quanto aos métodos de pagamento:
- Se nenhum método de pagamento estiver habilitado o lightbox não iniciará.
- Se somente um método de pagamento estiver habilitado (`true`) o lightbox iniciará diretamente nessa opção.
- As modalidades crédito e débito não suportam múltiplos pagadores.
  Por esse motivo, mais de um pagador exibe somente a opção de pagamento com boleto,
  mesmo que as propriedades `creditEnabled` e `debitEnabled` estejam definidas como `true`.
- Emissão de boleto exige a informação do nome e do CPF/CNPJ do sacado (pagador).
  Por esse motivo, caso nenhum pagador seja informado, a opção para pagamento com boleto não será exibida,
  mesmo que a propriedade `bankSlipEnabled` esteja definida como `true`.
- Somente um pagador resulta na emissão de um único boleto (`application/pdf`).
  Múltiplos pagadores resulta na emissão de boletos em lote (`application/zip`), sendo um boleto para cada pagador.

### Pagadores

| Propriedade   | Descrição                                                                      |
| ------------- | ------------------------------------------------------------------------------ |
| `sellingKey`  | Código que associa o seu ID ao pagamento processado pela Paggcerto (opcional). |
| `fullName`    | Nome de quem está pagando (pessoa ou empresa).                                 |
| `taxDocument` | CPF/CNPJ de quem está pagando.                                                 |

### Eventos (opcionais)

| Propriedade | Descrição                                                                        |
| ----------- | -------------------------------------------------------------------------------- |
| `abort`     | Executado quando o lightbox é encerrado (fechado) antes de concluir o pagamento. |
| `success`   | Executado quando o pagamento é finalizado com sucesso.                           |
| `fail`      | Executado quando ocorre algum erro no processamento do pagamento.                |

## Como executar localmente

1. Instale o [Node.js](https://nodejs.org/)
2. Execute `npm install` para instalar as dependências do node
3. Execute `npm run build` para recompilar os arquivos JavaScript e CSS

## Bugs e funcionalidades

Por favor, sinta-se a vontade para [inicar uma issue](https://github.com/paggcerto-sa/paggcerto-lightbox/issues).
