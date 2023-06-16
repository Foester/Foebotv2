const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');

const warehouses = ['Warehouse 1', 'Warehouse 2', 'Warehouse 3'];

const games = new Map();
const foebucks = new Map();

// Load foebucks from file
let foebucksData = {};
if (fs.existsSync('./foebucks.json')) {
  const fileData = fs.readFileSync('./foebucks.json');
  foebucksData = JSON.parse(fileData);
  for (const [userId, balance] of Object.entries(foebucksData)) {
    foebucks.set(userId, balance);
  }
}

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const startGame = async (message) => {
  if (games.has(message.author.id)) {
    return message.reply("You already have an active game!");
  }

  const game = {
    status: true,
    points: 0,
    warehouseNum: Math.floor(Math.random() * 3),
    messageID: null,
  };

  const buttons = [
    new MessageButton().setCustomId('warehouse1').setLabel('Warehouse 1').setStyle('PRIMARY'),
    new MessageButton().setCustomId('warehouse2').setLabel('Warehouse 2').setStyle('SECONDARY'),
    new MessageButton().setCustomId('warehouse3').setLabel('Warehouse 3').setStyle('SUCCESS')
  ];

  shuffleArray(buttons);

  const row = new MessageActionRow().addComponents(buttons);

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`🚜 Forklift Game (Player: ${message.author.username})`)
    .setDescription(`Deliver to ${warehouses[game.warehouseNum]}!`)
    .setFooter({ text: `Points: ${game.points}` });

  const gameMessage = await message.channel.send({ embeds: [embed], components: [row] });
  game.messageID = gameMessage.id;

  games.set(message.author.id, game);
};

const handleButton = async (interaction, client) => {
  const game = games.get(interaction.user.id);
  if (!game || !game.status || interaction.message.id !== game.messageID) return;

  const warehouseClicked = interaction.customId.replace('warehouse', '');
  if (warehouseClicked == (game.warehouseNum + 1)) {
    game.points++;
    game.warehouseNum = Math.floor(Math.random() * 3);

    const buttons = [
      new MessageButton()
        .setCustomId('warehouse1')
        .setLabel('Warehouse 1')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('warehouse2')
        .setLabel('Warehouse 2')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('warehouse3')
        .setLabel('Warehouse 3')
        .setStyle('SUCCESS'),
    ];

    shuffleArray(buttons);

    const row = new MessageActionRow().addComponents(buttons);

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`🚜 Forklift Game (Player: ${interaction.user.username})`)
      .setDescription(`Deliver to ${warehouses[game.warehouseNum]}!`)
      .setFooter({ text: `Points: ${game.points}` });

    await interaction.update({ embeds: [embed], components: [row] });
  } else {
    game.status = false;

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('🚜 Forklift Game')
      .setDescription(`Game Over ${interaction.user.username}! Your score is ${game.points}`)
      .setFooter({ text: `Game Over. Your score was: ${game.points}` });

    await interaction.update({ embeds: [embed], components: [] });

    updateHighScores(interaction.user.id, game.points);
    updateFoebucks(interaction.user.id, game.points);
    games.delete(interaction.user.id);
  }
};

const updateHighScores = (userId, score) => {
  let scores = JSON.parse(fs.readFileSync('./highscores.json'));
  if (!scores[userId] || scores[userId] < score) {
    scores[userId] = score;
  }
  fs.writeFileSync('./highscores.json', JSON.stringify(scores));
};

const updateFoebucks = (userId, score) => {
  if (!foebucks.has(userId)) {
    foebucks.set(userId, score);
  } else {
    const currentBalance = foebucks.get(userId);
    foebucks.set(userId, currentBalance + score);
  }

  // Update foebucks in file
  foebucksData[userId] = foebucks.get(userId);
  fs.writeFileSync('./foebucks.json', JSON.stringify(foebucksData));
};

const showHighScores = async (client, message) => {
  const data = JSON.parse(fs.readFileSync('./highscores.json', 'utf-8'));
  let entries = Object.entries(data);

  // Sort the entries by score (in descending order)
  entries.sort((a, b) => b[1] - a[1]);

  const scoreStrings = [];

  for (const [userId, score] of entries) {
    try {
      const user = await client.users.fetch(userId);
      scoreStrings.push(`${user.username}: ${score}`);
    } catch (err) {
      console.error(`Could not fetch the user with the ID ${userId}: ${err}`);
    }
  }

  const embed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('🚜 Forklift Game High Scores')
    .setDescription(scoreStrings.join('\n'))
    .setFooter({ text: 'Get back to forklifting!' });

  await message.channel.send({ embeds: [embed] });
};

const showFoebuckBalance = (message) => {
  const userId = message.author.id;
  const balance = foebucks.get(userId) || 0;

  message.reply(`Your foebuck balance is ${balance}.`);
};

const quitGame = async (message) => {
    console.log('Quit command triggered');
    const game = games.get(message.author.id);
    console.log('Game:', game);
    if (game && game.status) {
      console.log('Quitting the active game');
      game.status = false;
  
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('🚜 Forklift Game')
        .setDescription(`Game Over ${message.author.username}! You quit the game. Your score is ${game.points}`)
        .setFooter({ text: `Points: ${game.points}` });
  
      await message.channel.send({ embeds: [embed] });
  
      games.delete(message.author.id);
      console.log('Game deleted');
    } else {
      console.log('No active game to quit');
      message.reply("You don't have an active game to quit.");
    }
  };
  
  module.exports = { startGame, handleButton, showHighScores, showFoebuckBalance, quitGame };
  


