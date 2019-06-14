phina.namespace(() => {

  phina.define("phina.three.ObjMtlAsset", {
    superClass: "phina.asset.Asset",

    init: function () {
      this.superInit();
    },

    _load: function (resolve) {
      let urlPath = this.src.substring(0, this.src.lastIndexOf("/"));
      if (urlPath != "") urlPath += "/";
      const baseFilename = this.src.substring(this.src.lastIndexOf("/") + 0, this.src.lastIndexOf("."));
      let urlObj = baseFilename + ".obj";
      if (urlObj.startsWith("/")) urlObj = urlObj.substring(1);
      let urlMtl = baseFilename + ".mtl";
      if (urlMtl.startsWith("/")) urlMtl = urlMtl.substring(1);

      console.log("load objmtl", urlPath, urlObj, urlMtl);

      new THREE.MTLLoader()
        .setPath(urlPath)
        .load(urlMtl, function (materials) {
          materials.preload();
          new THREE.OBJLoader()
            .setMaterials(materials)
            .setPath(urlPath)
            .load(urlObj, function (object) {
              resolve(object);
            }, () => { }, () => { });
        });
    },
  });

  phina.asset.AssetLoader.register("objmtl", (key, path) => {
    const asset = phina.three.ObjMtlAsset();
    const flow = asset.load(path);
    return flow;
  });

});
