const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const googleTTS = require('google-tts-api'); // CommonJS

let connection;

const handleTTS = async (message) => {
    try {
        if (message.content.startsWith('*tts')) {
            // Get the user's voice channel
            const channel = message.member?.voice.channel;
            if (channel) {
                // Generate an array of TTS audio URLs
                const text = message.content.slice(5);
                const audioUrls = googleTTS.getAllAudioUrls(text, {
                    lang: 'en',
                    slow: false,
                    host: 'https://translate.google.com',
                });

                // Create a voice connection
                connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                // Create an audio player
                const player = createAudioPlayer();

                // Subscribe the connection to the audio player
                connection.subscribe(player);

                // Function to play a list of TTS audio URLs sequentially
                const playNextTTS = async () => {
                    if (audioUrls.length === 0) {
                        // No more TTS audio URLs to play
                        return;
                    }

                    const url = audioUrls.shift().url;
                    const resource = createAudioResource(url);
                    player.play(resource);

                    // Wait for the audio player to be ready before playing audio
                    await entersState(player, AudioPlayerStatus.Playing, 5e3);

                    player.once('idle', playNextTTS);
                    player.once('error', error => {
                        console.error(`Error: ${error.message}`);
                    });
                };

                // Start playing the list of TTS audio URLs
                playNextTTS();
            } else {
                message.reply('Join a voice channel first!');
            }
        }
    } catch (error) {
        console.error(`Error in handleTTS: ${error}`);
    }
};


const handleDisconnect = (message) => {
    try {
        if (message.content.startsWith('*dc') && connection) {
            connection.destroy();
            connection = null; // Clear the connection
            message.reply('Disconnected from the voice channel.');
        }
    } catch (error) {
        console.error(`Error in handleDisconnect: ${error}`);
    }
};

module.exports = { handleTTS, handleDisconnect };
