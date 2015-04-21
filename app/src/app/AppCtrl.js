'use strict';

angular.module('starterApp')
  .controller('AppCtrl', function ($scope, $mdToast, //
                                   $q, NotificationsService) {

    function showMessage (type, toastPosition) {
      return function (message) {

        if (_.isEmpty(message)) {
          return $q.when();

        } else {

          return $mdToast.show(
            $mdToast.simple()
              .content(message)
              .position(toastPosition)
          );

        }
      };
    }

    var showError = showMessage('error', 'top left');
    var showInfo = showMessage('info', 'bottom right');

    $scope.$watch(function () {
      return NotificationsService.notifications;
    }, function (notifications) {

      showError(notifications.error)
        .finally(function () {
          return showInfo(notifications.info);
        })
        .finally(function () {
          NotificationsService.clear();
        })
      ;

    }, true);

  });

