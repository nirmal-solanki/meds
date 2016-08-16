(function () {
  'use strict';

  describe('Medicines Route Tests', function () {
    // Initialize global variables
    var $scope,
      MedicinesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MedicinesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MedicinesService = _MedicinesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('medicines');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/medicines');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MedicinesController,
          mockMedicine;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('medicines.view');
          $templateCache.put('modules/medicines/client/views/view-medicine.client.view.html', '');

          // create mock Medicine
          mockMedicine = new MedicinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Medicine Name'
          });

          //Initialize Controller
          MedicinesController = $controller('MedicinesController as vm', {
            $scope: $scope,
            medicineResolve: mockMedicine
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:medicineId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.medicineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            medicineId: 1
          })).toEqual('/medicines/1');
        }));

        it('should attach an Medicine to the controller scope', function () {
          expect($scope.vm.medicine._id).toBe(mockMedicine._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/medicines/client/views/view-medicine.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MedicinesController,
          mockMedicine;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('medicines.create');
          $templateCache.put('modules/medicines/client/views/form-medicine.client.view.html', '');

          // create mock Medicine
          mockMedicine = new MedicinesService();

          //Initialize Controller
          MedicinesController = $controller('MedicinesController as vm', {
            $scope: $scope,
            medicineResolve: mockMedicine
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.medicineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/medicines/create');
        }));

        it('should attach an Medicine to the controller scope', function () {
          expect($scope.vm.medicine._id).toBe(mockMedicine._id);
          expect($scope.vm.medicine._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/medicines/client/views/form-medicine.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MedicinesController,
          mockMedicine;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('medicines.edit');
          $templateCache.put('modules/medicines/client/views/form-medicine.client.view.html', '');

          // create mock Medicine
          mockMedicine = new MedicinesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Medicine Name'
          });

          //Initialize Controller
          MedicinesController = $controller('MedicinesController as vm', {
            $scope: $scope,
            medicineResolve: mockMedicine
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:medicineId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.medicineResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            medicineId: 1
          })).toEqual('/medicines/1/edit');
        }));

        it('should attach an Medicine to the controller scope', function () {
          expect($scope.vm.medicine._id).toBe(mockMedicine._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/medicines/client/views/form-medicine.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
