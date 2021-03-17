async function sleep (mill) {
  return new Promise(resolve => {
    setTimeout(resolve, mill)
  })
}

export {
  sleep
}
