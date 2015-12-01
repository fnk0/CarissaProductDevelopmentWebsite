/**
 * Created by marcus on 9/30/15.
 */
'use strict';
/* global app: true */

(function () {

    var app = angular.module('WebApp', []);

    app.controller('AppController', ['$http', '$scope', '$rootScope',
        function ($http, $scope, $rootScope) {
            $rootScope.items = [];
            $rootScope.tags = [];
            $http.get('items/items.json')
                .success(function (data) {
                    $rootScope.tags = data.tags;
                    $rootScope.items = data.items;
                    console.log(data);
                })
                .error(function (data) {
                    console.log(data);
                });
        }]);

    app.filter("sanitize", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]);

    app.factory('authInterceptor', function ($rootScope, $q, $window, $location) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Token ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                    $window.sessionStorage.removeItem('token');
                    $location.path('/');
                }
                return response || $q.when(response);
            }
        };
    });

    app.directive('openDialog', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                var dialogId = '#' + attr.openDialog;
                elem.bind('click', function (e) {
                    e.preventDefault();
                    var title = elem.find('.project-title').text(),
                        link = elem.attr('href'),
                        descr = elem.find('.project-description').html(),
                        slidesHtml = '<ul class="slides">',
                        slides = elem.data('images').split(',');

                    for (var i = 0; i < slides.length; ++i) {
                        slidesHtml = slidesHtml + '<li><img src=' + slides[i] + ' alt=""></li>';
                    }

                    slidesHtml = slidesHtml + '</ul>';

                    $(dialogId).on('show.bs.modal', function () {
                        $(this).find('h1').text(title);
                        $(this).find('.btn').attr('href', link);
                        $(this).find('.project-descr').html(descr);
                        $(this).find('.image-wrapper').addClass('flexslider').html(slidesHtml);

                        setTimeout(function () {
                            $('.image-wrapper.flexslider').flexslider({
                                slideshowSpeed: 3000,
                                animation: 'slide',
                                controlNav: false,
                                start: function () {
                                    $('#project-modal .image-wrapper')
                                        .addClass('done')
                                        .prev('.loader').fadeOut();
                                }
                            });
                        }, 1000);
                    }).modal();
                });
            }
        };
    });

    app.directive('filterItem', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                var category = attr.filterItem;
                elem.bind('click', function (e) {
                    e.preventDefault();

                    $('#filter-works li').removeClass('active');
                    elem.parent('li').addClass('active');

                    $('.project-item').each(function () {
                        if ($(this).is(category)) {
                            $(this).removeClass('filtered');
                        }
                        else {
                            $(this).addClass('filtered');
                        }

                        $('#projects-container').masonry('reload');
                    });

                    scrollSpyRefresh();
                    waypointsRefresh();

                });
            }
        };
    });
})();