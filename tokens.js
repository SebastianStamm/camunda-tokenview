const bouncyness = 0.007;

(function() {
	AFRAME.registerComponent( 'tokens', {
		init: function() {
		},

		tick: function (time, delta) {
			var self = this;
			const tokens = window.tokens;

			const initialSetup = !tokens.find(token => token.obj && window.BATscene.contains(token.obj));

			for(let i = 0; i < tokens.length; i++) {
				const token = tokens[i];

				if(token.dead) {
					if(token.obj && token.obj.parentNode) {
						token.obj.parentNode.removeChild(token.obj);
					}
					continue;
				}

				if(!token.obj || !window.BATscene.contains(token.obj)) {
					// token genesis
					const obj = document.createElement('a-sphere');
					obj.setAttribute('color', 'hsl('+~~(Math.random()*255)+', 70%, 50%)');
					obj.setAttribute('radius', '0.5');
					window.BATscene.appendChild(obj);

					const latestStage = token.life[initialSetup ? token.life.length -1 : 0];
					const modelElement = window.BATViewer.get('elementRegistry').get(latestStage.activityId);

					const position = {
						x: modelElement.y * globalScaleFactor + modelElement.height / 2 * globalScaleFactor,
						y: .75,
						z: -modelElement.x * globalScaleFactor - modelElement.width / 2 * globalScaleFactor
					};

					const pos = obj.getAttribute('position');
					pos.x = position.x;
					pos.y = position.y;
					pos.z = position.z;
					obj.setAttribute('position', pos);

					token.obj = obj;
					token.speed = 0.03;
					token.currentStage = initialSetup ? token.life.length -1 : 0;
					token.currentResidence = modelElement;
					token.targetPosition = [{
						x: modelElement.y * globalScaleFactor + Math.random() * modelElement.height * globalScaleFactor,
						z: -modelElement.x * globalScaleFactor - Math.random() * modelElement.width * globalScaleFactor
					}];
					token.bounceCycle = Math.random() * 2 * Math.PI;
				}

				while(token.currentStage < token.life.length - 1) {
					if(token.speed === 0.03) {
						token.targetPosition.length = 0;
					}

					if(token.newPositionTimeout) {
						window.clearTimeout(token.newPositionTimeout);
						token.newPositionTimeout = null;
					}
					token.speed = .7;
					token.currentStage++;

					const targetActivity = token.life[token.currentStage].activityId;
					const sequenceFlow = token.currentResidence.outgoing.find(connection => {
						return connection.businessObject.targetRef.id === targetActivity;
					});

					if(sequenceFlow) {
						token.targetPosition.push({
							x: token.currentResidence.y * globalScaleFactor + .5 * token.currentResidence.height * globalScaleFactor,
							z: -token.currentResidence.x * globalScaleFactor - .5 * token.currentResidence.width * globalScaleFactor
						});
						sequenceFlow.waypoints.forEach(({x,y}) => {
							token.targetPosition.push({
								x: y * globalScaleFactor,
								z: -x * globalScaleFactor
							});
						});

						token.currentResidence = window.BATViewer.get('elementRegistry').get(targetActivity);

						token.targetPosition.push({
							x: token.currentResidence.y * globalScaleFactor + .5 * token.currentResidence.height * globalScaleFactor,
							z: -token.currentResidence.x * globalScaleFactor - .5 * token.currentResidence.width * globalScaleFactor
						});
					} else {
						console.log('could not find connection to next activity');
						debugger;
					}
				}

				const pos = token.obj.getAttribute('position');
				if(pos) {
					pos.y = .75 + .5 * Math.sin(token.bounceCycle);

					token.bounceCycle += delta * bouncyness;
					token.bounceCycle %= Math.PI * 2;

					// move token closer to its target position
					if(token.targetPosition[0]) {
						const vector = [
							token.targetPosition[0].x - pos.x,
							token.targetPosition[0].z - pos.z
						];

						// normalize and apply movement speed
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] *= token.speed / vectorLength;
						vector[1] *= token.speed / vectorLength;

						pos.x += vector[0];
						pos.z += vector[1];

						if(vectorLength < token.speed) {
							// targetPosition reached
							pos.x = token.targetPosition[0].x;
							pos.z = token.targetPosition[0].z;

							token.targetPosition.shift();
						}
					}
					token.obj.setAttribute('position', pos);

					if(token.targetPosition.length === 0 && !token.newPositionTimeout) {
						// set a new targetposition to avoid idling around
						token.newPositionTimeout = setTimeout(() => {
							token.speed = 0.03;
							token.targetPosition.push({
								x: token.currentResidence.y * globalScaleFactor + Math.random() * token.currentResidence.height * globalScaleFactor,
								z: -token.currentResidence.x * globalScaleFactor - Math.random() * token.currentResidence.width * globalScaleFactor
							});
							token.newPositionTimeout = null;
						}, 1500);
					}
				}
			}
		}
	});
})();
