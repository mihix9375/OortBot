const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const fs 		= require("node:fs");
const processor 	= require("./autorandomProcessor.js");
const ui		= require("./autorandomUI.js");
const inserter 		= require("./insertData.js");
const tempData 		= new Map();
const button 		= new Map();
const progressData 	= new Map();

async function buttonHandlerFirst(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;

	let contents;
	let isRepeat;
	if (interaction.customId.includes("once"))
	{
		const row = new ActionRowBuilder()
		.addComponents(ui.schedule_once, ...ui.row.components);

		contents = {
			content: "日時: 未設定\n選曲条件: 未設定\nメッセージ設定: 未設定",
			components: [row]
		}

		isRepeat = false;
	}
	else if (interaction.customId.includes("repeat"))
	{
		const row = new ActionRowBuilder()
		.addComponents(ui.schedule_repeat, ...ui.row.components);

		contents = {
			content: "日時: 未設定\n選曲条件: 未設定\nメッセージ設定: 未設定",
			components: [row]
		}

		isRepeat = true;
	}

	progressData.set(interaction.user.id, {
		prog: [false, false, false]
	});

	tempData.set(interaction.user.id, {
		schedule: null,
		random: null,
		content: null,
		isRepeat: isRepeat
	});

	return contents;
}

async function buttonHandler(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;

	let modal;
	let seq = interaction.customId.split("_").pop();
		
	if (interaction.customId.includes("once") && seq === "1")
	{
		modal = ui.ScheduleSetting(0);
	}
	else if (interaction.customId.includes("repeat") && seq === "1")
	{
		modal = ui.ScheduleSetting(1);
	}	
	else if (seq === "2")
	{
		modal = ui.RandomSetting();
	}
	else if (seq === "3")
	{
		modal = ui.ContentSetting();
	}

	return modal;
}

async function buttonHandlerLast(interaction)
{
	const user_id = interaction.user.id;
	const [suc, id] = await inserter.ParseData(tempData.get(user_id), interaction.client);
	
	if (suc)
	{
		contents = {
			content: "正常に終了しました"
		};
	}
	else
	{
		contents = {
			content: "正常に終了しませんでした"
		};
	}

	delete tempData.user_id;

	return contents;
}

async function modalHandler(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;
	
	const seq = interaction.customId.split("_").pop();
	const progress = progressData.get(interaction.user.id);
	const temp = tempData.get(interaction.user.id);
	const row = new ActionRowBuilder();

	if (interaction.customId.includes("once") && seq === "1")
	{
		[temp.schedule, progress.prog[0]] = await processor.ScheduleSettingProcess(interaction, false, progress.prog);
	}
	else if (interaction.customId.includes("repeat") && seq === "1")
	{
		[temp.schedule, progress.prog[0]] = await processor.ScheduleSettingProcess(interaction, true);
	
	}
	else if (seq === "2")
	{
		[temp.random, progress.prog[1]] = await processor.RandomSettingProcess(interaction);
	}
	else if (seq === "3")
	{
		[temp.content, progress.prog[2]] = await processor.ContentSettingProcess(interaction);
	}
	
	if (temp.isRepeat)
	{
		row.setComponents(ui.schedule_repeat, ...ui.row.components);
	}
	else if (!temp.isRepeat)
	{
		row.setComponents(ui.schedule_once, ...ui.row.components);
	}	

	let content = "日時: ";
	
	if (progress.prog[0])
	{
		content += "設定済み\n";
	}
	else 
	{
		content += "未設定\n";
	}

	content += "選曲条件: "

	if (progress.prog[1])
	{
		content += "設定済み\n";
	}
	else
	{
		content += "未設定\n";
	}

	content += "メッセージ設定: "

	if (progress.prog[2])
	{
		content += "設定済み\n";
	}
	else
	{
		content += "未設定";
	}

	let components;
	if (progress.prog[0] && progress.prog[1] && progress.prog[2])
	{
		row.setComponents(...row.components, ui.submit);
	}

	let contents = {
		content: content,
		components: [row]
	};

	return contents;
}

module.exports = {
	buttonHandlerFirst,
	buttonHandler,
	buttonHandlerLast,
	modalHandler
}
