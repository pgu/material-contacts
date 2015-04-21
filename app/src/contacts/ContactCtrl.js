'use strict';

angular.module('starterApp')
  .controller('ContactCtrl', function (ContactService, $mdSidenav, //
                                       $mdBottomSheet, $log, //
                                       $q) {

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
            ctrl.selectedContact = _.first(contacts);
          }

        });
    }

    self.toggleListPanel = function () {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function () {
        $mdSidenav('left').toggle();
      });
    }

    self.selectContact = function (contact, ctrl) {

      ctrl.selectedContact = contact;
      self.toggleListPanel();
    }

    self.addContact = function (ctrl) {

      ctrl.selectedContact = {
        firstName: '',
        lastName: '',
        avatar: _.first(self.avatars).value
      };

      self.toggleListPanel();

    };

    self.saveContact = function (contact) {

    };

    initView(self);
  });

