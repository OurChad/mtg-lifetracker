const setPlayerLife = (setLifeCallback) => (playerLifeContainer) => {
    const currentLife = Number.parseInt(playerLifeContainer.textContent);
    playerLifeContainer.textContent = setLifeCallback(currentLife);
}

const increment = (incrementBy = 1) => (amount) => amount + incrementBy;
const decrement = (decrementBy = 1) => (amount) => amount - decrementBy;

function increasePlayerLife({ target: { parentElement: { children } } }) {
    setPlayerLife(increment())(children.namedItem('playerLife'));
}

function decreasePlayerLife({ target: { parentElement: { children } } }) {
    setPlayerLife(decrement())(children.namedItem('playerLife'));
}

function generateRandomColorHex() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
}

(function setUp(numberOfPlayers = 4, startingLifeTotal = 40) {
    const lifeTrackerContainer = document.querySelector('.lifeTrackerContainer');
    for(let i = 1; i <= numberOfPlayers; i++) {
        const playerContainer = document.createElement('div');
        playerContainer.setAttribute('id', i);
        playerContainer.classList.add('playerContainer');
        playerContainer.style.backgroundColor = generateRandomColorHex();
        
        const incrementSpan = document.createElement('span');
        incrementSpan.onclick = increasePlayerLife;
        
        const playerLifeElement = document.createElement('div');
        playerLifeElement.classList.add('playerLife');
        playerLifeElement.setAttribute('id', 'playerLife');
        playerLifeElement.textContent = startingLifeTotal;
        
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
}())