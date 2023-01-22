class PlayerMovement extends pc.ScriptType {
  force: pc.Vec3;
  eulers: pc.Vec3;

  camera: pc.Entity; // TODO: can we get this from the hierarchy?
  power: number;
  lookSpeed: number;

  _onMouseMove(e: any) {
    this.eulers.x -= this.lookSpeed * e.dx;
    this.eulers.y -= this.lookSpeed * e.dy;
  }

  initialize() {
    this.force = new pc.Vec3();
    this.eulers = new pc.Vec3();

    const app = this.app;

    // Listen for mouse move events
    app.mouse.on("mousemove", this._onMouseMove, this);

    // Check for required components
    if (!this.entity.collision) {
      console.error(
        "First Person Movement script needs to have a 'collision' component"
      );
    }

    if (
      !this.entity.rigidbody ||
      this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC
    ) {
      console.error(
        "First Person Movement script needs to have a DYNAMIC 'rigidbody' component"
      );
    }
  }

  update(dt: number): void {
    const force = this.force;
    const app = this.app;

    // Get camera directions to determine movement directions
    const forward = this.camera.forward;
    const right = this.camera.right;

    // movement
    let x = 0;
    let z = 0;

    // Use W-A-S-D keys to move player
    // Check for key presses
    if (app.keyboard.isPressed(pc.KEY_A) || app.keyboard.isPressed(pc.KEY_Q)) {
      x -= right.x;
      z -= right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_D)) {
      x += right.x;
      z += right.z;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) {
      x += forward.x;
      z += forward.z;
    }

    if (app.keyboard.isPressed(pc.KEY_S)) {
      x -= forward.x;
      z -= forward.z;
    }

    // use direction from keypresses to apply a force to the character
    if (x !== 0 || z !== 0) {
      (force.set(x, 0, z).normalize() as any).scale(this.power); // TODO: remove `as any` assertion
      this.entity.rigidbody?.applyForce(force); // TODO: should not be undefined
    }

    // update camera angle from mouse events
    this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
  }
}

pc.registerScript(PlayerMovement, "playerMovement");

PlayerMovement.attributes.add("camera", {
  type: "entity",
  description: "Optional, assign a camera entity, otherwise one is created",
});

PlayerMovement.attributes.add("power", {
  type: "number",
  default: 2500,
  description: "Adjusts the speed of player movement",
});

PlayerMovement.attributes.add("lookSpeed", {
  type: "number",
  default: 0.25,
  description: "Adjusts the sensitivity of looking",
});
