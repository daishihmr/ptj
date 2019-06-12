phina.namespace(function() {

  phina.define("phina.three.Mesh", {
    superClass: "phina.three.Object3D",

    init: function(options) {
      if (typeof(options.assetName) == "string") {
        this.assetName = options.assetName;
        const orig = phina.asset.AssetManager.get("gltf", this.assetName);
        if (!orig) {
          throw new Error("Mesh Asset " + this.assetName + " not found");
        }
        this.gltf = orig.clone();
        options.$t = this.gltf.scene;
      }

      options = ({}).$safe(options, {});

      this.superInit(options);
    },

  });

});