'use strict';

angular.module('starterApp')
  .factory('ContactService', function ($q) {

    var contacts = [
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Lara', lastName: 'Croft' }
    ];

    return {
      loadAllContacts: function () {
        return $q.when({ data: contacts });
      }
    };

  });

