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
    replicateAmount: true,
    bankSlipEnabled: true,
    creditEnabled: true,
    debitEnabled: true,
    deviceEnabled: false,
    "card":{
      installments: 10
    },
    "bankSlip": {
      dueDate: "20/12/2018",
      discountDays: 10,
      interest: 0.25,
      fines: 0.25,
      addNoteToInstructions: false,
      note: " ",
      acceptedUntil:1,
      installments: 3,
      discount: 14.28,
      avoidSteps: false
    },
    payers: [{
      sellingKey: null,
      fullName: 'Maria dos Santos',
      taxDocument: '123.123.123-87',
      email: 'maria@email.com',
      mobile: '(79) 99999-9999'
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

| Propriedade   | Tipo                             | Descrição                                                                                 |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| `environment` | enum: `sandbox`, `production`    | Define o ambiente: `sandbox` (ambiente de teste) ou `production` (ambiente de produção).  |
| `token`       | `string`                         | Token do usuário gerado após a [autenticação](https://desenvolvedor.paggcerto.com.br/v2/account/#operation/autenticar-com-credenciais). |

### Valor do pagamento

| Propriedade | Tipo     | Descrição                                            |
| ----------- | -------- | ---------------------------------------------------- |
| `amount`    | `number` | Quando `null` habilita o campo de valor para edição. |

### Método do pagamento

| Propriedade        | Tipo   | Descrição                                                                                                            |
| ------------------ | ------ | ---------------------------------------------------------------------------------------------- |
| `bankSlipEnabled`  | `bool` | Exibe (`true`) ou oculta (`false`) a opção de pagamento com boleto.  Valor mínimo: R$ 6,00.           |
| `creditEnabled`    | `bool` | Exibe (`true`) ou oculta (`false`) a opção de pagamento com cartão de crédito. Valor mínimo: R$ 1,00. |
| `debitEnabled`     | `bool` | Exibe (`true`) ou oculta (`false`) a opção de pagamento com cartão de débito. Valor mínimo: R$ 1,00.  |
| `replicateAmount`  | `bool` | Indica se o valor do boleto deve ser replicado ou dividido. Ex.: R$100 em 10 boletos de R$100 (replicado) ou em 10 boletos de R$10 cada (dividido). |
| `deviceEnabled`    | `bool` | Indica se será utilizado dispositivo durante a realização do pagamento. |

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
- Se a propriedade `deviceEnabled` estiver habilitada, não será possível realizar pagamentos com cartão de forma digitada, apenas com a utilização de um dispositivo.

### Pagamento com cartão

|Propriedade     | Tipo     | Descrição
| -------------  | -------- | ------------------------------------------------------------------------------ |
| `installments` | `number` | Limita a quantidade máxima de parcelas com cartão. Esse limite deve ser de 1 a 12 (opcional).|

### Pagamento com boleto

|Propriedade     | Tipo     | Descrição
| -------------  | -------- | ------------------------------------------------------------------------------ |
| `dueDate` | `string` | Data do vencimento, essa data pode ser a partir da emissão do boleto e com formato: "DD/MM/YYYY". Este parâmetro possui o limite de 365 dias. Ex.: Um boleto emitido no dia 17/12/2018 o limite máximo para seu vencimento é 17/12/2019 (obrigatório). |
| `discountDays` | `number`| Até quantos dias, anteriores a data de vencimento, será aplicado o desconto. O número de dias deve ser de 0 a 30 (opcional). |
| `interest` | `number`| Valor do juros cobrado ao mês após o vencimento do boleto. Esse valor está em porcentagem e deve ser de 0.25 a 20 (opcional).|
| `fines`| `number` | Valor da multa cobrada após o vencimento do boleto. Esse valor está em porcentagem e deve ser de 0.25 a 20 (opcional).|
| `addNoteToInstructions` | `bool` | Ativa (`true`) ou desativa (`false`) as informações da descrição do pagamento que irão para a instrução do boleto (opcional).|
| `note` | `string` |Observações para o pagamento (opcional).|
| `acceptedUntil` | `number`| Até quantos dias, contados a partir da data de vencimento, o boleto poderá ser pago. Esse valor deve ser de 0 a 25 (opcional).|
| `installments` | `number` |Limita a quantidade máxima de parcelas com boleto. Esse limite deve ser de 1 a 12 (opcional).  |
| `discount` | `number` | Valor do desconto. O valor do boleto após o desconto não deve ultrapassar o valor mínimo de R$ 6,00. Esse valor está em porcentagem (opcional).|
| `avoidSteps` | `bool` | Habilita (`true`)  ou desabilita (`false`) que ao utilizar o LightBox o(s) boleto(s) seja(m) gerado(s) e seja exibida a tela de geração do(s) boleto(s). Por padrão essa propriedade será `false` (opcional).|

### Pagadores

| Propriedade   | Tipo     | Descrição                                                                      |
| ------------- | -------- | ------------------------------------------------------------------------------ |
| `sellingKey`  | `string` | Código que associa o seu ID ao pagamento processado pela Paggcerto (opcional). |
| `fullName`    | `string` | Nome de quem está pagando (pessoa ou empresa).                                 |
| `taxDocument` | `string` | CPF/CNPJ de quem está pagando (obrigátorio). Nos formatos: CPF - 000.000.000-00 e CNPJ - 00.000.000/0000-00                                   |
| `mobile`      | `string` | Celular do pagador (opcional). Possibilita envio de notificações por SMS. No formato: (99) 99999-9999 |
| `email`       | `string` | E-mail do pagador (opcional). Possibilita envio de notificações por e-mail.    |

### Eventos (opcionais)

| Propriedade | Tipo       | Descrição                                                                        |
| ----------- | ---------- | -------------------------------------------------------------------------------- |
| `abort`     | `function` | Executado quando o lightbox é encerrado (fechado) antes de concluir o pagamento. |
| `success`   | `function` | Executado quando o pagamento é finalizado com sucesso.                           |
| `fail`      | `function` | Executado quando ocorre algum erro no processamento do pagamento.                |

## Como executar localmente

1. Instale o [Node.js](https://nodejs.org/)
2. Execute `npm install` para instalar as dependências do node
3. Execute `npm run build` para recompilar os arquivos JavaScript e CSS

## Bugs e funcionalidades

Por favor, sinta-se a vontade para [iniciar uma issue](https://github.com/paggcerto-sa/paggcerto-lightbox/issues).
