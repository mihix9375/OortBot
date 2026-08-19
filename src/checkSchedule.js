const schedule 	= require("node-schedule");
const table 	= require("./createTable.js");
const runSchedule = require("../commands/autorandom/src/runSchedule.js");
const fs        = require("fs");
const path      = require("node:path");
const DataBase  = require("better-sqlite3");

async function CheckSchedule(client)
{
    const files = fs.readdirSync(table.dataDir);
    if (files.length == 0) return;

    files.forEach(async function(f) {
        if (f === "musics.sqlite") return;
        
        const db    = new DataBase(path.join(table.dataDir, f));

        const schedules = db.prepare("SELECT * FROM schedules").all();
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

                const updateTarget = db.prepare("UPDATE schedules SET target = ? WHERE id = ?");
                updateTarget.run(target, task.id);

                countUpdate += 1;
            }
            else if (task.is_repeat === 0 && target <= now)
            {
                const deleteTask = db.prepare("DELETE FROM schedules WHERE id = ?");
                deleteTask.run(task.id);
                
                countdeleted += 1;
            }

            db.close();
        }

        console.log(f.slice(0, f.length - 7));

        if (countDelete === 0 && countUpdate === 0)
        {
            console.log("変更はありません");
        }

        if (countDelete > 0)
        {
            console.log(`${deleteTask} 個のタスクが過去のため削除されました`);
        }

        if (countUpdate > 0)
        {
            console.log(`${updateTask} 個のタスクが過去のため更新されました`);
        }
    });
}

module.exports = {
	CheckSchedule
}
