(function () {
  'use strict';

  angular
    .module('medicines')
    .controller('MedicinesListController', MedicinesListController);

  MedicinesListController.$inject = ['MedicinesService'];

  function MedicinesListController(MedicinesService) {
    var vm = this;

    vm.medicines = MedicinesService.query();
  }
})();
