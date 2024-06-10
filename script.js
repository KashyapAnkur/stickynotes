const addButton = document.querySelector("#addButton");
const notes = document.querySelector("#notes");

let ClientX = 0;
let ClientY = 0;
let WindowObject = window;
let isMouseDown = false;
const colors = ["orange","grey","blue","green","yellow","red"];
const lightColors = ["#FFD580","#909090","#89CFF0","#90EE90","#FFFFE0","#FFCCCB"]

addButton.addEventListener("click", addToLocalStorage);

function createAndAppendElements(nodeObject) {
    const id = nodeObject.divID.split("_")[1];
    const newNoteDiv = document.createElement("div");

    const header = document.createElement("div");
    header.classList.add(nodeObject.headerID);
    header.style.backgroundColor = "purple";
    header.style.display = "flex";
    header.style.backgroundColor = nodeObject.textAreaHeaderBackgroundColor;
    
    for(let i = 0 ;i<6;i++) {
        const colorDivs = document.createElement("div");
        colorDivs.style.width = "20px";
        colorDivs.style.height = "20px";
        colorDivs.style.backgroundColor = colors[i];
        colorDivs.style.marginTop = "-20px";
        colorDivs.style.borderRadius = "50%";
        colorDivs.classList.add("colorDiv_" + id + "_color_" + (i + 1));
        colorDivs.style.display = "none";
        header.appendChild(colorDivs);
    }
    const addBtn = document.createElement("div");
    addBtn.classList.add("addBtn_" + id);
    addBtn.innerHTML = "+";
    addBtn.style.width = "20px";
    addBtn.style.height = "20px";
    addBtn.style.textAlign = "center";
    addBtn.style.color = "white";
    addBtn.style.fontStyle = "bold";
    addBtn.style.right = 0;
    addBtn.style.position = "relative";
    addBtn.style.backgroundColor = "grey";
    header.appendChild(addBtn);

    newNoteDiv.classList.add(nodeObject.divClass);
    newNoteDiv.style.width = nodeObject.divWidth;
    newNoteDiv.style.height = nodeObject.divHeight;
    const closeBtn = createCloseButton(nodeObject);
    newNoteDiv.appendChild(closeBtn);
    const txtArea = createTextArea(nodeObject);
    newNoteDiv.appendChild(header);
    newNoteDiv.appendChild(txtArea);
    notes.appendChild(newNoteDiv);
}

function createLocalStorageData(lastLSData, rest) {
    const nodeObject = {};
    const localStorageData = rest;
    let divID = (lastLSData?.divID) ? parseInt(lastLSData.divID.split("_")[1]) + 1 : 1;
    let divClass = lastLSData?.divClass ? parseInt(lastLSData.divClass.split("_")[1]) + 1 : 1;
    let closeBtnClass = lastLSData?.closeBtnClass ? parseInt(lastLSData.closeBtnClass.split("_")[1]) + 1 : 1;
    let textareaClass = lastLSData?.textareaClass ? parseInt(lastLSData.textareaClass.split("_")[1]) + 1 : 1;


    nodeObject.headerID = `header_${divID}`;


    nodeObject.divID = `div_${divID}`;
    nodeObject.divClass = `stickynote_${divClass}`
    nodeObject.divWidth = '190px';
    nodeObject.divHeight = '190px';
    nodeObject.closeBtnClass = `closeBtnClass_${closeBtnClass}`;
    nodeObject.textareaClass = `textArea_${textareaClass}`;
    nodeObject.textAreaMarginLeft = "50%";
    nodeObject.textAreaHeight = "80%";
    nodeObject.textAreaWidth = "97%";
    nodeObject.textAreaMarginTop = "50px !important";
    nodeObject.textAreaInnerText  = "";
    nodeObject.textAreaBackgroundColor = "lightyellow";
    nodeObject.textAreaHeaderBackgroundColor = "yellow";
    
    localStorageData.push(nodeObject);
    localStorage.setItem("nodes", JSON.stringify(localStorageData));

    createAndAppendElements(nodeObject);
}

function addToLocalStorage() {    
    if(localStorage.getItem("nodes")) {
        const localStorageData = JSON.parse(localStorage.getItem("nodes"));
        const lastLSData = localStorageData[localStorageData.length - 1];
        createLocalStorageData(lastLSData, localStorageData);
    } else { // if first time
        createLocalStorageData({}, []);
    }
}

