const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2308-ACC-ET-WEB-PT-A/players`;

const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const playerCards = document.querySelector("ul");
const formEl = document.querySelector("form");
const playerName = document.querySelector("#name");
const playerId = document.querySelector("#id");
const playerBreed = document.querySelector("#breed");
const playerStatus = document.querySelector("#status");
const playerImageUrl = document.querySelector("#imageUrl");
const everyPlayer = document.querySelector("#eachPlayer")
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
    state.players = data.players;
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function fetchSinglePlayer(id) {
  try {
    const response = await fetch(`${APIURL}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch player.');
    }

    return data.players;
  } catch (error) {
    console.error(error);
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
      <div class="player-details" style="display: none;">
        <p>Breed: ${player.breed}</p>
        <p>Status: ${player.status}</p>
        <img src="${player.imageUrl}" alt="${player.name}">
      </div>
      <button class="details-button" data-id="${player.id}">Get Info</button>
      <button class="delete-button" data-id="${player.id}">Delete Player</button>
  </li> `
    )
  }).join("");
  playerCards.innerHTML = template;
}


/**
* It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
* fetches all players from the database, and renders them to the DOM.
*/
async function init() {
  const players = await fetchAllPlayers();
  renderAllPlayers(players.data);
};

init();



formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    await fetch(APIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    formEl.reset();
  } catch (err) {
    console.error(err);
  }
  init();
});


async function removePlayer(id) {
  try {
    const response = await fetch(`${APIURL}/${id}`, {
      method: "DELETE",
    });
    await init();
  } catch (err) {
    console.error(err);
  }
  init();
}


document.body.addEventListener('click', async function (event) {
  if (event.target.classList.contains('details-button')) {
    const id = event.target.getAttribute('data-id');
    const playerDetails = event.target.parentNode.querySelector('.player-details');
    if (playerDetails.style.display === 'none') {
      playerDetails.style.display = 'block';
    } else {
      playerDetails.style.display = 'none';
    }
  } else if (event.target.classList.contains('delete-button')) {
    const id = event.target.getAttribute('data-id');
    if (id) {
      try {
        await removePlayer(id);
        fetchAllPlayers().then(players => {
          if (players) {
            renderAllPlayers(players);
          }
        });
      } catch (error) {
        console.error('Failed to delete player:', error);
      }
    } else {
      console.error('Failed to retrieve player ID');
    }
  }
});