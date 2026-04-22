// 1. 必要なライブラリを読み込む
const axios = require('axios');
const cheerio = require('cheerio');
const table = require("./createTable.js");

// 2. データを取得したいURLを指定
const url = 'https://pjsekai.com/?aad6ee23b0#table';

const insert = table.db.prepare(`INSERT INTO musics (id, title, expertLevel, masterLevel, appendLevel, expertCombo, masterCombo, appendCombo, duration, bpm)
		  						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
								`);

// 3. スクレイピングを実行する非同期関数を定義
async function fetchMusicData() {
  try {
    console.log("データ取得中");
    // 4. axiosでURLにアクセスし、HTMLデータを取得
    const response = await axios.get(url);
    const html = response.data;

    // 5. cheerioでHTMLを読み込み、jQueryのように操作できるオブジェクトを作成
    const $ = cheerio.load(html);

    // 6. 取得したデータを格納するための配列を用意
    const musicList = [];

    // 7. セレクタを使って目的のHTML要素（テーブルの各行）を取得し、ループ処理
    // ※実際のHTML構造に合わせてセレクタは調整が必要です
    $('table#sortable_table1 > tbody > tr').each((index, element) => {
      // 8. 各行の中から、さらに詳細な要素（各セル）を探す
      const tds = $(element).find('td');

      // 9. 各セルのテキスト情報を取得
      const id = $(tds[0]).text().trim();
      const title = $(tds[3]).text().trim(); // 曲名 (4番目のセル)
      const expertLevel = $(tds[8]).text().trim(); // EXPERTレベル (9番目のセル)
      const masterLevel = $(tds[9]).text().trim(); // MASTERレベル (10番目のセル)
      const appendLevel = $(tds[10]).text().trim();
      const expertCombo = $(tds[11]).text().trim(); // 最大コンボ数 (12番目のセル)
      const masterCombo = $(tds[12]).text().trim();
      const appendCombo = $(tds[13]).text().trim();
      const duration = $(tds[14]).text().trim(); // 時間 (15番目のセル)
      const bpm = $(tds[15]).text().trim();

	  insert.run(
		  Number(id),
		  title,
		  Number(expertLevel),
		  Number(masterLevel),
		  appendLevel === "-" ? 0 : Number(appendLevel),
		  Number(expertCombo),
		  Number(masterCombo),
		  appendCombo === "-" ? 0 : Number(appendCombo),
		  duration,
		  bpm
	  );
    });
    console.log("楽曲データを更新しました");

  } catch (error) {
    console.error('データの取得に失敗しました:', error);
  }
}

module.exports = {
	fetchMusicData
};

// 12. 関数を実行
fetchMusicData();
