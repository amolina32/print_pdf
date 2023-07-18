let html = `
<!DOCTYPE html>
<html>

<head>
  <title>Factura de Servicios de Telefonía</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
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

</html>`;

let css = `
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
}`;
document
  .getElementById("generateBtn")
  .addEventListener("click", async function () {
    const response = await axios.post("http://localhost:3000/generate-pdf", {
      html,
      css,
    });
    console.log({ response });

    const link = document.createElement("a");
    link.href = "data:application/pdf;base64," + response.data.data.pdf;
    link.download = "generated.pdf";
    link.click();
  });