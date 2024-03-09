//This is a code of Yan, Modified by me(Biru), I just added a greeting function

module.exports = async ({ api }) => {
  const logger = require('./utils/log');
  const cron = require('node-cron');
  const fs = require('fs');


  const biru = {
    autoRestart: {
      status: true,
      time: 40, // 40 minutes
      note: 'To avoid problems, enable periodic bot restarts'
    },
    accpetPending: {
      status: false,
      time: 30, // 30 minutes
      note: 'Approve waiting messages after a certain time'
    }
  };

  function autoRestart(config) {
    if (config.status) {
      setInterval(async () => {
        logger(`Start rebooting the system!`, "[ Auto Restart ]");
        process.exit(1);
      }, config.time * 60 * 1000);
    }
  }

  function accpetPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
        }
      }, config.time * 60 * 1000);
    }
  }

  autoRestart(biru.autoRestart);
  accpetPending(biru.accpetPending);


  function sendGreeting(thread, timeOfDay) {
    const greetings = {
      'midnight': 'It\'s midnight, the world sleeps, and so should you. Close your eyes, drift into peaceful dreams, and wake up refreshed for a brand new day ahead.\n\nGood Night 🌃',
      'early morning': 'They say legends are either waking up or going to sleep at this time.\n\nGood Early Morning, Everyone🥣',
      'morning': 'Seize the day at 7 AM, and let your passion fuel your actions. Today is a new chance to make your dreams a reality💪.\n\nHave you eaten yet tho? Good Morning 🌅',
      'noon': 'As the sun stands high, remember that every step you\'ve taken today brings you closer to your goals. Keep going with determination and purpose! 🚀\n\nIt\'s Time for lunch! Good Noon!🌞', 

      'afternoon': 'Take a short break now. Relax, breathe, and come back stronger. You\'ve got this!\n\nGood Afternoon!', 

      'evening': 'It\'s dinner time! Gather with loved ones, savor the food, and cherish these moments of togetherness. Nourish your body and soul with gratitude.\n\nGood Evening!',

      'night': 'Get some rest so you can wake up full of energy tomorrow. Sleep well, recharge, and embrace the new day ahead!\n\nGood Night🌉😴!', 

      'after_noon': 'Quench your thirst! Grab a glass of water and stay refreshed. The sun is shining, and so can you with a sip of vigor!\n\nGood Afternoon☀️!',

      'sunset': 'As the sun sets, remember: No matter how tough the day was, it\'s now behind you. Relax, be proud, and know that you\'ve conquered another day🌇.',

      'good_night': 'It\'s vital to relax and sleep. Avoid sleep deprivation by giving your body the rest it deserves. Your well-being depends on it!\n\nGood Night!🌃',
    };

    const greetingMessage = greetings[timeOfDay] || 'Greetings Everyone ಡ ͜ ʖ ಡ';

    try {
      api.sendMessage(greetingMessage, thread.threadID, (err) => {
        if (err) return console.error("Error sending a message:", err);
      });
    } catch (error) {
      console.error("Error sending a message:", error);
    }
  }


  cron.schedule('0 0 * * *', () => { // 12:00 AM
    sendGreetingToAll('midnight');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 3 * * *', () => { // 3:00 AM
    sendGreetingToAll('early morning');
  }, {
    scheduled: false,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 5 * * *', () => { // 5:00 AM
    sendGreetingToAll('early morning');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 7 * * *', () => { // 7:00 AM
    sendGreetingToAll('morning');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('30 11 * * *', () => { // 11:30 AM
    sendGreetingToAll('noon');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 12 * * *', () => { // 12:00 PM (noon)
    sendGreetingToAll('afternoon');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 14 * * *', () => { // 2:00 PM
    sendGreetingToAll('after_noon');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 17 * * *', () => { // 5:00 PM
    sendGreetingToAll('sunset');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 19 * * *', () => { // 7:00 PM
    sendGreetingToAll('evening');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 21 * * *', () => { // 9:00 PM
    sendGreetingToAll('night');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });

  cron.schedule('0 22 * * *', () => { // 10:00 PM
    sendGreetingToAll('good_night');
  }, {
    scheduled: true,
    timezone: "Asia/Manila"
  });


  function sendGreetingToAll(timeOfDay) {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);

      data.forEach(async (thread) => {
        if (thread.isGroup && thread.name != thread.threadID) {
          sendGreeting(thread, timeOfDay);
        }
      });
    });
  }
};
