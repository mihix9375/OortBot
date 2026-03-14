const { REST, Routes } = require("discord.js");
const { clientId, token } = require("./../config.json");
const fs = require("node:fs");
const rest = new REST({ version: "10" }).setToken(token);
const args = process.argv.slice(2);
const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles)
{
	const command = require(`./../commands/${file}`);
	commands.push(command.data.toJSON());
}

if (args[0] == 1) {
	(async () => {
		try {
			console.log("コマンドを削除しています。");
			await rest.put(Routes.applicationCommands(clientId), { body: [] });
			console.log("コマンドを削除しました。");
			console.log(`${commands.length} 個のコマンドを登録します。`);
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
			console.log(`${data.length} 個のコマンドを登録しました。`);
		}
		catch (error) {
			console.error(error);
		}
	})();
}
else if (args[0] == 0) return;
else return;