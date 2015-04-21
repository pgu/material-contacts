'use strict';

angular.module('starterApp', [ 'ngMaterial', 'ngMessages' ])
  .config(function ($mdThemingProvider, $mdIconProvider) {

    var contactIcons = [
      'add-contact', 'contact-man', 'contact-woman', 'contacts',
      'easter-6', 'easter-8', 'easter-10', 'easter-12', 'easter-13',
      'manager', 'operator', 'owner', 'delete-contact'
    ];

    _.each(contactIcons, function (ic) {
      $mdIconProvider.icon(ic, './assets/svg/contact/' + ic + '.svg', 128);
    });

    $mdIconProvider
      .icon('menu', './assets/svg/menu.svg', 24)
      .icon('save', './bower_components/material-design-icons/content/svg/production/ic_save_24px.svg', 24)
      .icon('undo', './bower_components/material-design-icons/content/svg/production/ic_undo_24px.svg', 24)
    ;

    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey');

  });
