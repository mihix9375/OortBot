const { SlashCommandBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
	}		= 	require("discord.js");
const randommusic 	=	require("./src/musicSelector.js");
const handler		=	require("./src/autorandomHandler.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("autorandom")
	.setDescription("自動でランダム選曲を実行します")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async buttonHandler(interaction)
	{
		await interaction.showModal(await handler.buttonHandler(interaction));
	},

	async modalHandler(interaction)
	{
		await interaction.update(await handler.modalHandler(interaction));
	},

	async execute(interaction)
	{
		const onceButton = new ButtonBuilder()
		.setCustomId("autorandom_button_once_0")
		.setLabel("１回きり")
		.setStyle(ButtonStyle.Primary);

		const repeatButton = new ButtonBuilder()
		.setCustomId("autorandom_button_repeat_0")
		.setLabel("繰り返し")
		.setStyle(ButtonStyle.Success);

		const row = new ActionRowBuilder()
		.addComponents(onceButton, repeatButton);
		
		await interaction.reply({
			content: "1度きりか複数回繰り返すか選んでください [1/3]",
			components: [row],
			ephemeral: true
		});
	}
}
				
