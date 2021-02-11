const {
  GAME_SPEED,
  DIRECTION_RIGHT,
  DIRECTION_LEFT,
} = require('./constants')

class Game {
  constructor(ui) {
    this.ui = ui

    this.reset()

    this.ui.bindHandlers(
      this.changeDirection.bind(this),
      this.quit.bind(this),
      this.start.bind(this)
    )
  }

  reset = () => {

    this.bugArr = []
    this.developer = Math.floor(this.ui.gameContainer.width / 2)

    this.score = 0
    this.timer = null

    this.ui.resetScore()
    this.ui.render()
  }

  addBug = () => {
    const randomBug = this.generateRandomPixelCoord(0, this.ui.gameContainer.width - 1)
    this.bugArr.unshift(randomBug)
    if(this.bugArr.length >= this.ui.gameContainer.height) {
      this.bugArr.pop()
    }
  }

  drawBug = () => {
    this.bugArr.forEach((x, y) => {
      this.ui.draw({
        x: x,
        y: y + 1
      }, "blue")
    }) 
  }

  drawDeveloper = () => {
    this.ui.draw({
      x: this.developer,
      y: this.ui.gameContainer.height - 1
    }, "red")
  }

  changeDirection(_, key) {
    if ((key.name === DIRECTION_LEFT || key.name === 'a')) {
      if (this.developer > 0) this.developer = this.developer - 1
    }
    if ((key.name === DIRECTION_RIGHT || key.name === 'd')) {
      if (this.developer < this.ui.gameContainer.width - 1) this.developer = this.developer + 1
    }
  }

  generateRandomPixelCoord(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  isGameOver = () => {
    if (this.bugArr.length === this.ui.gameContainer.height - 1) {
      return this.bugArr[this.bugArr.length - 1] === this.developer
    }
  }

  showGameOverScreen = () => {
    this.ui.gameOverScreen()
    this.ui.render()
  }

  tick = () => {
    this.ui.clearScreen()
    this.ui.updateScore(++this.score)
    this.addBug()
    this.drawBug()
    this.drawDeveloper()
    this.ui.render()


    if (this.isGameOver()) {
      this.showGameOverScreen()
      clearInterval(this.timer)
      this.timer = null

      return
    }
  }

  start = () => {
    if (!this.timer) {
      this.reset()

      this.timer = setInterval(this.tick.bind(this), GAME_SPEED)
    }
  }

  quit = () => {
    process.exit(0)
  }
}

module.exports = { Game }
