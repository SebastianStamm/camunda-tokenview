define(['angular'], function(angular) {

  var ngModule = angular.module('cockpit.tokenView', []);

  ngModule.config(['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
      id: 'cockpit.tokenView',
      overlay: ['$scope', 'control', 'processData', 'pageData', 'processDiagram', 'search', 'get', 'modification',
      function($scope, control, processData, pageData, processDiagram, search, get, modification) {

        // load aframe
        if(!window.Aframeloaded) {
          window.Aframeloaded = true;
          [
            'https://aframe.io/releases/0.5.0/aframe.min.js'
          ].forEach(src => {
            const scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', src);
            document.head.appendChild(scriptTag);
          });

          const interval = window.setInterval(() => {
            if(window.AFRAME) {
              window.clearInterval(interval);
              [
                '/camunda/app/cockpit/scripts/tokenView/globals.js',
                '/camunda/app/cockpit/scripts/tokenView/utils.js',
                '/camunda/app/cockpit/scripts/tokenView/collision.js',
                '/camunda/app/cockpit/scripts/tokenView/sequenceFlow.js',
                '/camunda/app/cockpit/scripts/tokenView/task.js',
                '/camunda/app/cockpit/scripts/tokenView/gateway.js',
                '/camunda/app/cockpit/scripts/tokenView/event.js',
              ].forEach(src => {
                const scriptTag = document.createElement('script');
                scriptTag.setAttribute('src', src);
                document.head.appendChild(scriptTag);
              });
            }
          }, 100);
        }

        const viewer = control.getViewer();
        let hoveredElement;
        viewer.on('element.hover', (evt) => {
          hoveredElement = evt.element.businessObject;
        });

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

            if(hoveredElement.$instanceOf('bpmn:FlowNode')) {
              console.log('should initialize view with', hoveredElement);

              document.querySelector('[process-diagram]').appendChild(handleModel(viewer));
              // handleModel(viewer);
            }
          }
        });

        document.querySelector('.bjs-container').appendChild(initButton);
      }]
    });
  }]);

  return ngModule;
});
