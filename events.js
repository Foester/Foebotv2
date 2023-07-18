const prefix = "*";

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



function handleBall (message) {
  const answer = [ 
    "Foeball thinks you're right.",
    "Foeball says absolutely fucking not.", 
    "Foeball thinks you should never ask that again.", 
    "Foeball thinks you should ask that again later.", 
    "Foeball says it is certain.",
    "Foeball says don't count on it.", 
    "Foeball thinks you should stop procastinating and fuck off to work.",
    "Foeball says you should go to sleep. Go.",
    "Foeball thinks sleep is for the weak, as for your question please ask again later.",
    "Foeball thinks that it is certain.", 
    "Foeball says it is decidedly so.", 
    "Foeball says most likely.", 
    "Foeball says no, just no.", 
    "Foeball's sources say no.'",
    "Foeball says outlook not so good.", 
    "Foeball says outlook good.", 
    "Foeball says try again.", 
    "Foeball signs point to yes.",
    "Foeball signs point to no.", 
    "Foeball says it's very doubtful.", 
    "Foeball says without a fucking doubt.",
    "Foeball says yes.", 
    "Foeball says yes, definitely.", 
    "Foeball thinks you may rely on it."   
  ]

  const arguments = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = arguments.shift().toLowerCase();

  if (message.content.startsWith('*foeball')) {
    if (!arguments.length) {
      // User didn't provide any input
      message.channel.send("You have to tell me something silly.");
    } else {
      const foeball = answer[Math.floor(Math.random() * answer.length)];
      message.channel.send(foeball);
    }
  }
}



module.exports = {
  handleReady, logDMs, listDMChannels, handleMention, handleBall
}; 



