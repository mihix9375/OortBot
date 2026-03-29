const { SlashCommandBuilder } = require("discord.js");
const musicSelector = require("./src/musicSelector.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("random_music")
	.setDescription("条件に合わせて楽曲をランダムに選びます。（下限 ≦ x ≦ 上限)")
	.addIntegerOption(option =>
		option
		.setName("min")
		.setDescription("レベル下限")
		.setRequired(true)
		)
	.addIntegerOption(option =>
		option
		.setName("max")
		.setDescription("レベル上限")
		.setRequired(true)
		)
	.addIntegerOption(option =>
		option
		.setName("num")
		.setDescription("曲数（指定しない場合は1曲のみ選びます）")
		)
	.addIntegerOption(option =>
		option
		.setName("difficulty1")
		.setDescription("特定の難易度から選ぶための項目")
		.addChoices(
			{ name: "エキスパート", value: 0 },
			{ name: "マスター", 	value: 1 },
			{ name: "アペンド", 	value: 2 }
		))
	.addIntegerOption(option =>
		option
		.setName("difficulty2")
		.setDescription("特定の2つの難易度から選ぶための項目")
		.addChoices(
			{ name: "エキスパート",	value: 0 },
			{ name: "マスター",	value: 1 },
			{ name: "アペンド",	value: 2 }
		)),

	async execute(interaction)
	{

		var result = musicSelector.PickMusic(
			interaction.options.getInteger("min"), 
			interaction.options.getInteger("max"),
			[interaction.options.getInteger("difficulty1"), interaction.options.getInteger("difficulty2")].filter(x => x),
			interaction.client.musicData.list,
			interaction.options.getInteger("num"));
		
		if (result.length == 0)
		{
			await interaction.reply({ content: "条件に合う曲が見つかりませんでした", ephemeral: true });
			return;
		}

		let replyText = "";

		replyText += "選ばれたのは...\n\`\`\`";
		result.forEach(arr => {
			replyText += `${arr.data.title} (${arr.diff})\n`;
		});
		replyText += "\`\`\`\nです！";

		await interaction.reply(replyText);
		return;
	}
};
