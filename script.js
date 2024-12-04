// basic-url (30 Pkmn):   https://pokeapi.co/api/v2/pokemon?limit=30&offset=0  (0 = start bei index 1(mehr laden += index))
// detail-url (last nr = index):  https://pokeapi.co/api/v2/pokemon/2

function init(){
    getData()
}
async function getData() {
    let pkmnResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
    let pkmnResponseJson = await pkmnResponse.json();
    console.log(pkmnResponseJson);
    
    let pokedex = pkmnResponseJson['results'];
    console.log(pokedex);
    getDetails(pokedex)
}

async function getDetails(pokedex){
    let pokedexRef = document.getElementById('pokedex')
    pokedexRef.innerHTML = "";
    for (let mainIndex = 0; mainIndex < pokedex.length; mainIndex++) {
        let detailDex = await fetch(`https://pokeapi.co/api/v2/pokemon/${mainIndex+1}`)
        let detailDexJson = await detailDex.json();
        let typeOne = await detailDexJson.types[0].type.name
        console.log(typeOne);
        
        //let typeTwo = await detailDexJson.types[1].type.name
        console.log(detailDexJson.forms[0].name);
        let text = `${detailDexJson.forms[0].name}`;
        let nameUpperCase = text.toUpperCase();    
        pokedexRef.innerHTML += `
        <div class="pokeCard ${typeOne}_bg" id="${typeOne}">
            <div class="card_header d_flex">
                <p class="single_index">#${mainIndex+1}</p>
                <h2>${nameUpperCase}</h2>
                <p class="color_none">#${mainIndex+1}</p>
            </div>
            <img class="pokePic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${mainIndex+1}.png" alt="picture of ${detailDexJson.forms[0].name}">
        </div>
        `
        
    }
    
}
//ToDos
// -get Data async-function erstellen
//      -promise für Ladezeit erstellen
// -Einzelansicht-Overlay erstellen
//      -zu öffnende Unter-Menüs mit weitere Details (Template / d-none)
//      -Pfeile zum Blättern zwischen pkm n (bei #1 nur "weiter-Pfeil")
//      -kein Scrolling im Hintergrund, wenn Karte offen
//      -Karte schließen durch Klick außerhalb (Event-bubbling)
// -Weitere Punkte:
//      -Suchfunktion auf Suchfeld im Header
//      -Button für 30 weitere Pkmn laden
//      -Ladescreen (drehender Pokéball)