//import librairie Express
const express = require("express");
//import de Mongoose pour la base de donnée
const mongoose = require("mongoose");
//creation de l'application (express)
const app = express();
//import router
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://new_user01:jinxjinx@cluster0.na98x.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res) => {
  res.json({ message: "Votre requête a bien été reçue !" }); //objet retourné
});

app.use("/api/auth", userRoutes);

//export de la const app pour y acceder depuis d'autres fichier
module.exports = app;
