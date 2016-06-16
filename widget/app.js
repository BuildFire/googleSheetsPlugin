'use strict';

(function (angular,buildfire) {
  angular.module('googleAppsSheetsPluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {
        var WidgetHome = this;
        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            if (result.data && result.id) {
              WidgetHome.data = result.data;
              if (WidgetHome.data && WidgetHome.data.content && WidgetHome.data.content.url) {
                if (WidgetHome.data.content.mode == 'EDITABLE')
                  WidgetHome.data.content.url = WidgetHome.data.content.url.replace("/htmlview", "/edit");
                else
                  WidgetHome.data.content.url = WidgetHome.data.content.url.replace("/edit", "/htmlview");
              }
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
              console.log(">>>>>", WidgetHome.data);
            }

          else
          {
            WidgetHome.data = {
              content: {}
            };
            var dummyData = {url: "https://docs.google.com/spreadsheets/d/1DRVGSGJh5s1w2giLbizZW6t6OT1Ea-YIewzX9D4meJ4/pubhtml#gid=0"};
            WidgetHome.data.content.url = dummyData.url;
          }
        };
          WidgetHome.error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
              }
            };
          DataStore.get(TAG_NAMES.GOOGLE_APPS_SHEETS_DATA).then(WidgetHome.success, WidgetHome.error);
        };

        WidgetHome.onUpdateCallback = function (event) {

          if (event && event.tag === TAG_NAMES.GOOGLE_APPS_SHEETS_DATA) {
            WidgetHome.data = event.data;
            console.log("+++", WidgetHome.data)

            if(WidgetHome.data && WidgetHome.data.content && WidgetHome.data.content.url) {
              if (WidgetHome.data.content.mode == 'EDITABLE')
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace("/htmlview", "/edit");
              else
                WidgetHome.data.content.url = WidgetHome.data.content.url.replace("/edit", "/htmlview");
            }
            if (WidgetHome.data&&!WidgetHome.data.design)
              WidgetHome.data.design = {};
            if (WidgetHome.data&&!WidgetHome.data.content)
              WidgetHome.data.content = {};
          }
        };
        
        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);

        //Refresh web page on pulling the tile bar

        buildfire.datastore.onRefresh(function () {
          var iFrame = document.getElementById("sheetFrame"),
            url = iFrame.src,
            hashIndex = url.indexOf("#");

          if(hashIndex !== -1) {
            url = url.substr(0, hashIndex) + "?v=test" + url.substr(hashIndex);
          }
          iFrame.src = url + "";
        });


        WidgetHome.init();

      }])
    .filter('returnUrl', ['$sce', function ($sce) {
      return function (url) {

        return $sce.trustAsResourceUrl(url);
      }
    }]);
})(window.angular, window.buildfire);
