import RestDAO from './restdao'
export const fontFamilies = [/*{
  id: '系统字体',
  name: '系统字体'
}, {
  id: 'HanyiSentySpringBrush',
  pic: 'public/vector/5fdabbb42807cb31ad2e7bc9/hyxdcl.png',
  name: '汉仪新蒂春联体',
  url: 'https://font-public.canva.cn/YAD-vxCF7wg/0/HanyiSentySpringBrush.4b56f65ebbe8e82d2f.d735e660b1ef482c348d6226087490d1.woff'
},{
  id: 'SentyGoldenBell',
  pic: 'public/vector/5fdabbb42807cb31ad2e7bc9/hyxdjzt.png',
  name: '汉仪新蒂金钟体',
  url: 'https://font-public.canva.cn/YAC1EMUkD58/0/SentyGoldenBell.woff'
},
{
  id: 'HYLeMiaoTiJ',
  name: '汉仪乐喵体简',
  url: '/fonts/HYLeMiaoTiJ.woff'
}, {
  id: 'HYZiYanHuanLeSongW',
  name: '汉仪字研欢乐宋',
  url: '/fonts/HYZiYanHuanLeSongW.woff'
}, {
  id: 'ChenYanXingKai',
  name: '字由点字晨颜行楷',
  url: '/fonts/HelloFont_ID_ChenYanXingKai.woff'
}, {
  id: 'ChunYiTi',
  name: '字由点字春意体',
  url: '/fonts/ChunYiTi.woff'
}, {
  id: 'WenQuanYi',
  name: '文泉仪黑体',
  url: '/fonts/wqy-microhei.woff'
}, {
  id: 'HanyiTianZhen',
  name: '汉仪天真体',
  url: '/fonts/HYTianZhenTi.woff'
}, {
  id: 'HanyiZhangnairen',
  name: '汉仪张乃仁行书',
  url: '/fonts/HYZhangNaiRenXingShuJ.woff'
}, {
  id: 'SentyCreamPuff',
  name: '汉仪新蒂泡芙体',
  url: '/fonts/SentyCreamPuff.woff'
}, {
  id: 'HanyiSentyGarden',
  name: '汉仪新蒂花园体',
  url: '/fonts/HanyiSentyGarden.woff'
}, {
  id: 'HYRunYuan-65J',
  pic: 'public/vector/5fdabbb42807cb31ad2e7bc9/hyrjy.png',
  name: '汉仪润圆简',
  url: '/fonts/HYRunYuan-65J.woff'
}, {
  id: 'HelloFont_WenYiHei',
  name: '字由文艺黑',
  url: '/fonts/HelloFont_WenYiHei.woff'
}, {
  id: 'HelloFont_LeYuanTi',
  name: '字由乐圆体',
  url: '/fonts/HelloFont_ID_LeYuanTi.woff'
}, {
  id: 'HelloFont_ID_ShouXieTongZhenTi',
  name: '字由点字书写童真体',
  url: 'https://font-public.canva.cn/YAD88jfJsos/0/HelloFont_ID_ShouXieTongZhenTi.4cd0f3e5c.f0e0481de2533d3c68f1257eececb02f.woff'
}*/]

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
