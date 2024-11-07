let arrayPokemon = []; // Inicializar el arreglo;
let arrayPokeDesc = [];
let pokeApi = "https://pokeapi.co/api/v2/pokemon/";
let pokeDescApi = "https://pokeapi.co/api/v2/pokemon-species/";

const pantallaCarga = document.getElementById('pantallaCarga');
const pokeAudio = document.querySelector(".poke-audio")

async function consultaPokeApi() {
    try {
        for (let i = 152; i <= 251; i++) {
            const resultadoEnBruto = await fetch(pokeApi + i);
            const resultadoJSON = await resultadoEnBruto.json();
            arrayPokemon.push(resultadoJSON);
        }

        if (arrayPokemon) {
            pantallaCarga.style.display = 'none';
            return arrayPokemon
        }


    } catch (error) {
        console.log(`Error en la promesa: ${error}`);
    }
}

async function consultaPokeDescApi() {
    try {
        for (let i = 152; i <= 251; i++) {
            const resultadoEnBruto2 = await fetch(pokeDescApi + i);
            const resultadoJSON2 = await resultadoEnBruto2.json();
            arrayPokeDesc.push(resultadoJSON2);
        }

        return arrayPokeDesc;

    } catch (error) {
        console.log(`Error en la promesa: ${error}`);
    }
}

window.addEventListener('load', async () => {
    const listadoPokemon = await consultaPokeApi();
    const listadoPokeDesc = await consultaPokeDescApi();
    // arrayPokemon = listadoPokemon;
    console.log(arrayPokemon)
    mostrarPokemon();
});

function mostrarPokemon() {

    const pokemonList = document.querySelector("#poke-lista");
    const pokemonImg = document.querySelector("#poke-image");

    const img = document.createElement("img");
    const infoDiv = document.createElement("div");
    const audio = document.createElement("audio");

    // const audio = document.createElement("audio");
    // audio.volume = 0.5;
    // audio.preload = "auto";
    // audio.src = pokemon.cries.legacy;
    // audio.play()
    // document.body.appendChild(audio);

    arrayPokemon.map((pokemon, index) => {

        const div = document.createElement("div");
        div.classList.add("poke-card", "row", "text-center");

        let tipos = pokemon.types.map((type) => `<p class="col-4 ${type.type.name} me-2">${type.type.name}</p>`);
        tipos = tipos.join(' ');

        const descDiv = arrayPokeDesc[index].flavor_text_entries.find(texto => texto.language.name === "es").flavor_text;
        const categoria = arrayPokeDesc[index].genera.find(gen => gen.language.name === 'es');

        div.addEventListener("mouseover", () => {

            img.src = div.childNodes[3].childNodes[0].src;

            infoDiv.innerHTML = `
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">

                    <div class="modal-body poke-body row">
                        <button type="button" class="btn-close poke-header" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                        <div class="col-5 a"><div>
                            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="">
                        </div></div>
                        <div class="col-7 b">
                            <div class="">
                                <div class="h1 text-center">
                                    <div class="">N.º ${pokemon.id} <big class="fw-bold">${pokemon.name}</big></div>
                                </div>
                                <div class="text-center bg-poke p-3 text-black h2">
                                    <div class="">${categoria.genus}</div>
                                </div>

                                <div class="text-center bg-poke p-3 text-light h3">
                                    <div class="mb-5 row justify-content-center">
                                     ${tipos}
                                    </div>
                                    <div class="row justify-content-between">

                                        <div class=" poke-altura ">Alt.</div>
                                        <div class="poke-peso">Peso</div>
                                        <p class="col-6 text-black">${pokemon.height} m.</p>
                                        <p class="col-6 text-black">${pokemon.weight} kg.</p>
                                    </div>
                                    
                                </div>
                                <div class="row justify-content-between align-items-center">
                                    <div class="col-3 text-center">

                                        <img  src="${pokemon.sprites.front_default}" widght="200" height="200" alt="">
                                    </div>
                                    <div class="col-3 text-center">
                                        <img  src="${pokemon.sprites.back_default}" widght="200" height="200" alt="">
                                    </div>
                                    <div class="col-3 text-center">
                                        <img  src="${pokemon.sprites.front_shiny}" widght="200" height="200" alt="">
                                    </div>
                                    <div class="col-3 text-center">
                                        <img  src="${pokemon.sprites.back_shiny}" widght="200" height="200" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 c">
                            <div class="poke-desc">${descDiv}</div>
                        </div>
                    </div>

                </div>
            </div>

        </div> 
            `;

            // Audio de cada pokemon 
            audio.volume = 0.30;
            audio.preload = "auto";
            audio.src = pokemon.cries.legacy;
            document.body.appendChild(audio);

            const modalElement = document.getElementById("staticBackdrop");

            modalElement.addEventListener("show.bs.modal", () => {
                audio.play()
            });

            modalElement.addEventListener("hide.bs.modal", () => {
                audio.pause();
                audio.currentTime = 0;
            });

        });

        div.innerHTML = `                        
            <div class="col-2 poke-audio" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><img
                src="https://static-00.iconduck.com/assets.00/pokeball-icon-2048x2046-npbb7ah7.png"
                alt=""></div>
            <div class="col-2"><img
                src="${pokemon.sprites.other["official-artwork"].front_default}"
                alt=""></div>
            <div class="col-4">N.º ${pokemon.id} </div>
            <div class="col-4 text-start">${pokemon.name}</div>
        `;
        pokemonList.append(div);
        pokemonImg.append(img);
        pokemonList.append(infoDiv);

    });

}