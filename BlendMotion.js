phina.namespace(function() {

  phina.define("phina.three.BlendMotion", {
    superClass: "phina.three.Motion",

    animationClips: null,
    _animationActions: null,

    init: function(animationClips) {
      this.superInit(animationClips[0]);

      this.animationClips = animationClips;
    },

    clip: function(skinnedMesh) {
      this._animationActions = this.animationClips.map(_ => skinnedMesh.animationMixer.clipAction(_));
    },

    setWeight: function(value) {
      // this._animationActions.forEach(_ => _.setEffectiveWeight(value));
      return this;
    },

    setWeights: function(weights) {
      if (this._animationActions) this._animationActions.forEach((action, i) => action.setEffectiveWeight(weights[i]));
    },

    play: function() {
      if (this._animationActions) this._animationActions.forEach(_ => _.play());
      return this;
    },

    stop: function() {
      if (this._animationActions) this._animationActions.forEach(_ => _.stop());
      return this;
    },

    applyLoop: function() {
      if (this._animationActions) {
        if (this.loop) {
          this._animationActions.forEach(_ => _.setLoop(THREE.LoopRepeat));
        } else {
          this._animationActions.forEach(_ => {
            _.setLoop(THREE.LoopOnce);
            _.clampWhenFinished = true;
          });
        }
      }
    },

  });

});