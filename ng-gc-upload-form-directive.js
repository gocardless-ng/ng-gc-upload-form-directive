/**
 * @license ng-gc-upload-form-directive v0.1.0
 * (c) 2013-2013 GoCardless, Ltd.
 * https://github.com/gocardless-ng/ng-gc-upload-form-directive.git
 * License: MIT
 */angular.module('gc-upload-form-template.html', []).run(function($templateCache) {
  $templateCache.put('gc-upload-form-template.html',
    '<div><form action="{{formAction}}" name="uploadForm" novalidate="" stop-propagation="submit" gc-upload="{\n' +
    '      onUploadEnd: handleUploadEnd\n' +
    '    }"><div class="well u-margin-Txxs u-padding-Axs"><input type="file" name="file" ng-model="file" accept="{{ fileAccept }}" gc-file-value=""><div ng-transclude=""></div><div ng-show="uploadErrors"><p ng-repeat="fileError in uploadErrors" class="u-text-primary u-text-h6 u-margin-Txxs">{{ fileError }}</p></div></div><div class="u-margin-Ts"><button class="btn btn--info" ng-class="{\n' +
    '          \'btn--block\': !isInlineUpload,\n' +
    '          \'btn--small\': isInlineUpload\n' +
    '        }" id="fileUploadBtn" ng-disabled="uploadForm.$pristine || !uploadForm.file.$viewValue || $isUploading"><span>Upload<span ng-show="$isUploading">ing...</span></span></button></div></form></div>');
});

'use strict';

angular.module('gc.uploadFormController', [])
  .controller('GcUploadFormController', [
    '$scope',
    function GcUploadFormController($scope) {

      /**
       * @param  {Object|Null} response
       * @return {Array|Undefined}
       */
      function parseErrors(response) {
        if (!response) { return; }
        // rails is a dick
        var errors = response.error || response.errors;
        if (errors == null) { return; }
        return !_.isObject(errors) ? [errors] :
          _.uniq(_.flatten(_.values(errors)));
      }

      $scope.handleUploadEnd = function handleUpload(response) {
        $scope.uploadErrors = parseErrors(response);
        $scope.onUploadEnd({
          errors: $scope.uploadErrors,
          response: response
        });
      };

    }
  ]);

'use strict';

angular.module('gc.uploadForm', [
  'gcUpload',
  'gc.file',
  'gc.stopPropagation',
  'gc.uploadFormController',
  'gc-upload-form-template.html'
])
.directive('gcUploadForm', [
  function GcUploadFormDirective() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: 'GcUploadFormController',
      templateUrl: 'gc-upload-form-template.html',
      scope: {
        formAction: '@',
        fileAccept: '@',
        isInlineUpload: '@',
        onUploadEnd: '&'
      }
    };

  }
]);
