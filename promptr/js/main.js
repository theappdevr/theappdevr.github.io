
function toggleAdmin() {
    if (document.querySelector("#adminDisplay").style.display === "inline-block") {
        document.querySelector("#mainDisplay").style.display = "inline-block";
        document.querySelector("#adminDisplay").style.display = "none";
    } else {
        document.querySelector("#mainDisplay").style.display = "none";
        document.querySelector("#adminDisplay").style.display = "inline-block";
    }
}

function gridClick(sender) {
    if (sender.classList.contains("gridItemActive")) {
        logRecord(`Term: ${sender.innerHTML}`);
    } else {
        document.querySelectorAll(".gridItemActive").forEach(item => item.classList = "gridItem");
        sender.classList = "gridItem gridItemActive";
    }
}

function cleanHTMLId(id) {
    return id.replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("'", "")
    .replaceAll("/", "")
}

function genGrid(terms) {
    terms = terms.map(term => localStorage.getItem(term).split(">>>")[0]);
    if (terms.length == 0) {
        document.querySelector("#termsGrid").innerHTML = "";
    } else {
        document.querySelector("#termsGrid").innerHTML = terms.map(term => `<div class="gridItem" id="gridItem${cleanHTMLId(term)}" onclick="gridClick(this)">${term}</div>`).join("");
        document.querySelector(`#gridItem${cleanHTMLId(terms[0])}`).classList = "gridItem gridItemActive";
    }
}


let curLogRecord = "";
let curLogSecs = 0;
let logTimer;
let curGridPos = 0;
let curTerms = [];
let activeSets = [];

filterTerms();

function filterTerms() {
    let allTerms = localStorage.getItem("terms").split(">>>");
    allTerms.shift();
    curTerms = [];
    if (activeSets.length == 0) {
        curTerms = allTerms;
    } else {
        allTerms.forEach((term) => {
            let termSets = localStorage.getItem(term).split(">>>")[1].split("//");
            let overlap = termSets.filter(val => activeSets.includes(val));
            if (overlap.length > 0) { curTerms.push(term); }
        } );
    }
    genGrid(curTerms);
}

document.body.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            if (curGridPos > 0) {
                curGridPos--;
            } else {
                curGridPos = curTerms.length - 1;
            }
            document.querySelectorAll(".gridItemActive").forEach(item => item.classList = "gridItem");
            document.querySelector(`#gridItem${cleanHTMLId(localStorage.getItem(curTerms[curGridPos]).split(">>>")[0])}`).classList = "gridItem gridItemActive";
            break;
        case "ArrowRight":
            if (curGridPos < curTerms.length - 1) {
                curGridPos++;
            } else {
                curGridPos = 0;
            }
            document.querySelectorAll(".gridItemActive").forEach(item => item.classList = "gridItem");
            document.querySelector(`#gridItem${cleanHTMLId(localStorage.getItem(curTerms[curGridPos]).split(">>>")[0])}`).classList = "gridItem gridItemActive";
            break;
        case "ArrowUp":
            break;
        case "ArrowDown":
            break;
        case "Enter":
            break;
        default:
            break;              
    }
});

document.querySelector("#setNamesPlaceholder").innerHTML = getAvailableSetsInput();
document.querySelector("#setsToFilter").innerHTML = getAvailableSetsInput();

populatePrompts("root");

function populatePrompts(base) {

    document.querySelector("#promptsList").innerHTML = "";
    let prompts = localStorage.getItem("prompts").split(">>>");
    prompts.shift();

    let rootPromptRelateds = "";
    if (base != "root") {
        rootPromptRelateds = localStorage.getItem(base).split(">>>")[2];
    }

    prompts.forEach((promptId) => {
        let promptDetails = localStorage.getItem(promptId).split(">>>");
        if (base === "root" || rootPromptRelateds.includes(promptId)) {
            document.querySelector("#promptsList").innerHTML += `<div class="leftSideBarBtn" onclick="activatePrompt('${promptId}')">${promptDetails[0]}</div>`;
        }
    });

    if (document.querySelector("#promptsList").innerHTML == "") {
        document.querySelector("#promptsList").innerHTML = "<br><span style='margin:10px'>No prompts to display.</span>";
    }

}

