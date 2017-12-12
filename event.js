function handleEvent(scene, element) {
  /*  <a-entity geometry="primitive: circle; radius: 2;" rotation="-90 0 0" material="color: #FFFFFF" position="5 0 -5"></a-entity>
      <a-entity geometry="primitive: circle; radius: 2.3;" rotation="-90 0 0" material="color: #333333;" position="5 -0.005 -5"></a-entity>
  */

  const posOffset = element.width / 2 * globalScaleFactor;

  const event = document.createElement('a-entity');
  event.setAttribute('geometry', 'primitive: circle; radius:' + (posOffset - eventOulineWidth) + ';');
  event.setAttribute('rotation', '-90 0 0');
  event.setAttribute('position', (element.y * globalScaleFactor + posOffset) + ' 0 ' + -(element.x * globalScaleFactor + posOffset));
  event.setAttribute('material', 'color: #FFFFFF');

  const line = document.createElement('a-entity');
  line.setAttribute('geometry', 'primitive: circle; radius:' + posOffset + ';');
  line.setAttribute('rotation', '-90 0 0');
  line.setAttribute('position', (element.y * globalScaleFactor + posOffset) + ' '+(-layer1)+' ' + -(element.x * globalScaleFactor + posOffset));
  line.setAttribute('material', 'color: #333333');

  scene.appendChild(event);
  scene.appendChild(line);
}
