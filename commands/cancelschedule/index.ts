import type { Command } from "#src/types/Command";
const { SlashCommandBuilder,
	PermissionFlagsBits} 			= require("discord.js");
const canceler 				= require("./src/cancelSchedule");

const command: Command = {
	data: new SlashCommandBuilder()
	.setName("cancelschedule")
	.setDescription("IDを用いてスケジュールをキャンセルします")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.addIntegerOption(option => 
		option
		.setName("id")
		.setDescription("listschedule で確認できるID")
		.setRequired(true)
	),

	async execute(interaction)
	{
		await interaction.reply(await canceler.Cancel(interaction.options.getInteger("id"), interaction.guildId));
	}
}

module.exports = command;
