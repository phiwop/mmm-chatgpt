Module.register("MMM-ChatGPT", {

  // Default module config.
  defaults: {
    inputPlaceholder: "Ask ChatGPT ...",
    openaiapikey: "XXX",
    model: "text-davinci-003",
    max_tokens: 1024,
  },

  start: function () {
    this.value = "";
    this.sendSocketNotification('INITIATE', this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "ChatGPT-Answer") {
      this.value = payload;
      this.sendNotification("MMM-TTS-NANOTTS", payload)
      this.updateDom();
    }
  },

  getStyles: function () {
    return [
      this.file('style.css'), // this file will be loaded straight from the module folder.
    ]
  },

  getScripts: function() {
    return [
      'https://unpkg.com/typewriter-effect@latest/dist/core.js',
    ]
  },

  write: function (element,value) {
    var app = element;

    var typewriter = new Typewriter(app, {
        loop: false,
        cursor: "▌"
    });

    typewriter.typeString(value).start();
},

  // Override the start function.
  getDom: function () {

    var self = this;
    this.text = "";

    // Create the text input element.
    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "text");
    this.inputElement.setAttribute("id", "chatgpt-input");
    this.inputElement.setAttribute("placeholder", this.config.inputPlaceholder);
    this.inputElement.style.width = "100%";

    this.inputElement.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        self.text = self.inputElement.value;
        // Send the text to Python script.
        self.sendSocketNotification("ChatGPT-Question", self.text);
      }
    });

    var wrapper = document.createElement("div");
    wrapper.setAttribute("id", "chatgpt-module");
    wrapper.appendChild(this.inputElement);
    var valueElem = document.createElement("div");
    valueElem.setAttribute("id", "chatgpt-answer");
    this.write(valueElem,this.value);
    wrapper.appendChild(valueElem);

    return wrapper;
  },

});