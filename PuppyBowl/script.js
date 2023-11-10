// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ACC-ET-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const formEl = document.querySelector('form');


const state = {
    players: [],
};

// Get references to HTML elements
const playerId = document.querySelector("#playerId");
const playerName = document.querySelector("#playerName");
const playerBreed = document.querySelector("#breed");
const playerStatus = document.querySelector("#status");
const playerImageUrl = document.querySelector('#imageURL');
const playerList = document.getElementById('playerList');


/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
            const response = await fetch(APIURL);
            const data = await response.json();
            state.players = data.data;
    } catch (error) {
        console.error(error);
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        if (response.ok) {
            const data = await response.json();
            const player = json.data;
        } else {
            console.error(`Player #${playerId} not found.`);
        }
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, { // Use APIURL, not API_URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(playerObj),
        });
        if (response.ok) {
            formEl.reset();
            await fetchAllPlayers();
        } else {
            console.error('Error adding a new players.');
        }
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${id}`, {
            method: 'DELETE',
        });
        renderAllPlayers(state.players);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

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
 * API to get the details for a single players. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {

        // Clear the list before rendering
        playerList.innerHTML = "";
        state.players.forEach((player) => {
            const playerCard = document.createElement("li");
            playerCard.setAttribute('data-id', player.id);
            playerCard.innerHTML = `
            <h2>${player.name}</h2>
            <img src="${player.imageUrl}" alt="${player.name}" />
            <button data-id="${player.id}">Delete player</button>
            <button class="show-details-button" data-id="${player.id}">Show Details</button>
        `;

            // Add event listener for the "See Details" button
            playerCard.querySelector('.show-details-button').addEventListener('click', () => {
                const playerId = playerCard.getAttribute('data-id');
                fetchSinglePlayer(playerId);
            });

            // Add event listener for the "Remove from roster" button
            playerCard.querySelector('.remove-player-button').addEventListener('click', () => {
                const playerId = playerCard.getAttribute('data-id');
                removePlayer(playerId);
            });

            playerList.appendChild(playerCard);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    const formContainer = document.getElementById('new-player-form');
    formContainer.innerHTML = `
        <form>
            <label>
                Player ID
                <input type="text" id="id" name="playerId" />
            </label>
            <label>
                Player Name
                <input type="text" name="name" />
            </label>
            <label>
                Breed
                <input type="text" name="breed" />
            </label>
            <label>
                Status
                <input type="text" name="status" />
            </label>
            <label>
                Image Url
                <textarea name="imageURL"></textarea>
            </label>     
            <button>Add Player</button>
        </form>
    `;

    // Add an event listener to the form's submit button to call addNewPlayer function.
    formContainer.querySelector('form button').addEventListener('click', (event) => {
        event.preventDefault();
        const playerObj = {
            name: playerName.value,
            breed: playerBreed.value,
            status: playerStatus.value,
            imageUrl: playerImageUrl.value,
            playerId: playerId.value
        };
        addNewPlayer(playerObj);
    });
};


const init = async () => {
    await fetchAllPlayers();
    renderAllPlayers(state.players);
    renderNewPlayerForm();
}

init();