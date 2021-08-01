const menu = {
    pageNumber: 1,
    logs: [null, null, null, null, null, null]
};


async function updateMenu(pageNumber) {
    const endpoint = logPath + 'page/'+String(pageNumber);
    const response = await fetch(endpoint);
    const logJson = await response.json();
    menu.logs = logJson;
}

function fillMenu() {
    for (let i=0; i<6; i++) {
        fillMenuItems(i+1, menu.logs[i]);
    }
}

function fillMenuItems(itemNumber, log) {
    if (log) {
        hold = `<p>${log.author}</p><p>${log._id}</p><p>${log.subject}</p>`;
        document.getElementById("menuLog"+String(itemNumber)).innerHTML = hold;
    }
    else {
        hold = `<p> </p><p> </p><p> </p>`;
        document.getElementById("menuLog"+String(itemNumber)).innerHTML = hold;
    }
}

//for the > button on the page, increases the page number by 1 and updates the menu ADD VALIDATION TO MAKE SURE PAGE NUMBER IS VALID
async function pageNumberUp() {
    menu.pageNumber++;
    await updateMenu(menu.pageNumber);
    fillMenu();
}

//function for all on-load logic
async function initialize() {
    await updateMenu(menu.pageNumber);
    fillMenu();
}