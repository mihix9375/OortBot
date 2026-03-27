const schedule 	= require("node-schedule");
const table 	= require("./createTable.js");

async function CheckSchedule(client)
{
	const schedules = table.db.prepare("SELECT * FROM schedules").all();
	const now 	= Date.now();
	
	for (const task of schedules)
	{
		let 	target 		= task.target;
		const 	interval 	= task.interval;

		if (task.is_repeat === 1 && target <= now)
		{
			while ( target <= now)
			{
				target += interval;
			}

			const updateTarget = table.db.prepare("UPDATE schedules SET target = ? WHERE id = ?");
			updateTarget.run(target, task.id);
		}

		schedule.scheduleJob(new Date(target), async function(){
			const channel = await client.channels.fetch(task.channel_id);
			await channel.send(task.message);
		});
	}
}

module.exports = {
	CheckSchedule
}
