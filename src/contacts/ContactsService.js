'use strict';

angular.module('starterApp')
  .factory('ContactsService', function ($q, $timeout) {

    var contacts = [
      { id: '21', firstName: 'John', lastName: 'Doe', avatar: 'svg-14' },
      { id: '22', firstName: 'Lara', lastName: 'Croft', avatar: 'svg-13' },
      { id: '23', firstName: 'Stewie', lastName: 'Griffin', avatar: 'svg-1' },
      { id: '24', firstName: 'Brian', lastName: 'Griffin', avatar: 'svg-10' },
      { id: '25', firstName: 'Lois', lastName: 'Griffin', avatar: 'svg-6' },
      { id: '26', firstName: 'Meg', lastName: 'Griffin', avatar: 'svg-15' },
      { id: '27', firstName: 'El', lastName: 'Abuelo', avatar: 'svg-5' },
      { id: '28', firstName: 'La', lastName: 'Abuela', avatar: 'svg-9' },
      { id: '29', firstName: 'Gato', lastName: 'Abuela', avatar: 'svg-11' }
    ];

    //_.times(16, function (j) {
    //  var i = j + 1;
    //  contacts.push({ id: '' + i, firstName: 'F' + i, lastName: 'L' + i, avatar: 'svg-' + i });
    //});

    var ms = 500;

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

