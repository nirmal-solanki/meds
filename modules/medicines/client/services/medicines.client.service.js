//Medicines service used to communicate Medicines REST endpoints
(function () {
  'use strict';

  angular
    .module('medicines')
    .factory('MedicinesService', MedicinesService);

  MedicinesService.$inject = ['$resource'];

  function MedicinesService($resource) {
    return $resource('api/medicines/:medicineId', {
      medicineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
