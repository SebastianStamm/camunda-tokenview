AFRAME.registerGeometry('task', {
  schema: {
    position: {
      default: '0 0'
    },
    width: {
      default: '10'
    },
    height: {
      default: '10'
    }
  },

  init: function (data) {
    var geometry = new THREE.Geometry();

    const pos = new THREE.Vector2(parseFloat(data.position.split(' ')[0]), parseFloat(data.position.split(' ')[1]));
    const width = parseFloat(data.width);
    const height = parseFloat(data.height);

    geometry.vertices = [
      new THREE.Vector3(pos.y, 0, -pos.x),
      new THREE.Vector3(pos.y + height, 0, -pos.x),
      new THREE.Vector3(pos.y + height, 0, -pos.x - width),
      new THREE.Vector3(pos.y, 0, -pos.x - width),

      // northern wall
      new THREE.Vector3(pos.y, roomHeight, -pos.x),
      new THREE.Vector3(pos.y, roomHeight, -pos.x - width),
      new THREE.Vector3(pos.y, 0, -pos.x - width / 2 + sequenceFlowWidth),
      new THREE.Vector3(pos.y, sequenceFlowHeight, -pos.x - width / 2 + sequenceFlowWidth),
      new THREE.Vector3(pos.y, sequenceFlowHeight, -pos.x - width / 2 - sequenceFlowWidth),
      new THREE.Vector3(pos.y, 0, -pos.x - width / 2 - sequenceFlowWidth),

      // southern wall
      new THREE.Vector3(pos.y + height, roomHeight, -pos.x),
      new THREE.Vector3(pos.y + height, roomHeight, -pos.x - width),
      new THREE.Vector3(pos.y + height, 0, -pos.x - width / 2 + sequenceFlowWidth),
      new THREE.Vector3(pos.y + height, sequenceFlowHeight, -pos.x - width / 2 + sequenceFlowWidth),
      new THREE.Vector3(pos.y + height, sequenceFlowHeight, -pos.x - width / 2 - sequenceFlowWidth),
      new THREE.Vector3(pos.y + height, 0, -pos.x - width / 2 - sequenceFlowWidth),

      // western wall
      new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth, 0, -pos.x),
      new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth, sequenceFlowHeight, -pos.x),
      new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth, sequenceFlowHeight, -pos.x),
      new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth, 0, -pos.x),

      // eastern wall
      new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth, 0, -pos.x - width),
      new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth, sequenceFlowHeight, -pos.x - width),
      new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth, sequenceFlowHeight, -pos.x - width),
      new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth, 0, -pos.x - width)

    ];

    geometry.faces = [
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(2, 3, 0),

      // norhtern wall
      new THREE.Face3(0, 6, 7),
      new THREE.Face3(0, 7, 4),
      new THREE.Face3(4, 7, 5),
      new THREE.Face3(7, 8, 5),
      new THREE.Face3(8, 3, 5),
      new THREE.Face3(9, 3, 8),

      // southern wall
      new THREE.Face3(1, 13, 12),
      new THREE.Face3(1, 10, 13),
      new THREE.Face3(10, 11, 13),
      new THREE.Face3(13, 11, 14),
      new THREE.Face3(14, 11, 2),
      new THREE.Face3(15, 14, 2),

      // western wall
      new THREE.Face3(0, 17, 16),
      new THREE.Face3(4, 17, 0),
      new THREE.Face3(10, 17, 4),
      new THREE.Face3(10, 18, 17),
      new THREE.Face3(10, 1, 18),
      new THREE.Face3(1, 19, 18),

      // eastern wall
      new THREE.Face3(3, 20, 21),
      new THREE.Face3(3, 21, 5),
      new THREE.Face3(5, 21, 11),
      new THREE.Face3(21, 22, 11),
      new THREE.Face3(22, 2, 11),
      new THREE.Face3(23, 2, 22),

      // roof
      // new THREE.Face3(11, 10, 4),
      // new THREE.Face3(11, 4, 5),
    ];

    addSpace(geometry.vertices[0], geometry.vertices[1], geometry.vertices[2]);
    addSpace(geometry.vertices[2], geometry.vertices[3], geometry.vertices[0]);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    this.geometry = geometry;
  }
});

