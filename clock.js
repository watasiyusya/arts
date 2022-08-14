const FRAME_RATE = 3

const SMALL_DOT_DIAMETER_PX = 2

function ellipse_color(x, y, diameter, colorCode) {
    const c = color(colorCode);
    fill(c)
    noStroke();
    ellipse(x, y, diameter)
}

class DigitalSmallDot {
  constructor(x, y, diameter) {
    this.x = x
    this.y = y
    this.diameter = diameter
  }

  draw () {
    const c = color('rgba(100%, 100%, 100%, 0.5)');
    ellipse_color(this.x, this.y, this.diameter, c)
  }
}

class DigitalDot {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.dots = []

    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 12; y++) {
        let d = SMALL_DOT_DIAMETER_PX

        if (
          (x === 0 && (y === 0 || y === 11)) ||
          (x === 11 && (y === 0 || y === 11))
        ) {
          d = SMALL_DOT_DIAMETER_PX / 2.5
        } else if (
          (x === 0 && (y === 1 || y === 10)) ||
          (x === 1 && (y === 0 || y === 11)) ||
          (x === 10 && (y === 0 || y === 11)) ||
          (x === 11 && (y === 1 || y === 10))
        ) {
          d = SMALL_DOT_DIAMETER_PX / 2.0
        } else if (
          (x === 0 && (y === 2 || y === 9)) ||
          (x === 1 && (y === 1 || y === 10)) ||
          (x === 2 && (y === 0 || y === 11)) ||
          (x === 9 && (y === 0 || y === 11)) ||
          (x === 10 && (y === 1 || y === 10)) ||
          (x === 11 && (y === 2 || y === 9))
        ) {
          d = SMALL_DOT_DIAMETER_PX / 1.5
        }

        this.dots.push(new DigitalSmallDot(
          this.x + x*(SMALL_DOT_DIAMETER_PX + 1),
          this.y + y*(SMALL_DOT_DIAMETER_PX + 1),
          d
        ))
      }
    }
  }

  draw () {
    for(const dot of this.dots) {
      dot.draw()
    }
  }
}

class DigitalNumber {
  constructor(number, positions) {
    this.number = number
    this.dots = []
    for (const p of positions) {
      const y = p[0]
      const x = p[1]
      this.dots.push(new DigitalDot(
        x * (SMALL_DOT_DIAMETER_PX + 1) * 12,
        y * (SMALL_DOT_DIAMETER_PX + 1) * 12,
      ))
    }
  }

  draw () {
    for (const d of this.dots) {
      d.draw()
    }
  }
}

class DigitalClock {
  constructor() {
    this.numbers = []
    this.numbers.push(new DigitalNumber(0, [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [0, 1], [4, 1]
    ]))
    this.numbers.push(new DigitalNumber(1, [
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    ]))
    this.numbers.push(new DigitalNumber(2, [
      [0, 0], [0, 1], [0, 2],
      [2, 0], [2, 1], [2, 2],
      [4, 0], [4, 1], [4, 2],
      [1, 2], [3, 0],
    ]))
    this.numbers.push(new DigitalNumber(3, [
      [0, 0], [0, 1], [0, 2],
      [2, 0], [2, 1], [2, 2],
      [4, 0], [4, 1], [4, 2],
      [1, 2], [3, 2],
    ]))
    this.numbers.push(new DigitalNumber(4, [
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [0, 0], [1, 0], [2, 0],
      [2, 1],
    ]))
    this.numbers.push(new DigitalNumber(5, [
      [0, 0], [0, 1], [0, 2],
      [2, 0], [2, 1], [2, 2],
      [4, 0], [4, 1], [4, 2],
      [1, 0], [3, 2],
    ]))
    this.numbers.push(new DigitalNumber(6, [
      [0, 0], [0, 1], [0, 2],
      [2, 0], [2, 1], [2, 2],
      [4, 0], [4, 1], [4, 2],
      [1, 0], [3, 0], [3, 2]
    ]))
    this.numbers.push(new DigitalNumber(7, [
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [0, 0], [0, 1],
    ]))
    this.numbers.push(new DigitalNumber(8, [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [0, 1], [2, 1], [4, 1]
    ]))
    this.numbers.push(new DigitalNumber(9, [
      [0, 0], [0, 1], [0, 2],
      [2, 0], [2, 1], [2, 2],
      [4, 0], [4, 1], [4, 2],
      [1, 0], [1, 2], [3, 2]
    ]))
  }

  draw () {
    const offsetWidth = (SMALL_DOT_DIAMETER_PX + 1) * 12 * 4
    const offsetHeight = (SMALL_DOT_DIAMETER_PX + 1) * 12 * 6

    const h = hour();
    const m = minute();
    const s = second();
    const h2 = floor(h / 10)
    const h1 = h - (h2 * 10)
    const m2 = floor(m / 10)
    const m1 = m - (m2 * 10)
    const s2 = floor(s / 10)
    const s1 = s - (s2 * 10)

    translate(windowWidth / 2 - offsetWidth * 2, windowHeight / 2 - offsetHeight);
    this.numbers[h2].draw()

    translate(offsetWidth, 0);
    this.numbers[h1].draw()

    translate(offsetWidth, 0);
    this.numbers[m2].draw()

    translate(offsetWidth, 0);
    this.numbers[m1].draw()

    translate(-offsetWidth, offsetHeight);
    this.numbers[s1].draw()

    translate(-offsetWidth, 0);
    this.numbers[s2].draw()
  }
}

const clock = new DigitalClock()

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FRAME_RATE)
}

function draw() {
  clear()
  createCanvas(windowWidth, windowHeight);
  background('#333')
  clock.draw()
}
