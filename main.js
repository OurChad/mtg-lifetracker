const setPlayerLife = (setLifeCallback) => (playerId) => (playerLifeContainer) => {
    const currentLife = Number.parseInt(playerLifeContainer.textContent);
    const newLifeTotal = setLifeCallback(currentLife);
    const currentGameState = getGameState();
    currentGameState.players[playerId].lifeTotal = newLifeTotal;
    setGameState(currentGameState);
    playerLifeContainer.textContent = setLifeCallback(currentLife);
}

const increment = (incrementBy = 1) => (amount) => amount + incrementBy;
const decrement = (decrementBy = 1) => (amount) => amount - decrementBy;

function increasePlayerLife({ target: { parentElement } }) {
    const { children, id: playerId } = parentElement;
    setPlayerLife(increment())(playerId)(children.namedItem('playerLife'));
}

function decreasePlayerLife({ target: { parentElement } }) {
    const { children, id: playerId } = parentElement;
    setPlayerLife(decrement())(playerId)(children.namedItem('playerLife'));
}

function generateRandomColorHex() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

const initialGameState = {
    options: {},
    players: {}
}

function getGameState() {
    return JSON.parse(localStorage.getItem('state')) || initialGameState;
}

function setGameState(newGameState) {
    const gameState = JSON.parse(localStorage.getItem('state'));
    localStorage.setItem('state', JSON.stringify({
        ...gameState,
        ...newGameState,
    }));
}

function resetGameState() {
    setGameState(initialGameState);
}

const setPlayerColor = (playerId) => ({ target: { value: color }}) => {
    const currentGameState = getGameState();
    currentGameState.options[playerId].backgroundColor = color;
    setGameState(currentGameState);
    const playerContainer = document.getElementById(playerId);
    playerContainer.style.backgroundColor = color;
}

function toggleSettings() {
    const settingsContainer = document.querySelector('.settingsContainer');
    settingsContainer.toggleAttribute('visible');
}

(function setUp(numberOfPlayers = 4, startingLifeTotal = 40) {
    const gameState = getGameState();
    const lifeTrackerContainer = document.querySelector('.lifeTrackerContainer');
    for(let i = 1; i <= numberOfPlayers; i++) {
        const playerId = `player_${i}`;
        gameState.options[playerId] = {
            backgroundColor: gameState?.options[playerId]?.backgroundColor ?? generateRandomColorHex(),
        }
        gameState.options[playerId].backgroundColor = gameState?.options[playerId]?.backgroundColor ?? generateRandomColorHex();
        gameState.players[playerId] = {
            lifeTotal: gameState?.players[playerId]?.lifeTotal ?? startingLifeTotal
        }

        const playerContainer = document.createElement('div');
        playerContainer.setAttribute('id', playerId);
        playerContainer.classList.add('playerContainer');
        playerContainer.style.backgroundColor = gameState.options[playerId].backgroundColor;
        
        const incrementSpan = document.createElement('span');
        incrementSpan.onclick = increasePlayerLife;
        
        const playerLifeElement = document.createElement('div');
        playerLifeElement.classList.add('playerLife');
        playerLifeElement.setAttribute('id', 'playerLife');
        playerLifeElement.textContent = gameState.players[playerId].lifeTotal;
        
        const decrementSpan = document.createElement('span');
        decrementSpan.onclick = decreasePlayerLife;
        
        if(i <= 2) {
            decrementSpan.classList.add('topButton');
            incrementSpan.classList.add('bottomButton');
            playerLifeElement.style.transform = 'rotate(180deg)';
            playerContainer.append(decrementSpan, playerLifeElement, incrementSpan);
        } else {
            incrementSpan.classList.add('topButton');
            decrementSpan.classList.add('bottomButton');
            playerContainer.append(incrementSpan, playerLifeElement, decrementSpan);
        }
        lifeTrackerContainer.append(playerContainer);
    }

    const settingsIcon = document.getElementById('settingsIcon');
    settingsIcon.onclick = toggleSettings;
    const closeSettingsIcon = document.getElementById('closeSettingsIcon');
    closeSettingsIcon.onclick = toggleSettings;

    const optionsElement = document.querySelector('.options');
    Object.entries(gameState.options).forEach(([playerId, playerOptions]) => {
        const playerOptionsElement = document.createElement('div');
        const playerOptionsHeaderElement = document.createElement('h2');
        playerOptionsHeaderElement.textContent = playerId;

        const playerBackgroundColorPicker = document.createElement('input');
        playerBackgroundColorPicker.setAttribute('id', `${playerId}_backgroundColor`);
        playerBackgroundColorPicker.type = 'color';
        playerBackgroundColorPicker.value = playerOptions.backgroundColor;
        playerBackgroundColorPicker.onchange = setPlayerColor(playerId);
        const playerBackgroundColorPickerLabel = document.createElement('label');
        playerBackgroundColorPickerLabel.for = `${playerId}_backgroundColor`;
        playerBackgroundColorPickerLabel.textContent = 'Color';

        playerOptionsElement.append(playerOptionsHeaderElement, playerBackgroundColorPicker, playerBackgroundColorPickerLabel);
        optionsElement.append(playerOptionsElement);
    })

    setGameState(gameState);
}())