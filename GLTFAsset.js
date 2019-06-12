// <script src="https://rawgit.com/mrdoob/three.js/r95/examples/js/loaders/GLTFLoader.js"></script>

phina.namespace(function() {

  phina.define("phina.three.GLTFAsset", {
    superClass: "phina.asset.Asset",

    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      console.log(this.src);
      const loader = new THREE.GLTFLoader();
      loader.load(this.src, (data) => {
        data.clone = () => cloneGltf(data);
        resolve(data);
      });
    },

  });

  phina.asset.AssetLoader.register("gltf", (key, path) => {
    const asset = phina.three.GLTFAsset();
    const flow = asset.load(path);
    return flow;
  });

  const cloneGltf = (gltf) => {
    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };

    const skinnedMeshes = {};

    gltf.scene.traverse(node => {
      if (node.isSkinnedMesh) {
        skinnedMeshes[node.name] = node;
      }
    });

    const cloneBones = {};
    const cloneSkinnedMeshes = {};

    clone.scene.traverse(node => {
      if (node.isBone) {
        cloneBones[node.name] = node;
      }

      if (node.isSkinnedMesh) {
        cloneSkinnedMeshes[node.name] = node;
      }
    });

    for (let name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];

      const orderedCloneBones = [];

      for (let i = 0; i < skeleton.bones.length; ++i) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }

      cloneSkinnedMesh.bind(
        new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
        cloneSkinnedMesh.matrixWorld);
    }

    return clone;
  };

});