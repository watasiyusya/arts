const FRAME_RATE = 10
const SPEED_MAX_PARTICLE = 4
const LIFE_MAX_PARTICLE = 2

let sound

function text_color(t, x, y, colorCode) {
  const c = color(colorCode)
  fill(c)
  textSize(32)
  text(t, x, y)
}


function ellipse_color(x, y, diameter, colorCode) {
    const c = color(colorCode);
    fill(c)
    noStroke();
    ellipse(x, y, diameter)
}

class Color {
  constructor(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
  }
}

class ShiningParticle {
  constructor(x, y, diameter, lifetimeSecs, baseColor) {
    this.x = x
    this.y = y
    this.diameter = diameter
    this.lifetimeSecs = lifetimeSecs
    this.lapseTimeSecs = 0
    this.baseColor = baseColor
  }

  move () {
    this.lapseTimeSecs += 1 / FRAME_RATE
  }

  isStopped () {
    if (this.lifetimeSecs <= this.lapseTimeSecs) {
      return true
    }
    return false
  }

  draw () {
    const p = (1 - (this.lapseTimeSecs / (this.lifetimeSecs))).toFixed(2) + 30
    // [1.00, 0.70]
    const r = 1 - (Math.random() * 30 / 100)
    const pr = p * r
    const c = color(`rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${pr})`);
    ellipse_color(this.x, this.y, this.diameter * p, c)
  }
}

class TrajectoryParticle {
  constructor(x, y, diameter, rad, speed, baseColor) {
    this.x = x
    this.y = y
    this.diameter = diameter
    this.rad = rad
    this.speed = speed
    this.baseColor = baseColor
    this.particles = []
  }

  move () {
    this.speed -= 1 / FRAME_RATE
    if (this.speed >= 0) {
      this.x += Math.sin(this.rad) * this.speed
      const randY = Math.random() * (1 - (this.speed / SPEED_MAX_PARTICLE)) * 5
      this.y += Math.cos(this.rad) * this.speed + randY
      // [1.0-0.8] 
      const s = (1 - (Math.random() * 20 / 100)) * LIFE_MAX_PARTICLE
      this.particles.push(new ShiningParticle(this.x, this.y, this.diameter, s, this.baseColor))
    }

    for (const p of this.particles) {
      p.move()
    }
    this.particles = this.particles.filter(p => !p.isStopped())
  }

  isStopped () {
    if (this.speed < 0 && this.particles.length === 0) {
      return true
    }
    return false
  }

  draw () {
    for (const p of this.particles) {
      p.draw()
    }
  }
}

class FireWork {
  constructor() {
    this.particles = []
    this.isStartSound = false
  }

  addParticles (x, y, diameter, baseColor, sleep) {
    for (let rad = 0; rad < 2 * Math.PI; rad += (Math.PI / 20)) {
      // [1.00, 9.7]
      const r = 1 - (Math.random() * 3 / 100)
      const s = SPEED_MAX_PARTICLE * r
      const p = new TrajectoryParticle(x, y, diameter, rad, s, baseColor)
      this.particles.push(p)
    }
    this.sleep = sleep
    this.lapseTimeSecs = 0
    this.isStartSound = false
  }

  move () {
    this.lapseTimeSecs += 1 / FRAME_RATE
    if (this.sleep > this.lapseTimeSecs) {
      return
    }

    if (!this.isStartSound) {
      // [0.8-0.3]
      const r = 0.8 - (Math.random() * 0.5 / 100)
      sound.setVolume(r)
      sound.play();
      this.isStartSound = true
    }

    for(const particle of this.particles) {
      particle.move()
    }
    this.particles = this.particles.filter(p => !p.isStopped())
  }

  isStopped () {
    if (this.particles.length === 0) {
      return true
    }
    return false
  }

  draw () {
    for(const particle of this.particles) {
      particle.draw()
    }
  }
}

const colorSets = [
  new Color('226', '121', '115'),
  new Color('230', '180', '34'),
  new Color('5%', '10%', '80%'),
  new Color('100%', '80%', '10%'),
  new Color('2%', '100%', '78%'),
]

const MAX_FIREWORKS = 10

let fireworks = []

function initFireWorks () {
  fireworks = []
  const widthOffset = windowWidth / MAX_FIREWORKS
  for (let i = 0; i < MAX_FIREWORKS; i++) {
    const d = Math.random() * 3 + 1
    const x = 20 + (widthOffset * i) + Math.random() * 40
    const y = 250  + Math.random() * 80
    const baseColor = colorSets[floor(Math.random() * colorSets.length)]
    const sleep = Math.random() * 3
    const f = new FireWork()
    f.addParticles(x, y, d, baseColor, sleep)
    fireworks.push(f)
  }
}


function preload() {
  sound = loadSound('firework.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(FRAME_RATE)
  initFireWorks()
}

const MAX_FIREWORK_LOOP_SLEEP_SEC = 2
let sleep = 2

function draw() {
  createCanvas(windowWidth, windowHeight)

  clear();
  background('#111');

  text_color('花火', 30, 50, '#994444')

  if (sleep > 0) {
    sleep -= 1 /FRAME_RATE
    return
  }

  let isAllStoped = true
  for (const f of fireworks) {
    f.move()
    f.draw()
    if (!f.isStopped()) {
      isAllStoped = false
    }
  }

  if (isAllStoped) {
    initFireWorks()
    sleep = Math.random() * MAX_FIREWORK_LOOP_SLEEP_SEC
  }
}

function touchStarted() {
  userStartAudio();
}
