const Discord = require('discord.js');
const prefix = '*';


  function handleDice(message) {
    if (!message || !message.content) return; // return if message or message.content is undefined
    // Split the message into individual words
    const words = message.content.split(' ');
    // Check if the first word is "*dice"
    if (words[0] === '*dice') {
      // Check if there are enough arguments
      if (words.length < 3) {
        message.channel.send('Use the format dummy. Number of rolls and number of sides.');
        return;
      }
      // Parse the arguments as integers
      const numRolls = parseInt(words[1]);
      const numSides = parseInt(words[2]);
      // Check if the arguments are valid
      if (isNaN(numRolls) || isNaN(numSides)) {
        message.channel.send('Invalid argument.');
        return;
      }
      // Check if the number of rolls or sides is zero or negative
      if (numRolls <= 0 || numSides <= 0) {
        message.channel.send('Give me something to work with!');
        return;
      }
      // Check if the number of rolls or sides is over 25
      if (numRolls > 25 || numSides > 25) {
        message.channel.send("I can't calculate!");
        return;
      }
      // Check if the number of sides is at least 2
      if (numSides < 2) {
        message.channel.send('A dice has a physical minimum of 2 sides.');
        return;
      }
      // Roll the dice the specified number of times
      let rolls = [];
      for (let i = 0; i < numRolls; i++) {
        rolls.push(Math.floor(Math.random() * numSides) + 1);
      }
      // Build the message with the dice rolls
      let diceMessage = 'You rolled:\n';
      for (let i = 0; i < rolls.length; i++) {
        diceMessage += `Dice ${i+1}: ${rolls[i]}\n`;
      }
      // Send the message
      message.channel.send(diceMessage);
    }
  }
  
  function handleToburger(message) {
    if (!message) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g).slice(1);
    if (args[0] == 0) {
      message.channel.send("Give me something to work with!");
    } else if (isNaN(args[0])) {
      message.channel.send("Write numbers, silly.");
    } else if (args[0] < 0) {
      message.channel.send("You're shorter than I can calculate!");
    } else if (args[0] > 250) {
      message.channel.send("We get it, you're tall. Stop flexing.");
    } else {
      const result = Math.ceil(args[0] / 8.8);
      message.channel.send(`You're ${result} cheeseburgers tall!`);
    }
  }
  
  function handleFlip(message) {
    if (!message || !message.channel) return; // return if message or message.channel is not defined
    // code for handling the *flip command
    const flipResult = Math.random() > 0.5 ? 'heads' : 'tails';
    message.channel.send(`The coin landed on ${flipResult}!`);
  }
  

  function handleHelp(message) {
    const helpEmbed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle(`Foebot`)
      .addFields(
        { name: '__*help__', value: 'dm foe'},
        { name: '__*truth__', value: 'answer truthfully'},
        { name: '__*dare__', value: 'do the dares pleb'},
        { name: '__*wyr__', value: 'would you rather?'},
        { name: '__*nhie__', value: 'never have I ever'},
        { name: '__*toburger__', value: 'ever wondered how tall are you in cheeseburgers?'},
        { name: '__*foeball__', value: 'ask foeball'},
        { name: '__*tts__', value: 'converts text to speech in the voice channel'},
        { name: '__*dc__', value: 'disconnects the bot from the voice channel'},
      )
      .setTimestamp()
      .setFooter({ text: `${message.author.username} Foebot`, iconURL: 'https://i.imgur.com/YV9mKy7.jpg' });
  
      message.channel.send({embeds: [helpEmbed]});
  }
  
function handleSay(client, message) {
  if (!message.content.startsWith('*say')) return;

  // Check if the first argument is a channel, user, or a message
  const args = message.content.split(' ').slice(1);
  if (args.length === 0) {
    return message.channel.send('Tell me something!');
  }

  // Check if the first argument is a channel, user, or a message
  const target = args[0];
  let channel; // Define the channel variable here
  if (target.startsWith('<#') && target.endsWith('>')) {
    // The first argument is a channel mention
    channel = message.mentions.channels.first();
    if (!channel) {
      return message.channel.send('Invalid channel mention.');
    }
  } else if (target.startsWith('<@') && target.endsWith('>')) {
    // The first argument is a user mention
    const user = message.mentions.users.first();
    if (!user) {
      return message.channel.send('Invalid user mention.');
    }
    if (args.length === 1) {
      return message.channel.send('Tell me something!');
    }
    const sayMessage = args.slice(1).join(' ');
    user.send(sayMessage);
    return; // Return here to stop execution of the rest of the code
  } else {
    // The first argument is not a channel or user mention, check if it's a channel ID
    channel = client.channels.cache.get(target);
    if (!channel) {
      // If it's not a channel ID, check if it's a channel name
      const channelName = target;
      channel = client.channels.cache.find(c => c.name === channelName);
      if (!channel) {
        // If the first argument is not a channel mention, user mention, channel ID, or channel name,
        // it must be the message to send
        const sayMessage = args.join(' ');
        message.channel.send(sayMessage); // Send the message on the channel the *say command was posted on
        return; // Return here to stop execution of the rest of the code
      }
    }
  }
  const sayMessage = args.slice(1).join(' ');
  channel.send(sayMessage);

  const logChannelId = '946127792179929182'; // Replace this with the actual channel ID of your log channel
  const logChannel = client.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send(`${message.author.username} said "${sayMessage}" on ${channel.name}`);
  } else {
    // If the log channel is not found, try fetching the channels and updating the cache
    client.channels.fetch()
      .then(() => {
        // Try getting the log channel again
        const logChannel = client.channels.cache.get(logChannelId);
        if (logChannel) {
          logChannel.send(`${message.author.username} said "${sayMessage}" on ${channel.name}`);
        } else {
          console.log('Log channel not found');
        }
      })
      .catch(console.error);
  }
}



module.exports = { handleSay, handleDice, handleToburger, handleFlip, handleHelp, };