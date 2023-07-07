const el = document.getElementById('element')
const arr = [{ x: 24, y: 24 }, { x: 56, y: 24 }, { x: 88, y: 24 }, { x: 120, y: 24 }]
let undoArr = []
let redoArr = []
let currElement = null
const size = 24

function draw(ar = []) {
  el.innerHTML = ''
  ar.forEach((cordinates, index) => {
    const point = document.createElement('span')
    point.id = 'point-' + index
    point.innerText = index
    point.style.width = size + 'px';
    point.style.height = size + 'px';
    point.style.background = '#000';
    point.style.color = '#fff';
    point.style.textAlign = 'center';
    point.style.lineHeight = '24px';
    point.style.display = 'inline-block';
    point.style.margin = '4px';
    point.style.position = 'absolute';
    point.style.top = (cordinates.y - size) + 'px';
    point.style.left = (cordinates.x - size) + 'px';
    point.style.cursor = 'pointer';
    el.appendChild(point)
  })
}
function move(x, y) {
  const newArr = []
  let currElementFrom = undoArr.find(elm => elm.index === currElement)
  arr.forEach((elm) => {
    newArr.push(Object.assign({}, elm))
  })
  const r = [...undoArr]
  r.reverse().forEach((elm) => {
    if (elm.index !== currElement) {
      newArr[elm.index] = elm.to
    }
  })
  newArr[currElement].x = x
  newArr[currElement].y = y
  undoArr.unshift({
    index: currElement,
    from: currElementFrom ? currElementFrom.to : arr[currElement],
    to: { x: x, y: y },
  })
  draw(newArr)
}
function mouseClick(event) {
  if (event.target.id.includes('point-') && event.target.tagName !== 'BUTTON') {
    const index = event.target.id.split('-')[1]
    currElement = Number(index)
  } else if (currElement !== null && event.target.tagName !== 'BUTTON') {
    move(event.clientX, event.clientY)
  }
}
function undo() {
  const newArr = []
  arr.forEach((elm) => {
    newArr.push(Object.assign({}, elm))
  })
  if (undoArr.length) {
    redoArr.unshift(Object.assign({}, undoArr[0]))
  }
  undoArr.splice(0, 1)
  const r = [...undoArr]
  r.reverse().forEach((elm) => {
    newArr[elm.index] = elm.to
  })
  draw(newArr)
}
function redo() {
  const newArr = []
  arr.forEach((elm) => {
    newArr.push(Object.assign({}, elm))
  })
  if (redoArr.length) {
    undoArr.unshift(redoArr[0])
    const r = [...undoArr]
    r.reverse().forEach((elm) => {
      newArr[elm.index] = elm.to
    })
    draw(newArr)
    redoArr.splice(0, 1)
  }
}
function defaultState() {
  currElement = null
  undoArr = []
  redoArr = []
  draw(arr)
}
draw(arr)
document.body.addEventListener('click', mouseClick)

window.undo = undo
window.redo = redo
window.defaultState = defaultState