AFRAME.registerGeometry('taskLine', {
  schema: {
    position: {
      default: '0 0'
    },
    width: {
      default: '10'
    },
    height: {
      default: '10'
    }
  },

  init: function (data) {
    var geometry = new THREE.Geometry();

    const pos = new THREE.Vector2(parseFloat(data.position.split(' ')[0]), parseFloat(data.position.split(' ')[1]));
    const width = parseFloat(data.width);
    const height = parseFloat(data.height);

    geometry.vertices = [
        new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth * flowOutlineWidthFactor, layer1, -pos.x),
        new THREE.Vector3(pos.y, layer1, -pos.x),
        new THREE.Vector3(pos.y, layer1, -pos.x - width / 2 + sequenceFlowWidth * flowOutlineWidthFactor),
        new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth * flowOutlineWidthFactor - taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
        new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
        new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - width / 2 + sequenceFlowWidth * flowOutlineWidthFactor + taskOutlineWidth),

        new THREE.Vector3(pos.y, layer1, -pos.x - width / 2 - sequenceFlowWidth * flowOutlineWidthFactor),
        new THREE.Vector3(pos.y, layer1, -pos.x - width),
        new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth * flowOutlineWidthFactor, layer1, -pos.x - width),
        new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - width / 2 - sequenceFlowWidth * flowOutlineWidthFactor - taskOutlineWidth),
        new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth),
        new THREE.Vector3(pos.y + height / 2 - sequenceFlowWidth * flowOutlineWidthFactor - taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth),

        new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth * flowOutlineWidthFactor, layer1, -pos.x),
        new THREE.Vector3(pos.y + height, layer1, -pos.x),
        new THREE.Vector3(pos.y + height, layer1, -pos.x - width / 2 + sequenceFlowWidth * flowOutlineWidthFactor),
        new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth * flowOutlineWidthFactor + taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
        new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
        new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - width / 2 + sequenceFlowWidth * flowOutlineWidthFactor + taskOutlineWidth),

        new THREE.Vector3(pos.y + height, layer1, -pos.x - width / 2 - sequenceFlowWidth * flowOutlineWidthFactor),
        new THREE.Vector3(pos.y + height, layer1, -pos.x - width),
        new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth * flowOutlineWidthFactor, layer1, -pos.x - width),
        new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - width / 2 - sequenceFlowWidth * flowOutlineWidthFactor - taskOutlineWidth),
        new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth),
        new THREE.Vector3(pos.y + height / 2 + sequenceFlowWidth * flowOutlineWidthFactor + taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth)
    ];

    geometry.faces = [
      new THREE.Face3(0, 4, 1),
      new THREE.Face3(0, 3, 4),
      new THREE.Face3(1, 4, 2),
      new THREE.Face3(4, 5, 2),

      new THREE.Face3(6,10, 7),
      new THREE.Face3(6, 9, 10),
      new THREE.Face3(7,10, 8),
      new THREE.Face3(10,11, 8),

      new THREE.Face3(12, 13, 16),
      new THREE.Face3(12, 16, 15),
      new THREE.Face3(13, 14, 16),
      new THREE.Face3(16, 14, 17),

      new THREE.Face3(18, 19,22),
      new THREE.Face3(18, 22, 21),
      new THREE.Face3(19, 20,22),
      new THREE.Face3(22, 20,23)


    ];

    // geometry.vertices = [
    //   new THREE.Vector3(pos.y, layer1, -pos.x),
    //   new THREE.Vector3(pos.y + height, layer1, -pos.x),
    //   new THREE.Vector3(pos.y + height, layer1, -pos.x - width),
    //   new THREE.Vector3(pos.y, layer1, -pos.x - width),
    //   new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
    //   new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - taskOutlineWidth),
    //   new THREE.Vector3(pos.y + height - taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth),
    //   new THREE.Vector3(pos.y + taskOutlineWidth, layer1, -pos.x - width + taskOutlineWidth)
    // ];
    //
    // geometry.faces = [
    //   new THREE.Face3(0, 1, 5),
    //   new THREE.Face3(0, 5, 4),
    //   new THREE.Face3(1, 2, 5),
    //   new THREE.Face3(5, 2, 6),
    //   new THREE.Face3(6, 2, 3),
    //   new THREE.Face3(7, 6, 3),
    //   new THREE.Face3(4, 7, 3),
    //   new THREE.Face3(0, 4, 3)
    // ];

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    this.geometry = geometry;
  }
});

