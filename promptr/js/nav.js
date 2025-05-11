function toggleScript() {
    if (document.querySelector("#toggleBtnScript").innerHTML === "+") {
        document.querySelector("#scriptDisplay").style.height = "100%";
        document.querySelector("#termsGrid").style.width = "calc(70% - 20px)";
        document.querySelector("#promptDisplay").style.width = "calc(70% - 20px)";
        document.querySelector("#promptDisplay").style.marginLeft = "20px";
        document.querySelector("#activeSets").style.width = "calc(70% - 20px)";
        document.querySelector("#activeSets").style.marginLeft = "20px";
        document.querySelector("#toggleBtnScript").innerHTML = "✕";
    } else {
        document.querySelector("#scriptDisplay").style.height = "50px";
        document.querySelector("#termsGrid").style.width = "100%";
        document.querySelector("#promptDisplay").style.width = "100%";
        document.querySelector("#promptDisplay").style.marginLeft = "0px";
        document.querySelector("#activeSets").style.width = "100%";
        document.querySelector("#activeSets").style.marginLeft = "0px";
        document.querySelector("#toggleBtnScript").innerHTML = "+";
    }
    
}
function toggleTerms() {
    console.log(document.querySelector("#termsGrid").style.display);
    if (document.querySelector("#toggleBtnTerms").innerHTML === "+") {
        document.querySelector("#termsGrid").style.display = "inline";
        document.querySelector("#toggleBtnTerms").innerHTML = "✕";
    } else {
        console.log("IN HERE");
        document.querySelector("#termsGrid").style.display = "none";
        document.querySelector("#toggleBtnTerms").innerHTML = "+";
    }
    console.log(document.querySelector("#termsGrid").style.display);
}
function toggleLeftPane() {
    if (document.querySelector("#toggleBtnLeftPane").innerHTML === "✕") {
        if (document.querySelector("#toggleBtnRightPane").innerHTML === "✕") {
            document.querySelector("#mainPane").style.width = "calc(80% - 60px)";
        } else {
            console.log("AAA");
            document.querySelector("#mainPane").style.width = "calc(100% - 120px)";
        }
        document.querySelector("#mainPane").style.left = "60px";
        document.querySelector("#toggleBtnLeftPane").innerHTML = "+";
    } else {
        if (document.querySelector("#toggleBtnRightPane").innerHTML === "✕") {
            console.log("BBB");
            document.querySelector("#mainPane").style.left = "20%";
            document.querySelector("#mainPane").style.width = "60%";
            document.querySelector("#toggleBtnLeftPane").innerHTML = "✕";
        } else {
            console.log("CCC");
            document.querySelector("#mainPane").style.left = "20%";
            document.querySelector("#mainPane").style.width = "calc(80% - 60px)";
            document.querySelector("#toggleBtnLeftPane").innerHTML = "✕";
            console.log(document.querySelector("#mainPane").style.width);
        }
    }
}
function toggleRightPane() {
    console.log(document.querySelector("#mainPane").style.width);
    if (document.querySelector("#toggleBtnRightPane").innerHTML === "✕") {
        if (document.querySelector("#toggleBtnLeftPane").innerHTML === "✕") {
            document.querySelector("#mainPane").style.width = "calc(80% - 60px)";
        } else {
            document.querySelector("#mainPane").style.width = "calc(100% - 120px)";
        }
        document.querySelector("#toggleBtnRightPane").innerHTML = "+";
    } else {
        if (document.querySelector("#toggleBtnLeftPane").innerHTML === "✕") {
            document.querySelector("#mainPane").style.width = "60%";
            document.querySelector("#toggleBtnRightPane").innerHTML = "✕";
        } else {
            document.querySelector("#mainPane").style.width = "calc(80% - 60px)";
            document.querySelector("#toggleBtnRightPane").innerHTML = "✕";
        }
    }
}
