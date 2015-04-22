'use strict';

angular.module('starterApp', [ 'ngMaterial', 'ngMessages' ])
  .config(function ($mdThemingProvider, $mdIconProvider) {

    $mdIconProvider
      .defaultIconSet('./assets/svg/contact/avatars.svg', 128)
      .icon('add-contact', './assets/svg/contact/add-contact.svg', 128)
      .icon('delete-contact', './assets/svg/contact/delete-contact.svg', 128)
      .icon('menu', './assets/svg/menu.svg', 24)
      .icon('save', './bower_components/material-design-icons/content/svg/production/ic_save_24px.svg', 24)
      .icon('undo', './bower_components/material-design-icons/content/svg/production/ic_undo_24px.svg', 24)
    ;

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('pink');

  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $location, NotificationsService) {
      return {
        'responseError': function (rejection) {

          var payload = rejection.data;
          var message;

          if (_.has(payload, 'message')) {
            message = payload.message;

          } else if (_.has(payload, 'description')) {
            message = payload.description;

          } else {
            message = '<strong>Oh snap!</strong> Something wrong happened';
          }

          NotificationsService.addError(message);

          return $q.reject(rejection);
        }
      };
    });
  })

;
