const fs 					= require("node:fs");
const path 					= require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { token } 				= require("./config.json");
const musicList 				= require('./data/Musics.json');
const client = new Client({
	intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
console.log(commandFiles);

client.musicData = {
	list: 		musicList,
	idMap: 		new Map(musicList.map(music => [music.id, 		music])),
	titleMap:	new Map(musicList.map(music => [music.title, 		music])),
};

console.log(`♪ ${musicList.length} 曲を読み込みました。`);

for (const file of commandFiles)
{
	const filePath 	= path.join(commandsPath, file);
	const command 	= require(filePath);

	if ("data" in command && "execute" in command)
	{
		client.commands.set(command.data.name, command);
	}
	else
	{
		console.warn(`${filePath} にdataかexecuteが含まれていません。`);
	}
}

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`${interaction.commandName} が見つかりません。`);
		return;
	}

	try
	{
		if (interaction.isAutocomplete())
		{
			if (command.autocomplete)
			{
				await command.autocomplete(interaction);
			}
		}
		else if (interaction.isChatInputCommand())
		{
			await command.execute(interaction);
		}
	}
	catch (error)
	{
		console.error(error);
		await interaction.reply({ content : "エラーが発生しました", ephemeral: true});
	}
});


client.on("ready", () => {
	console.log(`${client.user.tag} でログインしています。`);
});

client.login(token);
