'use strict';

(function (angular, window) {
  angular.module('googleAppsSheetsPluginContent', ['ui.bootstrap'])
    .controller('ContentHomeCtrl', ['DataStore', 'TAG_NAMES', 'STATUS_CODE', '$timeout','$scope', function (DataStore, TAG_NAMES, STATUS_CODE, $timeout, $scope) {
      var ContentHome = this;
      ContentHome.data = {
        content: {
          url: null
        }
      };
        ContentHome.modeType={
          PREVIEW:"PREVIEW",
          EDITABLE : "EDITABLE"
        }
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
            if(!ContentHome.data.content.mode) {
              ContentHome.mode = ContentHome.modeType.PREVIEW;
            }else{
              ContentHome.mode = ContentHome.data.content.mode;
            }
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

        ContentHome.changeMode =  function(){
         ContentHome.data.content.mode =  ContentHome.mode;
          ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_APPS_SHEETS_DATA);
        }
        ContentHome.valiadte= function (url) {
          var regExp = /^https?:\/\/.+\/spreadsheets\/.+/;
          return regExp.test(url);
        }

      ContentHome.validateUrl = function () {
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
        ContentHome.gotToSupport = function(){
           window.open('https://support.google.com/drive/answer/2494822?hl=en', '_blank');
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
