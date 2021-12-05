let connection = require("./connection-wrapper");
let ErrorType = require("../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllCustomers() {
  
  let sql = `SELECT c.id, c.tz, c.first_name as firstName, c.last_name as lastName, c.date_of_birth as dateOfBirth, c.sex, p.phone_number as phoneNumber 
  from customers c 
  join phones p on c.id = p.customer_id`;

  try {
    let customersData = await connection.execute(sql);
    return customersData;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function addCustomer(customerData) {
  const sql1 = `INSERT INTO customers (tz, first_name, last_name, date_of_birth, sex)
  VALUES (?,?,?,?,?)`;

  const parameters1 = [
    customerData.tz,
    customerData.firstName,
    customerData.lastName,
    customerData.dateOfBirth,
    customerData.sex
  ];

  const sql2 = 'SELECT id FROM customers WHERE tz = ?';
  const parameters2 = [customerData.tz];

  try {
  await connection.executeWithParameters(sql1, parameters1);
  const res = await connection.executeWithParameters(sql2, parameters2);

  const sql3 = `INSERT INTO phones(phone_number, customer_id) VALUES ?`;
  let values = [];
  for (let i = 0; i < customerData.phoneNumbers.length; i++) {
    let params = [customerData.phoneNumbers[i], res[0].id];
    values.push(params);
  }
  await connection.insertMultipleRows(sql3, values);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, customerData, e);
  }
}

async function editCustomer(customerData) {
  
  try {
    const sql1 = `UPDATE customers SET first_name = ?, last_name = ?, date_of_birth = ?, sex = ? WHERE id = ?`;
    const parameters1 = [
      customerData.firstName,
      customerData.lastName,
      customerData.dateOfBirth,
      customerData.sex,
      customerData.id
    ];
  await connection.executeWithParameters(sql1, parameters1);

  // in case there are more phone numbers to insert then existing phone numbers, we are 
  // deleting the existing phone numbers and adding a new phone numbers
  const sql2 = 'DELETE FROM phones WHERE customer_id = ?';
  const parameters2 = [customerData.id];

  await connection.executeWithParameters(sql2, parameters2);

  const sql3 = `INSERT INTO phones(phone_number, customer_id) VALUES ?`;
  let values = [];
  for (let i = 0; i < customerData.phoneNumbers.length; i++) {
    let params = [customerData.phoneNumbers[i], customerData.id];
    values.push(params);
  }
  await connection.insertMultipleRows(sql3, values);
  // return response;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, customerData, e);
  }
}

async function deleteCustomer(customerId) {
  const sql1 = `DELETE FROM customers WHERE id = ?`;
  const parameters = [customerId];
  const sql2 = `DELETE FROM phones WHERE customer_id = ?`

  try {
  await connection.executeWithParameters(sql1, parameters);
  await connection.executeWithParameters(sql2, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, customerId, e);
  }
}

async function isIdExist(tz) {
  let sql = `SELECT id FROM customers WHERE tz = ?`;
  let parameters = [tz];
  try {
    let res = await connection.executeWithParameters(sql, parameters);
    console.log(res);
    if (res.length == 0) {
      return false;
    }else{
      return true;
    }
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

module.exports = {
  getAllCustomers,
  addCustomer,
  isIdExist,
  editCustomer,
  deleteCustomer
};
