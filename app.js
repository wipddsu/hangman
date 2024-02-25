const wordsBox = document.querySelector('.words');
const startBtn = document.getElementById('startGame');
const msgBox = document.querySelector('.message p');
let hangman;

class Hangman {
  constructor(word, life) {
    this.word = word.toUpperCase().split('');
    this.lifeCount = life;
    this.guessedLetters = [];
    this.remainLetters = '';
    this.gameStatus = 'playing';
  }

  getGuess(guess) {
    if (this.word.includes(guess.toUpperCase())) {
      this.guessedLetters.push(guess.toUpperCase());
      return true;
    } else {
      return false;
    }
  }

  puzzlize() {
    let puzzle = '';

    this.word.forEach((letter) => {
      if (this.guessedLetters.includes(letter) || letter === ' ') {
        puzzle += letter;
      } else {
        puzzle += '*';
      }
    });
    hangman.remainLetters = puzzle;

    return puzzle;
  }

  isMatch(guess) {
    const match = this.getGuess(guess);

    if (match) {
      render();
    } else {
      this.lifeCount -= 1;
      console.log(this.lifeCount);
    }
  }
}

function getKeyNum(e) {
  const guess = e.key;
  hangman.isMatch(guess);

  // 라이프가 0이 되면 이벤드 핸들러 제거 & 종료 메세지로 전환
  if (hangman.lifeCount === 0) {
    const answer = hangman.word.map((item) => `<span>${item}</span>`);

    wordsBox.innerHTML = answer.join('\n');
    msgBox.innerHTML = 'Failed😂 Try again!';
    document.removeEventListener('keydown', getKeyNum);
  }

  // 전부 맞췄을 경우 축하 메세지로 전환
  if (!hangman.remainLetters.includes('*')) {
    msgBox.innerHTML = 'Congratuation!🎉🎉';
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
  msgBox.innerHTML = `You have <span id="life">${hangman.lifeCount}</span> lives`;
  document.addEventListener('keydown', getKeyNum);
  console.log(hangman.word);

  render();
}

startBtn.addEventListener('click', startGame);
