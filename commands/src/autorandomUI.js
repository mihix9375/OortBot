const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

function ScheduleSetting(num)
{
	if (num === 0)
	{
		const modal = new ModalBuilder()
		.setCustomId("autorandom_modal_once_1")
		.setTitle("スケジュールを設定します");

		const timeInput = new TextInputBuilder()
		.setCustomId("input_time")
		.setLabel("送信する時刻")
		.setPlaceholder("例(16時5分の場合): 1605") 
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
		.setMaxLength(4)
		.setMinLength(4);

		const monthInput = new TextInputBuilder()
		.setCustomId("input_month")
		.setLabel("送信する月(任意)")
		.setPlaceholder("例(5月の場合): 5")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2);

		const dayInput = new TextInputBuilder()
		.setCustomId("input_day")
		.setLabel("送信する日(任意)")
		.setPlaceholder("例(8日の場合): 8")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2);

		modal.addComponents(
			new ActionRowBuilder().addComponents(timeInput),
			new ActionRowBuilder().addComponents(monthInput),
			new ActionRowBuilder().addComponents(dayInput)
		)

		return modal;
	}
}

module.exports = {
	ScheduleSetting
}
