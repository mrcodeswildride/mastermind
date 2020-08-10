let rows = document.getElementsByClassName(`row`)
let guessSquares = document.getElementsByClassName(`guess`)
let submitButtons = document.getElementsByClassName(`submit`)
let messageParagraph = document.getElementById(`messageParagraph`)

let colors = [`yellow`, `orange`, `red`, `green`, `blue`, `black`]
let answer = []
let activeRow = rows.length - 1

for (let i = 0; i < 4; i++) {
  let randomNumber = Math.floor(Math.random() * colors.length)
  answer[i] = colors[randomNumber]
}

for (let guessSquare of guessSquares) {
  guessSquare.addEventListener(`click`, makeGuess)
}

for (let submitButton of submitButtons) {
  submitButton.addEventListener(`click`, submitGuess)
}

function makeGuess() {
  if (this.classList.contains(`active`)) {
    this.style.backgroundColor = getNextColor(this.style.backgroundColor)
    
    let submitButton = this.parentElement.querySelector(`.submit`)
    submitButton.disabled = !isRowComplete(this.parentElement)
  }
}

function submitGuess() {
  let numBlack = 0
  let numWhite = 0
  let answerUsed = []
  let squares = this.parentElement.querySelectorAll(`.guess`)

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].style.backgroundColor == answer[i]) {
      numBlack++
      squares[i].classList.add(`used`)
      answerUsed[i] = true
    }
  }

  for (square of squares) {
    if (!square.classList.contains(`used`)) {
      for (let i = 0; i < answer.length; i++) {
        if (!answerUsed[i] && square.style.backgroundColor == answer[i]) {
          numWhite++
          square.classList.add(`used`)
          answerUsed[i] = true

          break
        }
      }
    }
  }

  showResult(this.parentElement, numBlack, numWhite)
}

function showResult(row, numBlack, numWhite) {
  let win = numBlack == 4
  let holes = row.querySelector(`.result`).children

  for (let hole of holes) {
    if (numBlack > 0) {
      hole.classList.add(`black`)
      numBlack--
    }
    else if (numWhite > 0) {
      hole.classList.add(`white`)
      numWhite--
    }
  }

  deactivateCurrentRow()

  if (win) {
    gameOver(true)
  }
  else if (activeRow == 0) {
    gameOver(false)
  }
  else {
    activateNextRow()
  }
}

function deactivateCurrentRow() {
  let squares = rows[activeRow].querySelectorAll(`.guess`)

  for (let square of squares) {
    square.classList.replace(`active`, `inactive`)
  }

  let submitButton = rows[activeRow].querySelector(`.submit`)
  submitButton.classList.remove(`submittable`)

  activeRow--
}

function activateNextRow() {
  let squares = rows[activeRow].querySelectorAll(`.guess`)

  for (let square of squares) {
    square.classList.add(`active`)
  }

  let submitButton = rows[activeRow].querySelector(`.submit`)
  submitButton.classList.add(`submittable`)
}

function gameOver(win) {
  let answerSquares = document.getElementsByClassName(`answer`)

  for (let i = 0; i < answerSquares.length; i++) {
    answerSquares[i].innerHTML = ``
    answerSquares[i].style.backgroundColor = answer[i]
  }

  messageParagraph.innerHTML = win ? `Good job!` : `You lose`
}

function getNextColor(currentColor) {
  if (currentColor == ``) {
    return colors[0]
  }

  for (let i = 0; i < colors.length; i++) {
    if (currentColor == colors[i]) {
      let nextColor = colors[i + 1]

      return nextColor == null ? `` : nextColor
    }
  }
}

function isRowComplete(row) {
  let squares = row.querySelectorAll(`.guess`)

  for (let square of squares) {
    if (square.style.backgroundColor == ``) {
      return false
    }
  }

  return true
}