'use strict';
/*
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const User = require('../models/users-model.js');

module.exports = async (req,res,next) =>  {
  // console.log(req.headers.authorization);
  const encoded = req.headers.authorization.split(' ')[1];
  // console.log('req.headers :',req.headers.authorization);
  // console.log('encoded :',encoded);
  const decoded = base64.decode(encoded);
  // console.log('decoded : ',decoded);
  const [username,password] = decoded.split(':');
  try {
    const user = await User.findOne({username});
    const isValid = await bcrypt.compare(password,user.password);
    if(isValid){
      req.user = user; 
      next();
    }
    else{
      next({error:'Incorrect username or password'});
    }
  } catch (error) {
    next({error:'Incorrect username or password'});
  }
};*/
const base64 = require('base-64');
const User = require('../models/users-model.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User.authenticateBasic(user, pass);
    next();
  } catch (e) {
    _authError();
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

};