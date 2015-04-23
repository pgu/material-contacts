'use strict';

angular.module('starterApp')
  .factory('ContactsService', function ($http) {

    var endpoint = 'https://pgu_contacts.apispark.net/v1';

    return {

      loadAllContacts: function () {
        return $http.get(endpoint + '/contacts/');
      },

      saveContact: function (copyContact) {

        var isCreation = !_.has(copyContact, 'id');

        if (isCreation) {
          return $http.post(endpoint + '/contacts/', copyContact);

        } else {
          return $http.put(endpoint + '/contacts/' + copyContact.id, copyContact);
        }
      },

      deleteContact: function (copyContact) {
        return $http.delete(endpoint + '/contacts/' + copyContact.id);
      }

    };

  });

