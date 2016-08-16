(function () {
  'use strict';

  angular
    .module('medicines')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Medicines',
      state: 'medicines',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'medicines', {
      title: 'List Medicines',
      state: 'medicines.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'medicines', {
      title: 'Create Medicine',
      state: 'medicines.create',
      roles: ['user']
    });
  }
})();
