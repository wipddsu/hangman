const wordsBox = document.querySelector('.words');
const startBtn = document.getElementById('startGame');
const msgBox = document.querySelector('.message p');
let hangman;

function Hangman(word, life) {
  // property
  this.word = word.toUpperCase().split('');
  this.leftLife = life;
  this.guessedLetters = [];
  this.gameStatus = 'playing';

  // method
  this.getGuess = function (guess) {
    if (this.word.includes(guess.toUpperCase())) {
      this.guessedLetters.push(guess.toUpperCase());
      return true;
    } else {
      return false;
    }
  };

  this.puzzlize = function () {
    let puzzle = '';

    this.word.forEach((letter) => {
      if (this.guessedLetters.includes(letter) || letter === ' ') {
        puzzle += letter;
      } else {
        puzzle += '*';
      }
    });
    return puzzle;
  };
}

function getKeyNum(e) {
  const guess = e.key;
  const match = hangman.getGuess(guess);
  const lifeCount = document.getElementById('life');

  // match 값이 true일 경우에만 매치된 글자 렌더링
  if (match) {
    render();
  } else {
    hangman.leftLife -= 1;
    lifeCount.textContent = hangman.leftLife;
  }

  // 라이프가 0이 되면 이벤드 핸들러 제거 & 종료 메세지로 전환
  if (hangman.leftLife === 0) {
    const answer = hangman.word.map((item) => `<span>${item}</span>`);

    wordsBox.innerHTML = answer.join('\n');
    msgBox.innerHTML = 'Failed😂 Try again!';
    document.removeEventListener('keydown', getKeyNum);
  }
}

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

  hangman
    .puzzlize()
    .split('')
    .forEach((el) => {
      const span = document.createElement('span');
      span.textContent = el.toUpperCase();
      wordsBox.append(span);
    });
}

async function startGame() {
  const word = await getWords(2);
  hangman = new Hangman(word, 10);
  msgBox.innerHTML = `You have <span id="life">10</span> lives`;
  document.addEventListener('keydown', getKeyNum);

  render();
}

startBtn.addEventListener('click', startGame);
