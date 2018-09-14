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
        <div style="text-align: -webkit-center;">
          <div class="w-50" style="max-width: 120px;">
            <svg id="Camada_1" data-name="Camada 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 203.5 106.65">
              <defs><style>.cls-1{fill:#000;}</style></defs>
              <title>marca </title>
              <path class="cls-1" d="M141.4,13.89l-19.23,12V37.33L150.46,19.6l-9.06-5.71ZM110.64,33,84.72,49.12a1.5,1.5,0,0,1-1.74,0,1.72,1.72,0,0,1-.87-1.49V32l-9.55-5.95v21.7a11.23,11.23,0,0,0,5.83,9.93,11.19,11.19,0,0,0,11.54-.25l30.38-19Z"/><path class="cls-1" d="M115.73,4.71c-3.6-2-8.19-1.61-12.28,1-7,4.35-28,17.49-28,17.49l-2.85,1.74,9.67,5.95L109,14.14a1.31,1.31,0,0,1,1.61,0,1.72,1.72,0,0,1,.87,1.49V32.5l9.67,5.33V15.63C121.18,10.67,119.2,6.7,115.73,4.71Z"/><path class="cls-1" d="M26.6,77.56c-.6,5.7-2.2,7.7-6.2,7.7a4.16,4.16,0,0,1-3.3-1.2c-1-1.1-1.3-3.1-.9-6.4.7-5.6,2.3-7.7,6.1-7.7a4.25,4.25,0,0,1,3.4,1.2c1,1.2,1.3,3.1.9,6.4Zm-3.3-11.5c-3.2,0-4.8,1-6,2.2l.2-1.6H12.9L9.5,97.36h4.6l1.1-10.1c.8,1.1,2,2,4.6,2.2h1.1q9.3,0,10.5-11.4v-.6c.5-4.2-.1-7.2-1.8-9.2A8.49,8.49,0,0,0,23.3,66.06Z"/><path class="cls-1" d="M48.1,80.36c-.4,3.5-2.5,5.1-6.7,5.1-1.5,0-2.5-.2-2.9-.7a2.19,2.19,0,0,1-.4-1.9c.2-2.1,1.3-2.9,4.6-3.3,0,0,2.8-.3,5.5-.4l-.1,1.2Zm-2.7-14.3c-6.4,0-9.2,2.1-10.2,7.3l-.1.6h4.6l.1-.3c.7-2.3,1.1-3.5,5.2-3.5q2.85,0,3.6.9a3.25,3.25,0,0,1,.4,2.4l-.2,2.2a31.76,31.76,0,0,0-9.2.6,7.64,7.64,0,0,0-6.1,7,5.53,5.53,0,0,0,1.1,4.4c1.1,1.3,3,1.9,5.7,1.9a11.62,11.62,0,0,0,7.2-2.2l-.2,1.7h4.6l1.8-16.4a5.53,5.53,0,0,0-1.1-4.4C51.2,66.66,49,66.06,45.4,66.06Z"/><path class="cls-1" d="M70.4,71.26c1,1.1,1.2,3,.8,6.4L70.5,84a13,13,0,0,1-5.3,1.2c-1.9,0-3.1-.4-3.8-1.1-.9-1-1.1-2.9-.8-6.3.5-4.9,1.7-7.6,6.2-7.6,1.8,0,2.9.3,3.6,1.1Zm1.9-3C71.2,67,69.7,66,66.6,66c-6.2,0-9.7,3.8-10.5,11.3-.5,4.4.2,7.6,2,9.6a8.3,8.3,0,0,0,6.4,2.4,15.71,15.71,0,0,0,5.5-1c-.5,3.4-1.3,5.2-6.4,5.2-2.6,0-3.7-.4-3.8-2.9v-.5H55.3v.5a7,7,0,0,0,1.6,5c1.3,1.3,3.4,2,6.6,2,9.4,0,10.7-5.4,11.4-11.4l2.2-19.8H72.5Z"/><path class="cls-1" d="M94.2,77.56l-.7,6.3a13,13,0,0,1-5.3,1.2c-1.9,0-3.1-.4-3.8-1.1-.9-1-1.1-2.9-.8-6.3.5-4.9,1.7-7.6,6.2-7.6a4.72,4.72,0,0,1,3.5,1.1c1.1,1.1,1.3,3.1.9,6.4Zm1.3-11-.2,1.7C94.2,67,92.7,66,89.6,66c-6.2,0-9.7,3.8-10.5,11.3-.5,4.4.2,7.6,2,9.6a8.3,8.3,0,0,0,6.4,2.4,15.71,15.71,0,0,0,5.5-1c-.5,3.4-1.3,5.2-6.4,5.2-2.6,0-3.7-.4-3.8-2.9v-.5H78.3v.5a7,7,0,0,0,1.6,5c1.3,1.3,3.4,2,6.6,2,9.4,0,10.7-5.4,11.4-11.4l2.2-19.8H95.5Z"/><path class="cls-1" d="M113.2,66.06c-4.7,0-10.2,1.3-11.3,11.8-.5,4.5,0,7.5,1.7,9.3,1.4,1.6,3.5,2.3,6.6,2.3,3.9,0,8.6-1,10.3-8.5l.1-.6H116l-.1.4c-1,3.9-2.4,4.6-5.1,4.6-1.8,0-2.9-.3-3.5-1.1-.9-1-1.1-2.8-.7-6.3.7-6.2,2-7.9,6.3-7.9,2.7,0,3.7.6,3.8,3.9v.5h4.6V74c0-2.8-.6-4.7-1.9-6S116,66.06,113.2,66.06Z"/><path class="cls-1" d="M128.8,75.36c1-4.4,2.9-5.2,6.2-5.2a5,5,0,0,1,3.6,1.1c.7.8,1,2,1,4.1Zm6.7-9.3c-7,0-10.9,3.9-11.8,12-.5,4.1.1,7,1.8,8.9,1.5,1.7,3.9,2.5,7.4,2.5,6,0,9.6-2.5,10.7-7.5l.1-.6h-4.6l-.1.4c-.6,2.7-2.1,3.6-5.4,3.6-2.1,0-3.4-.4-4.2-1.2s-1.1-2.4-1-4.8H144V79c.6-5.2,0-8.5-1.8-10.5C140.8,66.76,138.6,66.06,135.5,66.06Z"/><path class="cls-1" d="M158,66.06a6.56,6.56,0,0,0-5.1,2l.2-1.5h-4.3l-2.5,22.3h4.6l1.4-12.4c.4-4,1.9-5.7,5-5.7a7.19,7.19,0,0,1,1.8.2l.6.2.5-4.8-.4-.1C159.7,66.36,159.1,66.06,158,66.06Z"/><path class="cls-1" d="M168.5,60.86h-4.6L161.3,84c-.2,2.2,0,3.4.7,4.2a4.56,4.56,0,0,0,3.5,1.1,33.32,33.32,0,0,0,4-.4l.4-.1.4-4-.6.1c-.8.1-2,.2-2.3.2s-1.2,0-1.4-.2-.1-.3-.1-.8l1.5-13.5h4.5l.4-4h-4.5Z"/><path class="cls-1" d="M189.2,77.66c-.6,5.5-2.5,7.7-6.6,7.7-1.8,0-3-.4-3.8-1.3-1-1.1-1.3-3.1-1-6.2.6-5.5,2.5-7.7,6.6-7.7,1.8,0,3,.4,3.8,1.3,1,1.1,1.3,3.1,1,6.2Zm4.8-2v-.5a9.24,9.24,0,0,0-2.1-6.5c-1.6-1.8-4-2.6-7.3-2.6-6.9,0-10.8,3.9-11.6,11.7-.5,4.2.2,7.1,1.9,9.1,1.5,1.7,4,2.6,7.3,2.6,6.9,0,10.9-3.9,11.7-11.6A17,17,0,0,0,194,75.66Z"/>
            </svg>
          </div>
        </div>
        <div id="url" style="text-align:center;font-size:14px;font-family:Roboto;font-weight:400;">
          <p>www.paggcerto.com.br</p>
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
