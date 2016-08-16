(function () {
  'use strict';

  angular
    .module('medicines')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('medicines', {
        abstract: true,
        url: '/medicines',
        template: '<ui-view/>'
      })
      .state('medicines.list', {
        url: '',
        templateUrl: 'modules/medicines/views/list-medicines.client.view.html',
        controller: 'MedicinesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Medicines List'
        }
      })
      .state('medicines.create', {
        url: '/create',
        templateUrl: 'modules/medicines/views/form-medicine.client.view.html',
        controller: 'MedicinesController',
        controllerAs: 'vm',
        resolve: {
          medicineResolve: newMedicine
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Medicines Create'
        }
      })
      .state('medicines.edit', {
        url: '/:medicineId/edit',
        templateUrl: 'modules/medicines/views/form-medicine.client.view.html',
        controller: 'MedicinesController',
        controllerAs: 'vm',
        resolve: {
          medicineResolve: getMedicine
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Medicine {{ medicineResolve.name }}'
        }
      })
      .state('medicines.view', {
        url: '/:medicineId',
        templateUrl: 'modules/medicines/views/view-medicine.client.view.html',
        controller: 'MedicinesController',
        controllerAs: 'vm',
        resolve: {
          medicineResolve: getMedicine
        },
        data:{
          pageTitle: 'Medicine {{ articleResolve.name }}'
        }
      });
  }

  getMedicine.$inject = ['$stateParams', 'MedicinesService'];

  function getMedicine($stateParams, MedicinesService) {
    return MedicinesService.get({
      medicineId: $stateParams.medicineId
    }).$promise;
  }

  newMedicine.$inject = ['MedicinesService'];

  function newMedicine(MedicinesService) {
    return new MedicinesService();
  }
})();
