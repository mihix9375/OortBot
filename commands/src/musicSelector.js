

function PickMusic(min, max, difficulty, musicList, num)
{
	let exMusics = [];
	let msMusics = [];
	let apMusics = [];

	if (!difficulty || difficulty.length === 0)
	{
		difficulty = [0, 1, 2];
	}

	if (difficulty.indexOf(0) !== -1)
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

	if (difficulty.indexOf(1) !== -1)
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

	if (difficulty.indexOf(2) !== -1)
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
