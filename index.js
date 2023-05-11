const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const queues = new Map();

const playSong = async (queue, connection) => {
    const song = queue[0];
    if (song) {
        const stream = ytdl(song, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        const player = createAudioPlayer();
        
        player.play(resource);
        
        player.on(AudioPlayerStatus.Idle, () => {
            queue.shift();
            playSong(queue, connection);
        });
        
        try {
            await entersState(player, AudioPlayerStatus.Playing, 5e3);
            connection.subscribe(player);
        } catch (error) {
            console.error(error);
        }
    } else {
        connection.destroy();
    }
};

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const args = message.content.split(' ');
    const command = args[0];
    const url = args[1];

    if (command === '!play') {
        if (message.member.voice.channel) {
            const channel = message.member.voice.channel;
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            let queue = queues.get(message.guild.id);
            if (queue) {
                queue.push(url);
            } else {
                queue = [url];
                queues.set(message.guild.id, queue);
            }

            connection.on(VoiceConnectionStatus.Ready, async () => {
                playSong(queue, connection);
            });
        } else {
            message.reply('You need to join a voice channel first!');
        }
    } else if (command === '!list') {
        const queue = queues.get(message.guild.id);
        if (!queue) {
            message.reply('The queue is currently empty!');
        } else {
            let reply = 'Current queue:\n';
            queue.forEach((song, index) => {
                reply += `${index + 1}. ${song}\n`;
            });
            message.reply(reply);
        }
    } else if (command === '!skip') {
        const queue = queues.get(message.guild.id);
        if (!queue) {
            message.reply('There is no song to skip!');
        } else {
            queue.shift();
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.member.voice.channel.guild.id,
                adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
            });
            playSong(queue, connection);
            message.reply('Skipped the current song!');
        }
    }
});

client.login('ODU0MTcyNjAzNjU1NzgyNDMw.Gg4Qse.zlzMkXwc9cZWYrVRVDj8XimWIi25mIEfHSU9cQ');
