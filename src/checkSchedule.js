const schedule 	= require("node-schedule");
const table 	= require("./createTable.js");
const runSchedule = require("../commands/src/runSchedule.js");

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
			while (target <= now)
			{
				target += interval;
			}

			const updateTarget = table.db.prepare("UPDATE schedules SET target = ? WHERE id = ?");
			updateTarget.run(target, task.id);
		}

		await runSchedule.RunSchedule(client, task.id);
	}
}

module.exports = {
	CheckSchedule
}
