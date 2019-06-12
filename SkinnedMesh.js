phina.namespace(function() {


  phina.define("phina.three.SkinnedMesh", {
    superClass: "phina.three.Mesh",

    /** @type {Object.<int|String, phina.three.Motion>} */
    _motionCache: null,

    init: function(options) {
      this.superInit(options);

      this.animationMixer = new THREE.AnimationMixer(this.$t);
      this._motionCache = {};
    },

    getMotion: function(animationClip) {
      if (this._motionCache[animationClip] == null) {
        let name = null;
        if (typeof(animationClip) == "string") {
          name = animationClip;
          animationClip = this.gltf.animations.find(_ => _.name == name);
          if (!animationClip) animationClip = phina.asset.AssetManager.get("animationClip", name);
          if (!animationClip) throw new Error("no animationClip", name)
        }
        const motion = phina.three.Motion(animationClip);
        motion.name = name;
        this._motionCache[name] = motion;
        return this._motionCache[name];
      } else {
        return phina.three.Motion(animationClip);
      }
    },

    _accessor: {
      motionController: {
        get: function() {
          if (this._motionController == null) {
            this._motionController = phina.three.MotionController().attachTo(this);
          }
          return this._motionController;
        },
      },
    },

  });

});