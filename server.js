const express = require("express");
const pdf = require("html-pdf");

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ code: 200, message: "Working" });
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
