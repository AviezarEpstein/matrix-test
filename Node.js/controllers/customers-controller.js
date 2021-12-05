const customersLogic = require("../logic/customers-logic");
const express = require("express");
const router = express.Router();

router.get("/", getAllCustomers);
router.post("/", addCustomer);
router.put("/:id", editCustomer);
router.delete("/:id", deleteCustomer);

async function addCustomer(request, response, next){
  try {
    let customerData = request.body;
    await customersLogic.addCustomer(customerData);
    response.status(204);
    response.json();
  } catch (error) {
    return next(error);
  }
}

async function editCustomer(request, response, next){
  try {
    let customerData = request.body;
    let customerId = request.params.id;
    customerData.id = customerId;
    await customersLogic.editCustomer(customerData);
    response.status(204);
    response.json();
  } catch (error) {
    return next(error);
  }
}

async function deleteCustomer(request, response, next){
  try {
    let customerId = request.params.id;
    await customersLogic.deleteCustomer(customerId);
    response.status(204);
    response.json();
  } catch (error) {
    return next(error);
  }
}

async function getAllCustomers(request, response, next){
  try {
    let customersData = await customersLogic.getAllCustomers();
    response.status(200);
    response.json(customersData);
  } catch (error) {
    return next(error);
  }
}

module.exports = router;
