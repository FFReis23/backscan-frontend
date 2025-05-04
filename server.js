const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do transporter do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",  // Ou outro serviço de e-mail
  auth: {
    user: "machshev.reis@gmail.com", // Substitua pelo seu e-mail
    pass: "$$Yeshua$$31$$Reb",   // Substitua pela sua senha de e-mail
  },
});

const destinatarioEmail = "machshev.reis@exemplo.com"; // O e-mail para onde a localização será enviada

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const message = {
    from: "machshev.reis@gmail.com", // O e-mail de envio
    to: destinatarioEmail,
    subject: "Localização do Usuário",
    text: `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}\nLink do Google Maps: ${maps}`,
  };

  try {
    // Envia o e-mail
    await transporter.sendMail(message);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização por e-mail." });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