function activatePrompt(promptId) {
    let promptDetails = localStorage.getItem(promptId).split(">>>");
    document.querySelector("#promptDisplay").innerHTML = promptDetails[0];
    logRecord(`Prompt: ${promptDetails[0]}`)
    populatePrompts(promptId);
}

function logStart() {
    document.querySelector("#logDisplay").innerHTML = "";
    document.querySelector("#controlsDisplay").innerHTML = `<div class="controlsBtn controlsBtnRed" onclick="logPause()" style="width:calc(50% - 10px)">⏸ Pause</div><div class="controlsBtn controlsBtnRed" onclick="logStop()" style="width:calc(50% - 10px)">◼ Stop</div>`;
    curLogSecs = 0;
    logTimer = setInterval(() => {
        curLogSecs += 1;
    }, 1000);
    const startTime = new Date();
    const newUid = getUid();
    localStorage.setItem(newUid, "");
    localStorage.setItem("logs", `${localStorage.getItem("logs")}>>>${newUid}`);
    curLogRecord = newUid;
    logRecord(`Start log: ${startTime}`);
}
function logStop() {
    const endTime = new Date();
    logRecord(`End log: ${endTime}`);
    document.querySelector("#controlsDisplay").innerHTML = `<div class="controlsBtn controlsBtnGreen" onclick="logStart()" style="width:calc(100% - 10px)">▶ Start</div>`;
    clearInterval(logTimer);
    document.querySelector("#logDisplay").innerHTML = `<span style="color:mediumaquamarine">✔ Log successfully recorded</span>`;
}
function logPause() {
    logRecord(`Pause log`);
    document.querySelector("#controlsDisplay").innerHTML = `<div class="controlsBtn controlsBtnGreen" onclick="logResume()" style="width:calc(50% - 10px)">▶ Resume</div><div class="controlsBtn controlsBtnRed" onclick="logStop()" style="width:calc(50% - 10px)">◼ Stop</div>`;
}
function logResume() {
    logRecord(`Resume log`);
    document.querySelector("#controlsDisplay").innerHTML = `<div class="controlsBtn controlsBtnRed" onclick="logPause()" style="width:calc(50% - 10px)">⏸ Pause</div><div class="controlsBtn controlsBtnRed" onclick="logStop()" style="width:calc(50% - 10px)">◼ Stop</div>`;
}
function logRecord(newRecord) {
    if (curLogRecord != "") {
        if (!newRecord.includes("Start log:")) {
            newRecord = `<br><br>${ssmmhh(curLogSecs)} | ${newRecord}`;
        } else {
            newRecord = `00:00:00 | ${newRecord}`;
        }
        localStorage.setItem(curLogRecord, localStorage.getItem(curLogRecord) + newRecord);
        document.querySelector("#logDisplay").innerHTML += newRecord;
    }
}

function activateSet() {
    let setName = document.querySelector("#setToFilter").value;
    let sets = localStorage.getItem("sets").split(">>>");
    sets.shift();
    let setUid = "";
    sets.forEach((set) => {
        if (setName == localStorage.getItem(set).split(">>>")[0]) {
            setUid = set;
        }
    })
    if (setUid != "") {        
        if (!activeSets.includes(setUid)) {
            document.querySelector("#activeSets").innerHTML += `<div class="activeSet" onclick="deactivateSet('${setUid}', this)">${setName}</div>`;
            activeSets.push(setUid);
            filterTerms();
        }
    }
}
function deactivateSet(uid, sender) {
    activeSets = activeSets.filter(set => set !== uid);
    sender.remove();
    filterTerms();
}
function addNote() {
    logRecord(`Note: ${document.querySelector("#addNoteTextarea").value}`);
    document.querySelector("#addNoteTextarea").value = "";
}