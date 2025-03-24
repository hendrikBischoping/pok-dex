let pokedex = [];
let pokeData = [];
let isOpened = false;

/**
 * asynchron function to initialize the page-content
 */
async function init() {
    toggleLoadingSpinner();
    await getData();
    renderPokedex();
    toggleLoadingSpinner();
}

/**
 * asynchron function to fetch data from two different APIs ans save them into variables
 */
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

/**
 * combines two arrays (pokeNames & pokeData) to a single one (pokedex)
 * @param {object} pokeNames - contains the names of all loaded Pokémon (30 Pokémon at first)
 */
function combineArrays(pokeNames) {
    for (let i = 0; i < pokeNames.length; i++) {
        pokedex.push({ name: pokeNames[i], data: pokeData[pokeData.length - 30 + i] });        
    }
}

/**
 * renders all pokemon with basic-information into HTML
 */
function renderPokedex() {
    let pokedexRef = document.getElementById('pokedex');
    pokedexRef.innerHTML = "";
    for (let inDex = 0; inDex < pokedex.length; inDex++) {
        let pokeName = pokedex[inDex]['name']['name'];
        pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1).toLowerCase();
        let allTypes = pokedex[inDex]['data']['types'];
        let pokeType = allTypes[0]['type']['name'];
        pokedexRef.innerHTML += pokecardTemplate(allTypes, pokeType, inDex, pokeName);
    }
}

/**
 * toggles the visibility ob a loading spinner based on pokémon-rendering-progress
 */
function toggleLoadingSpinner() {
    let loadingSpinner = document.getElementById('loading_spinner');
    loadingSpinner.classList.toggle('d_none');
    loadingSpinner.classList.toggle('d_flex');
}

/**
 * find Pokémon via search bar - starts search after typing at least three letters
 */
function findPokemon() {
    let finderInputRef = document.getElementById('finder_input');
    let pokeCardRef = document.getElementsByClassName('pokeCard');
    let morePkmnRef = document.getElementById('more_pkmn');
    if (finderInputRef.value.length >= 3) {
        activateFind(finderInputRef, pokeCardRef, morePkmnRef)
    } else if (finderInputRef.value.length <= 2) {
        for (let i = 0; i < pokeCardRef.length; i++) {
            pokeCardRef[i].classList.remove('d_none');
        }
        morePkmnRef.classList.add('d_flex');
        morePkmnRef.classList.remove('d_none');
    }
}

/**
 * starts finding pokemon in all pokécards if at least 3 letters are typed id
 * @param {input field} finderInputRef 
 * @param {all pokecards} pokeCardRef 
 * @param {button} morePkmnRef to load nore pokémon gets invisible while finding
 */
function activateFind(finderInputRef, pokeCardRef, morePkmnRef) {
    for (let i = 0; i < pokeCardRef.length; i++) {
        pokeCardRef[i].classList.add('d_none');
    }
    morePkmnRef.classList.add('d_none');
    morePkmnRef.classList.remove('d_flex');
    let findPokedex = [];
    let foundPokemon = [];
    findPokedex.push(finderInputRef.value);
    let findPokedexRef = document.getElementById('find_pokedex');
    findPokedexRef.innerHTML = "";
    openFoundPokemon(finderInputRef, foundPokemon)
}

/**
 * 
 * @param {inputfield} finderInputRef - to find pokémon by name
 * @param {array} foundPokemon - gets all fond pokémon pushed
 */
function openFoundPokemon(finderInputRef, foundPokemon,) {
    pokedex.filter((pokemon) => {
        if (pokemon["name"]["name"].toLowerCase().includes(finderInputRef.value)) {
            foundPokemon.push(pokemon)
        }
    });
    showFoundPokemon(foundPokemon)
    if (!finderInputRef.value) {
        pokeCardRef.classList.remove('d_none')
        morePkmnRef.classList.remove('d_none')
    }
}

/**
 * found pokémon get rendered into HTML as pokecards
 * @param {array} foundPokemon - of found pokémon
 */
function showFoundPokemon(foundPokemon) {
    for (let k = 0; k < foundPokemon.length; k++) {
        let selfName = foundPokemon[k]['name']['name'];
        selfName = selfName.charAt(0).toUpperCase() + selfName.slice(1).toLowerCase();
        let foundCard = document.getElementById(selfName);
        foundCard.classList.remove('d_none');
    }
}

/**
 * when pokécard is clicked the pokémon information get delivered to the template-funktion 
 * @param {number} inDex - the index of a single pokémon (in pokédex) 
 */
function renderPokeInfo(inDex) {
    isOpened = true;
    let pokeInfoRef = document.getElementById('poke_info')
    let pokeName = pokedex[inDex]['name']['name'];
    pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1).toLowerCase();
    let allTypes = pokedex[inDex]['data']['types'];
    let pokeType = pokedex[inDex]['data']['types'][0]['type']['name'];
    let pokeHp = pokedex[inDex]['data']['stats'][0]['base_stat'];
    let pokeAttack = pokedex[inDex]['data']['stats'][1]['base_stat'];
    let pokeDefense = pokedex[inDex]['data']['stats'][2]['base_stat'];
    let pokeSpecialAttack = pokedex[inDex]['data']['stats'][3]['base_stat'];
    let pokeSpecialDefense = pokedex[inDex]['data']['stats'][4]['base_stat'];
    let pokeSpeed = pokedex[inDex]['data']['stats'][5]['base_stat'];
    pokeInfoRef.innerHTML = "";
    pokeInfoRef.innerHTML += singleCardTemplate(inDex, allTypes, pokeName, pokeType, pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed)
    renderStats(pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed)
    addPkmnInfo(inDex)
    toggleScrolling();
}

