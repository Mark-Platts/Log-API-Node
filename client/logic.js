const menu = {
    pageCount: 0,
    pageNumber: 1,
    logs: [null, null, null, null, null, null],
    logLoaded: null,
    creatingLog: false,
    editingLog: false,
    deletingLog: false,
    dateIntervalHolder: null
};


async function updateMenu(pageNumber) {
    const endpoint = logPath + 'page/'+String(pageNumber);
    const response = await fetch(endpoint);
    const logJson = await response.json();
    menu.logs = logJson;
}

async function updatePageCount() {
    const endpoint = logPath + 'count';
    const response = await fetch(endpoint);
    const countJson = await response.json();
    menu.pageCount = Math.ceil(countJson.count/6);
}

function fillMenu() {
    for (let i=0; i<6; i++) {
        fillMenuItems(i+1, menu.logs[i]);
    }
}

function fillMenuItems(itemNumber, log) {
    if (log) {
        hold = `<p>${log.author}</p><p>${log.timeStamp}</p><p>${log.subject}</p>`;
        document.getElementById("menuLog"+String(itemNumber)).innerHTML = hold;
    }
    else {
        hold = `<p> </p><p> </p><p> </p>`;
        document.getElementById("menuLog"+String(itemNumber)).innerHTML = hold;
    }
}

//for the > button on the page, increases the page number by 1 and updates the menu
async function pageTurnUp() {
    if (menu.pageNumber < menu.pageCount) {
        menu.pageNumber++;
        document.getElementById("pageNumber").innerHTML = 'Page: ' + String(menu.pageNumber);
        await updateMenu(menu.pageNumber);
        fillMenu();
    }
}

//for the < button on the page, decreases the page number by 1 and updates the menu
async function pageTurnDown() {
    if (menu.pageNumber >= 2) {
        menu.pageNumber--;
        document.getElementById("pageNumber").innerHTML = 'Page: ' + String(menu.pageNumber);
        await updateMenu(menu.pageNumber);
        fillMenu();
    }
}

//for the << button on the page, sets page number = 1 and updates the menu
async function pageTurnStart() {
    menu.pageNumber = 1;
    document.getElementById("pageNumber").innerHTML = 'Page: ' + String(menu.pageNumber);
    await updateMenu(menu.pageNumber);
    fillMenu();
}

//for the >> button on the page, sets page number = pageCount and updates the menu
async function pageTurnEnd() {
    menu.pageNumber = menu.pageCount;
    document.getElementById("pageNumber").innerHTML = 'Page: ' + String(menu.pageNumber);
    await updateMenu(menu.pageNumber);
    fillMenu();
}


//onclick for log tabs, loads log info into main screen
function loadLog(menuNumber) {
    const log = menu.logs[menuNumber];
    document.getElementById("logTop").innerHTML = '<p style="display:inline;">Author: '
                                                    +String(log.author)
                                                    +'</p><p style="display:inline;">Date: '+String(log.timeStamp)
                                                    +'</p><p style="display:inline;">Subject: '+String(log.subject)+'</p>';
    document.getElementById("logDisplay").innerHTML = '<p>'+String(log.content)+'</p>';
    menu.logLoaded = menuNumber;
}

//function for all on-load logic
async function initialize() {
    await updateMenu(menu.pageNumber);
    await updatePageCount();
    fillMenu();
}

//sets up the screen as it upon load
function startView() {
    clearDateInterval();
    menu.creatingLog = false;
    menu.editingLog = false;
    menu.deletingLog = false;
    menu.logLoaded = null;
    document.getElementById("logTop").innerHTML = '<p style="display:inline;">Author: </p><p style="display:inline;">Date: </p><p style="display:inline;">Subject: </p>';
    document.getElementById("logSec").innerHTML = '<button class="logButton" onclick="newLogButton()">New Log</button>'
    +'<button class="logButton" onclick="editLogButton()">Edit Log</button>'
    +'<button class="logButton" onclick="deleteLogButton()">Delete Log</button>';
    document.getElementById("logDisplay").innerHTML = '<p>Choose a log to view from the left.</p>';
}

//returns to the default view and loads last log opened
function cancelView() {
    const log = menu.logLoaded;
    clearDateInterval();
    startView();
    if (log != null) {
        loadLog(log);
    }
}

//updates the date shown in the log creation view
function newLogDateShow() {
    const currentDate = Date();
    document.getElementById("newLogDate").innerHTML = currentDate;
}

//clears the date interval if one is present
function clearDateInterval() {
    if (menu.dateIntervalHolder) {
        clearInterval(menu.dateIntervalHolder);
        menu.dateIntervalHolder = null;
    }
}

//sets the button bar for log creation or editing
function confirmCancelButtonBar() {
    document.getElementById("logSec").innerHTML = '<button class="logButton" onclick="confirmButtonBar()">Submit Log</button>'
    +'<button class="logButton" onclick="cancelView()">Cancel</button>';
}

//sets up page to create a new log
function newLogButton() {
    menu.creatingLog = true;
    document.getElementById("logTop").innerHTML = '<p style="display:inline;">Author: <input type="text" id="authorIn" class="topIn"></p>'
    +'<p style="display:inline;">Date: <span id="newLogDate"></span></p>'
    +'<p style="display:inline;">Subject: <input type="text" id="subjectIn" class="topIn"></p>';
    confirmCancelButtonBar();
    document.getElementById("logDisplay").innerHTML = '<p>Enter Log Below:</p> <textarea id="contentIn" name="contentIn" class="displayIn"></textarea>'
    //'<p>Enter Log Below:</p> <input type+"text" id="contentIn" class="displayIn">'
    document.getElementById("contentIn").focus();
    newLogDateShow();
    if (!menu.dateIntervalHolder) {
        menu.dateIntervalHolder = setInterval(newLogDateShow, 1000);
    }
}


