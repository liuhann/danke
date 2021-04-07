import RestDAO from './restdao'

const loadedFonts = []

export async function ensureFont (ctx, fontId) {
  if (loadedFonts.indexOf(fontId) > -1) {
    return
  }
  const dao = new RestDAO(ctx,'danke/font')

  const list = (await dao.list({
    id: fontId
  })).list

  if (list.length) {
    await loadFontFace(list[0].id, list[0].url)
  }
}

export async function loadFontFace (id, url) {
  // let pos = sheet.length
  if (loadedFonts.indexOf(id) > -1) {
    return
  }
  const ff = new FontFace(id, `url('${url}')`)
  await ff.load()
  document.fonts.add(ff)
  loadedFonts.push(id)
}
