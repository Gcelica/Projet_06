//import le model sauce
const Sauce = require("../models/Sauce");
const fs = require("fs"); //utilisation du module Node.js fs

//creation sauce
exports.creatSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);

  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistré !" }))
    .catch((error) => (400).JSON({ error }));
};

//modification sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié" }))
    .catch(() => res.status(400).json({ error }));
};

//suppression sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })

          .then(() => res.status(200).json({ message: "Sauce supprimé" }))
          .catch((error) => res.status(400).json({ error }));
        
      });
    })
    .catch((error = res.status(500).json({ error })));
};

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// like et dislike
exports.likeDislike = (req, res, next) => {
  if (req.body.like == 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { usersLiked: req.body.userId },
        $inc: { likes: req.body.like },
      }
    )

      .then(() => res.status(200).json({ message: "J'aime !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  
  else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) =>
        res.status(200).json({ message: "J'aime pas !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }
  else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Je retire mon j'aime" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Je retire mon j'aime pas !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};