import Polyglot from 'node-polyglot'

export default function initLang (ctx) {
  const polyglot = new Polyglot()
  ctx.lang_zh = {}
  ctx.lang_en = {}
  ctx.polyglot = polyglot
}
