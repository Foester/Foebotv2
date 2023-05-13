const Discord = require('discord.js');
const { token } = require('./config.json');
const prefix = "*";
const { Client, Intents } = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
const commands = require('./commands.js');
const events = require('./events.js');
const music = require('./music.js');
const { startGame, handleButton, showHighScores, quitGame } = require('./forklift.js');
const { handleTTS, handleDisconnect } = require('./tts.js');
const { handlePlay, handleList, handleSkip } = require('./music.js'); // Import music related handlers
const queues = new Map();
const connections = new Map();
const players = new Map();

client.on('ready', () => {
  events.handleReady(client);
});

client.on('interactionCreate', interaction => {
    handleButton(interaction);
  });

client.on('messageCreate', (message) => {
  events.handleMention(client, message);
});


client.on('messageCreate', message => {
    handleTTS(message);
});

  

events.logDMs(client)

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).split(' ').slice(1);
  const command = message.content.slice(prefix.length).split(' ')[0];
  switch (command) {
    case 'help':
      commands.handleHelp(message);
      break;
    case 'dice':
      commands.handleDice(message);
      break;
    case 'flip':
      commands.handleFlip(message);
      break;
    case 'toburger':
      commands.handleToburger(message);
      break;
    case 'say':
      commands.handleSay(client, message);
      break;
    case 'dms':
      events.listDMChannels(client, message);
      break;
    case 'play':
      await handlePlay(message, args, queues, connections, players);
      break;
    case 'list':
      handleList(message, queues);
      break;
      case 'skip':
      handleSkip(message, queues, players);
      break;
    case 'tts':
      handleTTS(message, connections);
      break;
    case 'dc':
      handleDisconnect(message, connections);
      break;
    case 'startgame':
      startGame(message, args, client);
      break;
    case 'highscore':
      showHighScores(client, message);
    case "quitgame":
      quitGame(message);
      break;
  }
});

client.login(token);
