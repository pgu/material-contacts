'use strict';

angular.module('starterApp')
  .factory('ContactService', function ($q) {

    var contacts = [
      { id: '1', firstName: 'John', lastName: 'Doe', avatar: 'contact-man' },
      { id: '2', firstName: 'Lara', lastName: 'Croft', avatar: 'contact-woman' }
    ];

    return {

      loadAllContacts: function () {
        var data = _.cloneDeep(contacts);
        return $q.when({ data: data });
      },

      saveContact: function (copyContact) {

        var isCreation = !_.has(copyContact, 'id');
        if (isCreation) {

          var newContact = _.cloneDeep(copyContact);
          newContact.id = Date.now();

          contacts.push(newContact);

          return $q.when({ data: newContact });

        } else {

          var originalContact = _.find(contacts, { id: copyContact.id });
          angular.copy(copyContact, originalContact);

          return $q.when({ data: originalContact });
        }
      },

      deleteContact: function (copyContact) {

        var idxToRemove = _.findIndex(contacts, { id: copyContact.id });
        contacts.splice(idxToRemove, 1);

        return $q.when({});
      }

    };

  });

