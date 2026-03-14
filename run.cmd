@echo off
node src/downloadDatas.js
node src/deply_commands.js %1
node index.js
