const express = require("express");
const router = express.Router();

//middleware pour l'authentification
const auth = require("../middleware/auth");
//middleware pour la gestion des images
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.creatSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/:id/like", auth, multer, sauceCtrl.likeDislike);

module.exports = router;
