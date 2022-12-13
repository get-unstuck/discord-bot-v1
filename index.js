require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { createFileAndUpload, getTags } = require('./utils/functions.js')
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
		// console.log(msg.mentions)
		if (msg.author.bot) return;

		/**
		 * Only reply when tagged
		 * Process only if it's a reply to a question
		 * Don't reply if it's replied to the bot itself
		 */

		if (
			msg.mentions.has(client.user.id) &&
			msg.reference &&
			!(msg.mentions.repliedUser.id === client.user.id)
		) {
			// Only process/add to db when tags are added
			// Reply to a question
			if (msg.content.includes("#")) {
				const repliedToMessage = await msg.channel.messages.fetch(
					msg.reference.messageId
				);
				const msgRef = await msg.channel.send("Loading...");

				// Get the Tags
				const tags = getTags(msg.content);

				console.log("REPLIED ", repliedToMessage.content);
				console.log("CONTENT ", msg.content);
				console.log("TAGS ", tags);
				let tagsArr = [];
				let tagsSplit = tags?.split(" ");
				for (let item of tagsSplit) {
					tagsArr.push(item.slice(1));
				}

				await createFileAndUpload(
					{
						question: repliedToMessage.content,
						tags: tagsArr,
						user: msg?.author?.username,
						userId: msg?.author?.id,
						questionId: msg?.id,
						questionChannelId: msg?.channelId,
						questionGuildId: msg?.guildId,
						questionTimestamp: msg?.createdTimestamp,
					},
					"question"
				);

				// msg.reply(`Question: ${repliedToMessage} \ntags: ${tags}`);
				await msgRef.delete();
				msg.reply(`Question: ${repliedToMessage} \ntags: ${tags}`);
			} else {
				msg.reply("sorry can't process this!");
			}
		}
	} catch (err) {
		console.log("ERROR ", err);
	}
});

client.login(process.env.TOKEN);
