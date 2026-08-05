const table     = require("../../src/createTable.js");
const schedule  = require("node-schedule");
const DataBase  = require("better-sqlite3");
const path      = require("node:path");

async function Cancel(schedule_id, guild_id)
{
    const db        = new DataBase(path.join(table.dataDir, `${guild_id}.sqlite`));
	const cancel    = db.prepare("DELETE FROM schedules WHERE id = ?");

	const result = cancel.run(schedule_id);

	if (result.changes != 0)
	{
		try {
			await schedule.cancelJob(String(schedule_id));
		}
		catch (e)
		{
			console.warn("ジョブが存在しません" + e);
		}

		return { content: "正常に削除しました", ephemeral: true };
	}
	else
	{
		return { content: "存在しないIDです", ephemeral: true };
	}
}

module.exports = {
	Cancel
}
