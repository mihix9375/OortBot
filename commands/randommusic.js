const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("random_music")
	.setDescription("条件に合わせて楽曲をランダムに選びます。（下限 ≦ x ≦ 上限）\n" +
			"下限, 上限が最低要項です。難易度は絶対ではありません。\n" +
			"難易度を設定しない場合は自動的にすべての難易度から選びます。")
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
		.setName("difficulty1")
		.setDescription("特定の難易度から選ぶための項目")
		.addChoices(
			{ name: "エキスパート", value: 1 },
			{ name: "マスター", 	value: 2 },
			{ name: "アペンド", 	value: 3 }
		))
	.addIntegerOption(option =>
		option
		.setName("difficulty2")
		.setDescription("特定の2つの難易度から選ぶための項目")
		.addChoices(
			{ name: "エキスパート",	value: 1 },
			{ name: "マスター",	value: 2 },
			{ name: "アペンド",	value: 3 }
		))

	async execute(interaction)
	{
		
	}
