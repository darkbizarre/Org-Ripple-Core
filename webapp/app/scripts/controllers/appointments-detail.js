'use strict';

angular.module('rippleDemonstrator')
  .controller('AppointmentsDetailCtrl', function ($scope, $stateParams, SearchInput, $modal, Helper, $state, $location, usSpinnerService, PatientService, Appointment, socket, UserService) {
    SearchInput.update();

    $scope.isClosed = false;

    UserService.findCurrentUser().then(function (result) {
      $scope.currentUser = result.data;
    });

    PatientService.get($stateParams.patientId).then(function (patient) {
      $scope.patient = patient;
    });

    Appointment.get($stateParams.patientId, $stateParams.appointmentIndex).then(function (result) {
      $scope.appointment = result.data;
      $scope.timeOfAppointment = moment($scope.appointment.timeOfAppointment).format('h:mma') + '-' + moment($scope.appointment.timeOfAppointment).add(59, 'm').format('h:mma');
      socket.emit('appointment:messages', {appointmentId: $stateParams.appointmentIndex});
    });

    $scope.edit = function () {
      var modalInstance = $modal.open({
        templateUrl: 'views/appointments/appointments-modal.html',
        size: 'lg',
        controller: 'AppointmentsModalCtrl',
        resolve: {
          modal: function () {
            return {
              title: 'Edit Appointment'
            };
          },
          appointment: function () {
            return angular.copy($scope.appointment);
          },
          patient: function () {
            return $scope.patient;
          }
        }
      });

      modalInstance.result.then(function (appointment) {
        appointment.dateOfAppointment = new Date(appointment.dateOfAppointment);
        appointment.dateCreated = new Date(appointment.dateCreated);

        var toUpdate = {
          sourceId: appointment.sourceId,
          serviceTeam: appointment.serviceTeam,
          dateOfAppointment: appointment.dateOfAppointment,
          location: appointment.location,
          status: appointment.status,
          author: 'example@email.com',
          dateCreated: appointment.dateCreated,
          source: 'openehr',
          timeOfAppointment: appointment.timeOfAppointment
        };

        Appointment.update($scope.patient.id, toUpdate).then(function () {
          setTimeout(function () {
            $state.go('appointments-detail', {
              patientId: $scope.patient.id,
              appointmentIndex: Helper.updateId(appointment.sourceId)
            });
          }, 2000);
        });
      });
    };

    $scope.startAppointment = function () {
      socket.emit('appointment:init', {
        patientId: $scope.patient.id,
        appointmentId: $scope.appointment.sourceId
      });

      openPopup($scope.appointment.sourceId);
    };

    $scope.joinAppointment = function () {
      // socket.emit('appointment:start', $scope.patient.id);
      openPopup($scope.appointment.sourceId);
    };

    socket.emit('appointment:status', {appointmentId: $stateParams.appointmentIndex});
    socket.off('appointment:messages'); // remove dublicate socket listeners
    socket.off('appointment:close');
    socket.off('appointment:status');
    socket.on('appointment:messages', onMessages);
    socket.on('appointment:close', onClose);
    socket.on('appointment:status', onStatus);

    function popupCenter(w, h) {
      var dualScreenLeft = (window.screenLeft != undefined) ? window.screenLeft : screen.left;
      var dualScreenTop = (window.screenTop != undefined) ? window.screenTop : screen.top;

      var width = (window.innerWidth ? window.innerWidth : document.documentElement.clientWidth) ? document.documentElement.clientWidth : screen.width;
      var height = (window.innerHeight ? window.innerHeight : document.documentElement.clientHeight) ? document.documentElement.clientHeight : screen.height;

      var left = ((width / 2) - (w / 2)) + dualScreenLeft;
      var top = ((height / 2) - (h / 2)) + dualScreenTop;
      return 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
    }

    function openPopup(id) {
      window.windowObjectReference = window.windowObjectReference || null;
      var center = popupCenter(972, 734);
      var options = center + ',resizable=yes,scrollbars=yes,status=yes,minimizable=yes,location=no';
      if (window.windowObjectReference == null || window.windowObjectReference.closed) {
        window.windowObjectReference = window.open(window.location.origin + '/socket.io?appointmentId=' + id,
          'Video Chat', options);
        window.windowObjectReference.focus();
      } else {
        window.windowObjectReference.focus();
      }
    }

    function onMessages(dt) {
      var data = JSON.parse(JSON.stringify(dt));
      if (!data.appointment) {
        usSpinnerService.stop('appointmentsDetail-spinner');
        return;
      }
      if ($state.current.name != 'appointments-detail' || $stateParams.appointmentIndex != data.appointmentId) return;
      usSpinnerService.stop('appointmentsDetail-spinner');

      $scope.messages = data.messages.map(function (message) {
        message.timestamp = moment(+message.timestamp).format('HH:mm');
        if (!message.author) {
          message.author = '';
        } else {
          var role = ($scope.currentUser.permissions.indexOf('WRITE') == -1) ? 'patient' : 'doctor';
          var opponent = ($scope.currentUser.permissions.indexOf('WRITE') == -1) ? 'doctor' : 'patient';
          if (message.author == role) {
            message.author = 'You: ';
          } else {
            message.author = data.appointment[opponent] + ': ';
          }
        }
        return message;
      });
    }

    function onClose(data) {
      socket.data('showJoinAppointment', null);
      if (data.appointmentId == $stateParams.appointmentIndex) {
        socket.emit('appointment:status', {appointmentId: $stateParams.appointmentIndex});
        socket.emit('appointment:messages', {appointmentId: $stateParams.appointmentIndex});
      }
    }

    function onStatus(data) {
      if (data.appointmentId == $stateParams.appointmentIndex) {
        $scope.isClosed = data.isClosed;
      }
    }
  });
