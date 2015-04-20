'use strict';

angular.module('starterApp')
  .controller('ContactCtrl', function (ContactService, $mdSidenav, //
                                       $mdBottomSheet, $log, //
                                       $q) {

    var self = this;

    self.avatars = [
      'contact-man', 'contact-woman',
      'owner', 'manager', 'operator',
      'easter-6', 'easter-8', 'easter-10', 'easter-12', 'easter-13'
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

    initView();
  });

