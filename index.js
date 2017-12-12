define(['angular'], function(angular) {

  var ngModule = angular.module('cockpit.tokenView', []);

  ngModule.config(['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
      id: 'cockpit.tokenView',
      overlay: ['$scope', 'control', 'processData', 'pageData', 'processDiagram', 'search', 'get', 'modification',
      function($scope, control, processData, pageData, processDiagram, search, get, modification) {
        console.log('in diagram overlay thing', $scope);

        const initButton = document.createElement('button');
        initButton.textContent = '🚶';
        initButton.style.position = 'absolute';
        initButton.style.bottom = '15px';
        initButton.style.right = '50px';
        initButton.style.border = '1px solid lightgray';
        initButton.style.backgroundColor = 'white';
        initButton.style.fontSize = '1.3em';

        let grabbed = false;
        let startPos = {x: 0, y: 0};

        initButton.addEventListener('mousedown', evt => {
          evt.preventDefault();

          initButton.style.backgroundColor = 'transparent';
          initButton.style.border = '0';
          initButton.style.pointerEvents = 'none';

          startPos.x = evt.screenX;
          startPos.y = evt.screenY;

          grabbed = true;
        });

        document.addEventListener('mousemove', evt => {
          if(grabbed) {
            initButton.style.bottom = (15 - (evt.screenY - startPos.y)) + 'px';
            initButton.style.right = (50 - (evt.screenX - startPos.x)) + 'px';
          }
        });

        document.addEventListener('mouseup', evt => {
          if(grabbed) {
            grabbed = false;
            initButton.style.bottom = '15px';
            initButton.style.right = '50px';
            initButton.style.border = '1px solid lightgray';
            initButton.style.backgroundColor = 'white';
            initButton.style.pointerEvents = 'initial';
          }
        });

        document.querySelector('.bjs-container').appendChild(initButton);

        console.log('diagram container', document.querySelector('.diagram-holder'));
      }]
    });
  }]);

  return ngModule;
});
