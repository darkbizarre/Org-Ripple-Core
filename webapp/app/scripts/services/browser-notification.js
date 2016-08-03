'use strict';

angular.module('rippleDemonstrator')
  .factory('browserNotification', function () {
    var notifications = [];

    var notificationServiceWorker = null;

    function createNotification(data) {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        _createNotification(data);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          if (permission === 'granted') {
            _createNotification(data);
          }
        });
      }
    }

    function getNotificationPermission(cb) {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'denied' || Notification.permission !== 'granted') {
        Notification.requestPermission(cb);
      }
    }

    function playSound(filename) {
      $('#notificationSound').empty().html('<audio autoplay="autoplay">' +
        '<source src="sounds/' + filename + '.mp3" type="audio/mpeg" />' +
        '<source src="sounds/' + filename + '.ogg" type="audio/ogg" />' +
        '<embed hidden="true" autostart="true" loop="false" src="sounds/' + filename + '.mp3" />' +
        '</audio>');
    }

    function closeNotifications() {
      while (notifications.length) {
        var notification = notifications.pop();
        // notification.close();
        setTimeout(notification.close.bind(notification), 1500);
      }
    }

    function _createNotification(data) {
      try {
        notifications.push(new Notification(data.title, {
          body: data.body,
          icon: '../images/ripple-icon.png'
        }));
        playSound('alert');
      } catch (err) {
        if (err.name == 'TypeError') { // if browser doesn't support new Notification syntax (Chrome Android)
          if (!navigator.serviceWorker) return;
          if (notificationServiceWorker === null) {
            notificationServiceWorker = navigator.serviceWorker.register('../scripts/chat/sw.js');
          }
          notificationServiceWorker.then(function(registration) {
            registration.showNotification(data.title, {
              body: data.body,
              icon: '../images/ripple-icon.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
            });
            registration.getNotifications().then(function (data) {
              notifications = [].concat(data);
            });
          });
        }
      }
    }

    return {
      createNotification: createNotification,
      getNotificationPermission: getNotificationPermission,
      closeNotifications: closeNotifications
    };
  });
