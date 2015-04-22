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
      { label: 'Woman (1)', value: 'svg-6' },
      { label: 'Woman (2)', value: 'svg-7' },
      { label: 'Woman (3)', value: 'svg-8' },
      { label: 'Woman (4)', value: 'svg-12' },
      { label: 'Woman (5)', value: 'svg-13' },
      { label: 'Woman (6)', value: 'svg-15' },
      { label: 'Man (1)', value: 'svg-1' },
      { label: 'Man (2)', value: 'svg-2' },
      { label: 'Man (3)', value: 'svg-3' },
      { label: 'Man (4)', value: 'svg-4' },
      { label: 'Man (5)', value: 'svg-14' },
      { label: 'Man (6)', value: 'svg-16' },
      { label: 'Abuelo', value: 'svg-5' },
      { label: 'Abuela', value: 'svg-9' },
      { label: 'Dog', value: 'svg-10' },
      { label: 'Cat', value: 'svg-11' }
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

    function CopyService () {
    }

    CopyService.prototype.from = function (source) {
      this.source = source;
      return this;
    }

    CopyService.prototype.to = function (dest) {
      this.dest = dest;
      return this;
    }

    CopyService.prototype.copy = function () {
      var self = this;

      _.each('firstName lastName avatar'.split(' '), function (key) {
        self.dest[ key ] = self.source[ key ];
      });
    }


    self.resetContact = function (copyContact, contacts) {

      var originalContact = _.find(contacts, { id: copyContact.id });

      new CopyService().from(originalContact).to(copyContact).copy();
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

          } else {
            var updatedContact = response.data;
            var originalContact = _.find(contacts, { id: copyContact.id });

            new CopyService().from(updatedContact).to(originalContact).copy();
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

