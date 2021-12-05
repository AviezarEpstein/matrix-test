const usersDao = require("../dao/users-dao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const crypto = require("crypto");

const saltRight = "sdkjfhdskajh";
const saltLeft = "--mnlcfs;@!$ ";

async function addUser(registrationData) {
  await vaidateRegistrationDetails(registrationData);
  registrationData.password = crypto
    .createHash("md5")
    .update(saltLeft + registrationData.password + saltRight)
    .digest("hex");
  await usersDao.addUser(registrationData);
}

function validateLoginDetails(userData) {
  if (!userData.userName) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (!validateEmail(userData.userName)) {
    throw new ServerError(ErrorType.INVALID_EMAIL);
  }

  if (!userData.password) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }
}

function validateEmail(email) {
  const regularExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regularExpression.test(email.toLowerCase());
}

async function login(user) {
  validateLoginDetails(user);
  user.password = crypto
    .createHash("md5")
    .update(saltLeft + user.password + saltRight)
    .digest("hex");
  let userLoginData = await usersDao.login(user);
  const token = jwt.sign(
    {
      id: userLoginData.userId,
      name: user.userName,
    },
    config.secret,
    { expiresIn: "7d" }
  );
  return token;
}

async function vaidateRegistrationDetails(registrationData) {
  console.log('USER DATA: ', registrationData);
  
  if (!registrationData.userName) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (!validateEmail(registrationData.userName)) {
    throw new ServerError(ErrorType.INVALID_EMAIL);
  }

  if (await usersDao.isUserExistByName(registrationData.userName)) {
    throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
  }

  if (!registrationData.password) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (registrationData.userName.length > 100) {
    throw new ServerError(ErrorType.TOO_LONG_TEXT);
  }

  if (registrationData.password.length > 15) {
    throw new ServerError(ErrorType.TOO_LONG_TEXT);
  }
}

module.exports = {
  addUser,
  login,
};
