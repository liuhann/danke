export const boxShadows = {
  'none': '',
  'hover': 'box-shadow: 0px 10px 13px -7px #000000',
  'hard light': 'box-shadow: 5px 5px #333',
  'reduced': 'box-shadow: 0px 8px 6px -6px #666',
  'inset': 'inset 0px 0px 10px #666',
  'glow': 'box-shadow: 0px 0px 10px -2px #FFF',
  'around': 'box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
}

export function getBoxShadowStyle ({ shadow }) {
  if (!shadow) {
    return []
  }
  return [boxShadows[shadow]]
}
