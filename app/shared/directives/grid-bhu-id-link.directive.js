
function bhuIdLinkRenderer(){

    return {
            restrict: 'EA',
            template: ['<div ng-bind-html="displayItemName(item.bhuId)" bhu-link>',
                '</div>'
            ].join(''),
            link: function(scope, element, attr) {
               scope.displayItemName = function(bhuId) {
                  if(isNaN(bhuId) || bhuId==null || bhuId== ''){
                    return bhuId;
                  }else{
                    return "<a title='Get deatils' href='javascript:void(0)'><span class='glyphicon glyphicon-new-window blue'></span>&nbsp;&nbsp;"+bhuId+"</a>";
                  }
                }
            }
        };

}

module.exports = bhuIdLinkRenderer;