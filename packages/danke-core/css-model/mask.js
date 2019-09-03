export default {
  url: '',
  size: 'cover'
}
export const Sizes = [{
  key: 'cover',
  value: '覆盖'
}, {
  key: 'contain',
  value: '包含'
}]

export function getMaskStyle ({ mask }) {
  if (mask && mask.url) {
    return ['mask-size: ' + mask.size, 'mask-image: url(' + mask.url + ')']
  } else {
    return []
  }
}
