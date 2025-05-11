/* INITIALIZATIONS */

if (!localStorage.getItem("terms")) { localStorage.setItem("terms", ""); }
if (!localStorage.getItem("logs")) { localStorage.setItem("logs", ""); }
if (!localStorage.getItem("prompts")) { localStorage.setItem("prompts", ""); }
if (!localStorage.getItem("sets")) { localStorage.setItem("sets", ""); }

/* reinitialize */
// localStorage.setItem("terms", "");
// localStorage.setItem("logs", "");
// localStorage.setItem("prompts", "");
// localStorage.setItem("sets", "");


/* ========================== TERMS ========================== */

function loadTableTerms() {
    document.querySelectorAll(".tableHead").forEach(item => {item.style.backgroundColor = "white"; item.style.color = "black";} );
    document.querySelector(`#tableHeadTerms`).style.backgroundColor = "rgb(215, 215, 215)";
    let terms = localStorage.getItem("terms").split(">>>");
    terms.shift();
    document.querySelector("#adminTable").innerHTML = "";
    terms.forEach((termUid) => {
        const termParts = localStorage.getItem(termUid).split(">>>");
        let setsList = termParts[1].split("//");
        setsList.shift();
        const setsDisplay = setsList.map((setUid) => `
            <div class="adminSet">${localStorage.getItem(setUid)}<div class="adminMiniBtn adminMiniBtnDel" onclick="removeSetFromTerm('${termUid}', '${setUid}', this)">✕</div></div>
        `);
        document.querySelector("#adminTable").innerHTML += `
        <tr>
            <td>
                <div class="adminMiniBtn adminMiniBtnDel" style="border-radius: 0px" onclick="deleteTerm('${termUid}', this)">✕</div>
                <input class="adminInput" value="${termParts[0]}" onchange="renameTerm('${termUid}', this)">
                <div id="termSets${termUid}" style="display:inline">${setsDisplay.join("")}</div>
                <datalist id='availableSets'>${getAvailableSetsInput()}</datalist>
                <input type="text" list="availableSets" id="setAdder${termUid}" class="adminInput" placeholder="Add set"><div class="adminMiniBtn adminMiniBtnAdd" onclick="processAddSetToTerm('${termUid}')">+</div>
            </td>
        </tr>
        `;
    });
}

function processAddTerm() {
    let valName = document.querySelector("#adminAddTermName").value;
    let uid = addTerm(valName);
    if (document.querySelector("#adminAddTermSets").value != "") {
        let valSets = document.querySelector("#adminAddTermSets").value.split(",");
        valSets.forEach((set) => {
            let setUid;
            if (!localStorage.getItem("sets").includes(`>>>${set}`)) {
                setUid = addSet(set.trim());
            } else {
                localStorage.getItem("sets").split(">>>").forEach((checkSetUid) => {
                    if (localStorage.getItem(checkSetUid) == set.trim()) {
                        setUid = checkSetUid;
                    }
                });
            }
            addSetToTerm(uid, setUid);
        });
    }
}

function processAddBulkTerms() {

    let input = document.querySelector("#adminBulkAddTerms").value;

    input = input.replaceAll("\n", "")

    let terms = input.split("ENDEND");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const today = new Date();
    const dateDisplay = `${today.getDate()} ${months[today.getMonth()]}`;

    const setUid = addSet(`Bulk Set: ${dateDisplay}`);
    terms.forEach((term) => {

        if (term.trim() != "") {
            const termName = term.split("BREAKBREAK")[0].trim();
            const termUid = addTerm(termName);
            addSetToTerm(termUid, setUid);
        }

    });

    // let setSize = 15;
    // for (let start=0; start<output.length; start += setSize) {
        
    //     let targetOutput;
    //     if (start + setSize > output.length) {
    //         targetOutput = output.slice(start, output.length - 1);
    //     } else {
    //         targetOutput = output.slice(start, start + setSize);
    //     }
    //     let len = targetOutput.length;
    //     targetOutput = targetOutput.map(e => e.split("BREAKBREAK"));
    //     targetOutput = targetOutput.map(e => `<span style="color:blue">${e[0].trim()}</span><br>${e[1].trim()};<span style="color:blue">${e[2].trim()}</span><br>${e[3].trim()}`).join("\n");
    //     download(`Terms ${dateDisplay} (${len}).csv`, targetOutput, start);
    // }

}

