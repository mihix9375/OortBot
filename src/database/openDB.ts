const DataBase      = require("better-sqlite3");
const fs            = require("fs");
const path          = require("node:path");
const createDB      = require("#src/database/createTable");

function open_database(guildId)
{
    const dbFileName = `${guildId}.sqlite`;
    const dbPath = path.join(createDB.dataDir, dbFileName);

    if (fs.existsSync(dbPath)) return new DataBase(dbPath);

    createDB.create_tables(guildId); 
    return new DataBase(dbPath);
}

module.exports = { open_database };
