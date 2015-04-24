'use strict';

angular.module('starterApp')
  .factory('MixpanelService', function ($window) {

    return {
      track: function (key, data) {

        if (_.has($window, 'mixpanel')) {
          $window.mixpanel.track(key, data);
        }

      }
    };

  });

