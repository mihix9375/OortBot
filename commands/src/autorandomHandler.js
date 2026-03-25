const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const ui = require("./autorandomUI.js");
const tempSchedule = new Map();

async function buttonHandler(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;

	let modal;
	let prog = interaction.customId.split("_").pop();
		
	if (interaction.customId.includes("autorandom_button_once"))
	{
		switch (prog)
		{
			case "0":
				modal = ui.ScheduleSetting(0);
				break;
			case "1":				
				modal = ui.RandomSetting();
				break;
			case "2":
				modal = ui.ContentSetting();
				break;
		}
	}
	else if (interaction.customId.includes("autorandom_button_repeat"))
	{
		switch (prog)
		{
			case "0":
				modal = ui.ScheduleSetting(1);
				break;
			case "1":
				modal = ui.RandomSetting();
				break;
			case "2":
				modal = ui.ContentSetting();
				break;
		}
	}	

	return modal;
}

async function modalHandler(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;

	const time = interaction.fields.getTextInputValue("input_time");
	const month = interaction.fields.getTextInputValue("input_month");
	const day = interaction.fields.getTextInputValue("input_day");

	tempSchedule.set(
		interaction.user.id,
		{
			time: time,
			month: month,
			day: day
		}
	);

	let row;
	if (interaction.customId.includes("once"))
	{
		const prevbtn = new ButtonBuilder()
		.setCustomId("autorandom_button_once_0")
		.setLabel("戻る")
		.setStyle(ButtonStyle.Primary);

		const nextbtn = new ButtonBuilder()
		.setCustomId("autorandom_button_once_1")
		.setLabel("次に進む")
		.setStyle(ButtonStyle.Success);

		row = new ActionRowBuilder().addComponents(prevbtn, nextbtn);
	}

	let contents = {
		content: "次に進んでください\n設定しなおす場合は戻るを押してください [2/3]",
		components: [row]
	};

	return contents;
}

module.exports = {
	buttonHandler,
	modalHandler
}
