'use strict';

angular.module('starterApp')
  .factory('NotificationsService', function () {

    var notifications = {
      info: '',
      error: ''
    };

    return {

      notifications: notifications,

      addError: function (message) {
        notifications.error = message;
      },

      addInfo: function (message) {
        notifications.info = message;
      },

      clear: function () {
        notifications.info = '';
        notifications.error = '';
      }
    };

  });

