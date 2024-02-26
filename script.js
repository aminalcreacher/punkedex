const dex = [];
let index = 0;
const currentMon = document.querySelector("#CurrentMon");
const coolNumber = document.querySelector("#CoolNumber");
const downloadButton = document.querySelector("#DownloadButton");
const punEntryField = document.querySelector("#PunEntryField");
const pokeListTop = document.querySelector("#PokeListTop").children[0];
const pokeListBottom = document.querySelector("#PokeListBottom").children[0];
const punList = document.querySelector("#PunList").children[0];

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        index == Math.min(--index, 1);
        reflowPunList();
    } else if (event.key === 'ArrowDown') {
        index += index >= dex.length - 1 ? 0 : 1;
        reflowPunList();
    }
    updateDisplay();
    punEntryField.focus();
});
document.addEventListener("wheel", (event) => {
    if (index - Math.floor(event.wheelDeltaY / 180) != index)
        reflowPunList();
    index -= Math.floor(event.wheelDeltaY / 180);
    index = Math.min(index, dex.length - 1);
    index = Math.max(index, 0);
    updateDisplay();
});
downloadButton.addEventListener('click', (event) => {
    this.className = "animated";
    saveLocalJSON(JSON.stringify(dex), 'dex');
});
punEntryField.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        dex[index].puns.push(punEntryField.value);
        punEntryField.value = '';
    } else if (event.key === "Backspace" && punEntryField.value === '' && dex[index].puns.length > 0) {
        punEntryField.value = dex[index].puns.pop() + ' ';
    }
});

function reflowPunList() {
    let oldTransition = punList.parentElement.style.transition;
    punList.parentElement.style.transition = "";
    punList.parentElement.style.left = "200px";
    punList.parentElement.style.transition = oldTransition;
    console.log("heregoes");
}

function updateDisplay() {
    if(dex.length == 0) {
        return;
    }
    currentMon.innerText = dex[index].name;
    coolNumber.innerText = ("000" + (index + 1)).slice(-4);
    topPadding = pokeListTop.parentElement.offsetHeight;
    pokeListTop.style.transform = "translateY(" + - ((index) * 50 - topPadding) + "px)"; 
    pokeListBottom.style.transform = "translateY(" + - (index + 1) * 50 + "px)";
    punList.innerHTML = '';
    dex[index].puns.forEach(element => {
        let div = document.createElement("div");
        div.className = "punListEntry";
        div.innerText = element;
        punList.append(div);
    });
    punList.parentElement.style.left = 190 - punList.offsetWidth + "px";
}

getJSON("https://pokeapi.co/api/v2/pokemon-species?limit=1008&offset=0", (err, data) => {
    if (err !== null) {
        alert('Something went wrong: ' + err);
    } else {
        data.results.forEach((pokemon, index) => {
            dex.push({
                name: pokemon.name,
                puns: []
            });
            let div = document.createElement("div");
            div.className = "listEntry";
            div.innerText = pokemon.name;
            pokeListBottom.append(div.cloneNode(true));
            pokeListTop.append(div);
        });
    }
    updateDisplay();
    document.querySelectorAll(".listContainer").forEach(element => {
        element.style.transition = ".2s ease-out";
    });
});

function saveLocalJSON(data, title) {
    var bb = new Blob([data], { type: 'text/plain' });
    var a = document.createElement('a');
    a.download = title + '.json';
    a.href = window.URL.createObjectURL(bb);
    a.click();
    a.remove();
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};