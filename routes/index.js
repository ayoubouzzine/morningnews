var express = require('express');
var router = express.Router();

var userModel = require('../models/users')
const articleModel = require('../models/Article');

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// route pour s'enregistrer
router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token : uid2(32),
      lang : req.body.lang
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  
    // 3.2 envoi de la valeur du token
  res.json({result, saveUser, error, token})
})

// route pour se loguer
router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null

  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){

    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
      if(user){
        if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
        } else {
        result = false
        error.push('mot de passe incorrect')
        }
      } else {
      error.push('email incorrect')
      }
  }

  res.json({result, user, error, token})
})

// route whishlist
router.post('/wishlist-article', async function(req, res, next) {
  console.log('body', req.body)
  let result = false;

  const user = await userModel.findOne({token: req.body.token});
  console.log('find', user)

  if (user != null) {
    const newArticle = new articleModel({
      title: req.body.name, 
      description: req.body.desc, 
      urlToImage: req.body.img, 
      content: req.body.content,
      lang: req.body.lang,
      userId: user._id
    });

    const articleSave = await newArticle.save();

    if (articleSave.name) {
      result = true;
    };
  };

  res.json({result});
});

// route delete supprime dans la wishlist
router.delete('/wishlist-article', async function(req, res, next) {

  let result = false;

  const user = await userModel.findOne({token: req.body.token});

  if (user != null) {
    const articleDB = await articleModel.deleteOne({title: req.body.title, userId: user._id})

    if (articleDB.deletedCount == 1) {
      result = true;
    };  
  };

  res.json({result});
});

// route qui récupère la wishlist
router.get('/wishlist-article', async function(req, res, next) {
  let articles = [];

  let user = await userModel.findOne({token: req.query.token});
  console.log('query', req.query)

  if (user != null) {
    if (req.query.lang !== '') {
      articles = await articleModel.find({userId: user._id, lang: req.query.lang});
    } else { 
      articles = await articleModel.find({userId: user._id});
    } 
  };
  
  res.json({articles});
});

// route qui récupère la dernière langue choisi
router.get('/user-language', async function(req, res, next) {
  console.log('/user-language req.query', req.query)
  let lang = null;

  const user = await userModel.findOne({token: req.query.token});

  if (user != null) {
    lang = user.lang;
  };

  res.json({lang});
});

// route qui enregistre le choix de la langue
router.post('/user-language', async function(req, res, next) {
  console.log('/user-language req.body', req.body)
  let result = false;

  let user = await userModel.updateOne({token: req.body.token}, {lang: req.body.lang});

  if (user != null) {
    result = true;
  };

  console.log(result);

  res.json({result});
});

module.exports = router;
