let gunPointedAt = null;

AFRAME.registerComponent('gun-pointer', {
  dependencies: ['raycaster'],

  init: function () {
    this.el.addEventListener('raycaster-intersection', function (evt) {
      gunPointedAt = evt.detail.intersections[0];
    });
  }
});

function getVectorNormal(vec) {
  const normal = new THREE.Vector2(vec.x, vec.y);

  normal.rotateAround(new THREE.Vector2(0, 0), Math.PI / 2);
  normal.normalize();

  normal.multiplyScalar(sequenceFlowWidth);

  return normal;
}

function getAngleBetweenVectors(vec1, vec2) {
  const a = new THREE.Vector2(vec1.x, vec1.y);
  a.normalize();

  const b = new THREE.Vector2(vec2.x, vec2.y);
  b.normalize();
  b.negate();

  const angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);

  return angle;
}

function calculateWaypoints(waypoints) {
  return waypoints.map((waypoint, idx) => {
    const previousWaypoint = waypoints[idx - 1];
    const nextWaypoint = waypoints[idx + 1];

    if(!previousWaypoint) {
      // first waypoint, take the normal
      const movingVector = nextWaypoint.clone().sub(waypoint);
      const normal = getVectorNormal(movingVector);
      const shortNormal = normal.clone().multiplyScalar(flowOutlineWidthFactor);
      return [
        waypoint.clone().add(normal),
        waypoint.clone().sub(normal),
        waypoint.clone().add(shortNormal),
        waypoint.clone().sub(shortNormal)
      ];
    } else {
      if(nextWaypoint) {
        // middle point, take the half angle
        const vec1 = waypoint.clone().sub(previousWaypoint);
        const vec2 = nextWaypoint.clone().sub(waypoint);

        const angle = getAngleBetweenVectors(vec1, vec2);
        const halfAngle = angle / 2;

        const normal = vec2.clone().rotateAround(new THREE.Vector2(0, 0), -halfAngle);
        normal.normalize();
        normal.multiplyScalar(sequenceFlowWidth * 1.5);

        const shortNormal = normal.clone().multiplyScalar(flowOutlineWidthFactor);

        if(halfAngle < 0) {
          return [
            waypoint.clone().add(normal),
            waypoint.clone().sub(normal),
            waypoint.clone().add(shortNormal),
            waypoint.clone().sub(shortNormal)
          ];
        } else {
          return [
            waypoint.clone().sub(normal),
            waypoint.clone().add(normal),
            waypoint.clone().sub(shortNormal),
            waypoint.clone().add(shortNormal)
          ];
        }
      } else {
        // last waypoint, take the normal
        const movingVector = waypoint.clone().sub(previousWaypoint);
        const normal = getVectorNormal(movingVector);
        const shortNormal = normal.clone().multiplyScalar(flowOutlineWidthFactor);

        return [
          waypoint.clone().add(normal),
          waypoint.clone().sub(normal),
          waypoint.clone().add(shortNormal),
          waypoint.clone().sub(shortNormal)
        ];
      }
    }
  });
}

openSpaces = [];
function addSpace(p1,p2,p3) {
  openSpaces.push({p1,p2,p3});
}

