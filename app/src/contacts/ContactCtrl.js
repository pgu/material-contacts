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


    function fetchContacts () {

      return ContactService.loadAllContacts()
        .then(function (response) {

          var contacts = response.data;
          self.contacts = contacts;

          return contacts;
        });

    }

    function initView () {

      fetchContacts()
        .then(function (contacts) {

          if (!_.isEmpty(contacts)) {
            self.selectedContact = _.first(contacts);
          }

        });
    }

    self.toggleListPanel = function () {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function () {
        $mdSidenav('left').toggle();
      });
    }

    self.selectContact = function (contact) {

      self.selectedContact = contact;
      self.toggleListPanel();
    }

    self.addContact = function () {

      self.selectedContact = {
        firstName: '',
        lastName: '',
        avatar: _.first(self.avatars)
      };

      self.toggleListPanel();

    };

    self.saveContact = function (contact) {

    };

    initView();
  });

