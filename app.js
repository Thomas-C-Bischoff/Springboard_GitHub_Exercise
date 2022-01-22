const letters = document.querySelectorAll(".letter");
const startGameButton = document.getElementById("startGameButton");
const gameboard = document.getElementById("gameboard");
const data = document.getElementById("data");
const guessCounter = document.getElementById("guessCounter");
const timer = document.getElementById("timer");
const victorySection = document.getElementById("victory");
const colors = ["red", "blue", "green", "orange", "purple", "red", "blue", "green", "orange", "purple"];

let pairs = 0;
let timerID = 0;
let seconds = 0;
let minutes = 0;

let guessCount = 0;
let matches = 0;
let previousCard = null;
let canClick = true;

let shuffledColors = Shuffle(colors);

function RandomRGB()
{
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`
}

setInterval(function()
{
    for (letter of letters)
    {
        letter.style.color = RandomRGB();
    }
},750);

function Timer()
{
    seconds++
    if (seconds === 60)
    {
        minutes++;
        seconds = 0;
    }
    if (seconds < 10)
    {
        timer.innerText = `Time Taken: ${minutes}:0${seconds}`;
    }
    else
    {
        timer.innerText = `Time Taken: ${minutes}:${seconds}`;
    }
}

function StartGame()
{
    startGameButton.classList.add("hidden");
    startGameButton.disabled = true;
    gameboard.classList.remove("hidden");
    pairs = gameboard.childElementCount / 2;
    data.classList.remove("hidden");
    timerID = setInterval(Timer, 1000);
}

function EndGame()
{
    clearInterval(timerID);
    gameboard.classList.add("hidden");
    victorySection.classList.remove("hidden");
    setTimeout(function(){document.location.reload(true)},3000);
}

startGameButton.addEventListener("click",StartGame)

function Shuffle(array)
{
    let counter = array.length;
    while (counter > 0)
    {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function CreateDivsForColors(colorArray)
{
    let cardPos = 1;
    for (let color of colorArray)
    {
        const newDiv = document.createElement("div");
        newDiv.classList.add(color);
        newDiv.classList.add("cardBack");
        newDiv.setAttribute("id",cardPos.toString());
        newDiv.addEventListener("click", HandleCardClick);
        gameboard.append(newDiv);
        cardPos++;
    }
}

function HandleCardClick(event)
{
    const target = event.target;
    if (canClick && !(target.classList.contains("matched")))
    {
        const target = event.target;
        event.target.classList.remove("cardBack");
        if (!previousCard)
        {
            previousCard = target;
        }
        else
        {
            guessCount++;
            guessCounter.innerText = `Guesses Taken: ${guessCount}`;
            if (!(target === previousCard))
            {
                canClick = false;
                if (target.className === previousCard.className)
                {
                    matches++;
                    if (matches === pairs)
                    {
                        EndGame();
                    }
                    else
                    {
                        setTimeout(function()
                        {
                            CardsMatch(target);
                        }, 500);
                    }
                }
                else
                {
                    setTimeout(function()
                    {
                        CardsDontMatch(target);
                    }, 1000);
                }
            }
        }
    }
}

function CardsMatch(currentCard)
{
    canClick = true;
    previousCard.classList.add("matched");
    currentCard.classList.add("matched");
    previousCard = null;
}

function CardsDontMatch(currentCard)
{
    canClick = true;
    previousCard.classList.add("cardBack");
    currentCard.classList.add("cardBack");
    previousCard = null;
}

CreateDivsForColors(shuffledColors);