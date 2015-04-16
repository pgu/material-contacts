'use strict';

angular.module('starterApp')
    .factory('ContactService', function ($q) {

        var contacts = [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' }
        ];

        return {
            loadAllContacts: function () {
                return $q.when(contacts);
            }
        };

    });

