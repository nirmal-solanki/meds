'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Medicine = mongoose.model('Medicine'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Medicine
 */
exports.create = function(req, res) {
  var medicine = new Medicine(req.body);
  medicine.user = req.user;

  medicine.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicine);
    }
  });
};

/**
 * Show the current Medicine
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var medicine = req.medicine ? req.medicine.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  medicine.isCurrentUserOwner = req.user && medicine.user && medicine.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(medicine);
};

/**
 * Update a Medicine
 */
exports.update = function(req, res) {
  var medicine = req.medicine ;

  medicine = _.extend(medicine , req.body);

  medicine.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicine);
    }
  });
};

/**
 * Delete an Medicine
 */
exports.delete = function(req, res) {
  var medicine = req.medicine ;

  medicine.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicine);
    }
  });
};

/**
 * List of Medicines
 */
exports.list = function(req, res) { 
  Medicine.find().sort('-created').populate('user', 'displayName').exec(function(err, medicines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicines);
    }
  });
};

/**
 * Medicine middleware
 */
exports.medicineByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Medicine is invalid'
    });
  }

  Medicine.findById(id).populate('user', 'displayName').exec(function (err, medicine) {
    if (err) {
      return next(err);
    } else if (!medicine) {
      return res.status(404).send({
        message: 'No Medicine with that identifier has been found'
      });
    }
    req.medicine = medicine;
    next();
  });
};
