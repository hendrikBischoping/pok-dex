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
            let detailDexJson = await detailDex.json();
            pokeData.push(detailDexJson);
        } combineArrays(pokeNames);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

function combineArrays(pokeNames){
    for (let i = 0; i < pokeNames.length; i++) {
        pokedex.push({ name: pokeNames[i], data: pokeData[pokeData.length-30+i] });
      }
}

function renderPokedex(){
    let pokedexRef = document.getElementById('pokedex');
    pokedexRef.innerHTML = "";
    for (let inDex= 0; inDex < pokedex.length; inDex++) {
        let pokeName = pokedex[inDex]['name']['name'];
        pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1).toLowerCase();
        let pokeType = pokedex[inDex]['data']['types'][0]['type']['name'];
        pokedexRef.innerHTML += pokecardTemplate(pokeType, inDex, pokeName);
     }
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
        morePkmnRef.classList.add ('d_flex');
        morePkmnRef.classList.remove ('d_none');
        }
}

function activateFind(finderInputRef, pokeCardRef, morePkmnRef){
    for (let i = 0; i < pokeCardRef.length; i++) {
        pokeCardRef[i].classList.add ('d_none');        
    }
    morePkmnRef.classList.add ('d_none');
    morePkmnRef.classList.remove ('d_flex');
    let findPokedex = [];
    let foundPokemon = [];
    findPokedex.push(finderInputRef.value);
    let findPokedexRef = document.getElementById('find_pokedex');
    findPokedexRef.innerHTML = "";
    openFoundPokemon(finderInputRef, foundPokemon)
}

function openFoundPokemon(finderInputRef, foundPokemon, ){
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
        selfName = selfName.charAt(0).toUpperCase() + selfName.slice(1).toLowerCase();
        let foundCard = document.getElementById(selfName);
        foundCard.classList.remove ('d_none');        
    }
}

function renderPokeInfo(inDex){
    let pokeInfoRef = document.getElementById('poke_info')
    let pokeName = pokedex[inDex]['name']['name'];
    pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1).toLowerCase();
    let pokeType = pokedex[inDex]['data']['types'][0]['type']['name'];
    let pokeHp = pokedex[inDex]['data']['stats'][0]['base_stat'];
    let pokeAttack = pokedex[inDex]['data']['stats'][1]['base_stat'];
    let pokeDefense = pokedex[inDex]['data']['stats'][2]['base_stat'];
    let pokeSpecialAttack = pokedex[inDex]['data']['stats'][3]['base_stat'];
    let pokeSpecialDefense = pokedex[inDex]['data']['stats'][4]['base_stat'];
    let pokeSpeed = pokedex[inDex]['data']['stats'][5]['base_stat'];
    pokeInfoRef.innerHTML = ""; 
        pokeInfoRef.innerHTML += singleCardTemplate(inDex, pokeName, pokeType, pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed)
        addPkmnInfo(inDex)
}

function addPkmnInfo(){
    let pokeInfoRef = document.getElementById('poke_info');
    pokeInfoRef.classList.remove ('d_none');
    pokeInfoRef.classList.add ('d_flex');
}

function removePkmnInfo(){
    let pokeInfoRef = document.getElementById('poke_info');
    pokeInfoRef.classList.add ('d_none');
    pokeInfoRef.classList.remove ('d_flex');
}

function toggleSinglePokePic(inDex){
    let singlePokePic = document.getElementById(`pokePic${inDex}`);
    let singleShinyPokePic = document.getElementById(`shinyPokePic${inDex}`);
    let singleHeadlineNormal = document.getElementById (`headline_normal${inDex}`);
    let singleHeadlineShiny = document.getElementById (`headline_shiny${inDex}`); 
    singlePokePic.classList.toggle ('d_none');
    singleShinyPokePic.classList.toggle ('d_none');
    singleHeadlineNormal.classList.toggle ('d_none')
    singleHeadlineShiny.classList.toggle ('d_none')    
}

function goBack(inDex){
    let flippedIndex = inDex - 1;
    if(flippedIndex < 0){
        flippedIndex = pokedex.length-1;
    }
    renderPokeInfo(flippedIndex);
}
function goNext(inDex){
    let flippedIndex = inDex + 1;
    if(flippedIndex >= pokedex.length){
        flippedIndex = 0;
    }
    renderPokeInfo(flippedIndex);
}

function stopBubbling(event) {
    event.stopPropagation();
}

function toggleStats(inDex){
    let statsTable = document.getElementById (`stats_table_${inDex}`)
    statsTable.classList.toggle ('d_none')
}