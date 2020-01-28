const HTMLRECEIPT = `<!DOCTYPE html>
<html>
  <head>
    <title>Comprovante</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/invoice.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet">
  </head>
  <body style="background-color:white;">
    <div class="w-100">
      <div id="invoice" style="font-size: 14px;margin: 0 auto; font-family: Roboto;">
        <div id="url" style="text-align:center;font-size:14px;font-family:Roboto;font-weight:400;">
          <p>Processado pela Pagcerto</p>
        </div>
        <div style="text-align: center !important; margin-bottom: 1.5rem !important; margin-top: .5rem !important; width:100% !important; display:block;">
          <h6 style="text-transform: uppercase !important; font-size: 1rem;">Comprovante de pagamento</h6>
        </div>
        <div style="display:flex!important;display: -ms-flexbox!important; width:100%; margin-bottom: 1rem !important; font-size: .875rem;">
          <div style="margin-right: auto !important;">
            <p style="display: block;text-transform:uppercase !important; margin-bottom:0">[[CARDBRAND]] - [[METHODPAYMENT]]<br></p>
            <p style="display: block;margin-bottom:0">Data: [[DATA]]<br></p>
            <p style="display: block;margin-bottom:0">*** **** **** **** [[CARDFINAL]]</p>
          </div>
          <div style="text-align: center!important; margin-left: 1.5rem!important;">
            <h5 style="font-weight: 700!important;white-space: nowrap!important; margin-bottom: 0!important; font-size: 1.15rem; line-height: 1.2;">[[AMOUNTPAID]]</h5>
            <p style="white-space: nowrap!important;margin-bottom: 0!important;">[[INSTALLMENTS]] x [[INSTALLMENTVALUE]]</p>
          </div>
        </div>
        <hr>
        <div style="text-align:center !important; padding: 0.5rem !important; border-radius: 0.25rem !important;border: 1px solid #343a40 !important; display:[[VISIBLE]];">
          <p style="font-weight: 700 !important;margin-bottom: 0 !important;">Aprovação realizada mediante<br>uso de senha.</p>
        </div>
        <div style="margin-top: 1rem !important;">
          <h6 style="text-transform: uppercase!important;margin-bottom: 0!important; margin-top: 0; font-weight: 700!important;font-size: 1rem;">[[TRADENAME]]</h6>
          <p style="text-transform:uppercase!important;margin-bottom:0!important;">[[CITY]]-[[STATE]]</p>
          <p style="margin-top:0!important; margin-bottom:1rem!important;">[[LINE1]], [[STREETNUMBER]]</p>
          <div style="display:flex!important;">
            <p style="margin-right:auto!important; margin-bottom:0 !important;"><strong>[[TYPEDOCUMENT]]</strong> [[TAXDOCUMENT]]</p><p class="mb-0"><strong>NSU:</strong> [[NSU]]</p>
          </div>
          <div>
          <div style="text-align:left !important; margin-top:1rem !important; margin-bottom:3rem!important; display:[[VISIBLE-ASS]];">
            <p>Assinatura:</p>
            <p>____________________________________________________________________</p>
          </div>
          <div style="text-align:center !important;">
          NÃO É UM COMPROVANTE FISCAL.
          </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
export default HTMLRECEIPT
