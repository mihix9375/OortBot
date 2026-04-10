const table = require("../../src/createTable.js");
const schedule = require("node-schedule");

async function Cancel(id)
{
	const cancel = table.db.prepare("DELETE FROM schedules WHERE id = ?");

	const result = cancel.run(id);

	if (result.changes != 0)
	{
		try {
			await schedule.cancelJob(String(id));
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
