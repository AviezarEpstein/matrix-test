let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

async function addUser(registrationData) {
  console.log(registrationData);
  let sql = `INSERT INTO users (user_name, password)
    VALUES (?,?)`;

  let parameters = [
    registrationData.userName,
    registrationData.password
  ];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(
      ErrorType.GENERAL_ERROR,
      JSON.stringify(registrationData),
      e
    );
  }
}

async function isUserExistByName(userName) {
  let sql = "select user_name from users WHERE user_name = ?";
  let parameters = [userName];
  try{
    let res = await connection.executeWithParameters(sql, parameters);
    if (res.length > 0) {
      console.log("User name already exists");
      return true;
    }
    return false;
  }catch(e){
    throw new ServerError(ErrorType.GENERAL_ERROR, userName, e);
  }
}

async function login(user) {
  let sql =
  "SELECT id as userId FROM users where user_name =? and password =?";
  
  let parameters = [user.userName, user.password];
  
  let usersLoginResult;

  try {
    usersLoginResult = await connection.executeWithParameters(sql, parameters);
    console.log(user);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, JSON.stringify(user), e);
  }
  // A functional (!) issue which means - the userName + password do not match
  if (usersLoginResult == null || usersLoginResult.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }
  return usersLoginResult[0];
}

module.exports = {
  addUser,
  login,
  isUserExistByName
};
