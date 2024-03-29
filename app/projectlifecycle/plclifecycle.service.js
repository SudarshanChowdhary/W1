ProjectLifeCycleService.$inject = ['$http', '$q', 'spinnerService','Upload','$rootScope','toaster', '$log'];

function ProjectLifeCycleService($http, $q, spinnerService, Upload, $rootScope, toaster, $log){
    var rtplcmilestoneservice = {
        rtPlcMilestoneAdd : rtPlcMilestoneAdd,
        sendNotification : sendNotification,
        getPhases : getPhases,
        getPLCPhases: getPLCPhases,
        getBhuSpocDetails : getBhuSpocDetails
    };
    return rtplcmilestoneservice;

    function rtPlcMilestoneAdd(reqData){
        var def = $q.defer();
       if(!$(".loading-backdrop").hasClass('loading')){                    $(".loading-backdrop").addClass('loading');                 }
		$http({
            url:"https://rtdashboardd.rno.apple.com:9012/RTDashboard/milestone/add",
         //  url: "milestone/add",
            data: reqData,
            method:"POST"
        }).success(function(data) {
            def.resolve(data);
            $(".loading-backdrop").removeClass('loading');
        })
        .error(function() {
            def.reject("Failed to get data");
            $(".loading-backdrop").removeClass('loading');
        });
        return def.promise;
    }

    function sendNotification(scope, file){
        var def = $q.defer();
       if(!$(".loading-backdrop").hasClass('loading')){                    $(".loading-backdrop").addClass('loading');                 }
        
        var reqUrl = "https://rtdashboardd.rno.apple.com:9012/RTDashboard/milestone/doEmail";
     //       var reqUrl = "milestone/doEmail";
       console.log($("#summernote").summernote('code'))
            if(file){
            file.upload = Upload.upload({
                url: reqUrl,
                file: file,
                fields: {
                    bhuId: scope.bhuId,
                    rtSpoc: scope.selected,
                    sentTo: scope.rt_recipients,
                    status: scope.plc_phase.value,
                    content: $("#summernote").summernote('code'),
                    from: $rootScope.user
                },
              });
              file.upload.then(function (response) {
                response.isError = false;
                $log.warn(JSON.stringify(response.config.transformRequest));
                file.result = response.data;
                def.resolve(response.data);
              }, function (response) {
                if (response.status > 0){
                    response.isError = true;
                    def.resolve(response);
                    $log.log( response.status + ': ' + response.data);
                   $(".loading-backdrop").removeClass('loading');
                }
              }, function (evt) {
                $log.warn(evt.type);
                  if(evt.type=='load'){
                    $log.warn(JSON.stringify( evt.config));
                    $log.warn(JSON.stringify( evt.currentTarget));
                  }
                // Math.min is to fix IE which reports 200% sometimes
                //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
              });
            }else{
                reqUrl = "https://rtdashboardd.rno.apple.com:9012/RTDashboard/milestone/doHTMLEmail"
             //    reqUrl = "milestone/doHTMLEmail"
                $http({
                     url: reqUrl,
                     params: {
                        bhuId: scope.bhuId,
                        rtSpoc: scope.selected,
                        sentTo: scope.rt_recipients,
                        status: scope.plc_phase.value,
                        content: $("#summernote").summernote('code'),
                        from: $rootScope.user
                    },
                     method:"POST"
                 }).success(function(data) {
                     def.resolve(data);
                     $(".loading-backdrop").removeClass('loading');
                 })
                 .error(function() {
                     def.reject("Failed to get data");
                     $(".loading-backdrop").removeClass('loading');
                 });
            }
              return def.promise;
    }

    function getBhuSpocDetails(bhuId){
        var def = $q.defer();
       // if(!$(".loading-backdrop").hasClass('loading')){                    $(".loading-backdrop").addClass('loading');                 }
         $http.get("https://rtdashboardd.rno.apple.com:9012/RTDashboard/tickets/bhudetails/"+bhuId)
       // $http.get("tickets/bhudetails/"+bhuId)
                .success(function(data) {
                    def.resolve(data);
                  // $(".loading-backdrop").removeClass('loading');
                })
                .error(function() {
                    def.reject("Failed to get data");
                });
            return def.promise;
    }
   
    function getPhases(phase){
        
                 var data = {
                     "RT":"images/rt-phase.png",
                     "UAT":"images/uat-phase.png",
                     "Design And Development":"images/design-phase.png",
                     "Integration Testing":"images/it-phase.png",
                     "Warranty Phase": "images/warranty-phase.png",
                     "P2S":"images/p2s-phase.png"
                 }
                 return data[phase];
    }


function getPLCPhases(phase){
    
            var plcphase = {
                "Design":"<p>Hi Team,<br/><span>As part of RT PLC, we will be performing the following activities at different phases for all the Projects.</span><br/><span> As a 1st step, we would be sharing the relevant RT test scripts from repository to the project team <br/>which can be utilised during the IT phase. This will reduce the effort of writing new scripts for the projects team.</span><br/><br/><span>Please find the attached test scripts that are relevant to this Project<br/><br/> We will be scheduling a call to explain the RT PLC and RT test script walkthrough.</span><br/><br/></p>",
    
                "IT":"<p>Hi Team,<br/><span>As per RT PLC, We will be scheduling a meeting to get System demo of the project changes and walkthrough of the test scripts that was used for Project IT.</span> <br/><span>Also highlight the changes that were made to the existing test script shared from RT repository during the Design phase.</span><br/><br/><span>Please share the IT Test Scripts, Test Results, Defects identified during IT.</span><br/><br/></p>",
    
                "RT":"<p>Hi Team,<br/><span>RT is completed and signed off for the project changes, sign off comments are updated in the RT ticket</span> <br/><span>Thanks for all your support.</span><br/><span>Happy Go-Live!</span><br/><span>Please keep us posted on all the warranty issues to plan RT for analysing and delivering the ticket on time.</span><br/><span>Kindly provide your feedback on RT after Go-Live</span><br/><br/></p>",
    
                "UAT": "<p>Hi Team,<br/><span>As per RT PLC, during the last week of UAT we will be starting with the RT readiness activities to start Testing on the Day 1 of RT timelines.</span><br/><br/><span>Please share the below details for our understanding purpose:</span><br/><span>UAT Test Results, UAT Defects, Any changes after the system demo</span><br/><br/><span>Please fill the below attached sample scoping document with the object details for the project and create a CS-SR ticket to have a final discussion on the Project changes and RT scope finalising.</span><br/><br/></p>",
    
                "Warranty": "<p>Hi Team,<br/><span>In Warranty Phase, RT team does RCA on all warranty issues to check for possible RT miss</span><br/><span>Please pass feedback to project team to include the validation points/scenarios reported on to failed scripts</span><br/><span>Project team append new functionalities /validation checks to  scripts shared by RT team</span><br/><span>Validate scoping template , MetaData part of CS incidents.Mutually agree on CR analysis fields</span><br><br/></p>",
    
                "P2S":"<p>Hi Team,<br/> <span>In P2S Handover, RT Team receives IT scripts from Project Team in prescribed format</span><br/><span>Changes are incorporated in automation script</span><br/><span>PD like cutover complete in QA#. This will help all systems to be in sync</span><br/><br/></p>"
            }
             return plcphase[phase];
        }
    }

module.exports = ProjectLifeCycleService;