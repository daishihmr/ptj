phina.namespace(function() {

  phina.define("phina.three.Motion", {
    superClass: "phina.util.EventDispatcher",

    _transitions: null,
    loop: false,

    /** @type {THREE.AnimationClip} */
    _animationClip: null,

    /** @type {THREE.AnimationAction} */
    _animationAction: null,

    _timeEventListeners: null,

    init: function(animationClip) {
      this.superInit();

      this._animationClip = animationClip
      this._transitions = [];

      this._timeEventListeners = [];

      this.on("entered", e => {
        this._timeEventListeners.forEach(t => {
          t.fired = false;
        });
      });
    },

    clip: function(skinnedMesh) {
      this._animationAction = skinnedMesh.animationMixer.clipAction(this._animationClip);
    },

    /**
     * pattern1:
     *   addTransition(conditionObject, conditionProperty, nextMotion, duration)
     *
     * pattern2:
     *   addTransition(conditionExpression, nextMotion, duration)
     *
     * pattern3:
     *   addTransition(eventName, nextMotion, duration)
     *
     */
    addTransition: function(condition, motion, duration) {
      if (arguments.length == 4) {
        // pattern1
        const object = arguments[0];
        const property = arguments[1];
        motion = arguments[2];
        duration = arguments[3];

        this._transitions.push({
          condition: () => object[property],
          motion: motion,
          duration: duration || 1,
        });
      } else {
        if (typeof(condition) == "function") {
          // pattern2
          this._transitions.push({
            condition: condition,
            motion: motion,
            duration: duration || 1,
          });
        } else if (typeof(condition) == "string") {
          // pattern3
          let flag = false;
          this.on("entered", () => flag = false);
          this.on(condition, () => flag = true);
          this._transitions.push({
            condition: () => flag,
            motion: motion,
            duration: duration || 0,
          });
        }
      }
      return this;
    },

    setWeight: function(value) {
      if (this._animationAction) this._animationAction.setEffectiveWeight(value);
      return this;
    },

    play: function() {
      if (this._animationAction) this._animationAction.play();
      return this;
    },

    stop: function() {
      if (this._animationAction) this._animationAction.stop();
      return this;
    },

    addTimeEventListener: function(time, listener) {
      this._timeEventListeners.push({
        time: time,
        listener: listener,
        fired: false,
      });
      return this;
    },

    at: function(time, listener) {
      return this.addTimeEventListener(time, listener);
    },

    update: function(controller) {
      if (this._animationAction) {
        this._timeEventListeners.forEach(t => {
          if (!t.fired && t.time <= this._animationAction.time * 1000) {
            t.listener.apply(this);
            t.fired = true;
          }
        });
      }

      this._transitions.forEach(t => {
        if (t.condition()) {
          controller.switchMotion(t.motion, t.duration);
          return;
        }
      });
    },

    setLoop: function(loop) {
      this.loop = loop;
      return this;
    },

    applyLoop: function() {
      if (this.loop) {
        this._animationAction.setLoop(THREE.LoopRepeat);
      } else {
        this._animationAction.setLoop(THREE.LoopOnce);
        this._animationAction.clampWhenFinished = true;
      }
    },

    _accessor: {
      weight: {
        get: function() {
          if (this._animationAction) {
            return this._animationAction.getEffectiveWeight();
          } else {
            return 0;
          }
        },
        set: function(v) {
          this.setWeight(v);
        },
      },
    },

  });

});