function addTerm(term) {
    const uid = getUid();
    localStorage.setItem(uid, `${term}>>>>>>`); /* term >>> set IDs >>> history (log IDs) */
    localStorage.setItem("terms", `${localStorage.getItem("terms")}>>>${uid}`);
    loadTableTerms();
    document.querySelector("#adminAddTermName").value = "";
    document.querySelector("#adminAddTermSets").value = "";
    return uid;
}
function renameTerm(uid, sender) {
    let newName = sender.value;
    const termParts = localStorage.getItem(uid).split(">>>");
    localStorage.setItem(uid, `${newName}>>>${termParts[1]}>>>${termParts[2]}`);
}
function processAddSetToTerm(termUid) {
    let setName = document.querySelector(`#setAdder${termUid}`).value;
    let setUid = "";
    localStorage.getItem("sets").split(">>>").forEach((set) => {
        if (localStorage.getItem(set) == setName) {
            setUid = set;
        }
    });
    if (setUid == "") {
        setUid = addSet(document.querySelector(`#setAdder${termUid}`).value);
    }
    addSetToTerm(termUid, setUid);
    document.querySelector(`#termSets${termUid}`).innerHTML += `<div class="adminSet">${localStorage.getItem(setUid)}<div class="adminMiniBtn adminMiniBtnDel" onclick="removeSetFromTerm('${termUid}', '${setUid}', this)">✕</div></div>`;
    document.querySelector(`#setAdder${termUid}`).value = "";
}
function addSetToTerm(termUid, newSet) {
    const termParts = localStorage.getItem(termUid).split(">>>");
    localStorage.setItem(termUid, `${termParts[0]}>>>${termParts[1]}//${newSet}>>>${termParts[2]}`);
}
function removeSetFromTerm(termUid, setUid, sender) {
    localStorage.setItem(termUid, localStorage.getItem(termUid).replace(`//${setUid}`, ""));
    sender.parentElement.remove();
}
function addRecordToTerm(uid, newRecord) {
    const termParts = localStorage.getItem(uid).split(">>>");
    localStorage.setItem(uid, `${termParts[0]}>>>${termParts[1]}>>>${termParts[2]}//${newRecord}`);
}

function deleteTerm(uid, sender) {
    localStorage.removeItem(uid);
    localStorage.setItem("terms", localStorage.getItem("terms").replace(`>>>${uid}`, ""));
    sender.parentElement.parentElement.remove();
}

/* ========================== PROMPTS ========================== */

// function validateRelatedPrompts(promptUid) {
//     let relatedPrompts = localStorage.getItem(promptUid).split(">>>")[2].split("//");
//     relatedPrompts.forEach((relatedPrompt) => {
//         if (!localStorage.getItem(relatedPrompt)) {
//             localStorage.setItem(promptUid, localStorage.getItem(promptUid).replace(`//${relatedPrompt}`, ""));
//         }
//     });
// }

