(function () {
  'use strict';

  // Medicines controller
  angular
    .module('medicines')
    .controller('MedicinesController', MedicinesController);

  MedicinesController.$inject = ['$scope', '$state', 'Authentication', 'medicineResolve'];

  function MedicinesController ($scope, $state, Authentication, medicine) {
    var vm = this;

    vm.authentication = Authentication;
    vm.medicine = medicine;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Medicine
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.medicine.$remove($state.go('medicines.list'));
      }
    }

    // Save Medicine
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.medicineForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.medicine._id) {
        vm.medicine.$update(successCallback, errorCallback);
      } else {
        vm.medicine.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('medicines.view', {
          medicineId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
