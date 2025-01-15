class AbortControllerSingleton {
  constructor() {
    this.controller = null;
  }

  getController() {
    return this.controller;
  }

  setController(newController) {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = newController;
  }

  clearController() {
    this.controller = null;
  }
}

const abortControllerSingleton = new AbortControllerSingleton();
export default abortControllerSingleton;
