const wordsBox = document.querySelector('.words');
const startBtn = document.getElementById('startGame');

function Hangman() {}

function getKeyNum(e) {
  console.log(e.keyCode);
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
  word.map((el) => {
    el = el !== ' ' ? '*' : el;
    const span = document.createElement('span');
    span.innerText = el.toUpperCase();
    wordsBox.append(span);
  });
}

async function startGame() {
  const word = await getWords(2);

  if (wordsBox.querySelector('span')) {
    const wordsList = wordsBox.querySelectorAll('span');
    for (const el of wordsList) {
      el.remove();
    }
  }

  render(word.split(''));
}

startBtn.addEventListener('click', startGame);
