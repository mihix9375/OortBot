const DataBase 	= require("better-sqlite3");
const path	= require("node:path");

const dataDir 	= path.join(__dirname, "../data");
const dbPath 	= path.join(dataDir, "database.sqlite");

const db 	= new DataBase(dbPath);

db.exec(`
	CREATE TABLE IF NOT EXISTS schedules (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	schedule_type TEXT NOT NULL,
	current INTEGER NOT NULL,
	target INTEGER NOT NULL,
	interval INTEGER NOT NULL,
	channel_id TEXT NOT NULL,
	message TEXT NOT NULL
	)
`);

module.exports = {
	db
}
