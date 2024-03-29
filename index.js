const {Client, Intents, MessageEmbed, CommandInteraction, ReactionUserManager, Options} = require( 'discord.js' );
const client = new Client( {intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]} );
//const mongoose = require('mongoose')
const config = require('./config.json')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
dotenv.config()
//Start
client.on('ready', () => {
    const guild = client.guilds.resolve("712268262347374632")
    client.user.setActivity("/help", { type: 'LISTENING'})
    console.log("OK, running v1.7")
    
    const database = new MongoClient(process.env.MONGO_SRV)

    const command = require('./src/commandsBuilder')
    command(config, client, 'clearComm', 1, ' ', (message, args) => {
        if (message.author.id === config.admin) {
            guild.commands.set([])
        }
    })

    command(config, client, 'shutdown', 1, ' ', (message, args) => {
        if (message.author.id === "832731781231804447") { //IFTTT
            const testChannel = client.channels.cache.get(config.testChannel)
            testChannel.send({embeds: [new MessageEmbed().setColor('ORANGE').setTitle('Shuting down my birthplace...')]})
            const birthplace = require('./src/birthplace')
            birthplace(config, client, 'off')
        }
    })

    //Slash commands - builder
    const slashCommands = require('./src/slashCommandsBuilder')
    slashCommands(config, client)
    //Game Deals
    const gameDeals = require('./src/gameDeals')
    gameDeals(config, client, database)
    //MC Server Status
    // const mcServerStatus = require('./src/mcServerStatus')
    // mcServerStatus(config, client)
    //Role select
    const roleSelect = require('./src/roleSelect');
    roleSelect(config, client)
    //Verification
    //const verify = require('./src/verify')
    //verify(config, client)
})
//Distube - init
const { DisTube, default: dist, Song } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { VoiceConnection } = require('@discordjs/voice')
client.distube = new DisTube(client, {
    youtubeDL: false,
    leaveOnEmpty: true,
    leaveOnStop: true,
    leaveOnFinish: true,
    plugins: [new YtDlpPlugin(), new SpotifyPlugin()]
})
//Distube - music
const disTubeInfo = require('./src/distube')
disTubeInfo(config, client)
//Slash Commands - exec
const interactions = require('./src/interactions')
interactions(config, client)
//Role on join
const onJoin = require('./src/onJoin')
onJoin(config, client)
//Auth login
client.login(process.env.TOKEN)