//sets up button bar to confirm or cancel a create or edit action
function confirmButtonBar() {
    document.getElementById("logSec").innerHTML = '<p style="padding-right:10px; padding-top:5px;">Confirm Log Submission:</p>'
    +'<button class="logButton" onclick="submitChoice()">Confirm</button>'
    +'<button class="logButton" onclick="returnToLastView()">Go Back</button>';
}

//sets up button bar to confirm or cancel a delete action
function confirmDeleteButtonBar() {
    document.getElementById("logSec").innerHTML = '<p style="padding-right:10px; padding-top:5px;">Confirm Deletion:</p>'
    +'<button class="logButton" onclick="submitChoice()">Confirm</button>'
    +'<button class="logButton" onclick="returnToLastView()">Go Back</button>';
}

//checks what to do if a confirm button is pressed
function submitChoice() {
    if (menu.creatingLog) {
        submitLog();
    } else if (menu.editingLog) {
        submitEdit();
    } else if (menu.deletingLog) {
        submitDelete();
    }
}

//sends off log and sets up next appropriate view
async function submitLog() {
    const log = {
        author: document.getElementById("authorIn").value,
        subject: document.getElementById("subjectIn").value,
        content: document.getElementById("contentIn").value
    };
    const response = await postLog(logPath, log);
    if (response.status == 201) {
        await updateMenu(menu.pageNumber);
        await updatePageCount();
        fillMenu();
        startView();
        document.getElementById("logDisplay").innerHTML = '<p>Log Created Successfully. Choose a log to view from the left.</p>';
    } else {
        document.getElementById("logSec").innerHTML = '<p style="padding-right:10px; padding-top:5px;">Log Submission Failed. Check all fields are completed. Try again?<p>'
        +'<button class="logButton" onclick="confirmButtonBar()">Submit Log</button>'
        +'<button class="logButton" onclick="cancelView()">Cancel</button>';
    }
}

//returns the view to the previous view if the go back or cancel buttons are pressed
function returnToLastView() {
    if (menu.creatingLog || menu.editingLog) {
        confirmCancelButtonBar();
    } else if (menu.deletingLog) {
        cancelView();
    }
}

function editLogButton() {
    if (menu.logLoaded != null) {
        menu.editingLog = true;
        document.getElementById("logTop").innerHTML = '<p style="display:inline;">Author: <input type="text" id="authorIn" class="topIn"></p>'
        +'<p style="display:inline;">Date: <span id="newLogDate"></span></p>'
        +'<p style="display:inline;">Subject: <input type="text" id="subjectIn" class="topIn"></p>';
        confirmCancelButtonBar();
        document.getElementById("logDisplay").innerHTML = '<p>Enter Log Below:</p> <textarea id="contentIn" name="contentIn" class="displayIn"></textarea>'
        document.getElementById("authorIn").value = menu.logs[menu.logLoaded].author;
        document.getElementById("subjectIn").value = menu.logs[menu.logLoaded].subject;
        document.getElementById("contentIn").value = menu.logs[menu.logLoaded].content;
        document.getElementById("contentIn").focus();
        newLogDateShow();
        if (!menu.dateIntervalHolder) {
            menu.dateIntervalHolder = setInterval(newLogDateShow, 1000);
        }
    }
}

async function submitEdit() {
    const addDate = '\n <br> edited: ' + Date();
    const edit = [
        { "propName": "author", "value": document.getElementById("authorIn").value},
        { "propName": "subject", "value": document.getElementById("subjectIn").value},
        { "propName": "content", "value": document.getElementById("contentIn").value + addDate}
    ]
    const logId = menu.logs[menu.logLoaded]._id;
    const response = await patchLog(logPath+logId, edit);
    if (response.status == 200) {
        const page = menu.pageNumber;
        const log = menu.logLoaded;
        startView();
        await updateMenu(page);
        fillMenu();
        loadLog(log);
    } else {
        document.getElementById("logSec").innerHTML = '<p style="padding-right:10px; padding-top:5px;">Edit Submission Failed. Check all fields are completed. Try again?<p>'
        +'<button class="logButton" onclick="confirmButtonBar()">Submit Log</button>'
        +'<button class="logButton" onclick="cancelView()">Cancel</button>';
    }
}

function deleteLogButton() {
    if (!menu.creatingLog && !menu.editingLog && menu.logLoaded != null) {
        menu.deletingLog = true;
        confirmDeleteButtonBar();
    }
}

async function submitDelete() {
    const logId = menu.logs[menu.logLoaded]._id;
    const response = await deleteLog(logPath+logId);
    if (response.status == 200) {
        const page = menu.pageNumber;
        const log = menu.logLoaded;
        startView();
        await updateMenu(page);
        fillMenu();
        document.getElementById("logDisplay").innerHTML = '<p>Log Successfully deleted. Choose a log to view.</p>'
    } else {
        document.getElementById("logSec").innerHTML = '<p style="padding-right:10px; padding-top:5px;">Log Deletion Failed. Try again?<p>'
        +'<button class="logButton" onclick="confirmButtonBar()">Delete Log</button>'
        +'<button class="logButton" onclick="cancelView()">Cancel</button>';
    }
}