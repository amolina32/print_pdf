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
<style>
        body {
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 90%;
            max-height: 50%;
            background-color: #FFFFFF;
            border: 1px solid #D7DBDD;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: 10px;
        }
        .logo {
            max-width: 200px;
            max-height: 200px;
        }
        .image-container {
              position: relative;
              display: inline-block;
        }
        .number-overlay {
              position: absolute;
              top: 10px;
              left: 10px;
              font-size: 20px;
              color: white;
        }
        .message-box {
            background-color: #555555;
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .info-box {
            background-color: #FFFFFF;
            border: 1px solid #D7DBDD;
            border-radius: 10px;
            padding: 10px;
            margin-top: 10px;
        }
        .payment-box {
            background-color: #005380;
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .payment-details {
            border: 1px solid #D7DBDD;
            border-radius: 5px;
            padding: 5px;
            margin-top: 5px;
        }
        .v-line {
            background-color: #D7DBDD;
            position: relative;
            height: 5vh;
            width: 0.1vw;
            border-width: 0;
            color: #D7DBDD;
            margin-left: auto;
            argin-right: auto;
            align-items: center;
            text-align: center;
            align-items: center;
        }
</style>
</head>
<body>
<div class="container">
<table style="width:100%;" border="0">
<tbody>
<tr>
<td style="width:50%;">
<div><img style="display:block; margin-left:auto; margin-right:auto;" src="<#LOGO#>" width="180" height="120"></div>
</td>
</tr>
<tr>
<td style="width:100%;">
<img style="display:block; margin-left:auto; margin-right:auto; border-radius:5px;" src="<#LLEGO_TU_FACTURA#>" width="550" height="70"></td>
</tr>
</tbody>
</table>
<table class="info-box">
<tbody >
<tr>
<td></td>
<td></td>
<td>
<p style="text-align:center;"><b>Cuenta contrato: <#CUENTA#></b></p>
</td>
<td></td>
<td></td>
</tr>
<tr>
<td><img style="display:block; margin-left:auto; margin-right:auto;" src="<#IMG_FECHA#>" width="50" height="50"></td>
<td style="width:10px;"><div class="v-line"></div></td>
<td><img style="display:block; margin-left:auto; margin-right:auto;" src="<#IMG_VALORSERV#>" width="50" height="50"></td>
<td style="width:10px;"><div class="v-line"></div></td>
<td><img style="display:block; margin-left:auto; margin-right:auto;" src="<#IMG_FECHALIM#>" width="50" height="50"></td>
</tr>
<tr style="text-align:center;">
<td><b>Mes Facturado:</b></td>
<td style="width:10px;"><div class="v-line"></div></td>
<td><b>Valor del servicio:</b></td>
<td style="width:10px;"><div class="v-line"></div></td>
<td><b>Fecha límite de pago:</b></td>
</tr>
<tr style="text-align:center;">
<td><#MES#></td>
<td>
</td>
<td><#VALOR#></td>
<td>
</td>
<td><#FECHA_PAGO#></td>
</tr>
</tbody>
</table>
<table style="width:100%; border=0; padding:20px;">
<tbody>
<tr>
<td><img style="display:block; margin-left:auto; margin-right:auto; border-radius:5px;" src="<#PAGA_EN_SUIGIENTES_CANALES#>" width="500" height="80"></td>
</tr>
<tr>
<td>
<img class="info-box" src="<#FORMAS_PAGO#>" width="700" height="80">
</td>
</tr>
<tr style="text-align:center; color:#008080;">
<td><p>o ingresa a: <a href="<#AvalPayCenter#>"><b>AvalPayCenter</b></a></p></td>
</tr>
<tr style="text-align:center;">
<td>Enviános el soporte de pago al correo de contacto</td>
</tr>
<tr style="text-align:center; color:#008080;">
<td><b><#vCorreoAtencionCliente#> o al <#vWhatsApp#></b></td>
</tr>
</tbody>
</table>
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
