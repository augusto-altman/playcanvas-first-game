class HelloWorld extends pc.ScriptType {
  text: string;
  entityLink: pc.Entity;

  initialize() {
    console.log("Hello " + this.text);
  }

  update(dt: number): void {
    const mouse = this.app.mouse;

    console.log("mouse.isPressed", mouse.isPressed(pc.MOUSEBUTTON_RIGHT));
  }
}

pc.registerScript(HelloWorld, "helloWorld");
HelloWorld.attributes.add("text", { type: "string" });
HelloWorld.attributes.add("entityLink", { type: "entity" });
