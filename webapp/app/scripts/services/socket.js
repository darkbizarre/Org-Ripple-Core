'use strict';

angular.module('rippleDemonstrator')
  .factory('socket', function ($rootScope) {
    $rootScope.socketData = $rootScope.socketData || {};
    var socket = io.connect('', {port: 8070});

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      once: function (eventName, callback) {
        socket.once(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      off: function (eventName, fn) {
        socket.off(eventName, fn);
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      data: function (key, value) {
        if (value !== undefined) {
          $rootScope.socketData[key] = value;
        }
        return $rootScope.socketData[key];
      }
    };
  });
