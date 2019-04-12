const myReuseableStylesheet = document.createElement('style')
document.head.appendChild(this.myReuseableStylesheet)
function addKeyFrames (name, frames) {
  let pos = myReuseableStylesheet.length
  myReuseableStylesheet.insertRule('@keyframes ' + name + '{' + frames + '}', pos)
}
export {
  addKeyFrames
}
