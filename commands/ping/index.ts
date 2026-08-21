import type { Command } from "#src/types/Command";
const { SlashCommandBuilder } = require("discord.js");

const command: Command = {
	data: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Pongを返す"),
	async execute(interaction) {
		await interaction.reply("Pong");
	}
};

module.exports = command;
