//log base path
const logPath = 'http://localhost:3000/logs/';

//get all logs
async function getAllLogs(url = '') {
    const response = await fetch(url)
    return response.json();
}

getAllLogs(logPath).then(logs => { console.log(logs) });



//post log
async function postLog(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const testLog = {
    author: "front end",
    subject: "front end post test",
    content: "A test to see if the front end works"
};

