require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
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

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

const getTags = (message) => {
	let tags = [];
	message.split(" ").forEach((word) => {
		if (word.includes("#")) {
			tags.push(word);
		}
	});

	return tags.join(" ");
};

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
			if (msg.content.includes("#")) {
				const repliedToMessage = await msg.channel.messages.fetch(
					msg.reference.messageId
				);

				// Get the Tags
				const tags = getTags(msg.content);

				console.log("REPLIED ", repliedToMessage.content)
				console.log("CONTENT ", msg.content)
				console.log("TAGS ", tags)
				let tagsArr = []
				let tagsSplit = tags?.split(" ")
				for(let item of tagsSplit) {
					tagsArr.push(item.slice(1))
				}

				const { data, error, status } = await supabase
					.from("questions")
					.insert({ question: repliedToMessage.content, tags: tagsArr })
				
				console.log("Data ", data)
				console.log("ERROR ", error)
				console.log("Status ", status)

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
