const { SlashCommandBuilder,
	PermissionFlagsBits
	} 	= require("discord.js");
const canceler 	= require("./src/cancelSchedule.js");

module.exports = {
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
		await interaction.reply(await canceler.Cancel(interaction.options.getInteger("id")));
	}
}