function loadTablePrompts() {
    document.querySelectorAll(".tableHead").forEach(item => {item.style.backgroundColor = "white"; item.style.color = "black";} );
    document.querySelector(`#tableHeadPrompts`).style.backgroundColor = "rgb(215, 215, 215)";
    let prompts = localStorage.getItem("prompts").split(">>>");
    prompts.shift();
    document.querySelector("#adminTable").innerHTML = "";
    prompts.forEach((promptUid) => {
        const promptParts = localStorage.getItem(promptUid).split(">>>");
        let relatedPromptsList = promptParts[2].split("//");
        relatedPromptsList.shift();
        let relatedPrompts = relatedPromptsList.map((relatedPrompt) => `<div class="adminSet">${localStorage.getItem(relatedPrompt).split(">>>")[0]}<div class="adminMiniBtn adminMiniBtnDel" onclick="removeRelatedPrompt('${promptUid}','${relatedPrompt}', this)">✕</div></div>`);
        document.querySelector("#adminTable").innerHTML += `
        <tr>
            <td>
                <div class="adminMiniBtn adminMiniBtnDel" style="border-radius: 0px" onclick="deletePrompt('${promptUid}', this)">✕</div>
                <input class="adminInput" value="${promptParts[0]}" onchange="renamePrompt('${promptUid}', this)">
                <textarea class="adminInput" onchange="updatePromptScript('${promptUid}', this)">${promptParts[1]}</textarea>
                <div id="relatedPrompts${promptUid}" style="display:inline">${relatedPrompts.join("")}</div>
                ${getRelatedPromptsInput()}
                <input type="text" id="relatedPromptsAdd${promptUid}" list="relatedPrompts" class="adminInput" placeholder="Related prompt"><div class="adminMiniBtn adminMiniBtnAdd" onclick="addRelatedPrompt('${promptUid}')">+</div>
            </td>
        </tr>
        `;
    });
}

function processAddPrompt() {
    const prompt = document.querySelector("#adminAddPrompt").value;
    const script = document.querySelector("#adminAddPromptScript").value;
    addPrompt(prompt.trim(), script.trim());
}

function addPrompt(prompt, script) {
    const uid = getUid();
    localStorage.setItem(uid, `${prompt}>>>${script}>>>`); /* prompt >>> script >>> related prompt IDs */
    localStorage.setItem("prompts", `${localStorage.getItem("prompts")}>>>${uid}`);

    document.querySelector("#adminAddPrompt").value = "";
    document.querySelector("#adminAddPromptScript").value = "";
    loadTablePrompts();
}

function renamePrompt(uid, sender) {
    let newName = sender.value;
    const promptParts = localStorage.getItem(uid).split(">>>");
    localStorage.setItem(uid, `${newName}>>>${promptParts[1]}>>>${promptParts[2]}`);
}

function updatePromptScript(uid, sender) {
    let newScript = sender.value;
    const promptParts = localStorage.getItem(uid).split(">>>");
    localStorage.setItem(uid, `${promptParts[0]}>>>${newScript}>>>${promptParts[2]}`);
}

function addRelatedPrompt(promptUid) {
    let relatedPromptName = document.querySelector(`#relatedPromptsAdd${promptUid}`).value;
    let relatedPromptUid;
    localStorage.getItem("prompts").split(">>>").forEach((prompt) => {
        if (localStorage.getItem(prompt)) {
            if (localStorage.getItem(prompt).split(">>>")[0] == relatedPromptName) {
                relatedPromptUid = prompt;
            }
        }
    })
    const promptParts = localStorage.getItem(promptUid).split(">>>");
    localStorage.setItem(promptUid, `${promptParts[0]}>>>${promptParts[1]}>>>${promptParts[2]}//${relatedPromptUid}`);
    document.querySelector(`#relatedPrompts${promptUid}`).innerHTML += `<div class="adminSet">${localStorage.getItem(relatedPromptUid).split(">>>")[0]}<div class="adminMiniBtn adminMiniBtnDel" onclick="removeRelatedPrompt('${promptUid}','${relatedPromptUid}', this)">✕</div></div>`;
    document.querySelector(`#relatedPromptsAdd${promptUid}`).value = "";
}

function deletePrompt(uid, sender) {
    localStorage.removeItem(uid);
    localStorage.setItem("prompts", localStorage.getItem("prompts").replace(`>>>${uid}`, ""));
    sender.parentElement.parentElement.remove();
    // Remove deleted prompt from any others that had it as a related prompt
    let allPrompts = localStorage.getItem("prompts").split(">>>");
    allPrompts.shift();
    allPrompts.forEach((promptUid) => {
        localStorage.setItem(promptUid, localStorage.getItem(promptUid).replace(`//${uid}`, ""));
    });
}

