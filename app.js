const wordsBox = document.querySelector('.words');
const startBtn = document.getElementById('startGame');
let hangman;

function Hangman(word, life) {
  this.word = word.toUpperCase().split('');
  this.life = life;

  this.getGuess = function (guess) {
    if (this.word.includes(guess.toUpperCase())) {
      return guess.toUpperCase();
    } else {
      return;
    }
  };

  this.puzzlize = function () {
    return this.word.map((el) => (el !== ' ' ? '*' : el));
  };

  this.match = function (letter) {
    letter = letter.toUpperCase();
    index = this.word.indexOf(letter);

    console.log(index);
  };
}

function getKeyNum(e) {
  const guess = e.key;
  const matchLetter = hangman.getGuess(guess);

  if (matchLetter) {
    hangman.match(matchLetter);
  }
}
document.addEventListener('keydown', getKeyNum);

async function getWords(wordCount) {
  const response = await fetch(`https://puzzle.mead.io/puzzle?wordCount=${wordCount}`);
  if (response.status === 200) {
    const data = await response.json();
    return data.puzzle;
  } else {
    throw new Error('Failed to get puzzle data');
  }
}

function render(word) {
  wordsBox.innerHTML = '';

  hangman.puzzlize().forEach((el) => {
    const span = document.createElement('span');
    span.innerText = el.toUpperCase();
    wordsBox.append(span);
  });
}

async function startGame() {
  const word = await getWords(2);
  hangman = new Hangman(word, 5);

  render();
}

startBtn.addEventListener('click', startGame);
