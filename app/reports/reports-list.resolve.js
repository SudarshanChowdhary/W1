getReportsList.$inject = ['reportservice', '$q', '$http', '$stateParams', 'spinnerService'];

function getReportsList(reportservice, $q, $http, $stateParams, spinnerService) {
    // return reportservice.getReportsList();
    var def = $q.defer();
    spinnerService.show();
    $http.get("https://rtdashboardd.rno.apple.com:9012/RTDashboard/reports/list")
  // $http.get("reports/list")
        .success(function (data) {
            if (data.errorCode) {
                def.resolve([]);
            } else {
                def.resolve(data);
            }
            spinnerService.hide();
        })
        .error(function () {
            def.reject("Failed to get data");
        });
    return def.promise;
}

module.exports = getReportsList;