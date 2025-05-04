const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Criação e conexão com o banco
const db = new sqlite3.Database("./localizacoes.db");

// Cria a tabela (executado uma vez)
db.run(`CREATE TABLE IF NOT EXISTS localizacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude TEXT,
  longitude TEXT,
  maps TEXT,
  data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Endpoint para receber e salvar localização
app.post("/send-location", (req, res) => {
  const { latitude, longitude, maps } = req.body;

  db.run(
    `INSERT INTO localizacoes (latitude, longitude, maps) VALUES (?, ?, ?)`,
    [latitude, longitude, maps],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.status(200).json({ success: true, id: this.lastID });
    }
  );
});

// Endpoint para consultar localizações
app.get("/localizacoes", (req, res) => {
  db.all("SELECT * FROM localizacoes ORDER BY data_envio DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false });
    }
    res.json(rows);
  });
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
