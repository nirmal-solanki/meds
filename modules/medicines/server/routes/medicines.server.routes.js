'use strict';

/**
 * Module dependencies
 */
var medicinesPolicy = require('../policies/medicines.server.policy'),
  medicines = require('../controllers/medicines.server.controller');

module.exports = function(app) {
  // Medicines Routes
  app.route('/api/medicines').all(medicinesPolicy.isAllowed)
    .get(medicines.list)
    .post(medicines.create);

  app.route('/api/medicines/:medicineId').all(medicinesPolicy.isAllowed)
    .get(medicines.read)
    .put(medicines.update)
    .delete(medicines.delete);

  // Finish by binding the Medicine middleware
  app.param('medicineId', medicines.medicineByID);
};
