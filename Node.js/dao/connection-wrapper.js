const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", // Computer
  user: "root", // Username
  password: "1234", // Password
  database: "test_db", // Database name
});

// Connect to the database:
connection.connect((err) => {
  if (err) {
    console.log("Failed to create connection + " + err);
    return;
  }
  console.log("We're connected to MySQL");
});

// One function for executing select / insert / update / delete:
function execute(sql) {
  return new Promise((resolve, reject) => {
    connection.execute(sql, (err, result) => {
      if (err) {
        // console.log("Error " + err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function executeWithParameters(sql, parameters) {
  return new Promise((resolve, reject) => {
    connection.execute(sql, parameters, (err, result) => {
      if (err) {
        console.log("Error " + err);
        console.log("Failed interacting with DB, calling reject");
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

const customers = new Promise((resolve, reject) => {
  const sql = `SELECT id, tz, first_name, last_name, date_of_birth, sex
  FROM customers
  ORDER BY id`;
  connection.execute(sql, (err, result) => {
    if (err) {
      //console.log("Error " + err);
      console.log("Failed interacting with DB, calling reject");
      reject(err);
      return;
    }
    resolve(result);
  });
});

const phones = new Promise((resolve, reject) => {
  const sql = `SELECT id, phone_number as phoneNumber, customer_id as customerId
  FROM phones
  order by customer_id`;
  connection.execute(sql, (err, result) => {
    if (err) {
      //console.log("Error " + err);
      console.log("Failed interacting with DB, calling reject");
      reject(err);
      return;
    }
    resolve(result);
  });
});

function getAllCustomersWithPhones() {
  return Promise.all([customers, phones])
    .then((res) => {
      const customers = res[0];
      const phones = res[1];
      customers.map((customer) => {
        customer.phoneNumbers = [];
        phones.map((phone)=>{
          if (phone.customerId == customer.id) {
            customer.phoneNumbers.push(phone.phoneNumber);
          }
        })
      });
      return customers;
    })
    .catch((err) => {
      console.error(err);
    });
}

function insertMultipleRows(sql, parameters) {
  return new Promise((resolve, reject) => {
    connection.query(sql, [parameters], (err, result) => {
      if (err) {
        console.log(err.message);
        reject(err);
        return;
      }
      console.log("Affected rows: " + result.affectedRows);
      resolve(result);
    });
  });
}

module.exports = {
  execute,
  executeWithParameters,
  insertMultipleRows,
  getAllCustomersWithPhones,
};
