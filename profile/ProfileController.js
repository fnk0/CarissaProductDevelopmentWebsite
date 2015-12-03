/**
 * Created by marcus on 12/3/15.
 */

/* global app: true */
'use strict';

(function () {

    var app = angular.module('WebApp');

    app.controller('ProfileController', ['$http', '$scope', '$rootScope', '$sce',
        function ($http, $scope, $rootScope, $sce) {

            $rootScope.user = {};
            $http.get('user.json')
                .success(function (data) {
                    $rootScope.user = data;
                })
                .error(function (data) {
                    console.log(data);
                });
        }]);
})();