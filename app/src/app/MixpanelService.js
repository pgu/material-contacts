'use strict';

angular.module('starterApp')
  .factory('MixpanelService', function ($window, $log) {

    var mixpanel = $window.mixpanel || { track: _.noop };

    return {
      track: function (key, data) {
        $log.log(mixpanel, key, data);
        mixpanel.track(key, data);
      }
    };

  });

