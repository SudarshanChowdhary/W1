
function effortsUtilizedLinkRenderer(){

    return {
        restrict: 'EA',
        template: ['<div ng-bind-html="displayUtilizedEfforts(item.efortsutilized)" effortsutilized-link>',
            '</div>'
        ].join(''),
        link: function(scope, element, attr) {
           scope.displayUtilizedEfforts = function(efortsutilized) {
              if(isNaN(efortsutilized) || efortsutilized==null){
                return efortsutilized;
              }else{
                return "<a title='Get deatils' href='javascript:void(0)'><span class='glyphicon glyphicon-new-window blue'></span>&nbsp;&nbsp;"+efortsutilized+"</a>";
              }
            }
        }
    };
    }
    
    module.exports = effortsUtilizedLinkRenderer;