require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
// const Intents = new Discord.Intents()
// const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
// console.log(GatewayIntentBits)
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on("ready", () => {
	console.log(`Bot is online ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
    try {
        // console.log(msg)
        if (msg.author.bot) return;

        // Only reply when tagged
        if(msg.mentions.has(client.user.id)) {
            // Only process/add to db when tags are added
            if (msg.content.includes('#')) {
                const repliedToMessage = await msg.channel.messages.fetch(msg.reference.messageId)
                let messageReply = []
        
                const tagsMessages = msg.content
                tagsMessages.split(" ").forEach((word) => {
                    if(word.includes("#")) {
                        messageReply.push(word)
                    }
                })
        
                msg.reply(`Question: ${repliedToMessage} \ntags: ${messageReply.join(" ")}`)
        
            } else {
                msg.reply("sorry can't process this!");
            }
        }
    } catch(err) {
        console.log("ERROR ", err)
    }
});

client.login(process.env.TOKEN);
