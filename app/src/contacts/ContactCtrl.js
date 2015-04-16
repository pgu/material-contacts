'use strict';

angular.module('starterApp')
  .controller('ContactCtrl', function (ContactService, $mdSidenav, //
                                       $mdBottomSheet, $log, //
                                       $q) {

    var self = this;

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

    initView();
  });

