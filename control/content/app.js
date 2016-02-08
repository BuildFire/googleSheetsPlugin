'use strict';

(function (angular, window) {
  angular.module('googleAppsSheetsPluginContent', ['ui.bootstrap'])
    .controller('ContentHomeCtrl', ['DataStore', 'TAG_NAMES', 'STATUS_CODE', '$timeout', function (DataStore, TAG_NAMES, STATUS_CODE, $timeout) {
      var ContentHome = this;
      ContentHome.data = {
        content: {
          url: null
        }
      };
      ContentHome.isUrlValidated = null;
      ContentHome.googleSheetUrl = null;
      /*Init method call, it will bring all the pre saved data*/
      ContentHome.init = function () {
        ContentHome.success = function (result) {
          console.info('init success result:', result);
          if (result) {
            ContentHome.data = result.data;
            if (!ContentHome.data.content)
              ContentHome.data.content = {};
            ContentHome.googleSheetUrl = ContentHome.data.content.url;
          }
        };
        ContentHome.error = function (err) {
          if (err && err.code !== STATUS_CODE.NOT_FOUND) {
            console.error('Error while getting data', err);
          }
          else if (err && err.code === STATUS_CODE.NOT_FOUND) {
            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_APPS_SHEETS_DATA);
          }
        };
        DataStore.get(TAG_NAMES.GOOGLE_APPS_SHEETS_DATA).then(ContentHome.success, ContentHome.error);
      };
      ContentHome.init();


        ContentHome.valiadte= function (url) {
          var regExp = /^https?:\/\/.+\/spreadsheets\/.+/;
          return regExp.test(url);
        }

      ContentHome.validateUrl = function () {
        console.log("aaaaaaaaaaaaaaaa",ContentHome.valiadte(ContentHome.googleSheetUrl))
        //  var result =
     //    if (ContentHome.googleSheetUrl.match("https://docs.google.com/spreadsheets")) {
        if (ContentHome.valiadte(ContentHome.googleSheetUrl)) {
            ContentHome.isUrlValidated = true;
            ContentHome.data.content.url = ContentHome.googleSheetUrl;
            ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_APPS_SHEETS_DATA);
          }
        else {
          ContentHome.isUrlValidated = false;
        }
          console.log("?????????error")
        $timeout(function () {
          ContentHome.isUrlValidated = null;
        }, 3000);
       };

      ContentHome.saveData = function (newObj, tag) {
        if (typeof newObj === 'undefined') {
          return;
        }
        ContentHome.success = function (result) {
          console.info('Saved data result: ', result);
          // updateMasterItem(newObj);
        };
        ContentHome.error = function (err) {
          console.error('Error while saving data : ', err);
        };
        DataStore.save(newObj, tag).then(ContentHome.success, ContentHome.error);
      };

      /*
       * Method to clear GoogleSheet feed url
       * */
      ContentHome.clearData = function () {
        if (!ContentHome.googleSheetUrl) {
          ContentHome.data.content.url = null;
          ContentHome.saveData(ContentHome.data.content, TAG_NAMES.GOOGLE_APPS_SHEETS_DATA)
        }
      };

    }]);
})(window.angular, window);
