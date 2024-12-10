function pokecardTemplate(pokeType, inDex, pokeName){
    return`
            <div class="pokeCard ${pokeType}_bg" name="${pokeName}" id="${pokeName}" onclick="renderPokeInfo(${inDex})">
                <div class="card_header d_flex">
                    <p class="single_index">#${inDex+1}</p>
                    <h2>${pokeName}</h2>
                    <p class="color_none">#${inDex+1}</p>
                </div>
                <img class="pokePic" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${inDex+1}.png" alt="picture of ${pokeName}">
            </div>
        `
}

function singleCardTemplate(inDex, pokeName, pokeType, pokeHp, pokeAttack, pokeDefense, pokeSpecialAttack, pokeSpecialDefense, pokeSpeed){
    return`
            <div class="single_card ${pokeType}_bg" id="single_card_${inDex}" onclick="
    stopBubbling(event)">
                <div class="single_card_header d_flex">
                    <p class="single_card_index">#${inDex+1}</p>
                    <h2 id="headline_normal${inDex}">${pokeName}</h2>
                    <h2 Class="headline_shiny d_none" id="headline_shiny${inDex}">Shiny ${pokeName}</h2>
                    <p class="color_none">#${inDex+1}</p>
                </div>
                <div class="nav_aria">
                    <img class="arrow_btn" onclick="goBack(${inDex})" src="./content/img/arrow-left.png" alt="arrow_left">
                    <img class="single_pokePic" id="pokePic${inDex}"onclick="toggleSinglePokePic(${inDex})" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${inDex+1}.png" alt="picture of ${pokeName}">
                    <img class="single_pokePic d_none" id="shinyPokePic${inDex}"onclick="toggleSinglePokePic(${inDex})" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${inDex+1}.png" alt="picture of shiny ${pokeName}">
                    <img class="arrow_btn" onclick="goNext(${inDex})" src="./content/img/arrow-right.png" alt="arrow_right">    
                </div>
                <div class="poke_infos">
                    <div class="stats">
                        <h3 class="stats_hl" onclick="toggleStats(${inDex})">Stats</h3>
                        <table id="stats_table_${inDex}">
                            <tr>
                                <td>hp:</td>
                                <td>${pokeHp}</td>
                            </tr>
                            <tr>
                                <td>attack:</td>
                                <td>${pokeAttack}</td>
                            </tr>
                            <tr>
                                <td>defense:</td>
                                <td>${pokeDefense}</td>
                            </tr>
                            <tr>
                                <td>special-attack:</td>
                                <td>${pokeSpecialAttack}</td>
                            </tr>
                            <tr>
                                <td>special-defense:</td>
                                <td>${pokeSpecialDefense}</td>
                            </tr>
                            <tr>
                                <td>speed:</td>
                                <td>${pokeSpeed}</td>
                            </tr>
                        </table>
                    </div>
                    <div>
                            <h3>old sound</h3>
                        <audio controls>
                            <source src="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${inDex+1}.ogg" type="audio/ogg">
                        </audio>
                            <h3>new sound</h3>
                        <audio controls>
                            <source src="https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${inDex+1}.ogg" type="audio/ogg">
                        </audio>
                    </div>
                </div>
            </div>`
}