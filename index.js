const download                                                      = require("./src/downloadDatas.js");
const create_table                                                  = require("./src/createTable.js");
const fs 															= require("node:fs");
const path 															= require("node:path");
const { Client, GatewayIntentBits, Collection, InteractionType } = require("discord.js");
const { token } 													= require("./config.json");
const checkSchedule 												= require("./src/checkSchedule.js");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
	]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	if (!fs.statSync(folderPath).isDirectory()) continue;

	const command = require(folderPath);

	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.warn(`${folderPath} にdataかexecuteが含まれていません。`);
	}
}
console.log(`${client.commands.size}個のコマンドを読み込みました。`);

client.on("interactionCreate", async interaction => {

	if (!interaction.isChatInputCommand() && !interaction.isAutocomplete() && !interaction.isButton() && !interaction.isModalSubmit()) return;

	let targetCommandName = "";

	if (interaction.isChatInputCommand() || interaction.isAutocomplete())
	{
		targetCommandName = interaction.commandName;
	}
	else if (interaction.isButton() || interaction.isModalSubmit())
	{
		targetCommandName = interaction.customId.split("_")[0];
	}

	const command = interaction.client.commands.get(targetCommandName);

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
		else if (interaction.isButton())
		{
			await command.buttonHandler(interaction);
		}
		else if (interaction.type === InteractionType.ModalSubmit)
		{
			await command.modalHandler(interaction);
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


client.once("ready", async () => {
	console.log(`${client.user.tag} でログインしています。`);
    download.fetchMusicData();
    download.set_schedule();
    await checkSchedule.CheckSchedule(client);
});

client.login(token);
