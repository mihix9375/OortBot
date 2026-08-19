const { SlashCommandBuilder,
        EmbedBuilder
        }   = require("discord.js");
const table                     = require("#src/createTable.js");
const DataBase                  = require("better-sqlite3");
const path                      = require("node:path");

const db       = new DataBase(path.join(table.dataDir, "musics.sqlite"));

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
		const musicList = db.prepare("SELECT * FROM musics").all();
		const focusedValue = interaction.options.getFocused();

		const choices = musicList
		.filter(music => music.title.toLowerCase().startsWith(focusedValue.toLowerCase()))
		.slice(0, 25);

		await interaction.respond(
			choices.map(choice => ({
				name: choice.title,
				value: String(choice.id),
			}))
		);
	},

	async execute(interaction)
	{
		const selectedMusicId = Number(interaction.options.getString("musicname"));

		const musicData = db.prepare("SELECT * FROM musics WHERE id = ?").get(selectedMusicId);

		if (!musicData)
		{
			await interaction.reply({ content: "その楽曲は見つかりませんでした。リストから正しく選択して下さい。", ephemeral: true });
			return;
		}
		
        const embed = new EmbedBuilder()
            .setTitle(musicData.title)
            .addFields(
                {
                    name: "EXPERT",
                    value: `Lv **${musicData.expertLevel}**\n(Combo: ${musicData.expertCombo})\n`,
                    inline: true
                },
                {
			        name: "MASTER",
                    value: `Lv **${musicData.masterLevel}**\n(Combo: ${musicData.masterCombo})\n`,
                    inline: true
                },
                {
			        name: "APPENT",
                    value: `Lv: **${musicData.appendLevel}**\n(Combo: ${musicData.appendCombo})\n`,
                    inline: true
                },
                {
			        name: "BPM",
                    value: `${musicData.bpm}`,
                    inline: true
                },
                {
			        name: "収録時間",
                    value: `${musicData.duration}`,
                    inline: true
                }
            );

		await interaction.reply({embeds: [embed]});
	},
};
