require("date-utils");

const {ButtonBuiler, ButtonStyle, ActionRowBuilder } = require("discord.js");

async function ScheduleSettingProcess(interaction, isRepeat)
{
	const date = new Date();

	if (!interaction.customId.startsWith("autorandom_")) return;

	let scheduleData = new Map();
	if (isRepeat)
	{
		const time = interaction.fields.getTextInputValue("input_time");
		const interval = interaction.fields.getTextInputValue("input_interval");
		let month = interaction.fields.getTextInputValue("input_month");
		let day = interaction.fields.getTextInputValue("input_day");
		let start = interaction.fields.getTextInputValue("input_start");

		if (month === "")
		{
			month = date.toFormat("MM");
		}
		
		if (day === "")
		{
			day = date.toFormat("DD");
		}

		if (start === "")
		{
			start = date.toFormat("YYYY/MM/DD/HH24/MI");
		}

		scheduleData = {
			time: time,
			month: month,
			day: day,
			interval: interval,
			start: start
		};
	}
	else
	{
		const time = interaction.fields.getTextInputValue("input_time");
		let month = interaction.fields.getTextInputValue("input_month");
		let day = interaction.fields.getTextInputValue("input_day");

		if (month === "")
		{
			month = date.toFormat("MM");
		}
		
		if (day === "")
		{
			day = date.toFormat("DD");
		}

		scheduleData = {
			time: time,
			month: month,
			day: day
		};
	}

	return [scheduleData, true];
}

async function RandomSettingProcess(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;
	
	const range = interaction.fields.getTextInputValue("input_range");
	const num = interaction.fields.getTextInputValue("input_num") || "1";
	const difficulty1 = interaction.fields.getStringSelectValues("input_difficulty1");
	const difficulty2 = interaction.fields.getStringSelectValues("input_difficulty2");

	const randomData = {
		range: range,
		num: num,
		difficulty1: difficulty1,
		difficulty2: difficulty2
	};

	return [randomData, true];
}

async function ContentSettingProcess(interaction)
{
	if (!interaction.customId.startsWith("autorandom_")) return;

	const channelField = interaction.fields.getField("input_channel");
	const channel = channelField.values[0];
	let message = interaction.fields.getTextInputValue("input_message");

	try {
		const mentionField = interaction.fields.getField("input_mention");
		const mention = mentionField?.values[0] || null;

		if (mention)
		{
			const isRole = interaction.guild.roles.cache.has(mention);

			if (isRole)
			{
				mentionText = `<@&${mention}>\n`;
			}
			else
			{
				mentionText = `<@${mention}>\n`;
			}
		
			message = mentionText + message;
		}
	}
	catch (error)
	{
	}

	const contentData = {
		channel: channel,
		message: message
	};

	return [contentData,true];
}

module.exports = {
	ScheduleSettingProcess,
	RandomSettingProcess,
	ContentSettingProcess
}
