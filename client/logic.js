const menu = {
    pageCount: 0,
    pageNumber: 1,
    logs: [null, null, null, null, null, null],
    logLoaded: false,
    creatingLog: false,
    editingLog: false
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
    menu.pageNumber++;
    document.getElementById("pageNumber").innerHTML = 'Page: ' + String(menu.pageNumber);
    await updateMenu(menu.pageNumber);
    fillMenu();
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
    document.getElementById("logDisplay").innerHTML = String(log.content);
    menu.logLoaded = true;
}

//function for all on-load logic
async function initialize() {
    await updateMenu(menu.pageNumber);
    await updatePageCount();
    fillMenu();
}

