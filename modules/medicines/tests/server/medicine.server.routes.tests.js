'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Medicine = mongoose.model('Medicine'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, medicine;

/**
 * Medicine routes tests
 */
describe('Medicine CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Medicine
    user.save(function () {
      medicine = {
        name: 'Medicine name'
      };

      done();
    });
  });

  it('should be able to save a Medicine if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicine
        agent.post('/api/medicines')
          .send(medicine)
          .expect(200)
          .end(function (medicineSaveErr, medicineSaveRes) {
            // Handle Medicine save error
            if (medicineSaveErr) {
              return done(medicineSaveErr);
            }

            // Get a list of Medicines
            agent.get('/api/medicines')
              .end(function (medicinesGetErr, medicinesGetRes) {
                // Handle Medicine save error
                if (medicinesGetErr) {
                  return done(medicinesGetErr);
                }

                // Get Medicines list
                var medicines = medicinesGetRes.body;

                // Set assertions
                (medicines[0].user._id).should.equal(userId);
                (medicines[0].name).should.match('Medicine name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Medicine if not logged in', function (done) {
    agent.post('/api/medicines')
      .send(medicine)
      .expect(403)
      .end(function (medicineSaveErr, medicineSaveRes) {
        // Call the assertion callback
        done(medicineSaveErr);
      });
  });

  it('should not be able to save an Medicine if no name is provided', function (done) {
    // Invalidate name field
    medicine.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicine
        agent.post('/api/medicines')
          .send(medicine)
          .expect(400)
          .end(function (medicineSaveErr, medicineSaveRes) {
            // Set message assertion
            (medicineSaveRes.body.message).should.match('Please fill Medicine name');

            // Handle Medicine save error
            done(medicineSaveErr);
          });
      });
  });

  it('should be able to update an Medicine if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicine
        agent.post('/api/medicines')
          .send(medicine)
          .expect(200)
          .end(function (medicineSaveErr, medicineSaveRes) {
            // Handle Medicine save error
            if (medicineSaveErr) {
              return done(medicineSaveErr);
            }

            // Update Medicine name
            medicine.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Medicine
            agent.put('/api/medicines/' + medicineSaveRes.body._id)
              .send(medicine)
              .expect(200)
              .end(function (medicineUpdateErr, medicineUpdateRes) {
                // Handle Medicine update error
                if (medicineUpdateErr) {
                  return done(medicineUpdateErr);
                }

                // Set assertions
                (medicineUpdateRes.body._id).should.equal(medicineSaveRes.body._id);
                (medicineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Medicines if not signed in', function (done) {
    // Create new Medicine model instance
    var medicineObj = new Medicine(medicine);

    // Save the medicine
    medicineObj.save(function () {
      // Request Medicines
      request(app).get('/api/medicines')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Medicine if not signed in', function (done) {
    // Create new Medicine model instance
    var medicineObj = new Medicine(medicine);

    // Save the Medicine
    medicineObj.save(function () {
      request(app).get('/api/medicines/' + medicineObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', medicine.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Medicine with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/medicines/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Medicine is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Medicine which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Medicine
    request(app).get('/api/medicines/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Medicine with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Medicine if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicine
        agent.post('/api/medicines')
          .send(medicine)
          .expect(200)
          .end(function (medicineSaveErr, medicineSaveRes) {
            // Handle Medicine save error
            if (medicineSaveErr) {
              return done(medicineSaveErr);
            }

            // Delete an existing Medicine
            agent.delete('/api/medicines/' + medicineSaveRes.body._id)
              .send(medicine)
              .expect(200)
              .end(function (medicineDeleteErr, medicineDeleteRes) {
                // Handle medicine error error
                if (medicineDeleteErr) {
                  return done(medicineDeleteErr);
                }

                // Set assertions
                (medicineDeleteRes.body._id).should.equal(medicineSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Medicine if not signed in', function (done) {
    // Set Medicine user
    medicine.user = user;

    // Create new Medicine model instance
    var medicineObj = new Medicine(medicine);

    // Save the Medicine
    medicineObj.save(function () {
      // Try deleting Medicine
      request(app).delete('/api/medicines/' + medicineObj._id)
        .expect(403)
        .end(function (medicineDeleteErr, medicineDeleteRes) {
          // Set message assertion
          (medicineDeleteRes.body.message).should.match('User is not authorized');

          // Handle Medicine error error
          done(medicineDeleteErr);
        });

    });
  });

  it('should be able to get a single Medicine that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Medicine
          agent.post('/api/medicines')
            .send(medicine)
            .expect(200)
            .end(function (medicineSaveErr, medicineSaveRes) {
              // Handle Medicine save error
              if (medicineSaveErr) {
                return done(medicineSaveErr);
              }

              // Set assertions on new Medicine
              (medicineSaveRes.body.name).should.equal(medicine.name);
              should.exist(medicineSaveRes.body.user);
              should.equal(medicineSaveRes.body.user._id, orphanId);

              // force the Medicine to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Medicine
                    agent.get('/api/medicines/' + medicineSaveRes.body._id)
                      .expect(200)
                      .end(function (medicineInfoErr, medicineInfoRes) {
                        // Handle Medicine error
                        if (medicineInfoErr) {
                          return done(medicineInfoErr);
                        }

                        // Set assertions
                        (medicineInfoRes.body._id).should.equal(medicineSaveRes.body._id);
                        (medicineInfoRes.body.name).should.equal(medicine.name);
                        should.equal(medicineInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Medicine.remove().exec(done);
    });
  });
});
