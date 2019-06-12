// <script src="https://rawgit.com/mrdoob/three.js/r95/examples/js/loaders/GLTFLoader.js"></script>

phina.namespace(function() {

  phina.define("phina.three.AnimationClipAsset", {
    superClass: "phina.asset.Asset",

    init: function(key) {
      this.superInit();
      this.key = key;
    },

    _load: function(resolve) {
      let url;
      let name;
      if (typeof(this.src) == "string") {
        url = this.src;
        name = this.key;
      } else {
        url = this.src.url;
        name = this.src.name;
      }

      const loader = new THREE.GLTFLoader();
      loader.load(url, (data) => {
        const animationClip = data.animations.find(_ => _.name === name);
        if (!animationClip) {
          throw new Error("そんな名前のanimationClipないよ " + name + ", " + url);
        }
        resolve(animationClip);
      });
    },

  });

  phina.asset.AssetLoader.register("animationClip", (key, path) => {
    const asset = phina.three.AnimationClipAsset(key);
    const flow = asset.load(path);
    return flow;
  });

});