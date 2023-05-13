const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');


const playSong = async (guildId, queues, players, connections) => {
    const queue = queues.get(guildId);
    const player = players.get(guildId);

    if (!queue || !queue.length) {
        const connection = connections.get(guildId);
        connection.destroy();
        connections.delete(guildId);
        players.delete(guildId);
        return;
    }

    const song = queue[0];
    const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1<<25 }); // Buffer size increased
    const resource = createAudioResource(stream);

    player.play(resource);
    player.once(AudioPlayerStatus.Idle, () => {
        queue.shift();
        playSong(guildId, queues, players, connections);
    });
    player.once('error', error => console.error(`Error: ${error.message}`));
};

const handlePlay = async (message, args, queues, connections, players) => {
    if (message.member.voice.channel) {
        const channel = message.member.voice.channel;
        const url = args[0];

        let connection = connections.get(message.guild.id);
        if (!connection) {
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            connections.set(message.guild.id, connection);
        }

        let player = players.get(message.guild.id);
        if (!player) {
            player = createAudioPlayer();
            players.set(message.guild.id, player);
            connection.subscribe(player);
        }

        let queue = queues.get(message.guild.id);
        if (!queue) {
            queue = [];
            queues.set(message.guild.id, queue);
        }
        try {
            const info = await ytdl.getInfo(url);
            queue.push({ url: url, title: info.videoDetails.title });
            message.reply(`Added to queue: ${info.videoDetails.title}`);
        } catch (error) {
            console.error(`Error fetching video info: ${error}`);
            return;
        }

        if (queue.length === 1) {
            playSong(message.guild.id, queues, players, connections);
        }
    } else {
        message.reply('You need to join a voice channel first!');
    }
};

const handleList = (message, queues) => {
    const queue = queues.get(message.guild.id);
    if (!queue || !queue.length) {
        message.reply('The queue is currently empty!');
    } else {
        const embed = new MessageEmbed()
        .setColor('#ffff00')
        .setTitle('Current Queue')
        .setDescription(queue.map((song, index) => `${index + 1}. [${song.title}](${song.url})`).join('\n'));
        message.channel.send({ embeds: [embed] });
    }
};

const handleSkip = (message, queues, players) => {
    const queue = queues.get(message.guild.id);
    if (!queue || !queue.length) {
        message.reply('There is no song to skip!');
    } else {
        queue.shift();
        playSong(message.guild.id, queues, players);
        message.reply('Skipped the current song!');
    }
};

module.exports = { handlePlay, handleList, handleSkip };
