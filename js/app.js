$(document).ready(init);

const $stars = $('.fa-star');
const $moves = $('.moves');
const $timer = $('.timer');
const $restart = $('.restart');
const $playAgain = $('.playAgain');
const $cards = $('.card');
const $cardsIcons = $('.card .fa');

let game = getInitialState();
let timer_start = false;
let total_moves = 0;
let total_cards = 16;
let cards_icons = [
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-leaf',
    'fa-leaf',
    'fa-bicycle',
    'fa-bicycle',
    'fa-bomb',
    'fa-bomb'
];
let open_card_icons = [];
let open_cards = [];

/**
* @description Initialization of the game
*/
function init() {
    //$('.modal').css('display', 'none');

    $moves.text('Moves: 0');
    $timer.text('Timer: 00:00');

    cards_icons = shuffle(cards_icons);
}

/**
* @description Initial state of different entities when the game starts or restarts
*/
function getInitialState() {
    return {
        clicks: 0,
        count: 0,
        moves: 0,
        timer: 0,
        stars: 3,
        displaySeconds: '',
        displayMinutes: '',
        displayTime: ''
    };
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    console.log('Cards_icons: ', array);
    shuffleCards(array);

    return array;
}

/**
* @description Shuffle all the card icons in the cards_icons array and arrange it in HTML
*/
function shuffleCards(cards_icons) {
    console.log('Array: ', cards_icons);

    $cardsIcons.each(function(index) {
        console.log('Icons[index] : ' + cards_icons[index]);
        $(this).addClass(cards_icons[index]);
    });
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$cards.on('click', clickcard);

function clickcard(e) {
    let result = false;
    let currentID = e.target.id;
    console.log('currentID: ' + currentID);

    if (timer_start == false) {
        timer_start = true;
        runTimer();
    }

    $('#'+currentID).unbind('click');

    showCard(currentID);
    updateCardDB(currentID);

    if (open_cards.length == 2) {
        movesCounter();
        let result = check_card_match();
        if (result == false) {
            hideCard(open_cards[0]);
            hideCard(open_cards[1]);
        }
        open_cards = [];
        open_card_icons = [];
    }
}

/**
* @description Start game timer
*/
function runTimer() {
    startCounting = setInterval(gameTimer, 1000);
}

/**
* @description Update game time
*/
function gameTimer() {
    let gameTimer = game.timer += 1;
    let seconds = (gameTimer >= 60) ? (gameTimer % 60) : gameTimer;
    let minutes = Math.floor(gameTimer / 60);
    let displayTime;

    game.displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    game.displayMinutes = minutes < 10 ? '0' + minutes : minutes
    displayTime = `Timer: ${game.displayMinutes}:${game.displaySeconds}`;

    $timer.text(displayTime);
}

/**
* @description Keep track of total moves and set the stars accordingly
*/
function movesCounter() {
    total_moves++;
    console.log('Total moves: ', total_moves);
    $('#moves').text('Moves: ' + total_moves);

    if (total_moves == 14) {
        stars = 2;
        document.getElementById('3star').classList.remove('fa-star');
    } else if (total_moves == 20) {
        stars = 1;
        document.getElementById('2star').classList.remove('fa-star');
    } else if (total_moves == 30) {
        stars = 0;
        document.getElementById('1star').classList.remove('fa-star');
    }
    console.log('Total stars: ', stars);
}

/**
* @description Check if two cards match
* - If the cards match keep it open
* - If the cards do not match, shake it and close the cards
*/
function check_card_match() {
    let result = false;

    if (open_card_icons[0] === open_card_icons[1]) {
        console.log('Cards match');
        result = true;
        hideCard(open_cards[0]);
        hideCard(open_cards[1])
        document.getElementById(open_cards[0]).classList.add('match');
        document.getElementById(open_cards[1]).classList.add('match');
        total_cards = total_cards - 2;

    } else {
        result = false;
        console.log('Cards do not match');
        $('#'+open_cards[0]).bind('click', clickcard);
        $('#'+open_cards[1]).bind('click', clickcard);
        shakeCard(open_cards[0]);
        shakeCard(open_cards[1]);
        hideCard(open_cards[0]);
        hideCard(open_cards[1]);
    }

    console.log('Total cards: ', total_cards);
    if (total_cards == 0) {
        console.log('Game Over!');
        gameOver();
    }
    return result;
}

/**
* @description Show cards
* @param {string} currentID - id of the card
*/
function showCard(currentID) {
    console.log('currentID: ', currentID);
    document.getElementById(currentID).classList.add('open', 'show');
}

/**
* @description Keep track of opened cards
* @param {string} currentID - id of the card
*/
function updateCardDB(currentID) {
    open_card_icons.push(cards_icons[currentID]);
    open_cards.push(currentID);

    console.log(open_card_icons);
    console.log(open_cards);
}

/**
* @description Shake card
* @param {string} ID - id of the card
*/
function shakeCard(id_) {
    document.getElementById(id_).classList.add('shake-slow', 'shake-constant');
}

/**
* @description Hide card
* @param {string} ID - id of the card
*/
function hideCard(_ID) {
    console.log('Hide card: ', _ID);

    window.setTimeout(function() {
        document.getElementById(_ID).classList.remove('show');
        document.getElementById(_ID).classList.remove('open');
        document.getElementById(_ID).classList.remove('shake-slow');
        document.getElementById(_ID).classList.remove('shake-constant');
    }, 1000);

}

$restart.on('click', function(e) {
    location.reload();
});

$playAgain.on('click', function(e) {
    $('.modal').css('display', 'none');
    location.reload();
});

/**
* @description When all cards in the deck are matched,
* - stop the timer
* - show a message to the user with score
* - show restart button with the message to play the game again
*/
function gameOver() {
    clearInterval(startCounting);

    showModal = setTimeout(function() {
        $('#timeScore').text('Total ' + $timer.text());
        $('#movesScore').text('Total Score: ' + total_moves);
        $('#starsScore').text('Total Stars: ' + stars);
        $('.modal').show();
    }, 500);
}