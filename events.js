function handleReady(client) {
  console.log(`Ready to serve, sir! I am a member of ${client.guilds.cache.size} servers:`);
  client.guilds.cache.forEach(guild => {
    console.log(`- ${guild.name} (ID: ${guild.id})`);
  });
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'with your life.',
      type: 'PLAYING'
    }
  });
}


const { MessageEmbed } = require('discord.js');

function logDMs(client) {
  client.on('messageCreate', message => {
    // Return if the message starts with *say
    if (message.content.startsWith('*say')) return;

    if (message.channel.type === 'DM') {
      // Get the channel object for the log channel
      const logChannel = client.channels.cache.get('1106677708336926882');
      if (logChannel) {
        // Create a new message embed
        const embed = new MessageEmbed()
          .setTitle(`Received DM from ${message.author.username}`)
          .setDescription(message.content);

        // Send the embed to the log channel
        logChannel.send({ embeds: [embed] });
      }
    }
  });
}


async function listDMChannels(client) {
  const logChannel = client.channels.cache.get('1106677708336926882');

  if (logChannel) {
    const user = await client.users.fetch(logChannel.recipient.id);
    if (user) {
      const dmChannels = await user.createDM();
      if (dmChannels) {
        const dmList = dmChannels.cache.map(dmChannel => `Name: ${dmChannel.recipient.username}, ID: ${dmChannel.recipient.id}`);
        if (dmList.length > 0) {
          const embed = new MessageEmbed()
            .setTitle('DM Channels')
            .setDescription(dmList.join('\n'));
          logChannel.send({ embeds: [embed] });
          return;
        }
      }
    }
  }

  logChannel.send('No DM channels have been found.');
}





module.exports = { logDMs, listDMChannels };


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

  if (message.mentions.has(client.user)) {
    const answer = answers[Math.floor(Math.random() * answers.length)];
    message.channel.send(answer);
  }
}


module.exports = {
  handleReady, logDMs, listDMChannels, handleMention
}; 



