const express = require('express');
const puppeteer = require('puppeteer');
const { Readable } = require('stream');
const app = express();
const port = 3000;

app.get('/generate-pdf', async (req, res) => {
  
  // HTML básico que muestra la hora actual
  const currentTime = new Date().toLocaleString();
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Factura de Servicios de Telefonía</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
      body {
        padding: 20px;
      }
  
      .header {
        background-color: #337ab7;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
  
      .customer-info p {
        margin: 0;
        color: #555;
        font-size: 16px;
      }
  
      .invoice-details {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
      }
  
      .invoice-details div {
        flex: 1;
      }
  
      .invoice-details div:first-child {
        margin-right: 20px;
      }
  
      .invoice-details h3 {
        margin: 0;
        color: #333;
        font-size: 18px;
      }
  
      .barcode {
        text-align: center;
        margin-top: 20px;
      }
  
      .qr-code {
        text-align: center;
        margin-top: 20px;
      }
  
      .table {
        margin-top: 40px;
      }
  
      .total {
        margin-top: 40px;
        text-align: right;
        color: #333;
        font-weight: bold;
      }
  
      .footer {
        margin-top: 60px;
        text-align: center;
        color: #777;
      }
  
      .footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Factura de Servicios de Telefonía</h1>
      </div>
  
      <div class="row">
        <div class="col-md-6">
          <div class="customer-info">
            <p>Nombre del cliente: John Doe</p>
            <p>Dirección: Calle Principal 123</p>
            <p>Ciudad: Ciudad Ejemplo</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="invoice-details">
            <div>
              <h3>Detalles de la factura</h3>
              <p>Número de factura: 12345</p>
              <p>Fecha: 15 de julio de 2023</p>
            </div>
            <div>
              <img src="logo.png" alt="Logo de la empresa" class="img-fluid">
            </div>
          </div>
        </div>
      </div>
  
      <div class="barcode">
        <svg id="barcode"></svg>
      </div>
  <div id="qrcode"></div>
      <div class="qr-code">
        <div id="qrcode"></div>
      </div>
  
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Energía consumida</td>
            <td>100 kWh</td>
            <td>$0.15</td>
            <td>$15.00</td>
          </tr>
          <tr>
            <td>Cargo fijo</td>
            <td>1</td>
            <td>$10.00</td>
            <td>$10.00</td>
          </tr>
        </tbody>
      </table>
  
      <div class="total">
        <p>Total a pagar: $25.00</p>
      </div>
  
      <div class="footer">
        <p>© 2023 Nombre de la Empresa. Todos los derechos reservados.</p>
      </div>
    </div>
  
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcode-js-package@1.0.4/qrcode.min.js"></script>
    <script>
      JsBarcode("#barcode", "12345");
      new QRCode(document.getElementById("qrcode"), "https://www.oracle.com/co/application-development/visual-builder-studio/");
  
    </script>
  </body>
  </html>
  
  `;

  // Iniciamos Puppeteer con el nuevo modo Headless
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Configuramos el contenido HTML de la página
  await page.setContent(html);

  // Generamos el PDF y aplicamos los estilos CSS
  const pdfBuffer = await page.pdf({ format: 'A4', displayHeaderFooter: false, printBackground: true, margin: { top: 10, right: 10, bottom: 10, left: 10 }, preferCSSPageSize: true, media: 'print' });

  // Cerramos el navegador
  await browser.close();

  // Convertimos el buffer del PDF a base64
  const base64Pdf = pdfBuffer.toString('base64');

  // Enviamos el PDF como respuesta
  res.setHeader('Content-Type', 'application/pdf');
  res.send(base64Pdf);
  //res.send(pdfBuffer)
  
});

app.listen(port, () => {
  console.log(`Servidor activo en http://localhost:${port}`);
});
