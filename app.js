const wordsBox = document.querySelector('.words');
const startBtn = document.getElementById('startGame');
let hangman;

function Hangman(word, life) {
  this.word = word.toUpperCase().split('');
  this.leftlife = life;
  this.guessLetter = '';
  this.remainLetter = this.word.map((el) => (el !== ' ' ? '*' : el));
  this.status = false;
  this.copy = [...this.word];

  this.getGuess = function (guess) {
    if (this.word.includes(guess.toUpperCase())) {
      return guess.toUpperCase();
    } else {
      return;
    }
  };

  this.puzzlize = function () {
    const target = this.guessLetter;

    if (!this.status) {
      this.status = !this.status;
      return this.remainLetter;
    } else {
      const index = this.copy.indexOf(this.guessLetter);

      if (index !== -1) {
        this.copy.splice(index, 1, '*');
        this.remainLetter.splice(index, 1, this.guessLetter);
      }

      return this.remainLetter;
    }
  };

  this.match = function (letter) {
    const index = this.word.indexOf(letter);
    this.guessLetter = letter;
  };
}

function getKeyNum(e) {
  const guess = e.key;
  const matchLetter = hangman.getGuess(guess);

  if (matchLetter) {
    hangman.match(matchLetter);
  } else {
    return;
  }

  render();
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

function render() {
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
