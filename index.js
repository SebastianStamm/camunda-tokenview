define(['angular'], function(angular) {

  var ngModule = angular.module('cockpit.tokenView', []);

  ngModule.config(['ViewsProvider', function(ViewsProvider) {
    ViewsProvider.registerDefaultView('cockpit.processInstance.diagram.plugin', {
      id: 'cockpit.tokenView',
      overlay: ['$scope', 'control', 'processData', 'pageData', 'processDiagram', 'search', 'get', 'modification',
      function($scope, control, processData, pageData, processDiagram, search, get, modification) {

        // make flownodes selectable
        Object
        .keys(processDiagram.bpmnElements)
        .forEach(function(key) {
          var bpmnElement = processDiagram.bpmnElements[key];
          if(bpmnElement.$instanceOf('bpmn:FlowNode')) {
            bpmnElement.isSelectable = true;
          }
        });

        // load aframe
        if(!window.Aframeloaded) {
          window.Aframeloaded = true;
          [
            'https://aframe.io/releases/0.5.0/aframe.min.js',
            '/camunda/app/cockpit/scripts/tokenView/tokenManager.js',
            '/camunda/app/cockpit/scripts/tokenView/taskCompleter.js',
          ].forEach(src => {
            const scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', src);
            document.head.appendChild(scriptTag);
          });

          const interval = window.setInterval(() => {
            if(window.AFRAME && window.tokenManager) {
              window.clearInterval(interval);
              [
                '/camunda/app/cockpit/scripts/tokenView/globals.js',
                '/camunda/app/cockpit/scripts/tokenView/utils.js',
                '/camunda/app/cockpit/scripts/tokenView/collision.js',
                '/camunda/app/cockpit/scripts/tokenView/tokens.js',
                '/camunda/app/cockpit/scripts/tokenView/sequenceFlow.js',
                '/camunda/app/cockpit/scripts/tokenView/task.js',
                '/camunda/app/cockpit/scripts/tokenView/gateway.js',
                '/camunda/app/cockpit/scripts/tokenView/event.js',
              ].forEach(src => {
                const scriptTag = document.createElement('script');
                scriptTag.setAttribute('src', src);
                document.head.appendChild(scriptTag);
              });

              tokenManager(processData.$providers.local.processInstance.data.value.id, control.getViewer());
            }
          }, 100);
        }

        // remove all bpmn io logos
        const customStyles = document.createElement('style');
        customStyles.innerHTML = '.bjs-powered-by{display: none !important;}';
        document.head.appendChild(customStyles);

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

              const vrView = handleModel(viewer, hoveredElement);

              document.querySelector('[process-diagram]').appendChild(vrView);

              // add a preview diagram
              const preview = document.createElement('div');
              preview.style.position = 'absolute';
              preview.style.bottom = '20px';
              preview.style.left = '10px';
              preview.style.height = '100px';
              preview.style.width = '200px';
              preview.style.border = '1px solid lightgray';
              preview.style.backgroundColor = 'white';
              preview.style.cursor = 'pointer';

              preview.addEventListener('click', () => {
                document.querySelector('[process-diagram]').removeChild(preview);
                document.querySelector('[process-diagram]').removeChild(vrView);
              });

              const previewViewer = new viewer.constructor({ container: preview });

              document.querySelector('[process-diagram]').appendChild(preview);

              viewer.saveXML({},function(err, xml){
                previewViewer.importXML(xml, function(err) {
                });
              });

              window.updatePreviewPosition = function(x,y,rotation) {
                previewViewer.get('canvas').viewbox({
                  x: x - 100,
                  y: y - 50,
                  width: 200,
                  height: 100
                });
              }
            }
          }
        });

        document.querySelector('.bjs-container').appendChild(initButton);

        // react to resizing of bottom and left panel
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(){
          if(window.BATscene) {
            const interval = window.setInterval(() => {BATscene.resize();}, 10);
            window.setTimeout(() => window.clearInterval(interval), 500);
          }
          originalSetItem.apply(this, arguments);
        }
      }]
    });
  }]);

  return ngModule;
});
