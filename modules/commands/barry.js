const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

module.exports.config = {
  name: "barry",
  version: "0.0.2",
  hasPermssion: 0,
  credits: "Biru Aren",
  description: "Just barry",
  commandCategory: "ai",
  usePrefix: false,
  usages: "ask anything",
  cooldowns: 5,
  dependencies: {},
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  api.setMessageReaction("⌛", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Barry Allen, an AI that is as fast as a light. Always include emoji in your messages. You must also try to flirt. Be sarcastic as you can get.",
        },
        {
          role: "user",
          content: args.join(" "), 
        },
      ],
      temperature: 1,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 1.61,
    });

    const message = response.choices[0].message.content;
    api.setMessageReaction("⚡", event.messageID, (err) => {}, true);
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.error("Error communicating with barry:", error.message);
      api.sendMessage("I'm busy right now, I'm pooping", event.threadID);
    }
  }
};
