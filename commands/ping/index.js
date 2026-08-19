const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Pongを返す"),
	async execute(interaction) {
		await interaction.reply("Pong");
	},
};
