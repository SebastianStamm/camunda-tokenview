const bouncyness = 0.007;

(function() {
	AFRAME.registerComponent( 'tokens', {
		init: function() {
		},

		tick: function (time, delta) {
			var self = this;
			const tokens = window.tokens;

			for(let i = 0; i < tokens.length; i++) {
				const token = tokens[i];

				if(!token.obj) {
					// token genesis
					const obj = document.createElement('a-sphere');
					obj.setAttribute('color', '#5555ff');
					obj.setAttribute('radius', '0.5');
					window.BATscene.appendChild(obj);

					const latestStage = token.life[token.life.length - 1];
					const modelElement = window.BATViewer.get('elementRegistry').get(latestStage.activityId);

					const position = {
						x: modelElement.y * globalScaleFactor + modelElement.height / 2 * globalScaleFactor,
						y: .75,
						z: -modelElement.x * globalScaleFactor - modelElement.width / 2 * globalScaleFactor
					};

					obj.setAttribute('position', position);

					token.obj = obj;
					token.speed = 0.03;
					token.currentResidence = modelElement;
					token.targetPosition = [{
						x: modelElement.y * globalScaleFactor + Math.random() * modelElement.height * globalScaleFactor,
						z: -modelElement.x * globalScaleFactor - Math.random() * modelElement.width * globalScaleFactor
					}];
					token.bounceCycle = Math.random() * 2 * Math.PI;
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

							if(token.targetPosition.length === 0) {
								// set a new targetposition to avoid idling around
								token.newPositionTimeout = setTimeout(() => {
									token.targetPosition.push({
										x: token.currentResidence.y * globalScaleFactor + Math.random() * token.currentResidence.height * globalScaleFactor,
										z: -token.currentResidence.x * globalScaleFactor - Math.random() * token.currentResidence.width * globalScaleFactor
									});
								}, 1500);
							}
						}
					}


					token.obj.setAttribute('position', pos);
				}


			}
		}
	});
})();
