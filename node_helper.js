'use strict';
const NodeHelper = require("node_helper");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: this.config.openaiapikey,
});
const openai = new OpenAIApi(configuration);

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting module: " + this.name);
    },

    socketNotificationReceived: async function (notification, payload) {
        console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);

        if (notification === 'INITIATE') {
            this.config = payload;
        }

        if (notification === "ChatGPT-Question") {
            const completion = await openai.createCompletion({
                model: this.config.model,
                prompt: payload,
                max_tokens: this.config.max_tokens,
                n: 1,
                temperature: 0.5,
            });
            this.sendSocketNotification("ChatGPT-Answer", completion.data.choices[0].text);
        }
    },
});