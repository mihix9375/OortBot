require("date-utils");

const { ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	ButtonStyle
}		= require("discord.js");
const table 	= require("../../src/createTable.js");
const diffMap = { "0": "EXPERT", "1": "MASTER", "2": "APPEND" };

async function first(interaction)
{
	const embed = new EmbedBuilder()
	.setTitle("スケジュール一覧")
	const schedules = table.db.prepare("SELECT * FROM schedules").all();
	
	if (schedules.length > 0)
	{
		const row 	= rowBuilder(1, schedules.length);
		const content 	= contentBuilder(schedules[0]);
	
		embed.addFields(content);

		return { embeds: [embed], components: [row] };
	}
	
	embed.addFields({
		name: "\u200B",
		value: "ここには何もないようです :("
	});

	return { embeds: [embed] };
}

async function buttonHandler(interaction)
{
	const embed = new EmbedBuilder()
	.setTitle("スケジュール一覧")
	const schedules = table.db.prepare("SELECT * FROM schedules").all();
	const currentIndex = Number(interaction.customId.split("_").pop());
	
	if (schedules.length > 0)
	{
		const row 	= rowBuilder(currentIndex, schedules.length);
		const content 	= contentBuilder(schedules[currentIndex - 1]);
	
		embed.addFields(content);

		return { embeds: [embed], components: [row] };
	}
	
	embed.addFields({
		name: "\u200B",
		value: "ここには何もないようです :("
	});

	return { embeds: [embed] };
}

function rowBuilder(currentIndex, maxIndex)
{
	const prog = new ButtonBuilder()
	.setCustomId("listschedule_prog")
	.setLabel(`${currentIndex} / ${maxIndex}`)
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);

	const next = new ButtonBuilder()
	.setCustomId(`listschedule_${currentIndex + 1}`)
	.setLabel("->")
	.setStyle(ButtonStyle.Primary)
	.setDisabled(currentIndex === maxIndex);

	const prev = new ButtonBuilder()
	.setCustomId(`listschedule_${currentIndex - 1}`)
	.setLabel("<-")
	.setStyle(ButtonStyle.Primary)
	.setDisabled(currentIndex === 1);

	const reload = new ButtonBuilder()
	.setCustomId("listschedule_reload")
	.setLabel("↺")
	.setStyle(ButtonStyle.Success)

	const close = new ButtonBuilder()
	.setCustomId("listschedule_close")
	.setLabel("×")
	.setStyle(ButtonStyle.Danger)

	return new ActionRowBuilder().addComponents(prev, prog, next, reload, close);
}

function contentBuilder(task)
{
	const randomSettings = task.random_setting.split("/");
	const message = task.message.replace("/music/", task.musics);

	return {
		name: "\u200B",
		value: 
		`**ID:** \`${task.id}\`\n\n` +
		`## スケジュール\n` +
		`- 繰り返し: 	${task.is_repeat == 1 ? "ON" : "OFF"}\n` +
		`- 実行日時: 	${new Date(task.target).toFormat("YYYY年MM月DD日HH24時MI分")}\n` +
		`- 開始: 	${task.start == 0 ? "-" : new Date(task.start).toFormat("YYYY年MM月DD日HH24時MI分")}\n` +
		`- 間隔: 	${task.interval == 0 ? "-" : String(Math.floor(task.interval / 86400000)) + "日" + 
				String(Math.floor((task.interval % 86400000) / 3600000)) + "時間" + 
				String(Math.floor((task.interval % 3600000) / 60000)) + "分"}\n\n` +
		`## 選曲条件\n` +
		`- レベル: 	${randomSettings[1]} ~ ${randomSettings[0]}\n` +
		`- 難易度: 	${diffMap[randomSettings[3]] || "-"}, ${diffMap[randomSettings[4]] || "-"}\n` +
		`- 曲数:	${randomSettings[2]}\n\n` +
		`## コンテンツ\n\n` +
		`${message}`
	};
}

module.exports = {
	first,
	buttonHandler
};
