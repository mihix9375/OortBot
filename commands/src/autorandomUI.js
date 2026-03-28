const { 
	ModalBuilder, 
	TextInputBuilder, 
	TextInputStyle, 
	ActionRowBuilder, 
	LabelBuilder, 
	StringSelectMenuBuilder, 
	StringSelectMenuOptionBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	ButtonBuilder,
	ButtonStyle
	} = require("discord.js");

const schedule_once = new ButtonBuilder()
.setCustomId("autorandom_button_once_1")
.setLabel("日時")
.setStyle(ButtonStyle.Primary);

const schedule_repeat = new ButtonBuilder()
.setCustomId("autorandom_button_repeat_1")
.setLabel("日時")
.setStyle(ButtonStyle.Primary);

const random = new ButtonBuilder()
.setCustomId("autorandom_button_2")
.setLabel("選曲条件")
.setStyle(ButtonStyle.Primary);

const content = new ButtonBuilder()
.setCustomId("autorandom_button_3")
.setLabel("メッセージ設定")
.setStyle(ButtonStyle.Primary);

const submit = new ButtonBuilder()
.setCustomId("autorandom_button_submit")
.setLabel("決定")
.setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder()
.addComponents(random, content);

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
		.setPlaceholder("例(16時5分の場合): 16/05") 
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
		.setMaxLength(5)
		.setMinLength(5);

		const monthInput = new TextInputBuilder()
		.setCustomId("input_month")
		.setLabel("送信する月(任意)")
		.setPlaceholder("例(5月の場合): 05")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2)
		.setMinLength(2);

		const dayInput = new TextInputBuilder()
		.setCustomId("input_day")
		.setLabel("送信する日(任意)")
		.setPlaceholder("例(8日の場合): 08")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2)
		.setMinLength(2);

		modal.addComponents(
			new ActionRowBuilder().addComponents(timeInput),
			new ActionRowBuilder().addComponents(monthInput),
			new ActionRowBuilder().addComponents(dayInput)
		)

		return modal;
	}
	else if (num === 1)
	{
		const modal = new ModalBuilder()
		.setCustomId("autorandom_modal_repeat_1")
		.setTitle("スケジュール設定");

		const timeInput = new TextInputBuilder()
		.setCustomId("input_time")
		.setLabel("送信する時刻(hh/mm)")
		.setPlaceholder("例(16時5分の場合): 16/05") 
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
		.setMaxLength(5)
		.setMinLength(5);

		const monthInput = new TextInputBuilder()
		.setCustomId("input_month")
		.setLabel("送信する月(任意)")
		.setPlaceholder("例(5月の場合): 05")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2)
		.setMinLength(2);

		const dayInput = new TextInputBuilder()
		.setCustomId("input_day")
		.setLabel("送信する日(任意)")
		.setPlaceholder("例(8日の場合): 08")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(2)
		.setMinLength(2);

		const interval = new TextInputBuilder()
		.setCustomId("input_interval")
		.setLabel("繰り返す間隔(dd/hh/mm)")
		.setPlaceholder("例(5日と3時間10分ごとの場合): 05/03/10")
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
		.setMaxLength(8)
		.setMinLength(8);

		const startDay = new TextInputBuilder()
		.setCustomId("input_start")
		.setLabel("開始する日時(yyyy/mm/dd/hh/mm)(任意)")
		.setPlaceholder("例(2026年5月8日10時30分から始める場合): 2026/05/08/10/30")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
		.setMaxLength(16)
		.setMinLength(16);

		modal.addComponents(
			new ActionRowBuilder().addComponents(timeInput),
			new ActionRowBuilder().addComponents(monthInput),
			new ActionRowBuilder().addComponents(dayInput),
			new ActionRowBuilder().addComponents(interval),
			new ActionRowBuilder().addComponents(startDay)
		);

		return modal;
	}
}

function RandomSetting()
{
	const modal = new ModalBuilder()
	.setCustomId("autorandom_modal_2")
	.setTitle("ランダム選曲設定");

	const range = new TextInputBuilder()
	.setCustomId("input_range")
	.setPlaceholder("例(20以上30以下の場合): 20/30")
	.setRequired(true)
	.setStyle(TextInputStyle.Short)
	.setMaxLength(5)
	.setMinLength(5);

	const num = new TextInputBuilder()
	.setCustomId("input_num")
	.setPlaceholder("例(3曲の場合): 3")
	.setRequired(false)
	.setStyle(TextInputStyle.Short)
	.setMaxLength(2);

	const difficulty1 = new StringSelectMenuBuilder()
	.setCustomId("input_difficulty1")
	.setPlaceholder("特定の難易度から選ぶときに設定して下さい")
	.setRequired(false)
	.setOptions(
		new StringSelectMenuOptionBuilder()
		.setLabel("EXPERT")
		.setValue("0"),

		new StringSelectMenuOptionBuilder()
		.setLabel("MASTER")
		.setValue("1"),

		new StringSelectMenuOptionBuilder()
		.setLabel("APPEND")
		.setValue("2")
	);

	const difficulty2 = new StringSelectMenuBuilder()
	.setCustomId("input_difficulty2")
	.setPlaceholder("前項目に加えて特定の難易度から選ぶときに設定して下さい")
	.setRequired(false)
	.setOptions(
		new StringSelectMenuOptionBuilder()
		.setLabel("EXPERT")
		.setValue("0"),

		new StringSelectMenuOptionBuilder()
		.setLabel("MASTER")
		.setValue("1"),

		new StringSelectMenuOptionBuilder()
		.setLabel("APPEND")
		.setValue("2")
	);

	const rangeLabel = new LabelBuilder()
	.setLabel("レベル範囲(min/max)")
	.setTextInputComponent(range);

	const numLabel = new LabelBuilder()
	.setLabel("曲数(任意)")
	.setTextInputComponent(num);

	const diff1Label = new LabelBuilder()
	.setLabel("難易度設定(任意)")
	.setStringSelectMenuComponent(difficulty1);

	const diff2Label = new LabelBuilder()
	.setLabel("追加の難易度設定(任意)")
	.setStringSelectMenuComponent(difficulty2);

	modal.addLabelComponents(
		rangeLabel,
		numLabel,
		diff1Label,
		diff2Label
	)

	return modal;
}

function ContentSetting()
{
	const modal = new ModalBuilder()
	.setCustomId("autorandom_modal_repeat_3")
	.setTitle("メッセージ設定")

	const channelSelect = new ChannelSelectMenuBuilder()
	.setCustomId("input_channel")
	.setPlaceholder("送信するチャンネルを選択してください")
	.setRequired(true)
	.addChannelTypes(ChannelType.GuildText);

	const message = new TextInputBuilder()
	.setCustomId("input_message")
	.setPlaceholder("選ばれた曲を入れたい場所に/music/をいれてください")
	.setRequired(true)
	.setMaxLength(1_000)
	.setStyle(TextInputStyle.Paragraph);

	const channelLabel = new LabelBuilder()
	.setLabel("送信先チャンネル")
	.setChannelSelectMenuComponent(channelSelect);

	const messageLabel = new LabelBuilder()
	.setLabel("送信メッセージ")
	.setTextInputComponent(message);

	modal.addLabelComponents(channelLabel, messageLabel);

	return modal;
}

module.exports = {
	ScheduleSetting,
	RandomSetting,
	ContentSetting,
	row,
	schedule_once,
	schedule_repeat,
	submit
}