function createTextArea({
    textareaClass,
    textAreaBackgroundColor,
    textAreaHeight,
    textAreaWidth,
    textAreaMarginTop,
    textAreaMarginLeft,
    textAreaInnerText,
 }) {
    const textArea = document.createElement("textarea");
    textArea.classList.add(textareaClass);
    textArea.style.marginLeft = textAreaMarginLeft;
    textArea.style.transform = 'translateX(-50%)';
    textArea.style.backgroundColor = textAreaBackgroundColor;
    textArea.style.height = textAreaHeight;
    textArea.style.width = textAreaWidth;
    textArea.style.marginTop = textAreaMarginTop;
    textArea.innerHTML = textAreaInnerText;
    return textArea;
}

function createCloseButton({ closeBtnClass }) {
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "X";
    closeBtn.classList.add(closeBtnClass);
    return closeBtn;
}


(function fetchLocalStorageData() {
    const localStorageData = localStorage.getItem("nodes");
    if(localStorageData) {
        const parsedData = JSON.parse(localStorage.getItem("nodes"));
        parsedData.forEach((stickyNoteObject) => {
            createAndAppendElements(stickyNoteObject);
        });
    }
})();

// mouse click activates the clicked sticky note
const eventListenerOfTextarea = (e) => {
    const localStorageData = localStorage.getItem("nodes");
    const parsedData = JSON.parse(localStorageData);
    if(localStorageData) {
        parsedData.forEach((textarea) => {
            if(textarea.textareaClass === e.target.classList[0]) {
                textarea.textAreaInnerText = e.target.value;
            }
        });
        localStorage.setItem("nodes", JSON.stringify(parsedData));
    }
}

window.addEventListener("keydown", () => {
    if(localStorage.getItem("nodes")) {
        const lsData = JSON.parse(localStorage.getItem("nodes"));
        lsData.forEach((object) => {
            const txtarea = document.querySelector(`.${object.textareaClass}`);
            if(txtarea) {
                txtarea.addEventListener("keyup", eventListenerOfTextarea);
            }
        });
    }
});

// mouse click activates the clicked sticky note


//
window.addEventListener("click", (e) =>{
    let elementToBeDeleted;
    if(e.srcElement.classList[0] && e.srcElement.classList[0].includes("closeBtnClass")) {
        elementToBeDeleted = document.getElementsByClassName(e.srcElement.classList[0]);
        elementToBeDeleted[0].parentElement.remove();
    }

    const lsData = localStorage.getItem("nodes");
    const parsedData = JSON.parse(localStorage.getItem("nodes"));
    if(lsData) {
        parsedData.forEach(() => {
            let updatedData = parsedData.filter(f => f.closeBtnClass !== e.srcElement.classList[0]);
            localStorage.removeItem("nodes");
            localStorage.setItem("nodes", JSON.stringify(updatedData));
        });
    }
});

//



window.addEventListener("click", (e) => {
    // onClick + button for notes color change
    if(e.srcElement.classList[0].includes('addBtn_')) {
        addToLocalStorage();
    }
    // onClick + button for notes color change


    // onClick header button for notes color change
    if(e.srcElement.classList[0].includes('header_')) {
        for(let i = 1; i <= 6; i++) {
            const headerIDNumber = e.srcElement.classList[0].split("_")[1];
            const colorDiv = document.querySelector(`.colorDiv_${headerIDNumber}_color_${i}`);
            colorDiv.style.display = colorDiv.style.display === "none" ? "block" : "none";
        }
    }
    // onClick header button for notes color change

    //
    if(e.srcElement.classList[0].includes('colorDiv_') && e.srcElement.classList[0].includes('_color_')) {
        const colorID = e.target.classList[0].split("_")[e.target.classList[0].split("_").length - 1];
        const headerID = e.target.classList[0].split("_")[1];
        const headerToBeColored = document.querySelector(".header_" + headerID);
        const textAreaToBeColored = document.querySelector(".textArea_" + headerID);
        headerToBeColored.style.backgroundColor = colors[colorID - 1];
        textAreaToBeColored.style.backgroundColor = lightColors[colorID - 1];

        // updateLocalStorage
        const ls = localStorage.getItem("nodes");

        const parsedData = JSON.parse(localStorage.getItem("nodes"));
        if(ls) {
            parsedData[headerID - 1].textAreaBackgroundColor = lightColors[colorID - 1];
            parsedData[headerID - 1].textAreaHeaderBackgroundColor = colors[colorID - 1];
            localStorage.setItem("nodes", JSON.stringify(parsedData));
        }
        // updateLocalStorage
    }
    //
});

document.querySelector("#deleteButton").addEventListener("click", () => {
    const yes = confirm("Are you sure you want to delete all the notes ?");
    if(yes) {
        localStorage.removeItem("nodes");
        notes.innerHTML = "";
    }
});