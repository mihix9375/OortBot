const DataBase 	= require("better-sqlite3");
const path	    = require("node:path");

const dataDir 	= path.join(__dirname, "../data");

function create_tables(guild_id)
{
    const dbPath 	= path.join(dataDir, `${guild_id}.sqlite`);
    const db 	    = new DataBase(dbPath);

    /*
     * schedules 		: the table for store schedule datas.
     * id 				: the schedule id. the date and time when user scheduled. 
     * user_id 			: the user's id. 													ex: 11111111, 203846459
     * is_repeat		: the schedule type. only once or repeat.							ex: (for once) 0, (for repeat) 1
     * current			: the date and time when scheduled millisec.
     * start			: the date and time when start schedule millisec.
     * target			: the date and time when next run. millisec.
     * interval			: the time from target to next target. millisec.
     * channel_id		: the channel's id, bot will send.
     * random_setting	: the setting to random pick music.
     * musics			: the picked music.
     * message			: the text, bot will send.
     */
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
    
    /*
     * tasks		: the table for store task musics.
     * id 			: the id. dont replace.
     * rank			: the mention target id. 		ex: <&12029293>
     * music_name	: the task song name.
     */
    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rank TEXT NOT NULL,
        music_name TEXT NOT NULL
        )
    `);

    /*
     * images	: the table for store submitted images.
     * id		: the id. dont replace.
     * user_id 	: the submitter's id.
     * rank		: the mention target id.
     * image	: the submitted image.
     */
    db.exec(`
        CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        rank TEXT NOT NULL,
        image TEXT NOT NULL
        )
    `);

    /*
     * score 		: the table for store user's score.
     * id			: the id. dont replace.
     * image		: the sumitted image.
     * user_id		: the submitter's id.
     * music_name	: the submitted music's name.
     * perfect		: the number of perfect.
     * great		: the number of great.
     * good			: the number of good.
     * other		: the number of bad or less.
     */
    db.exec(`
        CREATE TABLE IF NOT EXISTS score (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        user_id TEXT NOT NULL,
        music_name TEXT NOT NULL,
        perfect INTEGER NOT NULL,
        great INTEGER NOT NULL,
        good INTEGER NOT NULL,
        other INTEGER NOT NULL
        )
    `);
}

function create_musics_table()
{
    const db = new DataBase(path.join(dataDir, "musics.sqlite"));

    /*
     * musics 		: the table for store music datas.
     * id 			: the music id. from https://pjsekai.com/?aad6ee23b0#table.
     * title		: the music title.
     * expertLevel	: the expert level of music.
     * masterLevel 	: the master level of music.
     * appendLevel	: the append level of music.
     * expertCombo	: the expert combo of music.
     * masterCombo	: the master combo of music.
     * appendCombo	: the append combo of music.
     * duration		: the duration of music.
     * bpm			: the bpm of music.
     */
    db.exec(`
    	CREATE TABLE IF NOT EXISTS musics (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	title TEXT NOT NULL,
    	expertLevel INTEGER NOT NULL,
    	masterLevel INTEGER NOT NULL,
    	appendLevel INTEGER NOT NULL DEFAULT 0,
    	expertCombo INTEGER NOT NULL,
    	masterCombo INTEGER NOT NULL,
    	appendCombo INTEGER NOT NULL DEFAULT 0,
    	duration TEXT NOT NULL,
    	bpm TEXT NOT NULL
    	)
    `);
}

module.exports = {
    dataDir,
    create_tables,
    create_musics_table   
}
