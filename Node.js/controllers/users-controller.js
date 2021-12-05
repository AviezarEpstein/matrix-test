const usersLogic = require("../logic/users-logic");
const express = require("express");
const router = express.Router();

router.post('/register', register); // public
router.post('/login', login); // public to all kind of users

async function register(request, response, next){
  try{
    let registrationData = request.body;
    await usersLogic.addUser(registrationData);
    response.status(204).send();
  } 
  catch(error){
    return next(error);
  }
};

async function login(request, response, next){
  let user = request.body;
  try {
    let successfullLoginData = await usersLogic.login(user);
    response.status(200);
    response.send({token: successfullLoginData});
  }
  catch (error) {
    console.log(error);
    return next(error);
  }
};
module.exports = router;