function removeRelatedPrompt(uid, relatedPromptId, sender) {
    localStorage.setItem(uid, localStorage.getItem(uid).replace(`//${relatedPromptId}`, ""));
    sender.parentElement.remove();
}
function getRelatedPromptsInput() {
    let prompts = localStorage.getItem("prompts").split(">>>");
    prompts.shift();
    return "<datalist id='relatedPrompts'>" + prompts.map(prompt => `<option>${localStorage.getItem(prompt).split(">>>")[0]}</option>`) + "</datalist>";
}

/* ========================== SETS ========================== */

function processAddTermSet() {
    let setName = document.querySelector("#adminAddSet").value;
    addSet(setName.trim());
}

function addSet(name) {
    if (localStorage.getItem("sets").includes(name)) {
        alert("Set name already exists.")
    }
    const uid = getUid();
    localStorage.setItem(uid, name); /* name only...so that the name can be updated w/o modifying the ID */
    localStorage.setItem("sets", `${localStorage.getItem("sets")}>>>${uid}`);
    document.querySelector("#setNamesPlaceholder").innerHTML = getAvailableSetsInput();
    loadTableSets();
    return uid;
}

function renameSet(uid, sender) {
    let newName = sender.value;
    localStorage.setItem(uid, newName);
}

function deleteSet(uid, sender) {
    localStorage.removeItem(uid);
    localStorage.setItem("sets", localStorage.getItem("sets").replace(`>>>${uid}`, ""));
    sender.parentElement.parentElement.remove();
}

function getAvailableSetsInput() {
    let sets = localStorage.getItem("sets").split(">>>");
    sets.shift();
    return sets.map(set => `<option>${localStorage.getItem(set).split(">>>")[0]}</option>`).join("");
}

function loadTableSets() {
    document.querySelectorAll(".tableHead").forEach(item => {item.style.backgroundColor = "white"; item.style.color = "black";} );
    document.querySelector(`#tableHeadSets`).style.backgroundColor = "rgb(215, 215, 215)";
    let sets = localStorage.getItem("sets").split(">>>");
    sets.shift();
    document.querySelector("#adminTable").innerHTML = "";
    sets.forEach((setUid) => {
        document.querySelector("#adminTable").innerHTML += `
        <tr>
            <td>
                <div class="adminMiniBtn adminMiniBtnDel" style="border-radius: 0px" onclick="deleteSet('${setUid}', this)">✕</div>
                <input class="adminInput" value="${localStorage.getItem(setUid)}" onchange="renameSet('${setUid}', this)">
            </td>
        </tr>
        `;
    });
}

/* ========================== LOGS ========================== */

function deleteLog(uid, sender) {
    localStorage.removeItem(uid);
    localStorage.setItem("logs", localStorage.getItem("logs").replace(`>>>${uid}`, ""));
    sender.parentElement.parentElement.remove();
}

function loadTableLogs() {
    document.querySelectorAll(".tableHead").forEach(item => {item.style.backgroundColor = "white"; item.style.color = "black";} );
    document.querySelector(`#tableHeadLogs`).style.backgroundColor = "rgb(215, 215, 215)";
    let logs = localStorage.getItem("logs").split(">>>");
    logs.shift();
    logs = logs.reverse();
    document.querySelector("#adminTable").innerHTML = "";
    logs.forEach((logUid) => {
        document.querySelector("#adminTable").innerHTML += `
        <tr>
            <td>
                <div class="adminMiniBtn adminMiniBtnDel" style="border-radius: 0px" onclick="deleteLog('${logUid}', this)">✕</div>
                ${localStorage.getItem(logUid).split("Start log: ")[1].split(" GMT-")[0]}<div class="adminMiniBtn adminMiniBtnAdd" style="margin-left:10px" onclick="loadLog('${localStorage.getItem(logUid).replaceAll("'", "’")}')">⇗</div>
            </td>
        </tr>
        `;
    });
}

function loadLog(txt) {
    console.log("Here");
    let newPage = window.open("about:blank");
    newPage.document.body.innerHTML = txt;
}