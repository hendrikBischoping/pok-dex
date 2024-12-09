// basic-url (30 Pkmn):   https://pokeapi.co/api/v2/pokemon?limit=30&offset=0  (0 = start bei index 1(mehr laden += index))
// detail-url (last nr = index):  https://pokeapi.co/api/v2/pokemon/2

let pokedex = [];
let pokeData = [];
async function init(){
    toggleLoadingSpinner();
    await getData();
    renderPokedex();
    toggleLoadingSpinner();
}

async function getData() {
    try {
        let pkmnResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${pokedex.length}`);
        let pkmnResponseJson = await pkmnResponse.json();
        let pokeNames = pkmnResponseJson['results'];
        for (let i = 0; i < pokeNames.length; i++) {
            let globalIndex = pokedex.length + i + 1;
            let detailDex = await fetch(`https://pokeapi.co/api/v2/pokemon/${globalIndex}`);
            console.log(globalIndex);
            
            let detailDexJson = await detailDex.json();
            pokeData.push(detailDexJson);
        }
        combineArrays(pokeNames);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

function combineArrays(pokeNames){
    for (let i = 0; i < pokeNames.length; i++) {
        pokedex.push({ name: pokeNames[i], data: pokeData[i] });
      }
    console.log(pokedex);
}

function renderPokedex(){
    let pokedexRef = document.getElementById('pokedex');
    pokedexRef.innerHTML = "";
    for (let inDex= 0; inDex < pokedex.length; inDex++) {
        let pokeName = pokedex[inDex]['name']['name'];
        let pokeType = pokedex[inDex]['data']['types'][0]['type']['name'];
        pokedexRef.innerHTML += pokecardTemplate(pokeType, inDex, pokeName);
     }
}

function pokecardTemplate(pokeType, inDex, pokeName){
    return`
            <div class="pokeCard ${pokeType}_bg" name="${pokeName}" id="${pokeName}" onclick="togglePkmnInfo(${inDex})">
                <div class="card_header d_flex">
                    <p class="single_index">#${inDex+1}</p>
                    <h2>${pokeName}</h2>
                    <p class="color_none">#${inDex+1}</p>
                </div>
                <img class="pokePic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${inDex+1}.png" alt="picture of ${pokeName}">
            </div>
        `
}

function toggleLoadingSpinner(){
    let loadingSpinner = document.getElementById('loading_spinner');
    loadingSpinner.classList.toggle ('d_none');
    loadingSpinner.classList.toggle ('d_flex');
}

function findPokemon(){
    let finderInputRef = document.getElementById('finder_input');
    let pokeCardRef = document.getElementsByClassName ('pokeCard');
    let morePkmnRef = document.getElementById('more_pkmn');
    if (finderInputRef.value.length >= 3) {
        activateFind(finderInputRef, pokeCardRef, morePkmnRef)
    }else if(finderInputRef.value.length <= 2) {
        for (let i = 0; i < pokeCardRef.length; i++) {
            pokeCardRef[i].classList.remove ('d_none');        
        }
        morePkmnRef.classList.remove ('d_none')
        }
}

function activateFind(finderInputRef, pokeCardRef, morePkmnRef){
    for (let i = 0; i < pokeCardRef.length; i++) {
        pokeCardRef[i].classList.add ('d_none');        
    }
    morePkmnRef.classList.add ('d_none');
    let findPokedex = []; //Array zum zwischenspeichern des neusten Inputs
    let foundPokemon = []; //Array zum zwischenspeichern gefundener Pokemon
    findPokedex.push(finderInputRef.value);
    let findPokedexRef = document.getElementById('find_pokedex');
    findPokedexRef.innerHTML = "";
    pokedex.filter((pokemon) => {
        if (pokemon["name"]["name"].toLowerCase().includes(finderInputRef.value)) {
            foundPokemon.push(pokemon)
        }
    });
    showFoundPokemon(foundPokemon)

    if (!finderInputRef.value) {
    pokeCardRef.classList.remove ('d_none')
    morePkmnRef.classList.remove ('d_none')
    }
}

function showFoundPokemon(foundPokemon){
    for (let k = 0; k < foundPokemon.length; k++) {
        let selfName = foundPokemon[k]['name']['name'];
        let foundCard = document.getElementById(selfName);
        foundCard.classList.remove ('d_none');        
    }
}
//////////////////////////////////////////////PokeCard für Info Rendern/////////////////////////////////////////////////

// function renderPokeInfo(pokeName, pokeType, inDex){
//     let pokeInfoRef = document.getElementById('poke_info')
//     pokeInfoRef.innerHTML = ""; 
//         pokeInfoRef.innerHTML = `
//             <div class="singleCard ${pokeType}_bg" id="single_card_${inDex}">
//                 <div class="card_header d_flex">
//                     <p class="single_index">#${inDex+1}</p>
//                     <h2>${pokeName}Testname</h2>
//                     <p class="color_none">#${inDex+1}</p>
//                 </div>
//                 <img class="pokePic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${inDex+1}.png" alt="picture of ${pokeName}">
//             </div>`
//         console.log(pokeName);    
// }

function togglePkmnInfo( inDex){
let pokeInfoRef = document.getElementById('poke_info'); //section overlay
// let singleCardRef = document.getElementById('single_card_'+inDex);
console.log(inDex)

let pokeName = pokedex[inDex]['name']['name'];
let pokeType = pokedex[inDex]['data']['types'][0]['type']['name'];
console.log(pokeName)
console.log(pokeType)


pokeInfoRef.classList.toggle ('d_none');
pokeInfoRef.classList.toggle ('d_flex');
// singleCardRef.classList.toggle ('d_none');
// singleCardRef.classList.toggle ('d_flex');
}

function stopBubbling(event) {
event.stopPropagation();
console.log('Klick auf Karte');
}

function closeInfo(event){
    stopBubbling(event)
    let pokeInfoRef = document.getElementById('poke_info'); 
    pokeInfoRef.classList.toggle ('d_none');
    pokeInfoRef.classList.toggle ('d_flex');
}
//ToDos
//  Render-Funktion: Pokemon via for-loop und pokedex.length in template-HTML rendern
//  Render-Funktion in init() pasten