/**
 * disables or enables scrolling depending of if a pokécard-overlay is opened
 */
function toggleScrolling() {
    let content = document.getElementById('body');
    if (isOpened) {
        content.classList.add('prevent_scrolling');
    } else { body.classList.remove('prevent_scrolling'); }
}

/**
 * enables visibility of detailed pokémon information like stats od sounds
 */
function addPkmnInfo() {
    let pokeInfoRef = document.getElementById('poke_info');
    pokeInfoRef.classList.remove('d_none');
    pokeInfoRef.classList.add('d_flex');
}

/**
 * disables visibility of detailed pokémon information like stats od sounds - ans allows scrolling again
 */
function removePkmnInfo() {
    isOpened = false;
    let pokeInfoRef = document.getElementById('poke_info');
    pokeInfoRef.classList.add('d_none');
    pokeInfoRef.classList.remove('d_flex');
    toggleScrolling()
}

/** replaces defaul-pokémon image by shiny-pokémon image on click */
function toggleSinglePokePic(inDex) {
    let singlePokePic = document.getElementById(`pokePic${inDex}`);
    let singleShinyPokePic = document.getElementById(`shinyPokePic${inDex}`);
    let singleHeadlineNormal = document.getElementById(`headline_normal${inDex}`);
    let singleHeadlineShiny = document.getElementById(`headline_shiny${inDex}`);
    singlePokePic.classList.toggle('d_none');
    singleShinyPokePic.classList.toggle('d_none');
    singleHeadlineNormal.classList.toggle('d_none')
    singleHeadlineShiny.classList.toggle('d_none')
}

/**
 * browses the details of the next pokémon within the opened overlay depenting of the index
 * @param {number} inDex - the index of a single pokémon (in pokédex) 
 */
function goBack(inDex) {
    let flippedIndex = inDex - 1;
    if (flippedIndex < 0) {
        flippedIndex = pokedex.length - 1;
    }
    renderPokeInfo(flippedIndex);
}

/**
 * browses the details of the previous pokémon within the opened overlay depenting of the index
 * @param {number} inDex - the index of a single pokémon (in pokédex) 
 */
function goNext(inDex) {
    let flippedIndex = inDex + 1;
    if (flippedIndex >= pokedex.length) {
        flippedIndex = 0;
    }
    renderPokeInfo(flippedIndex);
}

/**
 * prevents event bubbling on html underneath an overlay
 * @param {object} event 
 */
function stopBubbling(event) {
    event.stopPropagation();
    
}

/**
 * opens 'stats' in default and on click in pokédetails (when sounds opened)
 * @param {*} inDex - the index of a single pokémon (in pokédex) 
 */
function toggleStats(inDex) {
    let statsTable = document.getElementById(`stats_table_${inDex}`)
    statsTable.classList.remove('d_none')
    let cardAudios = document.getElementById(`card_audios_${inDex}`)
    cardAudios.classList.add('d_none')
}

/**
 * opend 'sonds' in pokédetails
 * @param {*} inDex - the index of a single pokémon (in pokédex) 
 */
function toggleAudios(inDex) {
    let cardAudios = document.getElementById(`card_audios_${inDex}`)
    cardAudios.classList.remove('d_none')
    let statsTable = document.getElementById(`stats_table_${inDex}`)
    statsTable.classList.add('d_none')
}

/**
 * 
 * @param {*} inDex - the index of a single pokémon (in pokédex) 
 * @returns - second pokémon type if
 */
function loadTypes(inDex) {
    let typesArray = pokedex[inDex]['data']['types'];
    if (typesArray.length > 1) {
        let typeTwo = pokedex[inDex]['data']['types'][1]['type']['name'];
        return typeTwo;
    };
}

/**
 * renders individual stats of each pokémon into pokéinfo (overlay)
 * @param {number} pokeHp - health points
 * @param {number} pokeAttack - attack points
 * @param {number} pokeDefense - defense points
 * @param {number} pokeSpecialAttack - special attack points
 * @param {number} pokeSpecialDefense - special defense points
 * @param {number} pokeSpeed - speed points
 */
function renderStats(pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed) {
    var data = [pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed];
    const labels = ["HP", "ATTACK", "DEFENSE", "SPECIAL ATTACK", "SPECIAL DEFENSE", "SPEED"];
    const maxData = Math.max(...data);
    const svg = document.getElementById('chart');
    const barHeight = 16;
    const barSpacing = 4;
    data.forEach((value, index) => {
        const barWidth = (value / maxData) * 250;
        const x = 20;
        const y = index * (barHeight + barSpacing) + 20;
        svg.innerHTML += `<text x="36" y="${y + barHeight / 2 + 5}" class="label">${labels[index]}</text>`;
        svg.innerHTML += `<rect x="${x + 10}" y="${y}" width="${barWidth}" height="${barHeight}" class="bar"></rect>`;
        svg.innerHTML += `<text x="${x - 20}" y="${y + barHeight / 2 + 5}" class="value">${data[index]}</text>`;
    });
}