const schedule 	= require("node-schedule");
const table 	= require("./createTable.js");
const runSchedule = require("../commands/src/runSchedule.js");

async function CheckSchedule(client)
{
	const schedules = table.db.prepare("SELECT * FROM schedules").all();
	const now 	= Date.now();
	let countDelete = 0;
	let countUpdate = 0;
	
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

			countUpdate += 1;
		}
		else if (task.is_repeat === 0 && target <= now)
		{
			const deleteTask = table.db.prepare("DELETE FROM schedules WHERE id = ?");
			deleteTask.run(task.id);
			
			countdeleted += 1;
		}

		await runSchedule.RunSchedule(client, task.id);

		if (deleteTask > 0)
		{
			console.log(`${deleteTask} 個のタスクが過去のため削除されました`);
		}

		if (updateTask > 0)
		{
			console.log(`${updateTask} 個のタスクが過去のため更新されました`);
		}
	}
}

module.exports = {
	CheckSchedule
}
