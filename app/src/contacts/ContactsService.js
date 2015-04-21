'use strict';

angular.module('starterApp')
  .factory('ContactsService', function ($q, $timeout) {

    var contacts = [
      { id: '1', firstName: 'John', lastName: 'Doe', avatar: 'contact-man' },
      { id: '2', firstName: 'Lara', lastName: 'Croft', avatar: 'contact-woman' }
    ];

    var ms = 2000;

    return {

      loadAllContacts: function () {
        var data = _.cloneDeep(contacts);
        return $timeout(function () {
          return $q.when({ data: data });
        }, 500);
      },

      saveContact: function (copyContact) {

        var isCreation = !_.has(copyContact, 'id');
        if (isCreation) {

          var newContact = _.cloneDeep(copyContact);
          newContact.id = Date.now();

          contacts.push(newContact);

          return $timeout(function () {
            return $q.when({ data: newContact });
          }, ms);

        } else {

          var originalContact = _.find(contacts, { id: copyContact.id });
          angular.copy(copyContact, originalContact);

          return $timeout(function () {
            return $q.when({ data: originalContact });
          }, ms);
        }
      },

      deleteContact: function (copyContact) {

        var idxToRemove = _.findIndex(contacts, { id: copyContact.id });
        contacts.splice(idxToRemove, 1);

        return $timeout(function () {
          return $q.when({});
        }, ms);
      }

    };

  });

