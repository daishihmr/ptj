phina.define("phina.three.Extensions", {
  _static: {
    setup: function() {
      this._phina();
      this._three();
    },

    _phina: function() {
      // Element
      const _addChild = Element.prototype.addChild;
      Element.prototype.addChild = function(child) {
        _addChild.call(this, child);
        if (this.$t && child.$t) {
          this.$t.add(child.$t);
        }
        this.flare("addedchild", {
          child: child,
        });
      };

      const _removeChild = Element.prototype.removeChild;
      Element.prototype.removeChild = function(child) {
        _removeChild.call(this, child);
        if (this.$t && child.$t) {
          this.$t.remove(child.$t);
        }
      }
    },

    _three: function() {
    }
  },
});