function handleModel(viewer, startNode, processInstanceId) {
  const scene = document.createElement('a-scene');
  scene.setAttribute('embedded', 'true');
  scene.style.position = 'absolute';
  scene.style.top = '0';


  // <a-sky color="#ECECEC"></a-sky>
  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#ECECEC');
  scene.appendChild(sky);

  let startPosition;

  const data = [];
  const elementRegistry = viewer.get('elementRegistry');

  let min = [Infinity, Infinity];
  let max = [-Infinity, -Infinity];

  elementRegistry.forEach(element => {
    const bo = element.businessObject;

    if(typeof element.x === 'number') {
      min[0] = Math.min(min[0], element.x);
      min[1] = Math.min(min[1], element.y);
      max[0] = Math.max(max[0], element.x + element.width);
      max[1] = Math.max(max[1], element.y + element.height);
    }


    if(element.type === 'label') {
      return;
    }

    if(bo.$instanceOf('bpmn:SequenceFlow')) {
      handleSequenceFlow(scene, element);
    }

    if(bo.$instanceOf('bpmn:Task') || bo.$instanceOf('bpmn:CallActivity')) {
      handleTask(scene, element);
      if(bo === startNode) {
        startPosition = element;
      }
    }

    if(bo.$instanceOf('bpmn:Event')) {
      handleGateway(scene, element);
      if(bo === startNode) {
        startPosition = element;
      }
    }

    if(bo.$instanceOf('bpmn:Gateway')) {
      handleGateway(scene, element);
      if(bo === startNode) {
        startPosition = element;
      }
    }
  });

  // <a-entity camera="userHeight: 1.6" look-controls></a-entity>
  const posOffset = startPosition.width / 2 * globalScaleFactor;
  const camera = document.createElement('a-entity');
  camera.setAttribute('camera', true);
  camera.setAttribute('look-controls', 'pointerLockEnabled: true');
  camera.setAttribute('wasd-controls', 'acceleration: 250');
  camera.setAttribute('position', (startPosition.y * globalScaleFactor + posOffset) + ' 1.6 ' + (-startPosition.x * globalScaleFactor - posOffset));
  camera.setAttribute('rotation', '-45 90 0');
  camera.setAttribute('collision', true);
  camera.setAttribute('tokens', true);
  scene.appendChild(camera);

  // setup lights
  const ambientLight = document.createElement('a-entity');
  ambientLight.setAttribute('light', 'type: ambient; color: #BBB;');
  scene.appendChild(ambientLight);

  const movingLight = document.createElement('a-entity');
  movingLight.setAttribute('light', 'type: point; color: #FFF; intensity: 0.2;');
  camera.appendChild(movingLight);

  const directionalLight = document.createElement('a-entity');
  directionalLight.setAttribute('light', 'type: directional; color: #FFF; intensity: 0.6');
  directionalLight.setAttribute('position', '0 1 0');
  scene.appendChild(directionalLight);

  // add gun
  const gun = document.createElement('a-entity');
  gun.setAttribute('obj-model', 'obj: url(/camunda/app/cockpit/scripts/tokenView/models/gun.obj); mtl: url(/camunda/app/cockpit/scripts/tokenView/models/gun.mtl)');
  gun.setAttribute('position', {x: 0.5, y: -0.65, z: -0.5});
  gun.setAttribute('rotation', {x: -10, y: 100, z: 10});
  gun.setAttribute('scale', {x: .003, y: .003, z: .003});
  gun.setAttribute('visible', false);

  document.addEventListener('mousedown', () => {
    if(gun.getAttribute('visible')) {
      const tokenHit = tokens.find(token => token.obj && token.obj.object3D === gunPointedAt.object.parent);
      if(tokenHit) {
        const activityInstanceId = tokenHit.life[tokenHit.life.length -1].id;

        const particles = document.createElement('a-entity');
        particles.setAttribute('particle-system', 'color: #5555FF,#FF5555; blending: 1; accelerationValue: 0 -2 0; accelerationSpread: 0 0.001 0; velocityValue: 0 0.001 0; velocitySpread: 25 25 25; particleCount: 1000; maxAge: 6; size: 0.5; duration: 0.1;');
        particles.setAttribute('position', tokenHit.obj.getAttribute('position'));
        scene.appendChild(particles);

        tokenHit.obj.setAttribute('visible', false);

        fetch('/camunda/api/engine/engine/default/process-instance/'+processInstanceId+'/modification', {
          credentials: 'include',
          method: 'POST',
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-XSRF-TOKEN": document.cookie.split("=")[1]
          },
          body: JSON.stringify({
            skipCustomListeners: true,
            skipIoMappings: true,
            instructions: [{
              type: 'cancel',
              activityInstanceId
            }]
          })
        });
      }
    }
  });

  document.body.addEventListener('keydown', ({key}) => {
    if(key === 'g') {
      const display = !gun.getAttribute('visible');
      gun.setAttribute('visible', display);
      window.crossHair.style.display = display ? 'inline' : 'none';
    }
  });
  camera.appendChild(gun);
  camera.setAttribute('gun-pointer', true);
  camera.setAttribute('raycaster', 'objects: a-sphere');

  window.BATscene = scene;
  window.BATcamera = camera;
  window.BATViewer = viewer;

  window.gun = gun;

  return scene;
}


function findOpenExits(element) {
  let n=s=w=e = false;

  element.incoming.forEach(incoming => {
    const lastWp = incoming.waypoints[incoming.waypoints.length -1];
    if(lastWp.x === element.x && incoming.source.businessObject) {
      w = {
        name: incoming.source.businessObject.name,
        incoming: true
      };
    }
    if(lastWp.x === element.x + element.width && incoming.source.businessObject) {
      e = {
        name: incoming.source.businessObject.name,
        incoming: true
      };
    }
    if(lastWp.y === element.y && incoming.source.businessObject) {
      n = {
        name: incoming.source.businessObject.name,
        incoming: true
      };
    }
    if(lastWp.y === element.y + element.height && incoming.source.businessObject) {
      s = {
        name: incoming.source.businessObject.name,
        incoming: true
      };
    }
  });

  element.outgoing.forEach(outgoing => {
    const lastWp = outgoing.waypoints[0];
    if(lastWp.x === element.x && outgoing.target.businessObject) {
      w = {
        name: outgoing.target.businessObject.name,
        incoming: false
      };
    }
    if(lastWp.x === element.x + element.width && outgoing.target.businessObject) {
      e = {
        name: outgoing.target.businessObject.name,
        incoming: false
      };
    }
    if(lastWp.y === element.y && outgoing.target.businessObject) {
      n = {
        name: outgoing.target.businessObject.name,
        incoming: false
      };
    }
    if(lastWp.y === element.y + element.height && outgoing.target.businessObject) {
      s = {
        name: outgoing.target.businessObject.name,
        incoming: false
      };
    }
  });

  return {n,s,w,e};
}
