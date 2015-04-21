'use strict';

angular.module('starterApp')
  .controller('AppCtrl', function ($scope, $mdToast, //
                                   NotificationsService) {

    $scope.$watch(function () {
      return NotificationsService.messages;
    }, function (notifications) {

      _.each(notifications, function (notification) {

        $mdToast.show(
          $mdToast.simple()
            .content(notification)
            .position('top left')
        );

      });

      NotificationsService.messages = [];
    }, true);

  });

