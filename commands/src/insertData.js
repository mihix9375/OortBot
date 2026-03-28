require("date-utils");

const selector = require("./musicSelector.js");
const table = require("../../src/createTable.js");
const runSchedule = require("./runSchedule.js");
const musicData = require("../../data/Musics.json");

async function ParseData(data, interaction)
{
	const date = new Date();
	const id = date.toFormat("YYYYMMDDHH24MISS");
	const yearNow = date.toFormat("YYYY");
	let parsedData = {
		id: id,
		user_id: interaction.user.id
	};

	if (data.isRepeat)
	{
		const time = data.schedule.time;
		const month = data.schedule.month;
		const day = data.schedule.day;
		const interval = data.schedule.interval;
		const start = data.schedule.start;

		let splitTime;
		let splitInterval;
		let splitStart;

		try
		{
			splitTime = time.split("/");
			splitInterval = interval.split("/");
			splitStart = start.split("/");
		}
		catch (error)
		{
			console.warn(error);
			return;
		}

		for (let i = 0; i < splitInterval.length; i++)
		{
			splitInterval[i] = Number(splitInterval[i]);
		}
		
		let targetMs = Date.parse(`${yearNow}-${month}-${day}T${splitTime[0]}:${splitTime[1]}:00`);
		const startMs = Date.parse(`${splitStart[0]}-${splitStart[1]}-${splitStart[2]}T${splitStart[3]}:${splitStart[4]}:00`);
		const intervalMs = 86400000 * Number(splitInterval[0]) + 3600000 * Number(splitInterval[1]) + 60000 * Number(splitInterval[2]);

		if (startMs > targetMs)
		{
			const count = Math.floor((startMs - targetMs - 1) / intervalMs) + 1; 
			targetMs = targetMs + (count * intervalMs);
		}

		parsedData.type = "repeat";
		parsedData.target = targetMs;
		parsedData.start = startMs;
		parsedData.interval = intervalMs;
		parsedData.current = Date.now();
	}
	else
	{
		const time = data.schedule.time;
		const month = data.schedule.month;
		const day = data.schedule.day;

		let splitTime;

		try {
			splitTime = time.split("/");
		}
		catch (error)
		{
			console.warn(error);
			return;
		}

		const target = Date.parse(`${yearNow}-${month}-${day}T${splitTime[0]}:${splitTime[1]}:00`);

		parsedData.type = "once";
		parsedData.target = target;
		parsedData.current = Date.now();
	}

	const range = data.random.range;
	const num = Number(data.random.num);
	const diff = [data.random.difficulty1, data.random.difficulty2].flat().filter(x => x);
	const max = Number(range.split("/")[1]);
	const min = Number(range.split("/")[0]);

	const musics = selector.PickMusic(min, max, diff, musicData, num);
	
	let text = "\`\`\`";
	musics.forEach(music => {
		text += `${music.data.title} (${music.diff})\n`;
	});
	text += "\`\`\`";

	const channelId = data.content.channel;
	let message = data.content.message;

	parsedData.channel = channelId;
	parsedData.message = message;
	parsedData.random_setting = `${max}/${min}/${num}/${data.random.difficulty1}/${data.random.difficulty2}`;
	parsedData.musics = text;

	if (await InsertData(parsedData))
	{
		await runSchedule.RunSchedule(interaction, id);
		return [true, id];
	}

	return [false, id];
}

async function InsertData(data)
{
	try {
		const type = data.type === "repeat" ? 1 : 0;
		const interval = data.interval || 0;
		const start = data.start || 0;

		const insert = table.db.prepare(`
		INSERT INTO schedules (id, user_id, is_repeat, current, start, target, interval, channel_id, random_setting, musics, message)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		insert.run(
			data.id,
			data.user_id,
			type,
			data.current,
			start,
			data.target,
			interval,
			data.channel,
			data.random_setting,
			data.musics,
			data.message
		);
	}
	catch (error)
	{
		console.warn(error);
		return false;
	}

	return true;
}

module.exports = {
	ParseData
}
