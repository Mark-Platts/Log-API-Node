fs = require('fs');

class Log {
    constructor(logNumber, logDateTime, logEntry) {
      this.logNumber = logNumber;
      this.logDateTime = logDateTime;
      this.logEntry = logEntry;
    }
  }

let logs = [];

function addLog(entry) {
    const logNumber = logs.length;
    const date = new Date();
    const logDateTime = date.toUTCString();
    const newLog = new Log(logNumber, logDateTime, entry);
    logs.push(newLog);
}



addLog('This is a test log');

addLog('This is a second test log');

addLog('This is a third test log');


// fs.writeFile('test.txt', String(logs), function (err) {
//     if (err) return console.log(err);
//     console.log('done');
//   });