/**
 * auto split works to multi-line with
 * 1、work ratio kept
 * 2、work use with max line height. break to new line if over the container width
 * @param works
 * @param containerWidth
 * @param maxLineHeight
 */
export default function flowSchedule (works, containerWidth, gap, maxLineHeight) {
  const lines = []
  while (works.length) {
    const { line, index } = scheduleLine(works, containerWidth, gap, maxLineHeight)
    lines.push(line)
    works.splice(0, index)
  }
  for (let line of lines) {
    autoSplit(line, gap, containerWidth)
  }
  return lines
}

export function autoSplit (line, gap, containerWidth) {
  let totalWidth = 0
  for (let work of line) {
    totalWidth += work.screen.width
  }
  const ratio = (containerWidth - gap * (line.length - 1)) / totalWidth
  for (let work of line) {
    work.viewport = {
      width: work.screen.width * ratio,
      height: work.screen.height * ratio
    }
  }
}

function scheduleLine (works, containerWidth, gap, maxLineHeight) {
  const line = []
  let usedWidth = 0
  let i = 0
  while (usedWidth < containerWidth && i < works.length) {
    line.push(works[i])
    usedWidth += gap + maxLineHeight / works[i].screen.height  * works[i].screen.width
    i ++
  }

  return {
    index: i,
    line: line
  }
}
