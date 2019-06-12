phina.namespace(function() {

  phina.define("phina.three.MotionController", {
    superClass: "phina.accessory.Accessory",

    _beforeMotion: null,
    _currentMotion: null,

    transitionTweener: null,

    init: function() {
      this.superInit();

      this.on("attached", e => {
        this.transitionTweener = phina.accessory.Tweener().attachTo(this.target);
        this.target._transitionWeightBefore = 0;
        this.target._transitionWeightCurrent = 0;

        this.target.animationMixer.addEventListener("finished", (e) => {
          if (this._currentMotion) this._currentMotion.flare("finished");
        });
        this.target.animationMixer.addEventListener("loop", (e) => {
          if (this._currentMotion) this._currentMotion.flare("entered");
        });
      });
    },

    switchMotion: function(newMotion, duration) {
      if (this._currentMotion === newMotion) return;

      if (this._beforeMotion) {
        this._beforeMotion.stop();
      }

      this._beforeMotion = this._currentMotion;
      this._currentMotion = newMotion;

      if (this._currentMotion._animationAction == null) {
        this._currentMotion.clip(this.target);
        this._currentMotion.applyLoop();
      }

      this._currentMotion.stop();
      this._currentMotion.play();
      this._currentMotion.setWeight(0);

      if (duration) {
        this.transitionTweener
          .clear()
          .set({
            _transitionWeightBefore: this.target._transitionWeightCurrent,
            _transitionWeightCurrent: 0,
          })
          .to({
            _transitionWeightBefore: 0,
            _transitionWeightCurrent: 1,
          }, duration)
          .call(() => {
            if (this._beforeMotion) {
              this._beforeMotion.stop();
              this._beforeMotion = null;
            }
          });
      } else {
        this.target._transitionWeightBefore = 0;
        this.target._transitionWeightCurrent = 1;
        if (this._beforeMotion) {
          this._beforeMotion.stop();
          this._beforeMotion = null;
        }
      }

      if (this._beforeMotion) this._beforeMotion.flare("exited");
      newMotion.flare("entered");
    },

    setTime: function(time) {
      this.target.animationMixer.time = 0;
      this.target.animationMixer.update(time);
      return this;
    },

    update: function(app) {
      const target = this.target;

      if (this._beforeMotion) {
        this._beforeMotion.setWeight(target._transitionWeightBefore);
      }

      if (this._currentMotion) {
        this._currentMotion.setWeight(target._transitionWeightCurrent);
        this._currentMotion.update(this);
      }

      target.animationMixer.update(app.deltaTime / 1000);
    },

    getCurrentMotion: function() {
      if (this._currentMotion && this._beforeMotion) {
        if (this._currentMotion.weight >= this._beforeMotion.weight) {
          return this._currentMotion;
        } else {
          return this._beforeMotion;
        }
      } else if (this._currentMotion) {
        return this._currentMotion;
      } else {
        return null;
      }
    },

    _accessor: {
      currentMotionName: {
        get: function() {
          if (this.currentMotion) {
            return this.currentMotion.name;
          } else {
            return null;
          }
        },
      },
      currentMotion: {
        get: function() {
          return this.getCurrentMotion();
        },
      },
    },

  });

});