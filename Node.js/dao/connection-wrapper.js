const mysql = require("mysql2");

// Connection = קו תקשורת למסד הנתונים
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
        //console.log("Error " + err);
        console.log("Failed interacting with DB, calling reject");
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// async function test(sql) {
//   return new Promise((resolve, reject) => {
//     connection.execute(sql, (err, result) => {
//         if (err) {
//           //console.log("Error " + err);
//           console.log("Failed interacting with DB, calling reject");
//           reject(err);
//           return;
//         }

//         let phones = connection.query(
//             `select phone_number as phoneNumber from phones`,
//             (err, phoneNumber) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 resolve(phoneNumber)
//               }
//             }
//           );

//           console.log(phones);

//         resolve(result);
//       });


//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.log("Failed interacting with DB, calling reject");
//         reject(err);
//         return;
//       }

    

//     });
//   });
// }

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
};
