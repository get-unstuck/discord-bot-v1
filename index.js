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

client.on("messageCreate", (msg) => {
	// console.log(msg)

	if (msg.author.bot) return;

	if (msg.content == "answer") {
		msg.reply("loading...");
	}
});

client.login(process.env.TOKEN);
