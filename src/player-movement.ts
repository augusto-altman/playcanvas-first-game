class PlayerMovement extends pc.ScriptType {
  // State
  _eulers: pc.Vec3;

  // Attributes
  lookSpeed: number;

  _onMouseMove(e: any) {
    const { _eulers, lookSpeed } = this;

    if (!pc.Mouse.isPointerLocked()) {
      return;
    }

    _eulers.x -= lookSpeed * e.dx;
    _eulers.y -= lookSpeed * e.dy;
  }

  initialize() {
    this._eulers = new pc.Vec3();

    const { app } = this;

    app.mouse.on("mousemove", this._onMouseMove, this);
    app.mouse.disableContextMenu();
  }

  update(dt: number): void {
    const { app, _eulers, entity } = this;
    const cameraEntity = entity.camera?.entity;

    if (!cameraEntity) {
      throw new Error("This script needs a camera component");
    }

    const { forward, right } = cameraEntity; // Get camera directions to determine movement directions

    let xChange = 0;
    let yChange = 0;
    let zChange = 0;

    if (app.mouse.isPressed(pc.MOUSEBUTTON_RIGHT)) {
      // when the left button is pressed hide the cursor
      app.mouse.enablePointerLock();
    } else {
      app.mouse.disablePointerLock();
    }

    if (app.keyboard.isPressed(pc.KEY_A)) {
      xChange -= right.x;
      zChange -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D)) {
      xChange += right.x;
      zChange += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
      xChange += forward.x;
      zChange += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
      xChange -= forward.x;
      zChange -= forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_Q)) {
      yChange -= 1;
    }

    if (app.keyboard.isPressed(pc.KEY_E)) {
      yChange += 1;
    }

    if (xChange !== 0 || zChange !== 0 || yChange !== 0) {
      const pos = entity.getPosition();
      entity.setPosition(
        pos.x + xChange / 10,
        pos.y + yChange / 10,
        pos.z + zChange / 10
      );
    }

    // update camera angle from mouse events
    cameraEntity.setLocalEulerAngles(_eulers.y, _eulers.x, 0);
  }
}

pc.registerScript(PlayerMovement, "playerMovement");

PlayerMovement.attributes.add("lookSpeed", {
  type: "number",
  default: 0.25,
  description: "Adjusts the sensitivity of looking",
});
