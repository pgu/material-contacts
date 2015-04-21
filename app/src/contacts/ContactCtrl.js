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

      fetchContacts(ctrl)
        .then(function (contacts) {

          if (!_.isEmpty(contacts)) {
            self.selectContact(_.first(contacts), ctrl);
          }

        });
    }

    self.toggleListPanel = function () {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function () {
        $mdSidenav('left').toggle();
      });
    };

    self.selectContact = function (contact, ctrl) {
      ctrl.copyContact = null;

      var timeoutMs = contact.id ? 0 : 300; // reset form state (dirty, ...)
      $timeout(function () {

        ctrl.copyContact = _.cloneDeep(contact);
        self.toggleListPanel();

      }, timeoutMs);

    };

    self.addContact = function (ctrl) {

      ctrl.copyContact = {
        firstName: '',
        lastName: '',
        avatar: _.first(self.avatars).value
      };

      self.toggleListPanel();

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
            self.selectContact(newContact, ctrl);
          }

        });
    };

    function deleteContact (copyContact, contacts, ctrl) {

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
        self.selectContact(contactToSelect, ctrl);

      } else {
        self.addContact(ctrl);
      }

    }

    self.deleteContact = function (copyContact, contacts, ctrl) {

      var confirm = $mdDialog.confirm()
        .title('Would you like to delete ' + copyContact.firstName + '?')
        .ok('Yes')
        .cancel('Cancel');

      $mdDialog.show(confirm)
        .then(function () {
          deleteContact(copyContact, contacts, ctrl);
        });

    };

    initView(self);
  });

