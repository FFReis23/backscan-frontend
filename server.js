const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conectando ao MongoDB
mongoose.connect("mongodb://localhost:27017/localizacao", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado ao MongoDB"))
.catch((err) => console.error("Erro de conexão com o MongoDB:", err));

// Definindo o modelo de dados de localização
const LocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  mapsLink: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model("Location", LocationSchema);

// Rota para receber e armazenar a localização
app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const location = new Location({
    latitude,
    longitude,
    mapsLink: maps,
  });

  try {
    // Salvar a localização no banco de dados
    await location.save();
    res.status(200).json({ success: true, message: "Localização salva com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro ao salvar a localização no banco de dados." });
  }
});

// Rota para listar as localizações salvas
app.get("/locations", async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Erro ao recuperar as localizações." });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
