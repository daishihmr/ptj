phina.namespace(function() {

  phina.define("phina.three.ElementTexture", {
    superClass: "phina.display.DisplayElement",

    _pointingstart: false,
    _pointing: false,
    _pointingend: false,

    init: function(options) {
      this.superInit(options);

      this.setOrigin(0, 0);

      this.gridX = Grid(this.width, 16);
      this.gridY = Grid(this.height, 16);

      this.canvas = phina.graphics.Canvas();
      this.canvas.setSize(this.width, this.height);

      this.renderer = phina.display.CanvasRenderer(this.canvas);

      const pointer = phina.input.Input();
      pointer.id = 0;
      pointer.getPointingStart = () => this._pointingstart;
      pointer.getPointing = () => this._pointing;
      pointer.getPointingEnd = () => this._pointingend;

      this.pointerChecker = phina.app.Interactive({
        pointers: [pointer],
        pointer: pointer,
        on: () => {},
      });
    },

    check: function(appPointer, x, y) {
      this._pointingstart = appPointer.getPointingStart();
      this._pointing = appPointer.getPointing();
      this._pointingend = appPointer.getPointingEnd();

      this.pointerChecker.app.pointer.position.set(x, y);
      this.pointerChecker.check(this);

      return this;
    },

    render: function() {
      this.renderer.render(this);
      return this;
    },

  });

});