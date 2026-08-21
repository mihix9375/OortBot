const table     = require("#src/createTable");
const selector  = require("#src/musicSelector");
const openDB    = require("#src/openDB")
const schedule  = require("node-schedule");
const DataBase  = require("better-sqlite3");
const path      = require("node:path");

async function RunSchedule(client, id, guild_id)
{
    const db            = openDB.open_database(guild_id);
	const getSchedule   = db.prepare("SELECT * FROM schedules WHERE id = ?");

	const task = getSchedule.get(id);

	if (!task) 
	{
		console.warn("存在しないデータを参照しようとしました"); 
		return;
	}

	if (task.is_repeat == 1)
	{
		schedule.scheduleJob(String(id), new Date(task.target), async function() {

            const channel = await client.channels.fetch(task.channel_id);		
			const message = task.message.replace("/music/", task.musics);

			await channel.send(message);

			const randomSetting = task.random_setting.split("/");

			const musics = selector.PickMusic(
							Number(randomSetting[1]), 
							Number(randomSetting[0]),
							[randomSetting[3], randomSetting[4]].filter(x => x),
							Number(randomSetting[2])
			);
			
			let text = "\`\`\`";
			musics.forEach(music => {
				text += `${music.data.title} (${music.diff})\n`;
			});
			text += "\`\`\`";

			const target = task.target + task.interval;

			const update = db.prepare("UPDATE schedules SET target = ?, musics = ? WHERE id = ?");
			update.run(target, text, task.id);

			await RunSchedule(client, task.id, guild_id);
		});
	}
	else if (task.is_repeat == 0)
	{
		schedule.scheduleJob(String(id), new Date(task.target), async function() {
			const channel = await client.channels.fetch(task.channel_id);

			const message = task.message.replace("/music/", task.musics);

			await channel.send(message);

			const deleteTask = db.prepare("DELETE FROM schedules WHERE id = ?");
			deleteTask.run(task.id);
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
