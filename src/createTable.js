const DataBase 	= require("better-sqlite3");
const path	= require("node:path");

const dataDir 	= path.join(__dirname, "../data");
const dbPath 	= path.join(dataDir, "database.sqlite");

const db 	= new DataBase(dbPath);

db.exec(`
	CREATE TABLE IF NOT EXISTS schedules (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT NOT NULL,
	is_repeat INTEGER NOT NULL,
	current INTEGER NOT NULL,
	start INTEGER NOT NULL,
	target INTEGER NOT NULL,
	interval INTEGER NOT NULL,
	channel_id TEXT NOT NULL,
	random_setting TEXT NOT NULL,
	musics TEXT NOT NULL,
	message TEXT NOT NULL
	)
`);

db.exec(`
	CREATE TABLE IF NOT EXISTS images (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT NOT NULL,
	image TEXT NOT NULL
	)
`);

db.exec(`
	CREATE TABLE IF NOT EXISTS score (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT NOT NULL,
	music_name TEXT NOT NULL,
	score INTEGER NOT NULL,
	perfect INTEGER NOT NULL,
	great INTEGER NOT NULL,
	good INTEGER NOT NULL,
	other INTEGER NOT NULL
	)
`);

module.exports = {
	db
}
