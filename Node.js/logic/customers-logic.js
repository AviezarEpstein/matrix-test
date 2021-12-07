const customersDao = require("../dao/customers-dao");
const ServerError = require("../errors/server-error");
const ErrorType = require("../errors/error-type");

async function getAllCustomers() {
  const customersData = await customersDao.getAllCustomers();
  return customersData;
}

async function addCustomer(customerData) {
  await validateInputs(customerData);
  // Had to seperate validation for tz from other validations
  // because the editCustomer() dose not check tz as it is not editable
  await tzValidation(customerData.tz);
  await customersDao.addCustomer(customerData);
}

async function editCustomer(customerData) {
  await validateInputs(customerData);
  await customersDao.editCustomer(customerData);
}

async function deleteCustomer(customerId) {
    await customersDao.deleteCustomer(customerId);
  }

async function validateInputs(customerData) {
  if (isEmpty(customerData.firstName)) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (customerData.firstName.length > 45) {
    throw new ServerError(ErrorType.TOO_LONG_TEXT);
  }

  if (isEmpty(customerData.lastName)) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (customerData.lastName.length > 45) {
    throw new ServerError(ErrorType.TOO_LONG_TEXT);
  }

  if (isEmpty(customerData.dateOfBirth)) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (!isValidDate(customerData.dateOfBirth)) {
    throw new ServerError(ErrorType.INVALID_DATE_FORMAT);
  }

  if (!isValidDate(customerData.dateOfBirth)) {
    throw new ServerError(ErrorType.INVALID_DATE);
  }

  if (isEmpty(customerData.sex)) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (
    customerData.sex.toLowerCase() != "male" &&
    customerData.sex.toLowerCase() != "female"
  ) {
    throw new ServerError(ErrorType.INVALID_GENDER);
  }

  if (customerData.phoneNumbers.length == 0) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  const phoneRegex =
    /^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/;
  for (let i = 0; i < customerData.phoneNumbers.length; i++) {
    if (!phoneRegex.test(customerData.phoneNumbers[i])) {
      throw new ServerError(ErrorType.INVALID_PHONE);
    }
  }
}

async function tzValidation(tz) {
  if (isEmpty(tz)) {
    throw new ServerError(ErrorType.EMPTY_INPUT);
  }

  if (!isValidIsraeliID(tz)) {
    throw new ServerError(ErrorType.INCORRECT_ISRAELI_ID);
  }

  if (await customersDao.isIdExist(tz)) {
    throw new ServerError(ErrorType.ID_ALREADY_EXIST);
  }
}

function isValidDate(givenDate) {
  const currentDate = new Date();
  if (givenDate > currentDate) {
    return false;
  }
  return true;
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

function isValidIsraeliID(id) {
  var id = String(id).trim();
  if (id.length > 9 || id.length < 5) return false;

  // Pad string with zeros up to 9 digits
  id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

  return (
    Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) %
      10 ===
    0
  );
}

function isEmpty(field) {
  if (!field) {
    return true;
  }
  return false;
}

module.exports = {
  getAllCustomers,
  addCustomer,
  editCustomer,
  deleteCustomer,
};
