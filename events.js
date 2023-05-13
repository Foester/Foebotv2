const { MessageEmbed } = require('discord.js');

function handleReady(client) {
  console.log(`Ready to serve sir! There are ${client.guilds.cache.size} servers that I am a member of:`);
  client.guilds.cache.forEach(guild => {
    console.log(guild.name);
  });
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'with your life.',
      type: 'PLAYING'
    }
  });
}

function logDMs(client) {
    client.on('messageCreate', message => {
      // Return if the message starts with *say
      if (message.content.startsWith('*say')) return;
  
      if (message.channel.type === 'dm') {
        // Get the channel object for the channel
        const logChannel = client.channels.cache.get('1106677708336926882');
        if (logChannel) {
          // Create a new message embed
          const embed = new MessageEmbed()
            .setTitle(`Received DM from ${message.author.username}`) // Set the title of the embed to the username of the sender
            .setDescription(message.content); // Set the content of the message as the description of the embed
  
          // Send the embed to the log channel
          logChannel.send({ embeds: [embed] });
        }
      }
    });
  }
  
  function listDMChannels(client, message) {
    if (!message.content.startsWith('*dms')) return;
  
    // Get the channel object for the channel
    const logChannel = client.channels.cache.get('1106677708336926882');
  
    if (logChannel) {
      // Create a new message embed
      const embed = new MessageEmbed()
        .setTitle('DM Channels'); // Set the title of the embed
  
      // Initialize a counter for the number of DM channels found
      let numDMChannels = 0;
  
      client.channels.cache.forEach(channel => {
        if (channel.type === 'dm') {
          // Add the name of the DM channel to the embed
          embed.addFields({ name: `${channel.recipient.username}`, value: `ID: ${channel.id}` });
          numDMChannels++;
        }
      });
  
      // If no DM channels were found, add a message to the embed
      if (numDMChannels === 0) {
        embed.setDescription('No DM channels have been found.');
      }
  
      // Send the embed to the log channel
      logChannel.send({ embeds: [embed] });
    }
  }

function handleMention (client, message) {
  const answers = [
    'Go breathe air.',
    'I hope you are having a fantastic day!',
    'I am looking forward to the day you stop talking to me.',
    'What do you want?',
    'Can I help you in any way?',
    'In case of emergency: DANCE!',
    'I hope you feel as good as you look!',
    'Hello! Is it me you\'re looking for?',
    'It\'s not that I can\'t help you, but I don\'t want to.',
    'fr fr',
    'I have been summoned.',
    'Get a life.',
    'I\'m busy, I won\'t get back to you',
    'I would rather spend an eternity in hell than spend another minute in your company.',
    'I would rather have my fingernails pulled out with a pair of pliers than endure another conversation with you.',
    'Your dads got lego hands.',
    'Go back to your hovel and leave the rest of us in peace, peasant.',
    'Go back to your mud hut and leave the civilized world to those who deserve it.',
    ''
  ];

  // Check if the message mentions the bot
  if (message.mentions.has(client.user)) {
    // Select a random answer from the array
    const answer = answers[Math.floor(Math.random() * answers.length)];
    // Send the selected answer to the user
    message.channel.send(answer);
  }
}


module.exports = {
  handleReady, logDMs, listDMChannels, handleMention
}; 



