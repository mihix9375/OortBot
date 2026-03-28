const table = require("../../src/createTable.js");
const selector = require("./musicSelector.js");
const schedule = require("node-schedule");
const musicData = require("../../data/Musics.json");

async function RunSchedule(client, id)
{
	const getSchedule = table.db.prepare("SELECT * FROM schedules WHERE id = ?");

	const task = getSchedule.get(id);

	if (!task) 
	{
		console.warn("存在しないデータを参照しようとしました"); 
		return;
	}

	if (task.is_repeat == 1)
	{
		schedule.scheduleJob(new Date(task.target), async function() {
			const channel = await client.channels.fetch(task.channel_id);
			
			const message = task.message.replace("/music/", task.musics);

			await channel.send(message);

			const randomSetting = task.random_setting.split("/");

			const musics = selector.PickMusic(
							Number(randomSetting[1]), 
							Number(randomSetting[0]),
							[randomSetting[3], randomSetting[4]].filter(x => x),
							musicData,
							Number(randomSetting[2])
			);
			
			let text = "\`\`\`";
			musics.forEach(music => {
				text += `${music.data.title} (${music.diff})\n`;
			});
			text += "\`\`\`";

			const target = task.target + task.interval;

			const update = table.db.prepare("UPDATE schedules SET target = ?, musics = ? WHERE id = ?");
			update.run(target, text, task.id);

			await RunSchedule(client, task.id);
		});
	}
	else if (task.is_repeat == 0)
	{
		schedule.scheduleJob(new Date(task.target), async function(client) {
			const channel = await client.channels.fetch(task.channel_id);

			const message = task.message.replace("/music/", task.musics);

			await channel.send(message);
		});
	}
	else
	{
		console.warn("is_repeat に無効な値が入っています");
	}
}

module.exports = {
	RunSchedule
}
