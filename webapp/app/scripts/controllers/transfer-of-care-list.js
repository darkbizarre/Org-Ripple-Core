'use strict';

angular.module('rippleDemonstrator')
  .controller('TransferOfCareListCtrl', function ($scope, $location, $stateParams, $modal, $state, usSpinnerService, PatientService, TransferOfCare) {

    $scope.query = {};
    $scope.queryBy = '$';

    if ($stateParams.filter) {
      $scope.query.$ = $stateParams.filter;
    }

    PatientService.get($stateParams.patientId).then(function (patient) {
      $scope.patient = patient;
    });

    TransferOfCare.all($stateParams.patientId).then(function (result) {
      $scope.transferofCareComposition = result.data;

      for (var i = 0; i < $scope.transferofCareComposition.length; i++) {
        $scope.transferofCareComposition[i].dateOfTransfer = moment($scope.transferofCareComposition[i].dateOfTransfer).format('DD-MMM-YYYY');
      }
      usSpinnerService.stop('patientSummary-spinner');
    });

    $scope.go = function (id) {
        $state.go('transferOfCare-detail', {
        patientId: $scope.patient.id,
        transferOfCareIndex: id,
        filter: $scope.query.$
      });
    };

    $scope.selected = function (transferOfCareIndex) {
      console.log($stateParams);
      return transferOfCareIndex === $stateParams.transferOfCareIndex;
    };

    $scope.create = function () {
      $state.go('transferOfCare-create', {
        patientId: $scope.patient.id
      });
    };

  });
