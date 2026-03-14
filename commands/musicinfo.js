const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName("musicinfo")
	.setDescription("楽曲の情報を表示します。")
	.addStringOption(option => 
		option.setName("musicname")
		.setDescription("曲名を入力してください")
		.setRequired(true)
		.setAutocomplete(true)
	),

	async autocomplete(interaction)
	{
		const musicList = interaction.client.musicData.list;
		const focusedValue = interaction.options.getFocused();

		const choices = musicList
		.filter(music => music.title.toLowerCase().startsWith(focusedValue.toLowerCase()))
		.slice(0, 25);

		await interaction.respond(
			choices.map(choice => ({
				name: choice.title,
				value: choice.id,
			}))
		);
	},

	async execute(interaction)
	{
		const musicIdMap = interaction.client.musicData.idMap;

		const selectedMusicId = interaction.options.getString("musicname");

		const musicData = musicIdMap.get(selectedMusicId);

		if (!musicData)
		{
			await interaction.reply({ content: "その楽曲は見つかりませんでした。リストから正しく選択して下さい。", ephemeral: true });
			return;
		}
		
		await interaction.reply(
			`曲名: **${musicData.title}**\n` +
			`ID: \`${musicData.id}\`\n` +
			`EXPERTレベル: **${musicData.expertLevel}** (コンボ数: ${musicData.expertCombo})\n` +
			`MASTERレベル: **${musicData.masterLevel}** (コンボ数: ${musicData.masterCombo})\n` +
			`APPENTレベル: **${musicData.appendLevel}** (コンボ数: ${musicData.appendCombo})\n` +
			`BPM: ${musicData.bpm}\n` +
			`収録時間: ${musicData.duration}`
		);
	},
};
