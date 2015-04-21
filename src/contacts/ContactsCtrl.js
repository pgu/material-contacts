'use strict';

angular.module('starterApp')
  .controller('ContactsCtrl', function (ContactsService, $mdSidenav, //
                                        $log, //
                                        $q, $scope, //
                                        $timeout, $mdDialog, //
                                        $window, $mdToast, //
                                        NotificationsService) {

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

      ctrl.isAsyncInProgress = true;

      return ContactsService.loadAllContacts()
        .then(function (response) {

          var contacts = response.data;

          ctrl.contacts = contacts;

          return contacts;
        })
        .finally(function () {
          ctrl.isAsyncInProgress = false;
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
      $mdSidenav('left').toggle();
    };

    self.selectContact = function (contact, ctrl) {
      ctrl.copyContact = null;

      var timeoutMs = contact.id ? 0 : 300; // reset form state (dirty, ...)
      return $timeout(function () {

        ctrl.copyContact = _.cloneDeep(contact);
        $mdSidenav('left').close();

      }, timeoutMs);

    };

    self.addContact = function (ctrl) {

      ctrl.copyContact = {
        firstName: '',
        lastName: '',
        avatar: _.first(self.avatars).value
      };

      $mdSidenav('left').close();
    };

    self.resetContact = function (copyContact, contacts) {

      var originalContact = _.find(contacts, { id: copyContact.id });
      angular.copy(originalContact, copyContact);

    };

    self.saveContact = function (copyContact, contacts, ctrl) {

      var isCreation = !_.has(copyContact, 'id');

      ctrl.isAsyncInProgress = true;

      return ContactsService.saveContact(copyContact)
        .then(function (response) {

          if (isCreation) {
            var newContact = response.data;

            contacts.push(newContact);
            return self.selectContact(newContact, ctrl);
          }

        })
        .then(function () {

          if (isCreation) {
            NotificationsService.addInfo(copyContact.firstName + ' successfully added!');
          } else {
            NotificationsService.addInfo(copyContact.firstName + ' successfully updated!');
          }

        })
        .finally(function () {
          ctrl.isAsyncInProgress = false;
        });
    };

    function deleteContact (copyContact, contacts, ctrl) {

      ctrl.isAsyncInProgress = true;

      return ContactsService.deleteContact(copyContact)
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

        })
        .then(function () {
          NotificationsService.addInfo(copyContact.firstName + ' successfully deleted!');
        })
        .finally(function () {
          ctrl.isAsyncInProgress = false;
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

