'use strict';

angular.module('starterApp')
  .controller('ContactCtrl', function (ContactService, $mdSidenav, //
                                       $mdBottomSheet, $log, //
                                       $q, $scope, //
                                       $timeout, $mdDialog, //
                                       $window) {

    var self = this;

    self.avatars = [
      { label: 'User (Man)', value: 'contact-man' },
      { label: 'User (Woman)', value: 'contact-woman' },
      { label: 'Owner', value: 'owner' },
      { label: 'Manager', value: 'manager' },
      { label: 'Operator', value: 'operator' },
      { label: 'Egg 1', value: 'easter-6' },
      { label: 'Egg 2', value: 'easter-8' },
      { label: 'Egg 3', value: 'easter-10' },
      { label: 'Egg 4', value: 'easter-12' },
      { label: 'Egg 5', value: 'easter-13' }
    ];


    function fetchContacts (ctrl) {

      return ContactService.loadAllContacts()
        .then(function (response) {

          var contacts = response.data;

          ctrl.contacts = contacts;

          return contacts;
        });

    }

    function initView (ctrl) {

      return fetchContacts(ctrl)
        .then(function (contacts) {

          if (!_.isEmpty(contacts)) {
            return self.selectContact(_.first(contacts), ctrl);
          }

        });
    }

    self.toggleListPanel = function () {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      return pending.then(function () {
        $mdSidenav('left').toggle();
      });
    };

    self.selectContact = function (contact, ctrl) {
      ctrl.copyContact = null;

      var timeoutMs = contact.id ? 0 : 300; // reset form state (dirty, ...)
      return $timeout(function () {

        ctrl.copyContact = _.cloneDeep(contact);
        return self.toggleListPanel();

      }, timeoutMs);

    };

    self.addContact = function (ctrl) {

      ctrl.copyContact = {
        firstName: '',
        lastName: '',
        avatar: _.first(self.avatars).value
      };

      return self.toggleListPanel();
    };

    self.resetContact = function (copyContact, contacts) {

      var originalContact = _.find(contacts, { id: copyContact.id });
      angular.copy(originalContact, copyContact);

    };

    self.saveContact = function (copyContact, contacts, ctrl) {

      var isCreation = !_.has(copyContact, 'id');

      return ContactService.saveContact(copyContact)
        .then(function (response) {

          if (isCreation) {
            var newContact = response.data;

            contacts.push(newContact);
            return self.selectContact(newContact, ctrl);
          }

        });
    };

    function deleteContact (copyContact, contacts, ctrl) {

      return ContactService.deleteContact(copyContact)
        .then(function () {

          var idxToRemove = _.findIndex(contacts, { id: copyContact.id });

          var contactToSelect;
          if (idxToRemove > 0) {
            contactToSelect = contacts[ idxToRemove - 1 ];

          } else if (idxToRemove === 0) {

            if (_.size(contacts) > 1) {
              contactToSelect = contacts[ 1 ];
            }

          }

          contacts.splice(idxToRemove, 1);

          if (contactToSelect) {
            return self.selectContact(contactToSelect, ctrl);

          } else {
            return self.addContact(ctrl);
          }

        });

    }

    self.deleteContact = function (copyContact, contacts, ctrl) {

      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + copyContact.firstName + '?')
        .ok('Yes')
        .cancel('Cancel');

      return $mdDialog.show(confirm)
        .then(function () {
          return deleteContact(copyContact, contacts, ctrl);
        });

    };

    initView(self);
  });

