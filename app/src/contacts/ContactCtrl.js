'use strict';

angular.module('starterApp')
    .controller('ContactCtrl', function (ContactService, $mdSidenav, //
                                         $mdBottomSheet, $log, //
                                         $q) {

        var self = this;

        self.selected = null;
        self.users = [];
        self.selectUser = selectUser;
        self.toggleList = toggleUsersList;
        self.share = share;

        ContactService
            .loadAllContacts()
            .then(function (users) {
                self.users = [].concat(users);
                self.selected = users[ 0 ];
            });

        function toggleUsersList () {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function () {
                $mdSidenav('left').toggle();
            });
        }

        function selectUser (user) {
            self.selected = angular.isNumber(user) ? $scope.users[ user ] : user;
            self.toggleList();
        }

    });

