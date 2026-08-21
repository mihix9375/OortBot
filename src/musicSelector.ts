const table     = require("#src/createTable"); 
const DataBase  = require("better-sqlite3");
const path      = require("node:path");

function PickMusic(min, max, difficulty, num)
{
    const db        = new DataBase(path.join(table.dataDir, "musics.sqlite"));
	const musicList = db.prepare("SELECT * FROM musics").all();

	let exMusics = [];
	let msMusics = [];
	let apMusics = [];

	if (difficulty.length === 0)
	{
		difficulty = [0, 1, 2];
	}

	if (difficulty.includes(0))
	{
		exMusics = musicList
			.filter( music => music.expertLevel >= min && music.expertLevel <= max )
			.map( music => {
				return {
					data: music,
					diff: "エキスパート"
				};
			});
	}

	if (difficulty.includes(1))
	{
		msMusics = musicList
			.filter( music => music.masterLevel >= min && music.masterLevel <= max )
			.map( music => {
				return {
					data: music,
					diff: "マスター"
				};
			});
	}

	if (difficulty.includes(2))
	{
		apMusics = musicList
			.filter( music => music.appendLevel >= min && music.appendLevel <= max )
			.map( music => {
				return {
					data: music,
					diff: "アペンド"
				};
			});
	}

	const musics = [ ...exMusics, ...msMusics, ...apMusics ];
	if (musics.length === 0 || musics == null) return [];
	
	const selected = [];
	if (num == 0 || num == null) num = 1;

	for (let i = 0; i < num; i++)
	{
		if (musics.length == 0) break;
		const randIndex = Math.floor(Math.random() * musics.length);
		selected.push(musics[randIndex]);
		musics.splice(randIndex, 1);
	}

	return selected;
}

module.exports = {
	PickMusic
};
