//log base path
const logPath = 'http://localhost:3000/logs/';

//get all logs
async function getAllLogs(url = '') {
    const response = await fetch(url)
    return response.json();
}

//getAllLogs(logPath).then(logs => { console.log(logs) });



//post log
async function postLog(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}

const testLog = {
    author: "logTest",
    subject: "front end post test",
    content: "A test to see if the front end works"
};


async function populateLogsForTesting() {
    for (let i=0; i<100; i++) {
        const log = {
            author: "testPop",
            subject: "test number "+String(i),
            content: "This is test number "+String(i)+" automatically created by the populateLogsForTesting function."
        }
        await postLog(logPath, log);
        console.log("posted "+String(i));
    }
}


async function logrettest() {
    try {
        await postLog(logPath, testLog);
        console.log("success");
    } catch {
        console.log("failure");
    }
}