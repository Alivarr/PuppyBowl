const cohortName = "2308-ACC-ET-WEB-PT-A";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const playerCards = document.querySelector("ul");
const formEl = document.querySelector("form");
const playerName = document.querySelector("#name");
const playerId = document.querySelector("#id");
const playerBreed = document.querySelector("#breed");
const playerStatus = document.querySelector("#status");
const playerImageUrl = document.querySelector("#imageUrl");
const state = {
  players: [],
};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
async function fetchAllPlayers() {
  try {
    const response = await fetch(APIURL);
    const data = await response.json();
   //console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function fetchSinglePlayer(playerId) {
  try {
    const response = await fetch(`${APIURL}/${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
function renderAllPlayers(state) {
  const template = state.players.map(player => {
      return (`<li>
                    <h2>${player.name}</h2>
                    <button class="delete-button">Delete player</button>
        <button class="details-button" data-name=${player.id}>Get Info</button>
                </li> `
      )
    }).join("");
  playerCards.innerHTML = template;
}

playerCards.addEventListener("click", async (e) => {
  if (e.target.matches(".details-button")) {
    const id = e.target.dataset.id;
    const player = await fetchSinglePlayer(id);
  }
});



formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
       await fetch(APIURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playerName.value,
          breed: playerBreed.value,
          status: playerStatus.value,
          imageUrl: playerImageUrl.value,
        }),
      });
  
      playerName.value,
        playerBreed.value,
        playerStatus.value,
        playerImageUrl.value;
      init();
    } catch (err) {
      console.error(err);
    }
  });

  
async function removePlayer(playerId) {
    try {
      const response = await fetch(`${APIURL}/${id}`, {
        method: "DELETE",
      });
      renderAllPlayers(state.players);
    } catch (err) {
      console.error(console.error(err));
    }
  }

  /**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
async function init () {
    const players = await fetchAllPlayers();
    renderAllPlayers(players.data);
  };
  
  init();
  