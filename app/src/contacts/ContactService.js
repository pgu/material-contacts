'use strict';

angular.module('starterApp')
  .factory('ContactService', function ($q) {

    var contacts = [
      { id: '1', firstName: 'John', lastName: 'Doe', avatar: 'contact-man' },
      { id: '2', firstName: 'Lara', lastName: 'Croft', avatar: 'contact-woman' }
    ];

    return {
      loadAllContacts: function () {
        return $q.when({ data: contacts });
      }
    };

  });

