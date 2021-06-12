'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require ('./models/users-model.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth=require('./middleware/bearer.js');

router.get('/',(req,res)=>{
  res.render('pages/home');
});


router.get('/signup',(req,res)=>{
  res.render('pages/register');
});

router.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };

    // res.status(201).json(output);
    res.redirect('/profile');
    
  } catch (e) {
    next(e.message);
  }
});






router.get('/signin',(req,res)=>{
  res.render('pages/signin');
});

router.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).redirect('/profile');
});
router.get('/profile',(req,res)=>{
  res.render('pages/profile');
});

router.get('/users', bearerAuth, async (req, res, next) => {
  //all users
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);

  //one user
  // await res.status(200).json({user : req.user.username}); 
     
});

router.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});


module.exports = router;