function handleTask(scene, element) {
  /* <a-entity geometry="primitive: task; position: 10 15; width: 10; height: 10;" material="color: #FFFFFF"></a-entity>
     <a-entity geometry="primitive: taskLine; position: 10 15; width: 10; height: 10;" material="color: #333333"></a-entity>
  */

  const task = document.createElement('a-entity');
  task.setAttribute('geometry', 'primitive: task; position: ' + (element.x * globalScaleFactor) + ' ' + (element.y * globalScaleFactor)+'; width: '+element.width * globalScaleFactor+'; height: '+element.height * globalScaleFactor+';');
  task.setAttribute('material', 'color: #FFFFFF');

  const line = document.createElement('a-entity');
  line.setAttribute('geometry', 'primitive: taskLine; position: ' + (element.x * globalScaleFactor) + ' ' + (element.y * globalScaleFactor)+'; width: '+element.width * globalScaleFactor+'; height: '+element.height * globalScaleFactor+';');
  line.setAttribute('material', 'color: #333333');

  // text label look-controls
  const name = element.businessObject.name;
  const label = document.createElement('a-entity');
  label.setAttribute('rotation', '-90 90 0');
  label.setAttribute('text', 'value: '+name+'; color: black; width: ' + element.width * globalScaleFactor + '; align: center;');
  label.setAttribute('position', (element.y * globalScaleFactor + element.height / 2 * globalScaleFactor) + ' '+(layer1)+' ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor / 2));
  // <a-entity text="value: Hello world; color: black; width: 10;" rotation="-90 0 0"></a-entity>

  // human for usertasks
  if(element.businessObject.$instanceOf('bpmn:UserTask')) {
    //<a-entity obj-model="obj: #human-obj;" scale="0.1 0.1 0.1" rotation="0 90 0"></a-entity>
    const model = document.createElement('a-entity');
    model.setAttribute('obj-model', 'obj: #human-obj;');
    model.setAttribute('scale', '0.2 0.2 0.2');
    model.setAttribute('rotation', '0 90 0');
    model.setAttribute('position', (element.y * globalScaleFactor + element.height / 10 * globalScaleFactor) + ' '+(layer1)+' ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor / 10));

    scene.appendChild(model);
  }

  // computer for serviceTasks
  if(element.businessObject.$instanceOf('bpmn:ServiceTask')) {
    //<a-entity obj-model="obj: #human-obj;" scale="0.1 0.1 0.1" rotation="0 90 0"></a-entity>
    const model = document.createElement('a-entity');
    model.setAttribute('obj-model', 'obj: #computer-obj;');
    model.setAttribute('scale', '0.01 0.01 0.01');
    model.setAttribute('rotation', '0 90 0');
    model.setAttribute('position', (element.y * globalScaleFactor + element.height / 10 * globalScaleFactor) + ' '+(layer1)+' ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor / 10))

    scene.appendChild(model);
  }

  scene.appendChild(task);
  scene.appendChild(line);
  scene.appendChild(label);

  // close exits
  const openExits = findOpenExits(element);

  {
    const label = document.createElement('a-image');
    label.setAttribute('src', 'img/door.png');
    label.setAttribute('position', (element.y * globalScaleFactor - layer1) + ' ' + (sequenceFlowHeight / 2) + ' ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor / 2));
    label.setAttribute('rotation', '0 90 0');
    label.setAttribute('scale', (sequenceFlowWidth * 2) + ' ' + (roomHeight / 2));
    scene.appendChild(label);
    if(openExits.n !== false) {
      label.setAttribute('opacity', doorOpacity);
      label.setAttribute('transparent', 'true');
      availableDoors.push(label);
    }
  }
  {
    const label = document.createElement('a-image');
    label.setAttribute('src', 'img/door.png');
    label.setAttribute('position', ((element.y + element.height) * globalScaleFactor + layer1) + ' ' + (sequenceFlowHeight / 2) + ' ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor / 2));
    label.setAttribute('rotation', '0 90 0');
    label.setAttribute('scale', (sequenceFlowWidth * 2) + ' ' + (roomHeight / 2));
    scene.appendChild(label);
    if(openExits.s !== false) {
      label.setAttribute('opacity', doorOpacity);
      label.setAttribute('transparent', 'true');
      availableDoors.push(label);
    }
  }
  {
    const label = document.createElement('a-image');
    label.setAttribute('src', 'img/door.png');
    label.setAttribute('position', ((element.y + element.height / 2) * globalScaleFactor) + ' ' + (sequenceFlowHeight / 2) + ' ' + -(element.x * globalScaleFactor - layer1));
    label.setAttribute('rotation', '0 0 0');
    label.setAttribute('scale', (sequenceFlowWidth * 2) + ' ' + (roomHeight / 2));
    scene.appendChild(label);
    if(openExits.w !== false) {
      label.setAttribute('opacity', doorOpacity);
      label.setAttribute('transparent', 'true');
      availableDoors.push(label);
    }
  }
  {
    const label = document.createElement('a-image');
    label.setAttribute('src', 'img/door.png');
    label.setAttribute('position', ((element.y + element.height / 2) * globalScaleFactor) + ' ' + (sequenceFlowHeight / 2) + ' ' + -((element.x + element.width) * globalScaleFactor + layer1));
    label.setAttribute('rotation', '0 0 0');
    label.setAttribute('scale', (sequenceFlowWidth * 2) + ' ' + (roomHeight / 2));
    scene.appendChild(label);
    if(openExits.e !== false) {
      label.setAttribute('opacity', doorOpacity);
      label.setAttribute('transparent', 'true');
      availableDoors.push(label);
    }
  }

  // add labels to next stuff
  if(openExits.e) {
    const toLabel = document.createElement('a-entity');
    toLabel.setAttribute('rotation', '0 0 0');
    toLabel.setAttribute('text', 'value: To; color: black; width: 10; align: center;');
    toLabel.setAttribute('position', (element.y * globalScaleFactor + element.height / 2 * globalScaleFactor) + ' 5 ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor - layer1));
    scene.appendChild(toLabel);
    const nameLabel = document.createElement('a-entity');
    nameLabel.setAttribute('rotation', '0 0 0');
    nameLabel.setAttribute('text', 'value: '+openExits.e+'; color: black; width: 20; align: center;');
    nameLabel.setAttribute('position', (element.y * globalScaleFactor + element.height / 2 * globalScaleFactor) + ' 4 ' + -(element.x * globalScaleFactor + element.width * globalScaleFactor - layer1));
    scene.appendChild(nameLabel);
  }
  if(openExits.w) {
    const toLabel = document.createElement('a-entity');
    toLabel.setAttribute('rotation', '0 180 0');
    toLabel.setAttribute('text', 'value: To; color: black; width: 10; align: center;');
    toLabel.setAttribute('position', (element.y * globalScaleFactor + element.height / 2 * globalScaleFactor) + ' 5 ' + -(element.x * globalScaleFactor + layer1));
    scene.appendChild(toLabel);
    const nameLabel = document.createElement('a-entity');
    nameLabel.setAttribute('rotation', '0 180 0');
    nameLabel.setAttribute('text', 'value: '+openExits.w+'; color: black; width: 20; align: center;');
    nameLabel.setAttribute('position', (element.y * globalScaleFactor + element.height / 2 * globalScaleFactor) + ' 4 ' + -(element.x * globalScaleFactor + layer1));
    scene.appendChild(nameLabel);
  }
  if(openExits.n) {
    const toLabel = document.createElement('a-entity');
    toLabel.setAttribute('rotation', '0 90 0');
    toLabel.setAttribute('text', 'value: To; color: black; width: 10; align: center;');
    toLabel.setAttribute('position', (element.y * globalScaleFactor + layer1) + ' 5 ' + -((element.x + element.width / 2) * globalScaleFactor));
    scene.appendChild(toLabel);
    const nameLabel = document.createElement('a-entity');
    nameLabel.setAttribute('rotation', '0 90 0');
    nameLabel.setAttribute('text', 'value: '+openExits.n+'; color: black; width: 20; align: center;');
    nameLabel.setAttribute('position', (element.y * globalScaleFactor + layer1) + ' 4 ' + -((element.x + element.width / 2) * globalScaleFactor));
    scene.appendChild(nameLabel);
  }
  if(openExits.s) {
    const toLabel = document.createElement('a-entity');
    toLabel.setAttribute('rotation', '0 -90 0');
    toLabel.setAttribute('text', 'value: To; color: black; width: 10; align: center;');
    toLabel.setAttribute('position', ((element.y + element.height) * globalScaleFactor - layer1) + ' 5 ' + -((element.x + element.width / 2) * globalScaleFactor));
    scene.appendChild(toLabel);
    const nameLabel = document.createElement('a-entity');
    nameLabel.setAttribute('rotation', '0 -90 0');
    nameLabel.setAttribute('text', 'value: '+openExits.s+'; color: black; width: 20; align: center;');
    nameLabel.setAttribute('position', ((element.y + element.height) * globalScaleFactor - layer1) + ' 4 ' + -((element.x + element.width / 2) * globalScaleFactor));
    scene.appendChild(nameLabel);
  }

}
