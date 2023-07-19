const express = require("express");
const pdf = require("html-pdf");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  //res.json({ code: 200, message: "Working" });
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Formulario Imprimir</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f1f1f1;
      margin: 0;
      padding: 20px;
    }

    h1 {
      text-align: center;
      margin-bottom: 20px;
    }

    .form-container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    textarea {
      width: 100%;
      height: 100px;
      margin-bottom: 10px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      resize: vertical;
    }

    button {
      background-color: #4CAF50;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 16px;
    }

    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h1>Formulario Imprimir</h1>

    <label for="html">HTML:</label>
    <textarea id="html" name="html"></textarea>

    <label for="css">CSS:</label>
    <textarea id="css" name="css"></textarea>

    <button id="imprimirBtn">Imprimir</button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    document
  .getElementById("imprimirBtn")
  .addEventListener("click", async function () {
	const html = document.getElementById('html').value;
    const css = document.getElementById('css').value;
	  
	console.log('Valor de HTML:', html);
    console.log('Valor de CSS:', css);
	
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
  </script>
  
</body>
</html>
`);
});

app.listen(3000, () => {
  console.log("Servidor en ejecución puerto 3000");
});

app.post("/generate-pdf", (req, res) => {
  const { html, css } = req.body;

  // Agregar el CSS al HTML
  const styledHtml = `<style>${css}</style>${html}`;

  const options = { format: "Letter" };

  pdf.create(styledHtml, options).toBuffer((err, buffer) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al generar el PDF" });
      return;
    }

    const pdfBase64 = buffer.toString("base64");
    res.status(200).json({
      code: 200,
      message: " Pdf generado con exito",
      data: { pdf: pdfBase64 },
    });
  });
});
