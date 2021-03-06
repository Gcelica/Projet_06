const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//import des routes
const userRoutes = require("./routes/user"); //parcours utilisateur
const sauceRoutes = require("./routes/sauce"); //parcours des sauces

//import module path
const path = require("path"); //accès au chemin des fichiers

//connexion base de données MongoDB
mongoose
  .connect(process.env.MONGO_PASS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//création de l'application express
const app = express();

app.use(express.json()); // recupere les requetes avec un content-type/json

//headers pour autoriser les requetes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
