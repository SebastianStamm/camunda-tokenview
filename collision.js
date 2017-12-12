(function() {
	AFRAME.registerComponent( 'collision', {
		init: function() {
		},

		tick: function () {
			var self = this;
      window.debugObj = this;

			availableDoors.forEach(door => {
				if(distanceBetween(door.object3D.position, this.el.object3D.position) < doorThreshold) {
					openDoor(door);
				} else {
					closeDoor(door);
				}
			});


			if ( collides() ) {
				// check if we can resolve the collision
				const targetx = this.el.object3D.position.x;
				const targetz = this.el.object3D.position.z;

				this.el.object3D.position.x = this.lastKnownGoodPosition.x;

				if(collides()) {
					this.el.object3D.position.x = targetx;
					this.el.object3D.position.z = this.lastKnownGoodPosition.z;

					if(collides()) {
						// this.el.object3D.position.x = this.lastKnownGoodPosition.x;
						this.el.components['wasd-controls'].data.acceleration = 0;
						this.el.setAttribute( 'position', this.lastKnownGoodPosition );
					} else {
						this.lastKnownGoodPosition = {
							x: this.el.object3D.position.x,
							y: this.el.object3D.position.y,
							z: this.el.object3D.position.z
						};

						this.el.setAttribute( 'position', this.lastKnownGoodPosition );
						this.el.components['wasd-controls'].data.acceleration = 250;
					}
				} else {
					// found acceptable match
					this.lastKnownGoodPosition = {
						x: this.el.object3D.position.x,
						y: this.el.object3D.position.y,
						z: this.el.object3D.position.z
					};
					this.el.setAttribute( 'position', this.lastKnownGoodPosition );
					this.el.components['wasd-controls'].data.acceleration = 250;
				}
			} else {
				this.lastKnownGoodPosition = {
					x: this.el.object3D.position.x,
					y: this.el.object3D.position.y,
					z: this.el.object3D.position.z
				};
        this.el.components['wasd-controls'].data.acceleration = 250;
			}

			/**
			 * Tests each collideWiths for intersection.
			 */

			function collides() {
        return !window.openSpaces.some(openSpace => {
          return isInside(self.el.object3D.position, openSpace);
        });
			}
		}
	});
})();

function isInside(pt, space) {
  const b1 = sign(pt, space.p1, space.p2) < 0;
  const b2 = sign(pt, space.p2, space.p3) < 0;
  const b3 = sign(pt, space.p3, space.p1) < 0;

  return b1 === b2 && b2 === b3;
}

function sign(p1, p2, p3){
  // only x and z coordinates are relevant
  return (p1.x - p3.x) * (p2.z - p3.z) - (p2.x - p3.x) * (p1.z - p3.z);
}

function distanceBetween(p1, p2) {
	return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2);
}

function openDoor(door) {
	// door.object3D.position.y = sequenceFlowHeight;
	if(door.closingAnimObj) {
		door.removeChild(door.closingAnimObj);
		door.closingAnimObj = null;
	}
	if(!door.openingAnimObj) {
		const anim = document.createElement('a-animation');
		anim.setAttribute('attribute', 'position');
		anim.setAttribute('dur', '500');
		anim.setAttribute('to', door.object3D.position.x + ' ' + (sequenceFlowHeight * 1.5) + ' ' + door.object3D.position.z);

		door.appendChild(anim);
		door.openingAnimObj = anim;
	}
}

function closeDoor(door) {
	// door.object3D.position.y = sequenceFlowHeight / 2;
	if(door.openingAnimObj) {
		door.removeChild(door.openingAnimObj);
		door.openingAnimObj = null;
	}
	if(!door.closingAnimObj) {
		const anim = document.createElement('a-animation');
		anim.setAttribute('attribute', 'position');
		anim.setAttribute('dur', '500');
		anim.setAttribute('to', door.object3D.position.x + ' ' + (sequenceFlowHeight * 0.5) + ' ' + door.object3D.position.z);

		door.appendChild(anim);
		door.closingAnimObj = anim;
	}
}
