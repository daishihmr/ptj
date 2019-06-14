// https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_texture.html

phina.namespace(function() {

  phina.define("phina.three.CanvasPlate", {
    superClass: "phina.three.Mesh",

    point: false,
    pointPosition: null,

    init: function(options) {
      options = ({}).$safe(options, phina.three.CanvasPlate.defaults);

      this.canvas = options.canvas;
      this.texture = new THREE.CanvasTexture(this.canvas.domElement);

      this.geometry = new THREE.PlaneBufferGeometry(options.width, options.height);
      this.material = new THREE.MeshBasicMaterial({ map: this.texture })
      this.material.transparent = true;

      this.superInit({ $t: new THREE.Mesh(this.geometry, this.material) });

      this.raycaster = new THREE.Raycaster();

      this.pointPosition = phina.geom.Vector2(0, 0);
    },

    dispose: function() {
      this.geometry.dispose();
      this.material.dispose();
      this.texture.dispose();
    },

    updateTexture: function() {
      this.texture.needsUpdate = true;
      return this;
    },

    updatePointPosition: function(camera, pointer, screenWidth, screenHeight) {
      if (pointer.getPointing()) {
        const x = pointer.x;
        const y = pointer.y;
        const v = new THREE.Vector2((x / screenWidth * 2) - 1, -((y / screenHeight * 2) - 1));
        this.raycaster.setFromCamera(v, camera);
        const intersect = this.raycaster.intersectObjects([this.$t]);
        if (intersect.length > 0 && intersect[0].uv) {
          const uv = intersect[0].uv;
          intersect[0].object.material.map.transformUv(uv);

          this.point = true;
          this.pointPosition.set(this.canvas.width * uv.x, this.canvas.height * (1 - uv.y));
        } else {
          this.point = false;
          this.pointPosition.set(0, 0);
        }
      } else {
        this.point = false;
      }
    },

    _static: {
      defaults: {
        width: 1,
        height: 1,
      }
    },

    _accessor: {
      px: {
        get: function() {
          return this.pointPosition.x;
        },
      },
      py: {
        get: function() {
          return this.pointPosition.y;
        }
      }
    }

  });

});