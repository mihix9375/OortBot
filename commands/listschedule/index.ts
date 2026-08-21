const { SlashCommandBuilder,
	PermissionFlagsBits } 	= require("discord");
const handler 			= require("./src/listschedulehandler");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("listschedule")
	.setDescription("スケジュールの一覧を表示します")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async buttonHandler(interaction)
	{
		if (!interaction.customId.startsWith("listschedule_")) return;
		if (interaction.customId.split("_").pop() === "close")
		{
			await interaction.message.delete();
		}
		else
		{
			await interaction.update(await handler.buttonHandler(interaction));
		}
	},

	async execute(interaction)
	{
		await interaction.reply(await handler.first(interaction));
	}
}
