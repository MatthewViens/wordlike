const gameBoard = document.getElementById('game-board')

let allLetters = []
let currentGuessWord = 0
let currentGuessLetter = 0
let currentGuessValue = ''
let currentWord = getCurrentWord()
let gameOver = false

for (let i = 0; i < 6; i++) {
    allLetters[i] = []
    guessWord = document.createElement("div")
    guessWord.classList.add("word")
    gameBoard.appendChild(guessWord)
    for(let j = 0; j < 5; j++) {
        let guessLetter = document.createElement('div')
        guessLetter.classList.add("guess-letter")
        guessWord.appendChild(guessLetter)
        allLetters[i].push(guessLetter)
    }
}

let currentGuess = allLetters[currentGuessWord][currentGuessLetter]

document.addEventListener("keydown", handleGuess)

function handleGuess(e) {
    switch(e.key) {
        case "Enter":
            submitGuess()
            break
        case "Backspace":
            deleteGuess()
            break
        default:
            inputGuess(e.key)
    }
}

async function getCurrentWord() {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day")
    const data = await response.json()
    currentWord = data.word.toUpperCase()
}

async function submitGuess() {
    if (currentGuessValue.length === 5) {
        let response = await validateWord({word: currentGuessValue})
        let isValidWord = response.validWord
        if(isValidWord) {
            handleValidGuess()
        } else {
            allLetters[currentGuessWord].forEach(function(el) {
                el.animate(
                    [
                        { borderColor: '#D90202'},
                        { borderColor: "#CCC"}
                    ], {
                        duration: 1000
                    }
                )
            })
        }
    }
}

function handleValidGuess() {
    let currentGuessValueLetters = currentGuessValue.split('') 
    let currentWordLetters = currentWord.split('')
    const wordMap = createWordMap(currentWordLetters)
    for (let i = 0; i < currentWordLetters.length; i++) {
        if (currentWordLetters[i] === currentGuessValueLetters[i]) {
            allLetters[currentGuessWord][i].classList.add("correct-letter")
            wordMap[currentGuessValueLetters[i]]--
        }
    }
    for (let i = 0; i < currentWordLetters.length; i++) {
        if (currentWordLetters[i] === currentGuessValueLetters[i]) {

        } else if (currentWordLetters.includes(currentGuessValueLetters[i]) && wordMap[currentGuessValueLetters[i]] > 0) {
            wordMap[currentGuessValueLetters[i]]--
            allLetters[currentGuessWord][i].classList.add("close-answer")
        } else {
            allLetters[currentGuessWord][i].classList.add("wrong-answer")
            console.log("wrong answer")
        }
    }
    currentGuessWord++
    currentGuessLetter = 0
    checkForGameOver()
    currentGuessValue = ''
    if(!gameOver) {
        currentGuess = allLetters[currentGuessWord][currentGuessLetter]
    }
}

function deleteGuess() {
    if (currentGuessLetter > 0) {
        if (currentGuessValue.length !== 5) {
            currentGuessLetter--
        }
        currentGuess = allLetters[currentGuessWord][currentGuessLetter]
        currentGuess.textContent = ''
        currentGuessValue = currentGuessValue.slice(0, -1)
    } 
}

function inputGuess(letter) {
    letter = letter.toUpperCase()
    if (isLetter(letter) && currentGuessValue.length < 5) {
        currentGuess.textContent = letter
        currentGuessValue += letter
        if (currentGuessLetter < 4) {
            currentGuessLetter++
        }
        currentGuess = allLetters[currentGuessWord][currentGuessLetter]
    }
}

function checkForGameOver() {
    if (currentGuessWord === 6) {
        setTimeout(function(){alert("You Lose")}, 1000)
        gameOver = true
    } if (currentGuessValue === currentWord) {
        setTimeout(function(){alert("You Win")}, 1000)
        gameOver = true
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  async function validateWord(word) {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(word)
    })
    return response.json()
  }

  function createWordMap(wordArray) {
    const map = {}
    for (let i = 0; i < wordArray.length; i++) {
        if (map[wordArray[i]]) {
            map[wordArray[i]]++
        } else {
            map[wordArray[i]] = 1
        }
    }
    return map
  }