function hexToRgba (hexValue) {
  const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b)
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = parseInt(rgb[1], 16)
  const g = parseInt(rgb[2], 16)
  const b = parseInt(rgb[3], 16)
  return {
    r,
    g,
    b
  }
}

function rgb2lab (rgb) {
  var r = rgb[0] / 255
  var g = rgb[1] / 255
  var b = rgb[2] / 255
  var x
  var y
  var z

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

const ChinaColors = [{
  'CMYK': [4, 5, 18, 0],
  'RGB': [249, 244, 220],
  'hex': '#f9f4dc',
  'name': '乳白',
  'pinyin': 'rubai',
  'LAB': [96, -2.3, 12.15]
}, {
  'CMYK': [3, 8, 30, 0],
  'RGB': [249, 236, 195],
  'hex': '#f7e8aa',
  'name': '杏仁黄',
  'pinyin': 'xingrenhuang',
  'LAB': [93.48, -1.97, 21.49]
}, {
  'CMYK': [4, 13, 67, 0],
  'RGB': [248, 223, 114],
  'hex': '#f8df72',
  'name': '茉莉黄',
  'pinyin': 'molihuang',
  'LAB': [88.89, -4.66, 55.82]
}, {
  'CMYK': [5, 14, 68, 1],
  'RGB': [248, 223, 112],
  'hex': '#f8df70',
  'name': '麦秆黄',
  'pinyin': 'maiganhuang',
  'LAB': [88.87, -4.81, 56.72]
}, {
  'CMYK': [2, 16, 84, 0],
  'RGB': [251, 218, 65],
  'hex': '#fbda41',
  'name': '油菜花黄',
  'pinyin': 'youcaihuahuang',
  'LAB': [87.5, -3.8, 74.6]
}, {
  'CMYK': [1, 18, 94, 0],
  'RGB': [254, 215, 26],
  'hex': '#fed71a',
  'name': '佛手黄',
  'pinyin': 'foshouhuang',
  'LAB': [86.87, -2.09, 84.23]
}, {
  'CMYK': [3, 16, 50, 0],
  'RGB': [247, 222, 152],
  'hex': '#f7de98',
  'name': '篾黄',
  'pinyin': 'miehuang',
  'LAB': [89.05, -0.99, 37.47]
}, {
  'CMYK': [3, 17, 69, 0],
  'RGB': [248, 216, 106],
  'hex': '#f8d86a',
  'name': '葵扇黄',
  'pinyin': 'kuishanhuang',
  'LAB': [87.05, -1.72, 57.37]
}, {
  'CMYK': [0, 20, 87, 0],
  'RGB': [252, 211, 55],
  'hex': '#fcd337',
  'name': '柠檬黄',
  'pinyin': 'ningmenghuang',
  'LAB': [85.78, -0.2, 76.32]
}, {
  'CMYK': [0, 20, 95, 0],
  'RGB': [252, 210, 23],
  'hex': '#fcd217',
  'name': '金瓜黄',
  'pinyin': 'jinguahuang',
  'LAB': [85.42, -0.45, 83.52]
}, {
  'CMYK': [0, 21, 94, 0],
  'RGB': [254, 209, 16],
  'hex': '#ffd111',
  'name': '藤黄',
  'pinyin': 'tenghuang',
  'LAB': [85.35, 0.82, 84.5]
}, {
  'CMYK': [2, 16, 39, 0],
  'RGB': [246, 222, 173],
  'hex': '#f6dead',
  'name': '酪黄',
  'pinyin': 'laohuang',
  'LAB': [89.32, 1.11, 27.08]
}, {
  'CMYK': [1, 17, 50, 0],
  'RGB': [247, 218, 148],
  'hex': '#f7da94',
  'name': '香水玫瑰黄',
  'pinyin': 'xiangshuimeiguihuang',
  'LAB': [87.99, 0.62, 38.12]
}, {
  'CMYK': [1, 21, 70, 0],
  'RGB': [249, 211, 103],
  'hex': '#f9d367',
  'name': '淡密黄',
  'pinyin': 'danmihuang',
  'LAB': [85.85, 1.03, 57.4]
}, {
  'CMYK': [0, 23, 88, 0],
  'RGB': [251, 205, 49],
  'hex': '#fbcd31',
  'name': '大豆黄',
  'pinyin': 'dadouhuang',
  'LAB': [84.17, 2.25, 76.66]
}, {
  'CMYK': [0, 24, 94, 0],
  'RGB': [252, 203, 22],
  'hex': '#fccb16',
  'name': '素馨黄',
  'pinyin': 'suxinhuang',
  'LAB': [83.68, 3.12, 82.36]
}, {
  'CMYK': [0, 24, 94, 0],
  'RGB': [254, 204, 17],
  'hex': '#fecc11',
  'name': '向日葵黄',
  'pinyin': 'xiangrikuihuang',
  'LAB': [84.12, 3.39, 83.47]
}, {
  'CMYK': [0, 27, 88, 0],
  'RGB': [251, 200, 47],
  'hex': '#fbc82f',
  'name': '雅梨黄',
  'pinyin': 'yalihuang',
  'LAB': [82.92, 4.76, 76.16]
}, {
  'CMYK': [0, 28, 94, 0],
  'RGB': [252, 197, 21],
  'hex': '#fcc515',
  'name': '黄连黄',
  'pinyin': 'huanglianhuang',
  'LAB': [82.2, 6.19, 81.41]
}, {
  'CMYK': [0, 29, 95, 0],
  'RGB': [252, 195, 7],
  'hex': '#fcc307',
  'name': '金盏黄',
  'pinyin': 'jinzhanhuang',
  'LAB': [81.69, 7.08, 82.67]
}, {
  'CMYK': [0, 32, 52, 0],
  'RGB': [248, 195, 135],
  'hex': '#f8c387',
  'name': '蛋壳黄',
  'pinyin': 'dankehuang',
  'LAB': [82.23, 11.59, 37.31]
}, {
  'CMYK': [0, 32, 52, 0],
  'RGB': [247, 193, 115],
  'hex': '#f7c173',
  'name': '肉色',
  'pinyin': 'rouse',
  'LAB': [81.37, 10.43, 46.32]
}, {
  'CMYK': [0, 35, 89, 0],
  'RGB': [251, 185, 41],
  'hex': '#fbb929',
  'name': '鹅掌黄',
  'pinyin': 'ezhanghuang',
  'LAB': [79.25, 12.38, 74.74]
}, {
  'CMYK': [0, 36, 93, 0],
  'RGB': [251, 182, 18],
  'hex': '#fbb612',
  'name': '鸡蛋黄',
  'pinyin': 'jidanhuang',
  'LAB': [78.46, 13.52, 79.06]
}, {
  'CMYK': [0, 35, 94, 0],
  'RGB': [252, 183, 10],
  'hex': '#fcb70a',
  'name': '鼬黄',
  'pinyin': 'youhuang',
  'LAB': [78.8, 13.34, 80.34]
}, {
  'CMYK': [0, 44, 84, 0],
  'RGB': [249, 166, 51],
  'hex': '#f9a633',
  'name': '榴萼黄',
  'pinyin': 'liuehuang',
  'LAB': [74.6, 21.78, 67.44]
}, {
  'CMYK': [0, 45, 92, 0],
  'RGB': [251, 164, 20],
  'hex': '#fba414',
  'name': '淡橘橙',
  'pinyin': 'danjucheng',
  'LAB': [74.26, 22.96, 75.68]
}, {
  'CMYK': [0, 47, 92, 0],
  'RGB': [252, 161, 6],
  'hex': '#fca106',
  'name': '枇杷黄',
  'pinyin': 'pipahuang',
  'LAB': [73.67, 24.81, 77.25]
}, {
  'CMYK': [0, 47, 92, 0],
  'RGB': [252, 161, 4],
  'hex': '#fca104',
  'name': '橙皮黄',
  'pinyin': 'chengpihuang',
  'LAB': [73.67, 24.8, 77.48]
}, {
  'CMYK': [0, 56, 87, 0],
  'RGB': [252, 140, 35],
  'hex': '#fc8c23',
  'name': '北瓜黄',
  'pinyin': 'beiguahuang',
  'LAB': [69.16, 36.07, 68.26]
}, {
  'CMYK': [0, 54, 92, 0],
  'RGB': [250, 142, 22],
  'hex': '#f28e16',
  'name': '杏黄',
  'pinyin': 'xinghuang',
  'LAB': [69.27, 34.01, 71.63]
}, {
  'CMYK': [0, 51, 91, 0],
  'RGB': [255, 153, 0],
  'hex': '#ff9900',
  'name': '雄黄',
  'pinyin': 'xionghuang',
  'LAB': [72.25, 30.16, 77.23]
}, {
  'CMYK': [0, 56, 91, 0],
  'RGB': [251, 139, 5],
  'hex': '#fb8b05',
  'name': '万寿菊黄',
  'pinyin': 'wanshoujuhuang',
  'LAB': [68.74, 35.77, 74.08]
}, {
  'CMYK': [10, 13, 35, 1],
  'RGB': [233, 221, 182],
  'hex': '#e9ddb6',
  'name': '菊蕾白',
  'pinyin': 'juleibai',
  'LAB': [88.16, -2.02, 20.65]
}, {
  'CMYK': [8, 19, 84, 1],
  'RGB': [238, 208, 69],
  'hex': '#eed045',
  'name': '秋葵黄',
  'pinyin': 'qiukuihuang',
  'LAB': [83.81, -4, 69.21]
}, {
  'CMYK': [6, 20, 92, 1],
  'RGB': [242, 206, 43],
  'hex': '#f2ce2b',
  'name': '硫华黄',
  'pinyin': 'liuhuahuang',
  'LAB': [83.54, -2.25, 77.45]
}, {
  'CMYK': [6, 22, 92, 0],
  'RGB': [241, 202, 23],
  'hex': '#f1ca17',
  'name': '柚黄',
  'pinyin': 'youhuang',
  'LAB': [82.38, -1.06, 80.75]
}, {
  'CMYK': [15, 20, 66, 2],
  'RGB': [221, 200, 113],
  'hex': '#ddc871',
  'name': '芒果黄',
  'pinyin': 'mangguohuang',
  'LAB': [80.66, -3.96, 45.89]
}, {
  'CMYK': [14, 22, 85, 2],
  'RGB': [223, 194, 67],
  'hex': '#dfc243',
  'name': '蒿黄',
  'pinyin': 'haohuang',
  'LAB': [78.85, -3.26, 64.58]
}, {
  'CMYK': [12, 24, 95, 2],
  'RGB': [226, 192, 39],
  'hex': '#e2c027',
  'name': '姜黄',
  'pinyin': 'jianghuang',
  'LAB': [78.47, -2.02, 73.61]
}, {
  'CMYK': [11, 25, 99, 1],
  'RGB': [228, 191, 17],
  'hex': '#e4bf11',
  'name': '香蕉黄',
  'pinyin': 'xiangjiaohuang',
  'LAB': [78.34, -1.08, 78.06]
}, {
  'CMYK': [17, 27, 94, 4],
  'RGB': [210, 180, 44],
  'hex': '#d2b42c',
  'name': '草黄',
  'pinyin': 'caohuang',
  'LAB': [73.88, -2.55, 67.6]
}, {
  'CMYK': [17, 29, 100, 4],
  'RGB': [210, 177, 22],
  'hex': '#d2b116',
  'name': '新禾绿',
  'pinyin': 'xinhelv',
  'LAB': [73.02, -1.56, 72.44]
}, {
  'CMYK': [28, 26, 45, 7],
  'RGB': [183, 174, 143],
  'hex': '#b7ae8f',
  'name': '月灰',
  'pinyin': 'yuehui',
  'LAB': [71.09, -1.89, 17.09]
}, {
  'CMYK': [30, 30, 70, 12],
  'RGB': [173, 158, 85],
  'hex': '#ad9e5f',
  'name': '淡灰绿',
  'pinyin': 'danhuilv',
  'LAB': [64.95, -4.42, 39.81]
}, {
  'CMYK': [38, 38, 76, 24],
  'RGB': [142, 128, 75],
  'hex': '#8e804b',
  'name': '草灰绿',
  'pinyin': 'caohuilv',
  'LAB': [53.7, -2.34, 30.6]
}, {
  'CMYK': [36, 42, 100, 29],
  'RGB': [136, 115, 34],
  'hex': '#887322',
  'name': '苔绿',
  'pinyin': 'tailv',
  'LAB': [49.02, -0.94, 45.4]
}, {
  'CMYK': [36, 42, 100, 30],
  'RGB': [134, 112, 24],
  'hex': '#867018',
  'name': '碧螺春绿',
  'pinyin': 'biluochunlv',
  'LAB': [47.9, -0.61, 48.08]
}, {
  'CMYK': [47, 47, 65, 42],
  'RGB': [104, 94, 72],
  'hex': '#685e48',
  'name': '燕羽灰',
  'pinyin': 'yanyuhui',
  'LAB': [40.27, 0.22, 14.09]
}, {
  'CMYK': [46, 47, 69, 42],
  'RGB': [105, 94, 69],
  'hex': '#695e45',
  'name': '蟹壳灰',
  'pinyin': 'xiekehui',
  'LAB': [40.3, 0.22, 15.97]
}, {
  'CMYK': [48, 48, 100, 45],
  'RGB': [100, 88, 34],
  'hex': '#645822',
  'name': '潭水绿',
  'pinyin': 'tanshuilv',
  'LAB': [37.48, -2.38, 32.29]
}, {
  'CMYK': [50, 50, 10, 48],
  'RGB': [94, 83, 20],
  'hex': '#5e5314',
  'name': '橄榄绿',
  'pinyin': 'ganlanlv',
  'LAB': [35.23, -3.24, 36.35]
}, {
  'CMYK': [2, 6, 18, 0],
  'RGB': [249, 241, 219],
  'hex': '#f9f1db',
  'name': '蚌肉白',
  'pinyin': 'bangroubai',
  'LAB': [95.23, -0.94, 11.57]
}, {
  'CMYK': [3, 10, 31, 0],
  'RGB': [248, 232, 193],
  'hex': '#f8e8c1',
  'name': '豆汁黄',
  'pinyin': 'douzhihuang',
  'LAB': [92.36, -0.59, 20.95]
}, {
  'CMYK': [1, 19, 66, 0],
  'RGB': [249, 215, 112],
  'hex': '#f9d770',
  'name': '淡茧黄',
  'pinyin': 'danjianhuang',
  'LAB': [86.95, -0.35, 54.5]
}, {
  'CMYK': [0, 26, 94, 0],
  'RGB': [255, 201, 12],
  'hex': '#ffc90c',
  'name': '乳鸭黄',
  'pinyin': 'ruyahuang',
  'LAB': [83.47, 5.31, 83.61]
}, {
  'CMYK': [5, 11, 22, 0],
  'RGB': [242, 230, 206],
  'hex': '#f2e6ce',
  'name': '荔肉白',
  'pinyin': 'liroubai',
  'LAB': [91.65, 0.17, 13.14]
}, {
  'CMYK': [5, 19, 50, 0],
  'RGB': [240, 214, 149],
  'hex': '#f0d695',
  'name': '象牙黄',
  'pinyin': 'xiangyahuang',
  'LAB': [86.39, 0.05, 35.41]
}, {
  'CMYK': [3, 23, 69, 0],
  'RGB': [244, 206, 105],
  'hex': '#f4ce69',
  'name': '炒米黄',
  'pinyin': 'chaomihuang',
  'LAB': [84.17, 1.69, 54.41]
}, {
  'CMYK': [1, 28, 89, 0],
  'RGB': [246, 196, 48],
  'hex': '#f6c430',
  'name': '鹦鹉冠黄',
  'pinyin': 'yingwuguanhuang',
  'LAB': [81.44, 4.74, 74.39]
}, {
  'CMYK': [0, 30, 95, 0],
  'RGB': [249, 193, 22],
  'hex': '#f9c116',
  'name': '木瓜黄',
  'pinyin': 'muguahuang',
  'LAB': [80.92, 6.99, 80.16]
}, {
  'CMYK': [0, 32, 95, 0],
  'RGB': [249, 189, 16],
  'hex': '#f9bd10',
  'name': '浅烙黄',
  'pinyin': 'qianlaohuang',
  'LAB': [79.93, 9, 80.31]
}, {
  'CMYK': [11, 18, 39, 1],
  'RGB': [229, 211, 170],
  'hex': '#e5d3aa',
  'name': '莲子白',
  'pinyin': 'lianzibai',
  'LAB': [85.07, -0.03, 22.59]
}, {
  'CMYK': [5, 35, 99, 0],
  'RGB': [232, 176, 4],
  'hex': '#e8b004',
  'name': '谷黄',
  'pinyin': 'guhuang',
  'LAB': [74.96, 8.37, 77.29]
}, {
  'CMYK': [3, 36, 99, 0],
  'RGB': [235, 177, 13],
  'hex': '#ebb10d',
  'name': '栀子黄',
  'pinyin': 'zhizihuang',
  'LAB': [75.53, 9.22, 76.84]
}, {
  'CMYK': [11, 39, 100, 2],
  'RGB': [217, 164, 14],
  'hex': '#d9a40e',
  'name': '芥黄',
  'pinyin': 'jiehuang',
  'LAB': [70.4, 8.29, 72.11]
}, {
  'CMYK': [28, 27, 43, 8],
  'RGB': [181, 170, 144],
  'hex': '#b5aa90',
  'name': '银鼠灰',
  'pinyin': 'yinshuhui',
  'LAB': [69.88, -0.36, 14.84]
}, {
  'CMYK': [26, 31, 57, 10],
  'RGB': [182, 164, 118],
  'hex': '#b6a476',
  'name': '尘灰',
  'pinyin': 'chenhui',
  'LAB': [67.87, -0.32, 26.28]
}, {
  'CMYK': [21, 43, 100, 11],
  'RGB': [183, 141, 18],
  'hex': '#b78d12',
  'name': '枯绿',
  'pinyin': 'kulv',
  'LAB': [60.92, 5.66, 62.64]
}, {
  'CMYK': [35, 44, 80, 30],
  'RGB': [135, 114, 62],
  'hex': '#87723e',
  'name': '鲛青',
  'pinyin': 'jiaoqing',
  'LAB': [48.92, 1.19, 31.62]
}, {
  'CMYK': [32, 50, 100, 31],
  'RGB': [135, 104, 24],
  'hex': '#876818',
  'name': '粽叶绿',
  'pinyin': 'zongyelv',
  'LAB': [45.79, 4.48, 46.23]
}, {
  'CMYK': [31, 51, 100, 30],
  'RGB': [138, 105, 19],
  'hex': '#8a6913',
  'name': '灰绿',
  'pinyin': 'huilv',
  'LAB': [46.38, 5.15, 48.57]
}, {
  'CMYK': [52, 56, 64, 62],
  'RGB': [74, 64, 53],
  'hex': '#4a4035',
  'name': '鹤灰',
  'pinyin': 'hehui',
  'LAB': [27.79, 2.27, 8.31]
}, {
  'CMYK': [48, 58, 70, 62],
  'RGB': [77, 64, 48],
  'hex': '#4d4030',
  'name': '淡松烟',
  'pinyin': 'dansongyan',
  'LAB': [28, 2.87, 11.88]
}, {
  'CMYK': [45, 56, 100, 56],
  'RGB': [88, 71, 23],
  'hex': '#584717',
  'name': '暗海水绿',
  'pinyin': 'anhaishuilv',
  'LAB': [30.98, 1.25, 30.49]
}, {
  'CMYK': [45, 55, 100, 54],
  'RGB': [91, 73, 19],
  'hex': '#5b4913',
  'name': '棕榈绿',
  'pinyin': 'zonglvlv',
  'LAB': [31.88, 1.29, 33.42]
}, {
  'CMYK': [1, 11, 24, 0],
  'RGB': [249, 223, 205],
  'hex': '#f9e9cd',
  'name': '米色',
  'pinyin': 'mise',
  'LAB': [90.47, 6.12, 12.07]
}, {
  'CMYK': [1, 15, 38, 0],
  'RGB': [248, 224, 176],
  'hex': '#f8e0b0',
  'name': '淡肉色',
  'pinyin': 'danrouse',
  'LAB': [90.04, 1.22, 26.54]
}, {
  'CMYK': [0, 23, 59, 0],
  'RGB': [249, 210, 125],
  'hex': '#f9d27d',
  'name': '麦芽糖黄',
  'pinyin': 'maiyatanghuang',
  'LAB': [85.86, 3.28, 46.94]
}, {
  'CMYK': [0, 34, 93, 0],
  'RGB': [254, 186, 7],
  'hex': '#feba07',
  'name': '琥珀黄',
  'pinyin': 'hupohuang',
  'LAB': [79.72, 12.61, 81.39]
}, {
  'CMYK': [1, 31, 79, 0],
  'RGB': [243, 191, 76],
  'hex': '#f3bf4c',
  'name': '甘草黄',
  'pinyin': 'gancaohuang',
  'LAB': [80.08, 7.21, 62.81]
}, {
  'CMYK': [0, 33, 83, 0],
  'RGB': [248, 188, 49],
  'hex': '#f8bc31',
  'name': '初熟杏黄',
  'pinyin': 'chushuxinghuang',
  'LAB': [79.69, 9.77, 72.62]
}, {
  'CMYK': [10, 27, 59, 1],
  'RGB': [226, 193, 124],
  'hex': '#e2c17c',
  'name': '浅驼色',
  'pinyin': 'qiantuose',
  'LAB': [79.47, 2.75, 38.99]
}, {
  'CMYK': [7, 32, 78, 1],
  'RGB': [229, 183, 81],
  'hex': '#e5b751',
  'name': '沙石黄',
  'pinyin': 'shashihuang',
  'LAB': [76.75, 5.79, 56.67]
}, {
  'CMYK': [3, 38, 97, 0],
  'RGB': [234, 173, 26],
  'hex': '#eaad1a',
  'name': '虎皮黄',
  'pinyin': 'hupihuang',
  'LAB': [74.47, 11.08, 73.82]
}, {
  'CMYK': [12, 41, 98, 2],
  'RGB': [214, 160, 29],
  'hex': '#d6a01d',
  'name': '土黄',
  'pinyin': 'tuhuang',
  'LAB': [69.13, 9.38, 67.99]
}, {
  'CMYK': [28, 28, 41, 9],
  'RGB': [180, 169, 146],
  'hex': '#b4a992',
  'name': '百灵鸟灰',
  'pinyin': 'bailingniaohui',
  'LAB': [69.57, 0.1, 13.3]
}, {
  'CMYK': [21, 44, 97, 11],
  'RGB': [183, 139, 38],
  'hex': '#b78b26',
  'name': '山鸡黄',
  'pinyin': 'shanjihuang',
  'LAB': [60.49, 7.33, 56.48]
}, {
  'CMYK': [35, 47, 71, 33],
  'RGB': [130, 107, 72],
  'hex': '#826b48',
  'name': '龟背黄',
  'pinyin': 'guibeihuang',
  'LAB': [46.61, 4.05, 23.01]
}, {
  'CMYK': [34, 52, 85, 35],
  'RGB': [128, 99, 50],
  'hex': '#806332',
  'name': '苍黄',
  'pinyin': 'canghuang',
  'LAB': [43.86, 5.65, 31.89]
}, {
  'CMYK': [32, 56, 96, 34],
  'RGB': [129, 95, 37],
  'hex': '#815f25',
  'name': '莱阳梨黄',
  'pinyin': 'laiyanglihuang',
  'LAB': [42.74, 7.55, 37.4]
}, {
  'CMYK': [31, 57, 100, 33],
  'RGB': [131, 94, 29],
  'hex': '#835e1d',
  'name': '蜴蜊绿',
  'pinyin': 'yililv',
  'LAB': [42.64, 8.65, 41.1]
}, {
  'CMYK': [46, 59, 68, 61],
  'RGB': [79, 64, 50],
  'hex': '#4f4032',
  'name': '松鼠灰',
  'pinyin': 'songshuhui',
  'LAB': [28.27, 4.11, 11]
}, {
  'CMYK': [44, 61, 76, 62],
  'RGB': [80, 62, 42],
  'hex': '#503e2a',
  'name': '橄榄灰',
  'pinyin': 'ganlanhui',
  'LAB': [27.62, 4.76, 15.27]
}, {
  'CMYK': [43, 63, 88, 61],
  'RGB': [81, 60, 32],
  'hex': '#513c20',
  'name': '蟹壳绿',
  'pinyin': 'xiekelv',
  'LAB': [26.97, 5.41, 20.71]
}, {
  'CMYK': [42, 64, 94, 60],
  'RGB': [83, 60, 27],
  'hex': '#533c1b',
  'name': '古铜绿',
  'pinyin': 'gutonglv',
  'LAB': [27.15, 5.96, 23.96]
}, {
  'CMYK': [41, 66, 94, 60],
  'RGB': [85, 59, 24],
  'hex': '#553b18',
  'name': '焦茶绿',
  'pinyin': 'jiaochalv',
  'LAB': [27.08, 7.37, 25.66]
}, {
  'CMYK': [1, 7, 13, 0],
  'RGB': [251, 242, 227],
  'hex': '#fbf2e3',
  'name': '粉白',
  'pinyin': 'fenbai',
  'LAB': [95.81, 0.52, 8.29]
}, {
  'CMYK': [1, 12, 22, 0],
  'RGB': [249, 232, 208],
  'hex': '#f9e8d0',
  'name': '落英淡粉',
  'pinyin': 'luoyingdanfen',
  'LAB': [92.75, 1.95, 13.74]
}, {
  'CMYK': [0, 27, 51, 0],
  'RGB': [249, 203, 139],
  'hex': '#f9cb8b',
  'name': '瓜瓤粉',
  'pinyin': 'guarangfen',
  'LAB': [84.33, 8.21, 37.99]
}, {
  'CMYK': [0, 36, 72, 0],
  'RGB': [251, 185, 87],
  'hex': '#fbb957',
  'name': '蜜黄',
  'pinyin': 'mihuang',
  'LAB': [79.55, 14.29, 57.68]
}, {
  'CMYK': [0, 44, 91, 0],
  'RGB': [255, 166, 15],
  'hex': '#ffa60f',
  'name': '金叶黄',
  'pinyin': 'jinyehuang',
  'LAB': [75.18, 23.53, 77.35]
}, {
  'CMYK': [0, 43, 82, 0],
  'RGB': [244, 168, 58],
  'hex': '#f4a83a',
  'name': '金莺黄',
  'pinyin': 'jinyinghuang',
  'LAB': [74.53, 18.89, 64.57]
}, {
  'CMYK': [8, 31, 50, 1],
  'RGB': [227, 189, 141],
  'hex': '#e3bd8d',
  'name': '鹿角棕',
  'pinyin': 'lujiaozong',
  'LAB': [78.83, 7.06, 29.35]
}, {
  'CMYK': [2, 44, 83, 0],
  'RGB': [231, 162, 63],
  'hex': '#e7a23f',
  'name': '凋叶棕',
  'pinyin': 'diaoyezong',
  'LAB': [71.68, 16.8, 59.24]
}, {
  'CMYK': [10, 41, 72, 1],
  'RGB': [218, 164, 90],
  'hex': '#daa45a',
  'name': '玳瑁黄',
  'pinyin': 'daimaohuang',
  'LAB': [71, 11.86, 45.58]
}, {
  'CMYK': [7, 45, 82, 1],
  'RGB': [222, 158, 68],
  'hex': '#de9e44',
  'name': '软木黄',
  'pinyin': 'ruanmuhuang',
  'LAB': [69.75, 15.37, 54.76]
}, {
  'CMYK': [6, 51, 95, 1],
  'RGB': [220, 145, 35],
  'hex': '#dc9123',
  'name': '风帆黄',
  'pinyin': 'fengfanhuang',
  'LAB': [66.2, 20.19, 64.15]
}, {
  'CMYK': [19, 44, 75, 7],
  'RGB': [192, 147, 81],
  'hex': '#c09351',
  'name': '桂皮淡棕',
  'pinyin': 'guipidanzong',
  'LAB': [63.89, 9.38, 41.01]
}, {
  'CMYK': [32, 40, 53, 22],
  'RGB': [151, 132, 108],
  'hex': '#97846c',
  'name': '猴毛灰',
  'pinyin': 'houmaohui',
  'LAB': [56.25, 3.36, 15.62]
}, {
  'CMYK': [27, 60, 97, 21],
  'RGB': [152, 101, 36],
  'hex': '#986524',
  'name': '山鸡褐',
  'pinyin': 'shanjihe',
  'LAB': [47.11, 14.64, 43.27]
}, {
  'CMYK': [37, 65, 84, 49],
  'RGB': [102, 70, 42],
  'hex': '#66462a',
  'name': '驼色',
  'pinyin': 'tuose',
  'LAB': [32.63, 10.26, 22.22]
}, {
  'CMYK': [38, 69, 90, 54],
  'RGB': [93, 61, 33],
  'hex': '#5d3d21',
  'name': '茶褐',
  'pinyin': 'chahe',
  'LAB': [28.83, 10.76, 22.72]
}, {
  'CMYK': [37, 74, 96, 55],
  'RGB': [92, 55, 25],
  'hex': '#5c3719',
  'name': '古铜褐',
  'pinyin': 'gutonghe',
  'LAB': [26.95, 13.43, 25.21]
}, {
  'CMYK': [0, 10, 14, 0],
  'RGB': [251, 236, 222],
  'hex': '#fbecde',
  'name': '荷花白',
  'pinyin': 'hehuabai',
  'LAB': [94.21, 2.77, 8.59]
}, {
  'CMYK': [0, 40, 52, 0],
  'RGB': [248, 179, 127],
  'hex': '#f8b37f',
  'name': '玫瑰粉',
  'pinyin': 'meiguifen',
  'LAB': [78.3, 19.22, 36.38]
}, {
  'CMYK': [0, 62, 88, 0],
  'RGB': [249, 125, 28],
  'hex': '#f97d1c',
  'name': '橘橙',
  'pinyin': 'jucheng',
  'LAB': [65.66, 42.29, 67.42]
}, {
  'CMYK': [0, 62, 85, 0],
  'RGB': [250, 126, 35],
  'hex': '#fa7e23',
  'name': '美人焦橙',
  'pinyin': 'meirenjiaocheng',
  'LAB': [66.03, 42.32, 65.62]
}, {
  'CMYK': [0, 28, 25, 0],
  'RGB': [247, 205, 188],
  'hex': '#f7cdbc',
  'name': '润红',
  'pinyin': 'runhong',
  'LAB': [85.53, 12.28, 13.99]
}, {
  'CMYK': [0, 28, 22, 0],
  'RGB': [246, 206, 193],
  'hex': '#f6cec1',
  'name': '淡桃红',
  'pinyin': 'dantaohong',
  'LAB': [85.79, 12.1, 11.7]
}, {
  'CMYK': [0, 53, 65, 0],
  'RGB': [240, 148, 93],
  'hex': '#f0945d',
  'name': '海螺橙',
  'pinyin': 'hailuocheng',
  'LAB': [69.82, 29.63, 43.27]
}, {
  'CMYK': [0, 44, 32, 0],
  'RGB': [240, 173, 160],
  'hex': '#f0ada0',
  'name': '桃红',
  'pinyin': 'taohong',
  'LAB': [76.64, 22.84, 16.4]
}, {
  'CMYK': [0, 45, 34, 0],
  'RGB': [238, 170, 156],
  'hex': '#eeaa9c',
  'name': '颊红',
  'pinyin': 'jiahong',
  'LAB': [75.65, 23.19, 17.16]
}, {
  'CMYK': [0, 49, 41, 0],
  'RGB': [238, 160, 140],
  'hex': '#eea08c',
  'name': '淡罂粟红',
  'pinyin': 'danyingsuhong',
  'LAB': [73.03, 26.65, 22.26]
}, {
  'CMYK': [0, 58, 67, 0],
  'RGB': [234, 137, 88],
  'hex': '#ea8958',
  'name': '晨曦红',
  'pinyin': 'chenxihong',
  'LAB': [66.58, 32.67, 41.81]
}, {
  'CMYK': [0, 65, 80, 0],
  'RGB': [242, 118, 53],
  'hex': '#f27635',
  'name': '蟹壳红',
  'pinyin': 'xiekehong',
  'LAB': [63.41, 43.7, 55.83]
}, {
  'CMYK': [0, 69, 86, 0],
  'RGB': [248, 107, 29],
  'hex': '#f86b1d',
  'name': '金莲花橙',
  'pinyin': 'jinlianhuacheng',
  'LAB': [62.13, 50.55, 64.39]
}, {
  'CMYK': [0, 69, 70, 0],
  'RGB': [239, 111, 72],
  'hex': '#ef6f48',
  'name': '草莓红',
  'pinyin': 'caomeihong',
  'LAB': [61.81, 46.78, 44.77]
}, {
  'CMYK': [0, 72, 82, 0],
  'RGB': [239, 99, 43],
  'hex': '#ef632b',
  'name': '龙睛鱼红',
  'pinyin': 'longjingyuhong',
  'LAB': [59.38, 51.28, 56.27]
}, {
  'CMYK': [0, 81, 84, 0],
  'RGB': [241, 68, 29],
  'hex': '#f1441d',
  'name': '蜻蜓红',
  'pinyin': 'qingtinghong',
  'LAB': [54.99, 64.15, 58.48]
}, {
  'CMYK': [0, 80, 83, 0],
  'RGB': [240, 75, 34],
  'hex': '#f04b22',
  'name': '大红',
  'pinyin': 'dahong',
  'LAB': [55.75, 61.41, 57.01]
}, {
  'CMYK': [0, 80, 85, 0],
  'RGB': [242, 72, 27],
  'hex': '#f2481b',
  'name': '柿红',
  'pinyin': 'shihong',
  'LAB': [55.67, 63.01, 59.81]
}, {
  'CMYK': [0, 80, 85, 0],
  'RGB': [243, 71, 24],
  'hex': '#f34718',
  'name': '榴花红',
  'pinyin': 'liuhuahong',
  'LAB': [55.71, 63.64, 60.97]
}, {
  'CMYK': [0, 83, 87, 0],
  'RGB': [244, 62, 6],
  'hex': '#f43e06',
  'name': '银朱',
  'pinyin': 'yinzhu',
  'LAB': [54.75, 66.77, 65.19]
}, {
  'CMYK': [0, 78, 83, 0],
  'RGB': [237, 81, 38],
  'hex': '#ed5126',
  'name': '朱红',
  'pinyin': 'zhuhong',
  'LAB': [56.11, 58.19, 55.4]
}, {
  'CMYK': [0, 50, 68, 0],
  'RGB': [240, 156, 90],
  'hex': '#f09c5a',
  'name': '鲑鱼红',
  'pinyin': 'guiyuhong',
  'LAB': [71.58, 25.22, 46.88]
}, {
  'CMYK': [5, 69, 87, 0],
  'RGB': [242, 123, 31],
  'hex': '#f26b1f',
  'name': '金黄',
  'pinyin': 'jinhuang',
  'LAB': [64.27, 40.62, 65.02]
}, {
  'CMYK': [7, 52, 71, 1],
  'RGB': [217, 145, 86],
  'hex': '#d99156',
  'name': '鹿皮褐',
  'pinyin': 'lupihe',
  'LAB': [66.27, 21.38, 41.97]
}, {
  'CMYK': [4, 57, 82, 1],
  'RGB': [219, 133, 64],
  'hex': '#db8540',
  'name': '醉瓜肉',
  'pinyin': 'zuiguarou',
  'LAB': [63.51, 27.31, 49.85]
}, {
  'CMYK': [0, 64, 93, 0],
  'RGB': [222, 118, 34],
  'hex': '#de7622',
  'name': '麂棕',
  'pinyin': 'jizong',
  'LAB': [60.42, 35.29, 59.72]
}, {
  'CMYK': [22, 28, 34, 6],
  'RGB': [193, 178, 163],
  'hex': '#c1b2a3',
  'name': '淡银灰',
  'pinyin': 'danyinhui',
  'LAB': [73.43, 2.84, 9.59]
}, {
  'CMYK': [18, 57, 76, 6],
  'RGB': [190, 126, 74],
  'hex': '#be7e4a',
  'name': '淡赭',
  'pinyin': 'danzhe',
  'LAB': [58.38, 19.57, 38.03]
}, {
  'CMYK': [14, 69, 100, 4],
  'RGB': [193, 101, 26],
  'hex': '#c1651a',
  'name': '槟榔综',
  'pinyin': 'binglangzong',
  'LAB': [52.64, 32.13, 54.37]
}, {
  'CMYK': [34, 42, 46, 23],
  'RGB': [145, 128, 114],
  'hex': '#918072',
  'name': '银灰',
  'pinyin': 'yinhui',
  'LAB': [54.73, 4.11, 9.97]
}, {
  'CMYK': [42, 40, 46, 20],
  'RGB': [154, 136, 120],
  'hex': '#9a8878',
  'name': '海鸥灰',
  'pinyin': 'haiouhui',
  'LAB': [57.87, 4.12, 11.07]
}, {
  'CMYK': [27, 69, 85, 22],
  'RGB': [148, 88, 51],
  'hex': '#945833',
  'name': '淡咖啡',
  'pinyin': 'dankafei',
  'LAB': [43.52, 21.2, 31.58]
}, {
  'CMYK': [26, 76, 97, 20],
  'RGB': [150, 77, 34],
  'hex': '#964d22',
  'name': '岩石棕',
  'pinyin': 'yanshizong',
  'LAB': [41.06, 27.3, 38.02]
}, {
  'CMYK': [25, 80, 100, 20],
  'RGB': [149, 68, 22],
  'hex': '#954416',
  'name': '芒果棕',
  'pinyin': 'mangguozong',
  'LAB': [38.86, 31.32, 41.55]
}, {
  'CMYK': [39, 60, 58, 51],
  'RGB': [98, 73, 65],
  'hex': '#624941',
  'name': '石板灰',
  'pinyin': 'shibanhui',
  'LAB': [33.44, 9.36, 8.9]
}, {
  'CMYK': [38, 63, 63, 50],
  'RGB': [100, 72, 61],
  'hex': '#64483d',
  'name': '珠母灰',
  'pinyin': 'zhumuhui',
  'LAB': [33.3, 10.3, 11.29]
}, {
  'CMYK': [32, 83, 96, 41],
  'RGB': [113, 54, 29],
  'hex': '#71361d',
  'name': '丁香棕',
  'pinyin': 'dingxiangzong',
  'LAB': [30, 23.98, 27.2]
}, {
  'CMYK': [30, 87, 100, 38],
  'RGB': [117, 49, 23],
  'hex': '#753117',
  'name': '咖啡',
  'pinyin': 'kafei',
  'LAB': [29.51, 28.19, 30.27]
}, {
  'CMYK': [30, 89, 100, 39],
  'RGB': [115, 46, 18],
  'hex': '#732e12',
  'name': '筍皮棕',
  'pinyin': 'sunpizong',
  'LAB': [28.49, 28.76, 31.81]
}, {
  'CMYK': [0, 72, 86, 0],
  'RGB': [252, 99, 21],
  'hex': '#fc6315',
  'name': '燕颔红',
  'pinyin': 'yanhanhong',
  'LAB': [61.37, 55.45, 66.47]
}, {
  'CMYK': [3, 38, 39, 0],
  'RGB': [232, 180, 154],
  'hex': '#e8b49a',
  'name': '玉粉红',
  'pinyin': 'yufenhong',
  'LAB': [77.35, 15.33, 20.5]
}, {
  'CMYK': [0, 70, 87, 0],
  'RGB': [228, 104, 40],
  'hex': '#e46828',
  'name': '金驼',
  'pinyin': 'jintuo',
  'LAB': [58.55, 44.8, 56.14]
}, {
  'CMYK': [0, 76, 97, 0],
  'RGB': [216, 89, 22],
  'hex': '#d85916',
  'name': '铁棕',
  'pinyin': 'tiezong',
  'LAB': [53.81, 47.03, 58.15]
}, {
  'CMYK': [23, 35, 38, 10],
  'RGB': [183, 160, 145],
  'hex': '#b7a091',
  'name': '蛛网灰',
  'pinyin': 'zhuwanghui',
  'LAB': [67.46, 6, 10.91]
}, {
  'CMYK': [16, 77, 100, 6],
  'RGB': [183, 81, 29],
  'hex': '#b7511d',
  'name': '淡可可棕',
  'pinyin': 'dankekezong',
  'LAB': [47.02, 38.51, 47.84]
}, {
  'CMYK': [31, 63, 66, 31],
  'RGB': [139, 97, 77],
  'hex': '#8b614d',
  'name': '中红灰',
  'pinyin': 'zhonghonghui',
  'LAB': [45.04, 14.44, 18.2]
}, {
  'CMYK': [28, 76, 82, 26],
  'RGB': [140, 75, 49],
  'hex': '#8c4b31',
  'name': '淡土黄',
  'pinyin': 'dantuhuang',
  'LAB': [39.29, 25.01, 27.41]
}, {
  'CMYK': [28, 83, 92, 28],
  'RGB': [135, 61, 36],
  'hex': '#873d24',
  'name': '淡豆沙',
  'pinyin': 'dandousha',
  'LAB': [35.23, 29.85, 30]
}, {
  'CMYK': [27, 85, 98, 27],
  'RGB': [136, 58, 30],
  'hex': '#883a1e',
  'name': '椰壳棕',
  'pinyin': 'yekezong',
  'LAB': [34.7, 31.56, 32.84]
}, {
  'CMYK': [40, 64, 61, 56],
  'RGB': [91, 66, 58],
  'hex': '#5b423a',
  'name': '淡铁灰',
  'pinyin': 'dantiehui',
  'LAB': [30.46, 9.57, 9.1]
}, {
  'CMYK': [37, 72, 72, 52],
  'RGB': [96, 61, 48],
  'hex': '#603d30',
  'name': '中灰驼',
  'pinyin': 'zhonghuituo',
  'LAB': [29.5, 13.69, 14.32]
}, {
  'CMYK': [34, 82, 85, 47],
  'RGB': [103, 52, 36],
  'hex': '#673424',
  'name': '淡栗棕',
  'pinyin': 'danlizong',
  'LAB': [28.02, 21.2, 20.23]
}, {
  'CMYK': [33, 89, 92, 48],
  'RGB': [101, 43, 28],
  'hex': '#652b1c',
  'name': '可可棕',
  'pinyin': 'kekezong',
  'LAB': [25.49, 24.97, 22.12]
}, {
  'CMYK': [32, 90, 95, 45],
  'RGB': [105, 42, 27],
  'hex': '#692a1b',
  'name': '柞叶棕',
  'pinyin': 'zhayezong',
  'LAB': [25.97, 27.16, 23.48]
}, {
  'CMYK': [0, 53, 59, 0],
  'RGB': [251, 153, 104],
  'hex': '#fb9968',
  'name': '野蔷薇红',
  'pinyin': 'yeqiangweihong',
  'LAB': [72.42, 32.14, 41.05]
}, {
  'CMYK': [0, 65, 79, 0],
  'RGB': [252, 121, 48],
  'hex': '#fc7930',
  'name': '菠萝红',
  'pinyin': 'boluohong',
  'LAB': [65.42, 45.86, 60.38]
}, {
  'CMYK': [2, 31, 31, 0],
  'RGB': [237, 195, 174],
  'hex': '#edc3ae',
  'name': '藕荷',
  'pinyin': 'ouhe',
  'LAB': [81.88, 11.88, 16.16]
}, {
  'CMYK': [0, 70, 91, 0],
  'RGB': [225, 103, 35],
  'hex': '#e16723',
  'name': '陶瓷红',
  'pinyin': 'taocihong',
  'LAB': [57.87, 44.02, 57.37]
}, {
  'CMYK': [16, 23, 27, 2],
  'RGB': [212, 196, 183],
  'hex': '#d4c4b7',
  'name': '晓灰',
  'pinyin': 'xiaohui',
  'LAB': [80.12, 3.44, 8.53]
}, {
  'CMYK': [9, 64, 78, 1],
  'RGB': [207, 117, 67],
  'hex': '#cf7543',
  'name': '余烬红',
  'pinyin': 'yujinhong',
  'LAB': [58.4, 31.07, 42.28]
}, {
  'CMYK': [8, 72, 93, 1],
  'RGB': [205, 98, 39],
  'hex': '#cd6227',
  'name': '火砖红',
  'pinyin': 'huozhuanhong',
  'LAB': [53.87, 38.89, 51.01]
}, {
  'CMYK': [22, 64, 71, 12],
  'RGB': [170, 106, 76],
  'hex': '#aa6a4c',
  'name': '火泥棕',
  'pinyin': 'huonizong',
  'LAB': [51.12, 22.41, 27.45]
}, {
  'CMYK': [20, 76, 92, 9],
  'RGB': [166, 82, 44],
  'hex': '#a6522c',
  'name': '绀红',
  'pinyin': 'ganhong',
  'LAB': [44.69, 31.75, 37.41]
}, {
  'CMYK': [31, 79, 77, 37],
  'RGB': [119, 61, 49],
  'hex': '#773d31',
  'name': '橡树棕',
  'pinyin': 'xiangshuzong',
  'LAB': [32.87, 24.02, 18.73]
}, {
  'CMYK': [45, 68, 57, 66],
  'RGB': [72, 51, 50],
  'hex': '#483332',
  'name': '海报灰',
  'pinyin': 'haibaohui',
  'LAB': [23.59, 9.31, 4.35]
}, {
  'CMYK': [41, 76, 64, 65],
  'RGB': [175, 46, 43],
  'hex': '#4b2e2b',
  'name': '玫瑰灰',
  'pinyin': 'meiguihui',
  'LAB': [39.98, 51.5, 33.24]
}, {
  'CMYK': [41, 84, 71, 67],
  'RGB': [72, 37, 34],
  'hex': '#482522',
  'name': '火山棕',
  'pinyin': 'huoshanzong',
  'LAB': [19.29, 16.14, 9.28]
}, {
  'CMYK': [40, 92, 78, 66],
  'RGB': [72, 30, 28],
  'hex': '#481e1c',
  'name': '豆沙',
  'pinyin': 'dousha',
  'LAB': [17.41, 19.84, 10.93]
}, {
  'CMYK': [0, 9, 12, 0],
  'RGB': [251, 238, 226],
  'hex': '#fbeee2',
  'name': '淡米粉',
  'pinyin': 'danmifen',
  'LAB': [94.8, 2.39, 7.35]
}, {
  'CMYK': [0, 19, 19, 0],
  'RGB': [246, 220, 206],
  'hex': '#f6dcce',
  'name': '初桃粉红',
  'pinyin': 'chutaofenhong',
  'LAB': [89.5, 6.74, 10.13]
}, {
  'CMYK': [0, 27, 27, 0],
  'RGB': [247, 207, 186],
  'hex': '#f7cfba',
  'name': '介壳淡粉红',
  'pinyin': 'jieqiaodanfenhong',
  'LAB': [85.97, 10.96, 15.67]
}, {
  'CMYK': [0, 43, 43, 0],
  'RGB': [246, 173, 143],
  'hex': '#f6ad8f',
  'name': '淡藏花红',
  'pinyin': 'dancanghuahong',
  'LAB': [76.95, 23.18, 26.11]
}, {
  'CMYK': [0, 58, 61, 0],
  'RGB': [246, 140, 96],
  'hex': '#f68c60',
  'name': '瓜瓤红',
  'pinyin': 'guaranghong',
  'LAB': [68.89, 36.35, 40.77]
}, {
  'CMYK': [0, 67, 74, 0],
  'RGB': [249, 114, 61],
  'hex': '#f9723d',
  'name': '芙蓉红',
  'pinyin': 'furonghong',
  'LAB': [63.76, 48.54, 52.82]
}, {
  'CMYK': [0, 74, 85, 0],
  'RGB': [250, 93, 25],
  'hex': '#fa5d19',
  'name': '莓酱红',
  'pinyin': 'meijianghong',
  'LAB': [60.08, 57.38, 64.29]
}, {
  'CMYK': [0, 62, 66, 0],
  'RGB': [238, 128, 85],
  'hex': '#ee8055',
  'name': '法螺红',
  'pinyin': 'faluohong',
  'LAB': [65.17, 38.69, 41.83]
}, {
  'CMYK': [4, 82, 99, 0],
  'RGB': [207, 72, 19],
  'hex': '#cf4813',
  'name': '落霞红',
  'pinyin': 'luoxiahong',
  'LAB': [49.43, 51.31, 55.25]
}, {
  'CMYK': [21, 43, 43, 9],
  'RGB': [184, 148, 133],
  'hex': '#b89485',
  'name': '淡玫瑰灰',
  'pinyin': 'danmeiguihui',
  'LAB': [64.21, 11.23, 13.03]
}, {
  'CMYK': [18, 80, 92, 7],
  'RGB': [177, 75, 40],
  'hex': '#b14b28',
  'name': '蟹蝥红',
  'pinyin': 'xiemaohong',
  'LAB': [44.98, 39.54, 40.34]
}, {
  'CMYK': [27, 91, 95, 28],
  'RGB': [134, 48, 32],
  'hex': '#863020',
  'name': '火岩棕',
  'pinyin': 'huoyanzong',
  'LAB': [32.45, 35.92, 29.18]
}, {
  'CMYK': [27, 96, 100, 27],
  'RGB': [134, 38, 23],
  'hex': '#862617',
  'name': '赭石',
  'pinyin': 'zheshi',
  'LAB': [30.67, 40.06, 32.47]
}, {
  'CMYK': [36, 90, 82, 56],
  'RGB': [89, 38, 32],
  'hex': '#592620',
  'name': '暗驼棕',
  'pinyin': 'antuozong',
  'LAB': [22.35, 22.94, 15.2]
}, {
  'CMYK': [35, 96, 88, 55],
  'RGB': [90, 31, 27],
  'hex': '#5a1f1b',
  'name': '酱棕',
  'pinyin': 'jiangzong',
  'LAB': [20.95, 26.86, 16.83]
}, {
  'CMYK': [34, 98, 91, 53],
  'RGB': [92, 30, 25],
  'hex': '#5c1e19',
  'name': '栗棕',
  'pinyin': 'lizong',
  'LAB': [21.1, 28.05, 18.44]
}, {
  'CMYK': [0, 31, 24, 0],
  'RGB': [244, 199, 186],
  'hex': '#f4c7ba',
  'name': '洋水仙红',
  'pinyin': 'yangshuixianhong',
  'LAB': [83.77, 14.04, 12.51]
}, {
  'CMYK': [0, 67, 55, 0],
  'RGB': [241, 118, 102],
  'hex': '#f17666',
  'name': '谷鞘红',
  'pinyin': 'guqiaohong',
  'LAB': [63.84, 45.95, 31.07]
}, {
  'CMYK': [0, 77, 69, 0],
  'RGB': [241, 86, 66],
  'hex': '#f15642',
  'name': '苹果红',
  'pinyin': 'pingguohong',
  'LAB': [57.79, 58.41, 43.52]
}, {
  'CMYK': [0, 84, 82, 0],
  'RGB': [245, 57, 28],
  'hex': '#f5391c',
  'name': '铁水红',
  'pinyin': 'tieshuihong',
  'LAB': [54.47, 68.82, 58.81]
}, {
  'CMYK': [0, 76, 67, 0],
  'RGB': [242, 90, 71],
  'hex': '#f25a47',
  'name': '桂红',
  'pinyin': 'guihong',
  'LAB': [58.64, 57.31, 41.82]
}, {
  'CMYK': [0, 84, 82, 0],
  'RGB': [243, 59, 31],
  'hex': '#f33b1f',
  'name': '极光红',
  'pinyin': 'jiguanghong',
  'LAB': [54.32, 67.7, 57.33]
}, {
  'CMYK': [0, 38, 25, 0],
  'RGB': [242, 185, 178],
  'hex': '#f2b9b2',
  'name': '粉红',
  'pinyin': 'fenhong',
  'LAB': [80.06, 19.58, 11.51]
}, {
  'CMYK': [0, 53, 36, 0],
  'RGB': [241, 151, 144],
  'hex': '#f19790',
  'name': '舌红',
  'pinyin': 'shehong',
  'LAB': [71.45, 32.97, 17.95]
}, {
  'CMYK': [0, 76, 68, 0],
  'RGB': [240, 90, 70],
  'hex': '#f05a46',
  'name': '曲红',
  'pinyin': 'quhong',
  'LAB': [58.3, 56.59, 41.89]
}, {
  'CMYK': [0, 83, 81, 0],
  'RGB': [242, 62, 35],
  'hex': '#f23e23',
  'name': '红汞红',
  'pinyin': 'honggonghong',
  'LAB': [54.49, 66.55, 55.69]
}, {
  'CMYK': [0, 29, 16, 0],
  'RGB': [242, 202, 201],
  'hex': '#f2cac9',
  'name': '淡绯',
  'pinyin': 'danfei',
  'LAB': [84.65, 13.94, 5.77]
}, {
  'CMYK': [0, 43, 24, 0],
  'RGB': [239, 175, 173],
  'hex': '#efafad',
  'name': '无花果红',
  'pinyin': 'wuhuaguohong',
  'LAB': [77.29, 23.09, 10.24]
}, {
  'CMYK': [0, 57, 36, 0],
  'RGB': [241, 144, 140],
  'hex': '#f1908c',
  'name': '榴子红',
  'pinyin': 'liuzihong',
  'LAB': [69.85, 36.19, 17.95]
}, {
  'CMYK': [0, 83, 81, 0],
  'RGB': [240, 63, 36],
  'hex': '#f03f24',
  'name': '胭脂红',
  'pinyin': 'yanzhihong',
  'LAB': [54.24, 65.65, 54.9]
}, {
  'CMYK': [0, 50, 23, 0],
  'RGB': [240, 161, 168],
  'hex': '#f0a1a8',
  'name': '合欢红',
  'pinyin': 'hehuanhong',
  'LAB': [74.08, 30.22, 8.42]
}, {
  'CMYK': [0, 56, 27, 0],
  'RGB': [241, 147, 156],
  'hex': '#f1939c',
  'name': '春梅红',
  'pinyin': 'chunmeihong',
  'LAB': [70.84, 36.44, 10.45]
}, {
  'CMYK': [0, 65, 38, 0],
  'RGB': [240, 124, 130],
  'hex': '#f07c82',
  'name': '香叶红',
  'pinyin': 'xiangyehong',
  'LAB': [65.39, 45.01, 17.38]
}, {
  'CMYK': [0, 80, 72, 0],
  'RGB': [240, 74, 58],
  'hex': '#f04a3a',
  'name': '珊瑚红',
  'pinyin': 'shanhuhong',
  'LAB': [55.81, 62.46, 45.57]
}, {
  'CMYK': [0, 84, 82, 0],
  'RGB': [241, 60, 34],
  'hex': '#f13c22',
  'name': '萝卜红',
  'pinyin': 'luobohong',
  'LAB': [54.07, 66.86, 55.71]
}, {
  'CMYK': [0, 65, 29, 0],
  'RGB': [231, 124, 142],
  'hex': '#e77c8e',
  'name': '淡茜红',
  'pinyin': 'danqianhong',
  'LAB': [64.44, 43.06, 9.06]
}, {
  'CMYK': [0, 77, 49, 0],
  'RGB': [237, 90, 101],
  'hex': '#ed5a65',
  'name': '艳红',
  'pinyin': 'yanhong',
  'LAB': [58.27, 57.4, 24.26]
}, {
  'CMYK': [0, 81, 66, 0],
  'RGB': [237, 72, 69],
  'hex': '#ed4845',
  'name': '淡菽红',
  'pinyin': 'danshuhong',
  'LAB': [55.14, 62.71, 38.67]
}, {
  'CMYK': [0, 84, 76, 0],
  'RGB': [237, 59, 47],
  'hex': '#ed3b2f',
  'name': '鱼鳃红',
  'pinyin': 'yusaihong',
  'LAB': [53.31, 66.3, 48.57]
}, {
  'CMYK': [0, 86, 82, 0],
  'RGB': [237, 51, 33],
  'hex': '#ed3321',
  'name': '樱桃红',
  'pinyin': 'yingtaohong',
  'LAB': [52.37, 68.31, 54.45]
}, {
  'CMYK': [0, 82, 44, 0],
  'RGB': [238, 72, 102],
  'hex': '#ee4866',
  'name': '淡蕊香红',
  'pinyin': 'danruixianghong',
  'LAB': [55.85, 64.88, 20.48]
}, {
  'CMYK': [0, 82, 46, 0],
  'RGB': [238, 72, 99],
  'hex': '#ee4863',
  'name': '石竹红',
  'pinyin': 'shizhuhong',
  'LAB': [55.79, 64.68, 22.17]
}, {
  'CMYK': [0, 82, 50, 0],
  'RGB': [239, 71, 93],
  'hex': '#ef475d',
  'name': '草茉莉红',
  'pinyin': 'caomolihong',
  'LAB': [55.73, 64.95, 25.64]
}, {
  'CMYK': [0, 84, 60, 0],
  'RGB': [238, 63, 77],
  'hex': '#ee3f4d',
  'name': '茶花红',
  'pinyin': 'chahuahong',
  'LAB': [54.31, 66.49, 33.15]
}, {
  'CMYK': [0, 86, 74, 0],
  'RGB': [237, 51, 51],
  'hex': '#ed3333',
  'name': '枸枢红',
  'pinyin': 'goushuhong',
  'LAB': [52.52, 68.76, 45.69]
}, {
  'CMYK': [0, 88, 81, 0],
  'RGB': [236, 43, 36],
  'hex': '#ec2b24',
  'name': '秋海棠红',
  'pinyin': 'qiuhaitanghong',
  'LAB': [51.48, 70.13, 52.25]
}, {
  'CMYK': [0, 89, 84, 0],
  'RGB': [235, 38, 26],
  'hex': '#eb261a',
  'name': '丽春红',
  'pinyin': 'lichunhong',
  'LAB': [50.83, 70.79, 56.07]
}, {
  'CMYK': [0, 90, 90, 0],
  'RGB': [222, 42, 24],
  'hex': '#de2a18',
  'name': '夕阳红',
  'pinyin': 'xiyanghong',
  'LAB': [48.57, 66.26, 54.08]
}, {
  'CMYK': [0, 92, 95, 0],
  'RGB': [212, 37, 23],
  'hex': '#d42517',
  'name': '鹤顶红',
  'pinyin': 'hedinghong',
  'LAB': [46.15, 64.66, 51.82]
}, {
  'CMYK': [19, 89, 85, 9],
  'RGB': [171, 55, 47],
  'hex': '#ab372f',
  'name': '鹅血石红',
  'pinyin': 'exueshihong',
  'LAB': [40.56, 46.85, 31.35]
}, {
  'CMYK': [17, 98, 100, 8],
  'RGB': [172, 31, 24],
  'hex': '#ac1f18',
  'name': '覆盆子红',
  'pinyin': 'fupenzihong',
  'LAB': [37.51, 54.7, 41.05]
}, {
  'CMYK': [36, 81, 64, 54],
  'RGB': [93, 49, 49],
  'hex': '#5d3131',
  'name': '貂紫',
  'pinyin': 'diaozi',
  'LAB': [25.99, 19.89, 8.83]
}, {
  'CMYK': [35, 94, 77, 53],
  'RGB': [92, 34, 35],
  'hex': '#5c2223',
  'name': '暗玉紫',
  'pinyin': 'anyuzi',
  'LAB': [22.09, 26.7, 12.95]
}, {
  'CMYK': [35, 100, 85, 54],
  'RGB': [90, 25, 27],
  'hex': '#5a191b',
  'name': '栗紫',
  'pinyin': 'lizi',
  'LAB': [19.83, 29.86, 15.43]
}, {
  'CMYK': [35, 100, 80, 54],
  'RGB': [90, 18, 22],
  'hex': '#5a1216',
  'name': '葡萄酱紫',
  'pinyin': 'putaojiangzi',
  'LAB': [18.64, 32.58, 17.4]
}, {
  'CMYK': [0, 49, 27, 0],
  'RGB': [238, 162, 164],
  'hex': '#eea2a4',
  'name': '牡丹粉红',
  'pinyin': 'mudanfenhong',
  'LAB': [73.99, 28.44, 10.45]
}, {
  'CMYK': [0, 78, 44, 0],
  'RGB': [237, 85, 106],
  'hex': '#ed556a',
  'name': '山茶红',
  'pinyin': 'shanchahong',
  'LAB': [57.59, 59.85, 20.44]
}, {
  'CMYK': [0, 86, 55, 0],
  'RGB': [240, 55, 82],
  'hex': '#f03752',
  'name': '海棠红',
  'pinyin': 'haitanghong',
  'LAB': [53.88, 69.75, 29.78]
}, {
  'CMYK': [13, 83, 62, 3],
  'RGB': [192, 72, 81],
  'hex': '#c04851',
  'name': '玉红',
  'pinyin': 'yuhong',
  'LAB': [47.54, 48.77, 20.5]
}, {
  'CMYK': [11, 93, 77, 2],
  'RGB': [192, 44, 56],
  'hex': '#c02c38',
  'name': '高粱红',
  'pinyin': 'gaolianghong',
  'LAB': [43.2, 57.98, 30.08]
}, {
  'CMYK': [22, 76, 54, 12],
  'RGB': [167, 83, 90],
  'hex': '#a7535a',
  'name': '满江红',
  'pinyin': 'manjianghong',
  'LAB': [45.82, 35.18, 12.07]
}, {
  'CMYK': [28, 100, 86, 33],
  'RGB': [124, 24, 35],
  'hex': '#7c1823',
  'name': '枣红',
  'pinyin': 'zaohong',
  'LAB': [26.9, 42.47, 20.37]
}, {
  'CMYK': [39, 92, 67, 64],
  'RGB': [76, 31, 36],
  'hex': '#4c1f24',
  'name': '葡萄紫',
  'pinyin': 'putaozi',
  'LAB': [18.55, 21.85, 6.99]
}, {
  'CMYK': [39, 100, 79, 63],
  'RGB': [77, 16, 24],
  'hex': '#4d1018',
  'name': '酱紫',
  'pinyin': 'jiangzi',
  'LAB': [15.56, 28.87, 11.53]
}, {
  'CMYK': [0, 89, 62, 0],
  'RGB': [238, 39, 70],
  'hex': '#ee2746',
  'name': '淡曙红',
  'pinyin': 'danshuhong',
  'LAB': [51.91, 72.63, 34.34]
}, {
  'CMYK': [0, 93, 76, 0],
  'RGB': [222, 28, 49],
  'hex': '#de1c31',
  'name': '唐菖蒲红',
  'pinyin': 'tangchangpuhong',
  'LAB': [47.72, 69.82, 40.89]
}, {
  'CMYK': [1, 95, 82, 0],
  'RGB': [209, 26, 45],
  'hex': '#d11a2d',
  'name': '鹅冠红',
  'pinyin': 'eguanhong',
  'LAB': [44.91, 66.66, 39.39]
}, {
  'CMYK': [13, 76, 50, 2],
  'RGB': [196, 90, 101],
  'hex': '#c45a65',
  'name': '莓红',
  'pinyin': 'meihong',
  'LAB': [51.82, 43.37, 14.44]
}, {
  'CMYK': [10, 96, 82, 2],
  'RGB': [194, 31, 48],
  'hex': '#c21f30',
  'name': '枫叶红',
  'pinyin': 'fengyehong',
  'LAB': [42.25, 61.71, 33.86]
}, {
  'CMYK': [19, 99, 86, 11],
  'RGB': [166, 27, 41],
  'hex': '#a61b29',
  'name': '苋菜红',
  'pinyin': 'xiancaihong',
  'LAB': [36.08, 54.53, 29.56]
}, {
  'CMYK': [29, 73, 51, 28],
  'RGB': [137, 78, 84],
  'hex': '#894e54',
  'name': '烟红',
  'pinyin': 'yanhong',
  'LAB': [40.25, 25.53, 7.31]
}, {
  'CMYK': [27, 98, 79, 30],
  'RGB': [130, 32, 43],
  'hex': '#82202b',
  'name': '暗紫苑红',
  'pinyin': 'anziyuanhong',
  'LAB': [29.29, 42.04, 18.37]
}, {
  'CMYK': [27, 100, 90, 29],
  'RGB': [130, 17, 31],
  'hex': '#82111f',
  'name': '殷红',
  'pinyin': 'yanhong',
  'LAB': [27.42, 46.11, 23.91]
}, {
  'CMYK': [36, 95, 71, 59],
  'RGB': [84, 30, 36],
  'hex': '#541e24',
  'name': '猪肝紫',
  'pinyin': 'zhuganzi',
  'LAB': [19.8, 25.72, 8.93]
}, {
  'CMYK': [38, 100, 81, 61],
  'RGB': [80, 10, 22],
  'hex': '#500a16',
  'name': '金鱼紫',
  'pinyin': 'jinyuzi',
  'LAB': [15.38, 32.03, 12.88]
}, {
  'CMYK': [1, 11, 9, 0],
  'RGB': [248, 235, 230],
  'hex': '#f8ebe6',
  'name': '草珠红',
  'pinyin': 'caozhuhong',
  'LAB': [93.92, 3.54, 3.98]
}, {
  'CMYK': [0, 68, 21, 0],
  'RGB': [236, 118, 150],
  'hex': '#ec7696',
  'name': '淡绛红',
  'pinyin': 'danjianghong',
  'LAB': [64.15, 48.7, 4.17]
}, {
  'CMYK': [0, 86, 30, 0],
  'RGB': [239, 52, 115],
  'hex': '#ef3473',
  'name': '品红',
  'pinyin': 'pinhong',
  'LAB': [54.07, 72.39, 10.3]
}, {
  'CMYK': [0, 69, 22, 0],
  'RGB': [234, 114, 147],
  'hex': '#ea7293',
  'name': '凤仙花红',
  'pinyin': 'fengxianhuahong',
  'LAB': [63.03, 49.63, 4.24]
}, {
  'CMYK': [0, 52, 18, 0],
  'RGB': [236, 155, 173],
  'hex': '#ec9bad',
  'name': '粉团花红',
  'pinyin': 'fentuanhuahong',
  'LAB': [72.42, 32.61, 3.2]
}, {
  'CMYK': [0, 80, 28, 0],
  'RGB': [235, 80, 126],
  'hex': '#eb507e',
  'name': '夹竹桃红',
  'pinyin': 'jiazhutaohong',
  'LAB': [56.98, 62.88, 7.78]
}, {
  'CMYK': [0, 88, 36, 0],
  'RGB': [237, 47, 106],
  'hex': '#ed2f6a',
  'name': '榲桲红',
  'pinyin': 'wenpohong',
  'LAB': [53.03, 72.52, 14.21]
}, {
  'CMYK': [0, 39, 14, 0],
  'RGB': [238, 184, 195],
  'hex': '#eeb8c3',
  'name': '姜红',
  'pinyin': 'jianghong',
  'LAB': [79.83, 21.11, 1.97]
}, {
  'CMYK': [0, 80, 27, 0],
  'RGB': [234, 81, 127],
  'hex': '#ea517f',
  'name': '莲瓣红',
  'pinyin': 'lianbanhong',
  'LAB': [56.98, 62.28, 7.17]
}, {
  'CMYK': [0, 33, 11, 0],
  'RGB': [241, 196, 205],
  'hex': '#f1c4cd',
  'name': '水红',
  'pinyin': 'shuihong',
  'LAB': [83.22, 17.37, 1.55]
}, {
  'CMYK': [0, 60, 18, 0],
  'RGB': [236, 138, 164],
  'hex': '#ec8aa4',
  'name': '报春红',
  'pinyin': 'baochunhong',
  'LAB': [68.52, 40.31, 2.57]
}, {
  'CMYK': [8, 78, 35, 1],
  'RGB': [206, 87, 109],
  'hex': '#ce5777',
  'name': '月季红',
  'pinyin': 'yuejihong',
  'LAB': [52.99, 49.06, 11.55]
}, {
  'CMYK': [0, 52, 15, 0],
  'RGB': [237, 157, 178],
  'hex': '#ed9db2',
  'name': '豇豆红',
  'pinyin': 'jiangdouhong',
  'LAB': [73.11, 32.6, 1.45]
}, {
  'CMYK': [0, 63, 18, 0],
  'RGB': [239, 130, 160],
  'hex': '#ef82a0',
  'name': '霞光红',
  'pinyin': 'xiaguanghong',
  'LAB': [67.16, 44.94, 2.9]
}, {
  'CMYK': [0, 85, 33, 0],
  'RGB': [235, 60, 112],
  'hex': '#eb3c70',
  'name': '松叶牡丹红',
  'pinyin': 'songyemudanhong',
  'LAB': [54.09, 68.78, 12.02]
}, {
  'CMYK': [0, 88, 40, 0],
  'RGB': [236, 44, 100],
  'hex': '#ec2c64',
  'name': '喜蛋红',
  'pinyin': 'xidanhong',
  'LAB': [52.45, 72.59, 17]
}, {
  'CMYK': [5, 38, 20, 0],
  'RGB': [227, 180, 184],
  'hex': '#e3b4b8',
  'name': '鼠鼻红',
  'pinyin': 'shubihong',
  'LAB': [77.53, 17.59, 4.46]
}, {
  'CMYK': [5, 96, 73, 1],
  'RGB': [204, 22, 58],
  'hex': '#cc163a',
  'name': '尖晶玉红',
  'pinyin': 'jianjingyuhong',
  'LAB': [43.82, 66.51, 30.19]
}, {
  'CMYK': [16, 61, 34, 4],
  'RGB': [194, 124, 136],
  'hex': '#c27c88',
  'name': '山黎豆红',
  'pinyin': 'shanlidouhong',
  'LAB': [59.58, 28.8, 4.9]
}, {
  'CMYK': [13, 90, 56, 3],
  'RGB': [191, 53, 83],
  'hex': '#bf3553',
  'name': '锦葵红',
  'pinyin': 'jinkuihong',
  'LAB': [44.58, 56.28, 15.28]
}, {
  'CMYK': [41, 64, 44, 36],
  'RGB': [115, 87, 92],
  'hex': '#73575c',
  'name': '鼠背灰',
  'pinyin': 'shubeihui',
  'LAB': [39.97, 12.4, 1.58]
}, {
  'CMYK': [33, 100, 75, 49],
  'RGB': [98, 22, 36],
  'hex': '#621624',
  'name': '甘蔗紫',
  'pinyin': 'ganzhezi',
  'LAB': [21.19, 34.7, 11.29]
}, {
  'CMYK': [32, 100, 84, 49],
  'RGB': [99, 7, 28],
  'hex': '#63071c',
  'name': '石竹紫',
  'pinyin': 'shizhuzi',
  'LAB': [19.59, 39.17, 14.84]
}, {
  'CMYK': [57, 72, 54, 74],
  'RGB': [54, 40, 43],
  'hex': '#36282b',
  'name': '苍蝇灰',
  'pinyin': 'cangyinghui',
  'LAB': [17.81, 7.12, 0.55]
}, {
  'CMYK': [52, 88, 58, 81],
  'RGB': [48, 22, 28],
  'hex': '#30161c',
  'name': '卵石紫',
  'pinyin': 'luanshizi',
  'LAB': [11.17, 14, 1.66]
}, {
  'CMYK': [56, 88, 62, 84],
  'RGB': [43, 18, 22],
  'hex': '#2b1216',
  'name': '李紫',
  'pinyin': 'lizi',
  'LAB': [9.02, 13.43, 2.95]
}, {
  'CMYK': [58, 90, 63, 83],
  'RGB': [45, 12, 19],
  'hex': '#2d0c13',
  'name': '茄皮紫',
  'pinyin': 'qiepizi',
  'LAB': [7.83, 17.76, 3.31]
}, {
  'CMYK': [0, 76, 16, 0],
  'RGB': [206, 94, 138],
  'hex': '#ce5e8a',
  'name': '吊钟花红',
  'pinyin': 'diaozhonghuahong',
  'LAB': [55.03, 48.9, -2.69]
}, {
  'CMYK': [0, 81, 18, 0],
  'RGB': [236, 78, 138],
  'hex': '#ec4e8a',
  'name': '兔眼红',
  'pinyin': 'tuyanhong',
  'LAB': [57.18, 65.07, 1.02]
}, {
  'CMYK': [0, 87, 24, 0],
  'RGB': [238, 44, 121],
  'hex': '#ee2c79',
  'name': '紫荆红',
  'pinyin': 'zijinghong',
  'LAB': [53.34, 74.59, 5.62]
}, {
  'CMYK': [24, 99, 52, 19],
  'RGB': [149, 28, 72],
  'hex': '#951c48',
  'name': '菜头紫',
  'pinyin': 'caitouzi',
  'LAB': [33.32, 51.32, 5.38]
}, {
  'CMYK': [34, 97, 54, 50],
  'RGB': [98, 29, 52],
  'hex': '#621d34',
  'name': '鹞冠紫',
  'pinyin': 'yaoguanzi',
  'LAB': [22.73, 33.18, 2.31]
}, {
  'CMYK': [33, 100, 58, 60],
  'RGB': [98, 16, 46],
  'hex': '#62102e',
  'name': '葡萄酒红',
  'pinyin': 'putaojiuhong',
  'LAB': [20.69, 37.73, 3.57]
}, {
  'CMYK': [53, 81, 50, 74],
  'RGB': [56, 33, 41],
  'hex': '#382129',
  'name': '磨石紫',
  'pinyin': 'moshizi',
  'LAB': [15.94, 12.47, -0.73]
}, {
  'CMYK': [48, 90, 50, 76],
  'RGB': [56, 25, 36],
  'hex': '#381924',
  'name': '檀紫',
  'pinyin': 'tanzi',
  'LAB': [13.61, 16.92, -0.54]
}, {
  'CMYK': [50, 91, 54, 79],
  'RGB': [51, 20, 30],
  'hex': '#33141e',
  'name': '火鹅紫',
  'pinyin': 'huoezi',
  'LAB': [11.26, 16.98, 0.35]
}, {
  'CMYK': [53, 92, 55, 81],
  'RGB': [49, 15, 27],
  'hex': '#310f1b',
  'name': '墨紫',
  'pinyin': 'mozi',
  'LAB': [9.59, 18.77, 0.14]
}, {
  'CMYK': [0, 48, 15, 0],
  'RGB': [238, 166, 183],
  'hex': '#eea6b7',
  'name': '晶红',
  'pinyin': 'jinghong',
  'LAB': [75.36, 28.9, 2]
}, {
  'CMYK': [0, 82, 16, 0],
  'RGB': [239, 73, 139],
  'hex': '#ef498b',
  'name': '扁豆花红',
  'pinyin': 'biandouhuahong',
  'LAB': [57.05, 67.86, 0.3]
}, {
  'CMYK': [2, 66, 22, 0],
  'RGB': [222, 120, 151],
  'hex': '#de7897',
  'name': '白芨红',
  'pinyin': 'baijihong',
  'LAB': [62.67, 43.01, 1.21]
}, {
  'CMYK': [0, 85, 24, 0],
  'RGB': [222, 63, 124],
  'hex': '#de3f7c',
  'name': '嫩菱红',
  'pinyin': 'nenlinghong',
  'LAB': [52.44, 65.2, 2.15]
}, {
  'CMYK': [5, 87, 30, 1],
  'RGB': [209, 60, 116],
  'hex': '#d13c74',
  'name': '菠根红',
  'pinyin': 'bogenhong',
  'LAB': [49.55, 61.84, 2.51]
}, {
  'CMYK': [15, 68, 28, 2],
  'RGB': [197, 112, 139],
  'hex': '#c5708b',
  'name': '酢酱草红',
  'pinyin': 'cujiangcaohong',
  'LAB': [57.38, 36.78, 0.03]
}, {
  'CMYK': [22, 83, 34, 11],
  'RGB': [168, 69, 107],
  'hex': '#a8456b',
  'name': '洋葱紫',
  'pinyin': 'yangcongzi',
  'LAB': [43.71, 44.54, -1.34]
}, {
  'CMYK': [40, 92, 47, 64],
  'RGB': [75, 30, 47],
  'hex': '#4b1e2f',
  'name': '海象紫',
  'pinyin': 'haixiangzi',
  'LAB': [18.49, 23.46, -0.89]
}, {
  'CMYK': [41, 97, 49, 68],
  'RGB': [70, 22, 41],
  'hex': '#461629',
  'name': '绀紫',
  'pinyin': 'ganzi',
  'LAB': [15.67, 25.13, -0.85]
}, {
  'CMYK': [42, 99, 51, 69],
  'RGB': [68, 14, 37],
  'hex': '#440e25',
  'name': '古铜紫',
  'pinyin': 'gutongzi',
  'LAB': [13.68, 27.81, -0.89]
}, {
  'CMYK': [0, 30, 12, 0],
  'RGB': [240, 201, 207],
  'hex': '#f0c9cf',
  'name': '石蕊红',
  'pinyin': 'shiruihong',
  'LAB': [84.38, 14.69, 2.15]
}, {
  'CMYK': [0, 50, 16, 0],
  'RGB': [235, 160, 179],
  'hex': '#eba0b3',
  'name': '芍药耕红',
  'pinyin': 'shaoyaogenghong',
  'LAB': [73.58, 30.44, 1.56]
}, {
  'CMYK': [0, 88, 23, 0],
  'RGB': [236, 45, 122],
  'hex': '#ec2d7a',
  'name': '藏花红',
  'pinyin': 'canghuahong',
  'LAB': [53.07, 73.94, 4.59]
}, {
  'CMYK': [0, 71, 18, 0],
  'RGB': [225, 108, 150],
  'hex': '#e16c96',
  'name': '初荷红',
  'pinyin': 'chuhehong',
  'LAB': [60.72, 49.88, -1.01]
}, {
  'CMYK': [6, 13, 7, 0],
  'RGB': [237, 227, 231],
  'hex': '#ede3e7',
  'name': '马鞭草紫',
  'pinyin': 'mabiancaozi',
  'LAB': [91.1, 4.08, -0.75]
}, {
  'CMYK': [7, 20, 8, 0],
  'RGB': [233, 215, 223],
  'hex': '#e9d7df',
  'name': '丁香淡紫',
  'pinyin': 'dingxiangdanzi',
  'LAB': [87.6, 7.56, -1.7]
}, {
  'CMYK': [7, 79, 18, 0],
  'RGB': [210, 86, 140],
  'hex': '#d2568c',
  'name': '丹紫红',
  'pinyin': 'danzihong',
  'LAB': [54.29, 54.16, -4.9]
}, {
  'CMYK': [4, 89, 21, 0],
  'RGB': [210, 53, 125],
  'hex': '#d2357d',
  'name': '玫瑰红',
  'pinyin': 'meiguihong',
  'LAB': [49.16, 65.32, -3.5]
}, {
  'CMYK': [19, 27, 9, 0],
  'RGB': [209, 194, 211],
  'hex': '#d1c2d3',
  'name': '淡牵牛紫',
  'pinyin': 'danqianniuzi',
  'LAB': [80.09, 8.3, -6.6]
}, {
  'CMYK': [21, 37, 12, 0],
  'RGB': [200, 173, 196],
  'hex': '#c8adc4',
  'name': '凤信紫',
  'pinyin': 'fengxinzi',
  'LAB': [73.64, 13.77, -8.1]
}, {
  'CMYK': [23, 53, 14, 1],
  'RGB': [192, 142, 175],
  'hex': '#c08eaf',
  'name': '萝兰紫',
  'pinyin': 'luolanzi',
  'LAB': [64.68, 24.25, -9.86]
}, {
  'CMYK': [18, 91, 18, 2],
  'RGB': [186, 47, 123],
  'hex': '#ba2f7b',
  'name': '玫瑰紫',
  'pinyin': 'meiguizi',
  'LAB': [44.09, 60.66, -10.3]
}, {
  'CMYK': [58, 56, 17, 2],
  'RGB': [128, 118, 163],
  'hex': '#8076a3',
  'name': '藤萝紫',
  'pinyin': 'tengluozi',
  'LAB': [52.05, 13.62, -22.73]
}, {
  'CMYK': [57, 62, 16, 2],
  'RGB': [128, 109, 158],
  'hex': '#806d9e',
  'name': '槿紫',
  'pinyin': 'jinzi',
  'LAB': [49.49, 17.77, -23.75]
}, {
  'CMYK': [56, 72, 15, 1],
  'RGB': [129, 92, 148],
  'hex': '#815c94',
  'name': '蕈紫',
  'pinyin': 'xunzi',
  'LAB': [44.88, 25.89, -24.95]
}, {
  'CMYK': [54, 89, 12, 1],
  'RGB': [129, 60, 133],
  'hex': '#813c85',
  'name': '桔梗紫',
  'pinyin': 'jiegengzi',
  'LAB': [37.1, 40.73, -28]
}, {
  'CMYK': [52, 100, 17, 7],
  'RGB': [126, 22, 113],
  'hex': '#7e1671',
  'name': '魏紫',
  'pinyin': 'weizi',
  'LAB': [29.91, 52.02, -26.8]
}, {
  'CMYK': [3, 26, 10, 0],
  'RGB': [233, 204, 211],
  'hex': '#e9ccd3',
  'name': '芝兰紫',
  'pinyin': 'zhilanzi',
  'LAB': [84.59, 11.29, 0.26]
}, {
  'CMYK': [10, 67, 12, 0],
  'RGB': [210, 118, 163],
  'hex': '#d276a3',
  'name': '菱锰红',
  'pinyin': 'lingmenghong',
  'LAB': [61.04, 41.55, -8.24]
}, {
  'CMYK': [11, 97, 10, 0],
  'RGB': [204, 85, 149],
  'hex': '#cc5595',
  'name': '龙须红',
  'pinyin': 'longxuhong',
  'LAB': [53.49, 53.89, -11.49]
}, {
  'CMYK': [8, 22, 12, 0],
  'RGB': [230, 210, 213],
  'hex': '#e6d2d5',
  'name': '蓟粉红',
  'pinyin': 'jifenhong',
  'LAB': [85.86, 7.43, 1.02]
}, {
  'CMYK': [16, 79, 14, 1],
  'RGB': [195, 86, 145],
  'hex': '#c35691',
  'name': '电气石红',
  'pinyin': 'dianqishihong',
  'LAB': [52.17, 50.1, -11.25]
}, {
  'CMYK': [19, 68, 18, 1],
  'RGB': [192, 111, 152],
  'hex': '#c06f98',
  'name': '樱草紫',
  'pinyin': 'yingcaozi',
  'LAB': [56.92, 37.42, -8.29]
}, {
  'CMYK': [25, 31, 26, 5],
  'RGB': [189, 174, 173],
  'hex': '#bdaead',
  'name': '芦穗灰',
  'pinyin': 'lusuihui',
  'LAB': [72.3, 5.19, 2.44]
}, {
  'CMYK': [26, 43, 26, 6],
  'RGB': [181, 152, 161],
  'hex': '#b598a1',
  'name': '隐红灰',
  'pinyin': 'yinhonghui',
  'LAB': [65.63, 12.27, -0.7]
}, {
  'CMYK': [27, 97, 27, 14],
  'RGB': [155, 30, 100],
  'hex': '#9b1e64',
  'name': '苋菜紫',
  'pinyin': 'xiancaizi',
  'LAB': [35.62, 55.14, -9.22]
}, {
  'CMYK': [39, 53, 38, 25],
  'RGB': [133, 109, 114],
  'hex': '#856d72',
  'name': '芦灰',
  'pinyin': 'luhui',
  'LAB': [48.43, 10.34, 0.78]
}, {
  'CMYK': [49, 71, 49, 58],
  'RGB': [79, 56, 62],
  'hex': '#4f383e',
  'name': '暮云灰',
  'pinyin': 'muyunhui',
  'LAB': [26.26, 11.29, 0.31]
}, {
  'CMYK': [49, 82, 46, 63],
  'RGB': [72, 41, 54],
  'hex': '#482936',
  'name': '斑鸠灰',
  'pinyin': 'banjiuhui',
  'LAB': [20.94, 16.56, -2.21]
}, {
  'CMYK': [4, 11, 9, 0],
  'RGB': [242, 231, 229],
  'hex': '#f2e7e5',
  'name': '淡藤萝紫',
  'pinyin': 'dantengluozi',
  'LAB': [92.43, 3.37, 2.28]
}, {
  'CMYK': [10, 27, 11, 0],
  'RGB': [224, 200, 209],
  'hex': '#e0c8d1',
  'name': '淡青紫',
  'pinyin': 'danqingzi',
  'LAB': [82.78, 9.92, -1.41]
}, {
  'CMYK': [24, 58, 15, 1],
  'RGB': [188, 132, 168],
  'hex': '#bc84a8',
  'name': '青蛤壳紫',
  'pinyin': 'qinghakezi',
  'LAB': [61.67, 27.16, -10.44]
}, {
  'CMYK': [31, 71, 15, 1],
  'RGB': [173, 101, 152],
  'hex': '#ad6598',
  'name': '豆蔻紫',
  'pinyin': 'doukouzi',
  'LAB': [52.35, 36.29, -15.41]
}, {
  'CMYK': [35, 75, 18, 2],
  'RGB': [163, 92, 143],
  'hex': '#a35c8f',
  'name': '扁豆紫',
  'pinyin': 'biandouzi',
  'LAB': [48.78, 36.27, -15.62]
}, {
  'CMYK': [39, 91, 15, 3],
  'RGB': [152, 54, 128],
  'hex': '#983680',
  'name': '芥花紫',
  'pinyin': 'jiehuazi',
  'LAB': [39.36, 49.36, -21.13]
}, {
  'CMYK': [43, 97, 19, 8],
  'RGB': [139, 38, 113],
  'hex': '#8b2671',
  'name': '青莲',
  'pinyin': 'qinglian',
  'LAB': [34.12, 50.01, -20.05]
}, {
  'CMYK': [44, 85, 24, 10],
  'RGB': [137, 66, 118],
  'hex': '#894276',
  'name': '芓紫',
  'pinyin': 'zizi',
  'LAB': [38.76, 37.31, -16.06]
}, {
  'CMYK': [45, 99, 24, 16],
  'RGB': [126, 32, 101],
  'hex': '#7e2065',
  'name': '葛巾紫',
  'pinyin': 'gejinzi',
  'LAB': [30.41, 46.99, -18.31]
}, {
  'CMYK': [49, 100, 29, 32],
  'RGB': [104, 23, 82],
  'hex': '#681752',
  'name': '牵牛紫',
  'pinyin': 'qianniuzi',
  'LAB': [24.2, 41.5, -15.78]
}, {
  'CMYK': [53, 75, 41, 41],
  'RGB': [93, 63, 81],
  'hex': '#5d3f51',
  'name': '紫灰',
  'pinyin': 'zihui',
  'LAB': [30.58, 16.27, -5.58]
}, {
  'CMYK': [55, 87, 41, 52],
  'RGB': [78, 42, 64],
  'hex': '#4e2a40',
  'name': '龙睛鱼紫',
  'pinyin': 'longjingyuzi',
  'LAB': [22.46, 20.23, -6.69]
}, {
  'CMYK': [58, 96, 40, 61],
  'RGB': [65, 28, 53],
  'hex': '#411c35',
  'name': '荸荠紫',
  'pinyin': 'biqizi',
  'LAB': [16.55, 21.74, -8.2]
}, {
  'CMYK': [63, 74, 52, 70],
  'RGB': [54, 41, 47],
  'hex': '#36292f',
  'name': '古鼎灰',
  'pinyin': 'gudinghui',
  'LAB': [18.25, 7.26, -1.6]
}, {
  'CMYK': [81, 87, 54, 84],
  'RGB': [30, 19, 29],
  'hex': '#1e131d',
  'name': '乌梅紫',
  'pinyin': 'wumeizi',
  'LAB': [7.5, 7.89, -4.85]
}, {
  'CMYK': [83, 87, 55, 86],
  'RGB': [28, 13, 26],
  'hex': '#1c0d1a',
  'name': '深牵牛紫',
  'pinyin': 'shenqianniuzi',
  'LAB': [5.5, 9.42, -5.53]
}, {
  'CMYK': [7, 5, 7, 0],
  'RGB': [241, 240, 237],
  'hex': '#f1f0ed',
  'name': '银白',
  'pinyin': 'yinbai',
  'LAB': [94.79, -0.19, 1.55]
}, {
  'CMYK': [13, 10, 9, 0],
  'RGB': [226, 225, 228],
  'hex': '#e2e1e4',
  'name': '芡食白',
  'pinyin': 'qianshibai',
  'LAB': [89.68, 0.88, -1.36]
}, {
  'CMYK': [23, 18, 12, 1],
  'RGB': [204, 204, 214],
  'hex': '#ccccd6',
  'name': '远山紫',
  'pinyin': 'yuanshanzi',
  'LAB': [82.31, 1.87, -4.97]
}, {
  'CMYK': [39, 31, 17, 2],
  'RGB': [167, 168, 189],
  'hex': '#a7a8bd',
  'name': '淡蓝紫',
  'pinyin': 'danlanzi',
  'LAB': [69.39, 3.85, -10.87]
}, {
  'CMYK': [74, 64, 14, 1],
  'RGB': [97, 100, 159],
  'hex': '#61649f',
  'name': '山梗紫',
  'pinyin': 'shangengzi',
  'LAB': [44.46, 13.99, -32.38]
}, {
  'CMYK': [63, 53, 22, 5],
  'RGB': [116, 117, 155],
  'hex': '#74759b',
  'name': '螺甸紫',
  'pinyin': 'luodianzi',
  'LAB': [50.45, 8.35, -20.6]
}, {
  'CMYK': [21, 17, 19, 1],
  'RGB': [207, 204, 201],
  'hex': '#cfccc9',
  'name': '玛瑙灰',
  'pinyin': 'manaohui',
  'LAB': [82.2, 0.49, 1.84]
}, {
  'CMYK': [80, 73, 21, 6],
  'RGB': [82, 82, 136],
  'hex': '#525288',
  'name': '野菊紫',
  'pinyin': 'yejuzi',
  'LAB': [37.12, 14.23, -30.17]
}, {
  'CMYK': [100, 93, 21, 5],
  'RGB': [46, 49, 124],
  'hex': '#2e317c',
  'name': '满天星紫',
  'pinyin': 'mantianxingzi',
  'LAB': [24.42, 23.3, -43.19]
}, {
  'CMYK': [48, 45, 40, 26],
  'RGB': [122, 115, 116],
  'hex': '#7a7374',
  'name': '锌灰',
  'pinyin': 'xinhui',
  'LAB': [49.08, 2.88, 0.4]
}, {
  'CMYK': [91, 84, 40, 43],
  'RGB': [48, 47, 75],
  'hex': '#302f4b',
  'name': '野葡萄紫',
  'pinyin': 'yeputaozi',
  'LAB': [20.7, 8.19, -17.15]
}, {
  'CMYK': [70, 69, 49, 56],
  'RGB': [62, 56, 65],
  'hex': '#3e3841',
  'name': '剑锋紫',
  'pinyin': 'jianfengzi',
  'LAB': [24.43, 4.64, -4.62]
}, {
  'CMYK': [79, 74, 49, 60],
  'RGB': [50, 47, 59],
  'hex': '#322f3b',
  'name': '龙葵紫',
  'pinyin': 'longkuizi',
  'LAB': [20.15, 4.29, -7.12]
}, {
  'CMYK': [90, 84, 50, 69],
  'RGB': [34, 32, 46],
  'hex': '#22202e',
  'name': '暗龙胆紫',
  'pinyin': 'anlongdanzi',
  'LAB': [13.04, 4.75, -8.95]
}, {
  'CMYK': [98, 93, 48, 73],
  'RGB': [31, 32, 64],
  'hex': '#1f2040',
  'name': '晶石紫',
  'pinyin': 'jingshizi',
  'LAB': [13.79, 9.77, -20.6]
}, {
  'CMYK': [100, 94, 52, 77],
  'RGB': [19, 17, 36],
  'hex': '#131124',
  'name': '暗蓝紫',
  'pinyin': 'anlanzi',
  'LAB': [6.02, 6.29, -12.57]
}, {
  'CMYK': [95, 46, 10, 1],
  'RGB': [39, 117, 182],
  'hex': '#2775b6',
  'name': '景泰蓝',
  'pinyin': 'jingtailan',
  'LAB': [47.66, -0.42, -40.98]
}, {
  'CMYK': [96, 47, 11, 1],
  'RGB': [36, 116, 181],
  'hex': '#2474b5',
  'name': '尼罗蓝',
  'pinyin': 'niluolan',
  'LAB': [47.23, -0.51, -41.08]
}, {
  'CMYK': [25, 6, 10, 0],
  'RGB': [208, 223, 230],
  'hex': '#d0dfe6',
  'name': '远天蓝',
  'pinyin': 'yuantianlan',
  'LAB': [87.91, -3.65, -5.15]
}, {
  'CMYK': [53, 19, 15, 1],
  'RGB': [147, 181, 207],
  'hex': '#93b5cf',
  'name': '星蓝',
  'pinyin': 'xinglan',
  'LAB': [72.06, -5.47, -16.9]
}, {
  'CMYK': [74, 27, 16, 2],
  'RGB': [97, 154, 195],
  'hex': '#619ac3',
  'name': '羽扇豆蓝',
  'pinyin': 'yushandoulan',
  'LAB': [61.3, -7.23, -26.92]
}, {
  'CMYK': [95, 45, 10, 1],
  'RGB': [35, 118, 183],
  'hex': '#2376b7',
  'name': '花青',
  'pinyin': 'huaqing',
  'LAB': [47.92, -1.08, -41.16]
}, {
  'CMYK': [78, 27, 17, 2],
  'RGB': [86, 152, 195],
  'hex': '#5698c3',
  'name': '睛蓝',
  'pinyin': 'jinglan',
  'LAB': [60.22, -8.56, -28.62]
}, {
  'CMYK': [99, 44, 10, 1],
  'RGB': [33, 119, 184],
  'hex': '#2177b8',
  'name': '虹蓝',
  'pinyin': 'honglan',
  'LAB': [48.23, -1.51, -41.25]
}, {
  'CMYK': [43, 4, 16, 0],
  'RGB': [176, 213, 223],
  'hex': '#b0d5df',
  'name': '湖水蓝',
  'pinyin': 'hushuilan',
  'LAB': [82.99, -9.99, -8.98]
}, {
  'CMYK': [59, 12, 19, 0],
  'RGB': [138, 188, 209],
  'hex': '#8abcd1',
  'name': '秋波蓝',
  'pinyin': 'qiubolan',
  'LAB': [73.52, -11.29, -15.83]
}, {
  'CMYK': [73, 17, 20, 1],
  'RGB': [102, 169, 201],
  'hex': '#66a9c9',
  'name': '涧石蓝',
  'pinyin': 'jianshilan',
  'LAB': [66.07, -12.54, -22.93]
}, {
  'CMYK': [93, 36, 15, 2],
  'RGB': [41, 131, 187],
  'hex': '#2983bb',
  'name': '潮蓝',
  'pinyin': 'chaolan',
  'LAB': [52.16, -6.69, -36.76]
}, {
  'CMYK': [99, 48, 11, 1],
  'RGB': [23, 114, 180],
  'hex': '#1772b4',
  'name': '群青',
  'pinyin': 'qunqing',
  'LAB': [46.32, -0.83, -41.96]
}, {
  'CMYK': [74, 2, 24, 0],
  'RGB': [99, 187, 208],
  'hex': '#63bbd0',
  'name': '霁青',
  'pinyin': 'jiqing',
  'LAB': [71.38, -20.68, -18.71]
}, {
  'CMYK': [77, 7, 24, 0],
  'RGB': [92, 179, 204],
  'hex': '#5cb3cc',
  'name': '碧青',
  'pinyin': 'biqing',
  'LAB': [68.66, -19.15, -20.67]
}, {
  'CMYK': [94, 32, 17, 3],
  'RGB': [36, 134, 185],
  'hex': '#2486b9',
  'name': '宝石蓝',
  'pinyin': 'baoshilan',
  'LAB': [52.87, -9.68, -34.52]
}, {
  'CMYK': [98, 43, 14, 2],
  'RGB': [22, 119, 179],
  'hex': '#1677b3',
  'name': '天蓝',
  'pinyin': 'tianlan',
  'LAB': [47.77, -4.32, -39.09]
}, {
  'CMYK': [100, 52, 11, 1],
  'RGB': [18, 107, 174],
  'hex': '#126bae',
  'name': '柏林蓝',
  'pinyin': 'bolinlan',
  'LAB': [43.79, 0.82, -42.49]
}, {
  'CMYK': [92, 10, 25, 1],
  'RGB': [34, 162, 195],
  'hex': '#22a2c3',
  'name': '海青',
  'pinyin': 'haiqing',
  'LAB': [61.75, -21.66, -26.38]
}, {
  'CMYK': [94, 16, 23, 3],
  'RGB': [26, 148, 188],
  'hex': '#1a94bc',
  'name': '钴蓝',
  'pinyin': 'gulan',
  'LAB': [57.1, -17.26, -29.64]
}, {
  'CMYK': [95, 25, 20, 4],
  'RGB': [21, 139, 184],
  'hex': '#158bb8',
  'name': '鸢尾蓝',
  'pinyin': 'yuanweilan',
  'LAB': [54.11, -14.08, -32.01]
}, {
  'CMYK': [98, 42, 16, 3],
  'RGB': [17, 119, 176],
  'hex': '#1177b0',
  'name': '牵牛花蓝',
  'pinyin': 'qianniuhualan',
  'LAB': [47.55, -5.78, -37.7]
}, {
  'CMYK': [100, 65, 11, 1],
  'RGB': [15, 89, 164],
  'hex': '#0f59a4',
  'name': '飞燕草蓝',
  'pinyin': 'feiyancaolan',
  'LAB': [37.71, 8.17, -46.32]
}, {
  'CMYK': [95, 47, 14, 2],
  'RGB': [43, 115, 175],
  'hex': '#2b73af',
  'name': '品蓝',
  'pinyin': 'pinlan',
  'LAB': [46.8, -1.32, -38.27]
}, {
  'CMYK': [24, 14, 16, 1],
  'RGB': [205, 209, 211],
  'hex': '#cdd1d3',
  'name': '银鱼白',
  'pinyin': 'yinyubai',
  'LAB': [83.59, -0.99, -1.48]
}, {
  'CMYK': [93, 49, 17, 3],
  'RGB': [49, 112, 167],
  'hex': '#3170a7',
  'name': '安安蓝',
  'pinyin': 'ananlan',
  'LAB': [45.67, -1.57, -35.36]
}, {
  'CMYK': [64, 52, 39, 28],
  'RGB': [94, 97, 109],
  'hex': '#5e616d',
  'name': '鱼尾灰',
  'pinyin': 'yuweihui',
  'LAB': [41.26, 1.52, -7.19]
}, {
  'CMYK': [78, 60, 40, 31],
  'RGB': [71, 81, 100],
  'hex': '#475164',
  'name': '鲸鱼灰',
  'pinyin': 'jingyuhui',
  'LAB': [34.28, 0.92, -12.33]
}, {
  'CMYK': [69, 64, 52, 59],
  'RGB': [255, 254, 250],
  'hex': '#fffefa',
  'name': '海参灰',
  'pinyin': 'haishenhui',
  'LAB': [99.62, -0.36, 2.01]
}, {
  'CMYK': [76, 70, 51, 60],
  'RGB': [53, 51, 60],
  'hex': '#35333c',
  'name': '沙鱼灰',
  'pinyin': 'shayuhui',
  'LAB': [21.76, 3.04, -5.34]
}, {
  'CMYK': [100, 89, 54, 79],
  'RGB': [15, 20, 35],
  'hex': '#0f1423',
  'name': '钢蓝',
  'pinyin': 'ganglan',
  'LAB': [6.53, 2.58, -11.05]
}, {
  'CMYK': [35, 13, 13, 0],
  'RGB': [186, 204, 217],
  'hex': '#baccd9',
  'name': '云水蓝',
  'pinyin': 'yunshuilan',
  'LAB': [81.09, -3.45, -8.53]
}, {
  'CMYK': [55, 20, 18, 1],
  'RGB': [143, 178, 201],
  'hex': '#8fb2c9',
  'name': '晴山蓝',
  'pinyin': 'qingshanlan',
  'LAB': [70.8, -6.48, -15.54]
}, {
  'CMYK': [100, 60, 8, 1],
  'RGB': [22, 97, 171],
  'hex': '#1661ab',
  'name': '靛青',
  'pinyin': 'dianqing',
  'LAB': [40.67, 6.25, -45.71]
}, {
  'CMYK': [29, 16, 17, 1],
  'RGB': [196, 203, 207],
  'hex': '#c4cbcf',
  'name': '大理石灰',
  'pinyin': 'dalishihui',
  'LAB': [81.26, -1.63, -2.83]
}, {
  'CMYK': [100, 67, 16, 3],
  'RGB': [21, 85, 154],
  'hex': '#15559a',
  'name': '海涛蓝',
  'pinyin': 'haitaolan',
  'LAB': [35.96, 7.16, -43.12]
}, {
  'CMYK': [81, 41, 24, 8],
  'RGB': [78, 124, 161],
  'hex': '#4e7ca1',
  'name': '蝶翅蓝',
  'pinyin': 'diechilan',
  'LAB': [50.22, -4.95, -24.66]
}, {
  'CMYK': [93, 50, 21, 6],
  'RGB': [52, 108, 156],
  'hex': '#346c9c',
  'name': '海军蓝',
  'pinyin': 'haijunlan',
  'LAB': [44.02, -2.58, -31.47]
}, {
  'CMYK': [77, 68, 54, 66],
  'RGB': [47, 47, 53],
  'hex': '#2f2f35',
  'name': '水牛灰',
  'pinyin': 'shuiniuhui',
  'LAB': [19.61, 1.48, -3.83]
}, {
  'CMYK': [80, 70, 53, 65],
  'RGB': [45, 46, 54],
  'hex': '#2d2e36',
  'name': '牛角灰',
  'pinyin': 'niujiaohui',
  'LAB': [19.13, 1.59, -5.26]
}, {
  'CMYK': [100, 86, 54, 78],
  'RGB': [19, 24, 36],
  'hex': '#131824',
  'name': '燕颔蓝',
  'pinyin': 'yanhanlan',
  'LAB': [8.29, 1.57, -9.04]
}, {
  'CMYK': [21, 6, 10, 0],
  'RGB': [216, 227, 231],
  'hex': '#d8e3e7',
  'name': '云峰白',
  'pinyin': 'yunfengbai',
  'LAB': [89.53, -2.92, -3.23]
}, {
  'CMYK': [32, 8, 13, 0],
  'RGB': [195, 215, 223],
  'hex': '#c3d7df',
  'name': '井天蓝',
  'pinyin': 'jingtianlan',
  'LAB': [84.75, -5.08, -6.22]
}, {
  'CMYK': [91, 24, 22, 4],
  'RGB': [47, 144, 185],
  'hex': '#2f90b9',
  'name': '云山蓝',
  'pinyin': 'yunshanlan',
  'LAB': [56.14, -14.05, -29.4]
}, {
  'CMYK': [96, 34, 18, 4],
  'RGB': [23, 129, 181],
  'hex': '#1781b5',
  'name': '釉蓝',
  'pinyin': 'youlan',
  'LAB': [50.94, -9.38, -35.26]
}, {
  'CMYK': [28, 12, 17, 0],
  'RGB': [199, 210, 212],
  'hex': '#c7d2d4',
  'name': '鸥蓝',
  'pinyin': 'oulan',
  'LAB': [83.43, -3.34, -2.29]
}, {
  'CMYK': [100, 53, 21, 6],
  'RGB': [17, 101, 154],
  'hex': '#11659a',
  'name': '搪磁蓝',
  'pinyin': 'tangcilan',
  'LAB': [40.83, -3.41, -35.37]
}, {
  'CMYK': [29, 18, 21, 2],
  'RGB': [192, 196, 195],
  'hex': '#c0c4c3',
  'name': '月影白',
  'pinyin': 'yueyingbai',
  'LAB': [78.82, -1.57, 0]
}, {
  'CMYK': [36, 20, 23, 2],
  'RGB': [178, 187, 190],
  'hex': '#b2bbbe',
  'name': '星灰',
  'pinyin': 'xinghui',
  'LAB': [75.27, -2.53, -2.61]
}, {
  'CMYK': [70, 38, 36, 18],
  'RGB': [94, 121, 135],
  'hex': '#5e7987',
  'name': '淡蓝灰',
  'pinyin': 'danlanhui',
  'LAB': [49.25, -6.21, -10.81]
}, {
  'CMYK': [100, 68, 32, 20],
  'RGB': [20, 74, 116],
  'hex': '#144a74',
  'name': '鷃蓝',
  'pinyin': 'yanlan',
  'LAB': [30.17, -1.18, -28.99]
}, {
  'CMYK': [55, 40, 40, 23],
  'RGB': [116, 120, 122],
  'hex': '#74787a',
  'name': '嫩灰',
  'pinyin': 'nenhui',
  'LAB': [50.15, -1.09, -1.63]
}, {
  'CMYK': [77, 50, 41, 31],
  'RGB': [73, 92, 105],
  'hex': '#495c69',
  'name': '战舰灰',
  'pinyin': 'zhanjianhui',
  'LAB': [38, -3.84, -9.8]
}, {
  'CMYK': [67, 57, 49, 49],
  'RGB': [71, 72, 76],
  'hex': '#47484c',
  'name': '瓦罐灰',
  'pinyin': 'waguanhui',
  'LAB': [30.63, 0.49, -2.54]
}, {
  'CMYK': [87, 69, 51, 58],
  'RGB': [43, 51, 62],
  'hex': '#2b333e',
  'name': '青灰',
  'pinyin': 'qinghui',
  'LAB': [20.93, -0.34, -8.03]
}, {
  'CMYK': [100, 77, 50, 62],
  'RGB': [28, 41, 56],
  'hex': '#1c2938',
  'name': '鸽蓝',
  'pinyin': 'gelan',
  'LAB': [16.09, -0.64, -11.4]
}, {
  'CMYK': [100, 82, 51, 64],
  'RGB': [20, 35, 52],
  'hex': '#142334',
  'name': '钢青',
  'pinyin': 'gangqing',
  'LAB': [13.22, -0.29, -13.08]
}, {
  'CMYK': [100, 84, 51, 68],
  'RGB': [16, 31, 48],
  'hex': '#101f30',
  'name': '暗蓝',
  'pinyin': 'anlan',
  'LAB': [11.3, -0.06, -13.23]
}, {
  'CMYK': [11, 0, 8, 0],
  'RGB': [238, 247, 242],
  'hex': '#eef7f2',
  'name': '月白',
  'pinyin': 'yuebai',
  'LAB': [96.45, -3.86, 1.35]
}, {
  'CMYK': [33, 0, 14, 0],
  'RGB': [198, 230, 232],
  'hex': '#c6e6e8',
  'name': '海天蓝',
  'pinyin': 'haitianlan',
  'LAB': [89.12, -10.02, -4.5]
}, {
  'CMYK': [57, 0, 22, 0],
  'RGB': [147, 213, 220],
  'hex': '#93d5dc',
  'name': '清水蓝',
  'pinyin': 'qingshuilan',
  'LAB': [81.26, -19.05, -10.12]
}, {
  'CMYK': [79, 0, 27, 0],
  'RGB': [81, 196, 211],
  'hex': '#51c4d3',
  'name': '瀑布蓝',
  'pinyin': 'pubulan',
  'LAB': [73.5, -27.78, -17.19]
}, {
  'CMYK': [89, 0, 29, 0],
  'RGB': [41, 183, 203],
  'hex': '#29b7cb',
  'name': '蔚蓝',
  'pinyin': 'weilan',
  'LAB': [68.49, -29.06, -20.49]
}, {
  'CMYK': [92, 0, 28, 0],
  'RGB': [14, 176, 201],
  'hex': '#0eb0c9',
  'name': '孔雀蓝',
  'pinyin': 'kongquelan',
  'LAB': [66.02, -27.97, -23.18]
}, {
  'CMYK': [93, 0, 31, 0],
  'RGB': [16, 174, 194],
  'hex': '#10aec2',
  'name': '甸子蓝',
  'pinyin': 'dianzilan',
  'LAB': [65.18, -29.2, -20.59]
}, {
  'CMYK': [78, 36, 0, 0],
  'RGB': [87, 195, 194],
  'hex': '#57c3c2',
  'name': '石绿',
  'pinyin': 'shilv',
  'LAB': [72.85, -30.95, -8.89]
}, {
  'CMYK': [40, 0, 30, 0],
  'RGB': [185, 222, 201],
  'hex': '#b9dec9',
  'name': '竹篁绿',
  'pinyin': 'zhuhuanglv',
  'LAB': [85.38, -16.19, 6.26]
}, {
  'CMYK': [64, 0, 46, 0],
  'RGB': [131, 203, 172],
  'hex': '#83cbac',
  'name': '粉绿',
  'pinyin': 'fenlv',
  'LAB': [76.38, -29.35, 8.38]
}, {
  'CMYK': [95, 0, 52, 0],
  'RGB': [18, 170, 156],
  'hex': '#12aa9c',
  'name': '美蝶绿',
  'pinyin': 'meidielv',
  'LAB': [62.74, -38.95, -3.05]
}, {
  'CMYK': [75, 0, 61, 0],
  'RGB': [102, 193, 140],
  'hex': '#66c18c',
  'name': '毛绿',
  'pinyin': 'maolv',
  'LAB': [71.45, -39.28, 18.45]
}, {
  'CMYK': [78, 0, 62, 0],
  'RGB': [93, 190, 138],
  'hex': '#5dbe8a',
  'name': '蔻梢绿',
  'pinyin': 'koushaolv',
  'LAB': [70.16, -40.66, 17.69]
}, {
  'CMYK': [81, 0, 62, 0],
  'RGB': [85, 187, 138],
  'hex': '#55bb8a',
  'name': '麦苗绿',
  'pinyin': 'maimiaolv',
  'LAB': [68.97, -41.26, 15.99]
}, {
  'CMYK': [86, 0, 63, 0],
  'RGB': [69, 183, 135],
  'hex': '#45b787',
  'name': '蛙绿',
  'pinyin': 'walv',
  'LAB': [67.18, -43.6, 15.06]
}, {
  'CMYK': [92, 0, 64, 0],
  'RGB': [43, 174, 133],
  'hex': '#2bae85',
  'name': '铜绿',
  'pinyin': 'tonglv',
  'LAB': [63.73, -44.5, 11.23]
}, {
  'CMYK': [96, 0, 64, 0],
  'RGB': [27, 167, 132],
  'hex': '#1ba784',
  'name': '竹绿',
  'pinyin': 'zhulv',
  'LAB': [61.25, -43.56, 8.23]
}, {
  'CMYK': [98, 2, 64, 0],
  'RGB': [18, 161, 130],
  'hex': '#12a182',
  'name': '蓝绿',
  'pinyin': 'lanlv',
  'LAB': [59.18, -42.24, 6.38]
}, {
  'CMYK': [32, 7, 18, 0],
  'RGB': [196, 215, 214],
  'hex': '#c4d7d6',
  'name': '穹灰',
  'pinyin': 'qionghui',
  'LAB': [84.58, -6.54, -1.7]
}, {
  'CMYK': [94, 11, 33, 1],
  'RGB': [30, 158, 179],
  'hex': '#1e9eb3',
  'name': '翠蓝',
  'pinyin': 'cuilan',
  'LAB': [59.87, -25.27, -20.28]
}, {
  'CMYK': [96, 16, 31, 3],
  'RGB': [15, 149, 176],
  'hex': '#0f95b0',
  'name': '胆矾蓝',
  'pinyin': 'danfanlan',
  'LAB': [56.81, -22.63, -23.28]
}, {
  'CMYK': [96, 18, 34, 4],
  'RGB': [20, 145, 168],
  'hex': '#1491a8',
  'name': '樫鸟蓝',
  'pinyin': 'jianniaolan',
  'LAB': [55.3, -23, -21.03]
}, {
  'CMYK': [64, 18, 32, 2],
  'RGB': [124, 171, 177],
  'hex': '#7cabb1',
  'name': '闪蓝',
  'pinyin': 'shanlan',
  'LAB': [66.96, -14.14, -8.15]
}, {
  'CMYK': [40, 24, 32, 6],
  'RGB': [164, 172, 167],
  'hex': '#a4aca7',
  'name': '冰山蓝',
  'pinyin': 'bingshanlan',
  'LAB': [69.6, -3.78, 1.58]
}, {
  'CMYK': [56, 26, 36, 7],
  'RGB': [134, 157, 157],
  'hex': '#869d9d',
  'name': '虾壳青',
  'pinyin': 'xiakeqing',
  'LAB': [63.02, -8.04, -2.72]
}, {
  'CMYK': [71, 28, 39, 10],
  'RGB': [100, 142, 147],
  'hex': '#648e93',
  'name': '晚波蓝',
  'pinyin': 'wanbolan',
  'LAB': [56.24, -13.07, -7.3]
}, {
  'CMYK': [89, 27, 41, 13],
  'RGB': [59, 129, 140],
  'hex': '#3b818c',
  'name': '蜻蜓蓝',
  'pinyin': 'qingtinglan',
  'LAB': [50.12, -18.56, -12.61]
}, {
  'CMYK': [99, 33, 38, 21],
  'RGB': [18, 110, 130],
  'hex': '#126e82',
  'name': '玉鈫蓝',
  'pinyin': 'yuqinlan',
  'LAB': [42.6, -17.7, -18.23]
}, {
  'CMYK': [57, 37, 42, 21],
  'RGB': [115, 124, 123],
  'hex': '#737c7b',
  'name': '垩灰',
  'pinyin': 'ehui',
  'LAB': [51.25, -3.55, -0.62]
}, {
  'CMYK': [65, 40, 44, 26],
  'RGB': [97, 113, 114],
  'hex': '#617172',
  'name': '夏云灰',
  'pinyin': 'xiayunhui',
  'LAB': [46.4, -5.72, -2.57]
}, {
  'CMYK': [100, 52, 46, 43],
  'RGB': [19, 72, 87],
  'hex': '#134857',
  'name': '苍蓝',
  'pinyin': 'canglan',
  'LAB': [28.01, -11.46, -13.89]
}, {
  'CMYK': [67, 53, 51, 50],
  'RGB': [71, 75, 76],
  'hex': '#474b4c',
  'name': '黄昏灰',
  'pinyin': 'huanghunhui',
  'LAB': [31.56, -1.4, -1.17]
}, {
  'CMYK': [94, 58, 54, 60],
  'RGB': [33, 55, 61],
  'hex': '#21373d',
  'name': '灰蓝',
  'pinyin': 'huilan',
  'LAB': [21.55, -6.79, -6.5]
}, {
  'CMYK': [100, 64, 56, 68],
  'RGB': [19, 44, 51],
  'hex': '#132c33',
  'name': '深灰蓝',
  'pinyin': 'shenhuilan',
  'LAB': [16.39, -7.21, -7.49]
}, {
  'CMYK': [49, 5, 37, 0],
  'RGB': [164, 202, 182],
  'hex': '#a4cab6',
  'name': '玉簪绿',
  'pinyin': 'yuzanlv',
  'LAB': [78.17, -16.6, 5.82]
}, {
  'CMYK': [96, 12, 66, 2],
  'RGB': [44, 150, 120],
  'hex': '#2c9678',
  'name': '青矾绿',
  'pinyin': 'qingfanlv',
  'LAB': [55.79, -37.25, 7.24]
}, {
  'CMYK': [52, 11, 37, 0],
  'RGB': [154, 190, 175],
  'hex': '#9abeaf',
  'name': '草原远绿',
  'pinyin': 'caoyuanyuanlv',
  'LAB': [74.05, -15.12, 3.57]
}, {
  'CMYK': [74, 14, 51, 1],
  'RGB': [105, 167, 148],
  'hex': '#69a794',
  'name': '梧枝绿',
  'pinyin': 'wuzhilv',
  'LAB': [63.98, -24.44, 3.51]
}, {
  'CMYK': [55, 16, 40, 1],
  'RGB': [146, 179, 165],
  'hex': '#92b3a5',
  'name': '浪花绿',
  'pinyin': 'langhualv',
  'LAB': [70.22, -14.08, 3.42]
}, {
  'CMYK': [99, 23, 70, 10],
  'RGB': [36, 128, 103],
  'hex': '#248067',
  'name': '海王绿',
  'pinyin': 'haiwanglv',
  'LAB': [47.99, -32.97, 5.91]
}, {
  'CMYK': [88, 24, 61, 9],
  'RGB': [66, 134, 117],
  'hex': '#428675',
  'name': '亚丁绿',
  'pinyin': 'yadinglv',
  'LAB': [51.25, -25.96, 2.54]
}, {
  'CMYK': [40, 27, 36, 8],
  'RGB': [159, 163, 154],
  'hex': '#9fa39a',
  'name': '镍灰',
  'pinyin': 'niehui',
  'LAB': [66.44, -3.13, 4.16]
}, {
  'CMYK': [52, 28, 42, 10],
  'RGB': [138, 152, 142],
  'hex': '#8a988e',
  'name': '明灰',
  'pinyin': 'minghui',
  'LAB': [61.49, -7, 3.54]
}, {
  'CMYK': [63, 31, 50, 14],
  'RGB': [112, 136, 125],
  'hex': '#70887d',
  'name': '淡绿灰',
  'pinyin': 'danlvhui',
  'LAB': [54.58, -10.95, 3.04]
}, {
  'CMYK': [82, 32, 60, 20],
  'RGB': [73, 117, 104],
  'hex': '#497568',
  'name': '飞泉绿',
  'pinyin': 'feiquanlv',
  'LAB': [45.82, -18.42, 2.37]
}, {
  'CMYK': [62, 43, 52, 34],
  'RGB': [93, 101, 95],
  'hex': '#5d655f',
  'name': '狼烟灰',
  'pinyin': 'langyanhui',
  'LAB': [41.93, -4.37, 2.33]
}, {
  'CMYK': [85, 44, 64, 52],
  'RGB': [49, 74, 67],
  'hex': '#314a43',
  'name': '绿灰',
  'pinyin': 'lvhui',
  'LAB': [29.3, -11.37, 1.11]
}, {
  'CMYK': [93, 46, 70, 61],
  'RGB': [34, 62, 54],
  'hex': '#223e36',
  'name': '苍绿',
  'pinyin': 'canglv',
  'LAB': [23.84, -12.88, 1.59]
}, {
  'CMYK': [98, 46, 73, 63],
  'RGB': [26, 59, 50],
  'hex': '#1a3b32',
  'name': '深海绿',
  'pinyin': 'shenhailv',
  'LAB': [22.22, -14.77, 1.87]
}, {
  'CMYK': [67, 60, 57, 68],
  'RGB': [54, 52, 51],
  'hex': '#363433',
  'name': '长石灰',
  'pinyin': 'changshihui',
  'LAB': [21.86, 0.65, 0.93]
}, {
  'CMYK': [82, 60, 65, 80],
  'RGB': [31, 38, 35],
  'hex': '#1f2623',
  'name': '苷蓝绿',
  'pinyin': 'ganlanlv',
  'LAB': [14.39, -3.91, 0.94]
}, {
  'CMYK': [90, 62, 67, 86],
  'RGB': [20, 30, 27],
  'hex': '#141e1b',
  'name': '莽丛绿',
  'pinyin': 'mangconglv',
  'LAB': [10.23, -5.35, 0.59]
}, {
  'CMYK': [33, 1, 29, 0],
  'RGB': [198, 223, 200],
  'hex': '#c6dfc8',
  'name': '淡翠绿',
  'pinyin': 'dancuilv',
  'LAB': [86.47, -12.57, 8.47]
}, {
  'CMYK': [53, 1, 44, 0],
  'RGB': [158, 204, 171],
  'hex': '#9eccab',
  'name': '明绿',
  'pinyin': 'minglv',
  'LAB': [78.1, -21.67, 11.57]
}, {
  'CMYK': [75, 0, 59, 0],
  'RGB': [104, 184, 142],
  'hex': '#68b88e',
  'name': '田园绿',
  'pinyin': 'tianyuanlv',
  'LAB': [68.87, -34.24, 13.8]
}, {
  'CMYK': [98, 0, 82, 0],
  'RGB': [32, 161, 98],
  'hex': '#20a162',
  'name': '翠绿',
  'pinyin': 'cuilv',
  'LAB': [58.67, -48.45, 23.46]
}, {
  'CMYK': [78, 6, 62, 0],
  'RGB': [97, 172, 133],
  'hex': '#61ac85',
  'name': '淡绿',
  'pinyin': 'danlv',
  'LAB': [64.75, -32.43, 12.9]
}, {
  'CMYK': [90, 7, 73, 0],
  'RGB': [64, 160, 112],
  'hex': '#40a070',
  'name': '葱绿',
  'pinyin': 'conglv',
  'LAB': [59.34, -39.72, 16.8]
}, {
  'CMYK': [99, 10, 91, 2],
  'RGB': [34, 148, 83],
  'hex': '#229453',
  'name': '孔雀绿',
  'pinyin': 'kongquelv',
  'LAB': [54.17, -46.14, 25.69]
}, {
  'CMYK': [27, 11, 27, 1],
  'RGB': [202, 211, 195],
  'hex': '#cad3c3',
  'name': '艾绿',
  'pinyin': 'ailv',
  'LAB': [83.48, -5.95, 6.85]
}, {
  'CMYK': [92, 14, 76, 2],
  'RGB': [60, 149, 102],
  'hex': '#3c9566',
  'name': '蟾绿',
  'pinyin': 'chanlv',
  'LAB': [55.49, -37.93, 17.07]
}, {
  'CMYK': [100, 17, 92, 5],
  'RGB': [32, 137, 77],
  'hex': '#20894d',
  'name': '宫殿绿',
  'pinyin': 'gongdianlv',
  'LAB': [50.37, -43.32, 24.01]
}, {
  'CMYK': [61, 19, 52, 3],
  'RGB': [131, 167, 141],
  'hex': '#83a78d',
  'name': '松霜绿',
  'pinyin': 'songshuanglv',
  'LAB': [65.26, -17.66, 9.45]
}, {
  'CMYK': [81, 19, 67, 4],
  'RGB': [87, 149, 114],
  'hex': '#579572',
  'name': '蛋白石绿',
  'pinyin': 'danbaishilv',
  'LAB': [56.81, -28.26, 12.31]
}, {
  'CMYK': [100, 22, 90, 10],
  'RGB': [32, 127, 76],
  'hex': '#207f4c',
  'name': '薄荷绿',
  'pinyin': 'bohelv',
  'LAB': [46.98, -39.53, 20.11]
}, {
  'CMYK': [66, 29, 58, 12],
  'RGB': [110, 139, 116],
  'hex': '#6e8b74',
  'name': '瓦松绿',
  'pinyin': 'wasonglv',
  'LAB': [55.11, -15.13, 8.96]
}, {
  'CMYK': [100, 31, 91, 25],
  'RGB': [26, 104, 64],
  'hex': '#1a6840',
  'name': '荷叶绿',
  'pinyin': 'heyelv',
  'LAB': [38.7, -33.45, 15.98]
}, {
  'CMYK': [62, 42, 56, 34],
  'RGB': [94, 102, 91],
  'hex': '#5e665b',
  'name': '田螺绿',
  'pinyin': 'tianluolv',
  'LAB': [42.21, -5.38, 5.16]
}, {
  'CMYK': [74, 42, 65, 40],
  'RGB': [72, 91, 77],
  'hex': '#485b4d',
  'name': '白屈菜绿',
  'pinyin': 'baiqucailv',
  'LAB': [36.73, -10.47, 5.69]
}, {
  'CMYK': [64, 57, 60, 67],
  'RGB': [57, 55, 51],
  'hex': '#393733',
  'name': '河豚灰',
  'pinyin': 'hetunhui',
  'LAB': [23.13, 0, 2.81]
}, {
  'CMYK': [68, 56, 60, 66],
  'RGB': [55, 56, 52],
  'hex': '#373834',
  'name': '蒽油绿',
  'pinyin': 'enyoulv',
  'LAB': [23.29, -1.33, 2.34]
}, {
  'CMYK': [76, 56, 75, 72],
  'RGB': [43, 49, 44],
  'hex': '#2b312c',
  'name': '槲寄生绿',
  'pinyin': 'hujishenglv',
  'LAB': [19.6, -3.81, 2.3]
}, {
  'CMYK': [91, 60, 76, 83],
  'RGB': [21, 35, 27],
  'hex': '#15231b',
  'name': '云杉绿',
  'pinyin': 'yunshanlv',
  'LAB': [12.22, -8.29, 3.46]
}, {
  'CMYK': [9, 1, 14, 0],
  'RGB': [240, 245, 229],
  'hex': '#f0f5e5',
  'name': '嫩菊绿',
  'pinyin': 'nenjulv',
  'LAB': [95.78, -4.43, 7.11]
}, {
  'CMYK': [20, 1, 23, 0],
  'RGB': [223, 236, 213],
  'hex': '#dfecd5',
  'name': '艾背绿',
  'pinyin': 'aibeilv',
  'LAB': [91.9, -8.38, 9.66]
}, {
  'CMYK': [47, 0, 49, 0],
  'RGB': [173, 213, 162],
  'hex': '#add5a2',
  'name': '嘉陵水绿',
  'pinyin': 'jialingshuilv',
  'LAB': [81.33, -22.64, 20.99]
}, {
  'CMYK': [89, 0, 96, 0],
  'RGB': [65, 179, 73],
  'hex': '#41b349',
  'name': '玉髓绿',
  'pinyin': 'yusuilv',
  'LAB': [64.83, -53.54, 44]
}, {
  'CMYK': [88, 0, 99, 0],
  'RGB': [67, 178, 68],
  'hex': '#43b244',
  'name': '鲜绿',
  'pinyin': 'xianlv',
  'LAB': [64.52, -53.32, 45.94]
}, {
  'CMYK': [90, 0, 100, 0],
  'RGB': [65, 174, 60],
  'hex': '#41ae3c',
  'name': '宝石绿',
  'pinyin': 'baoshilv',
  'LAB': [63.11, -53.18, 47.87]
}, {
  'CMYK': [18, 4, 33, 0],
  'RGB': [226, 231, 191],
  'hex': '#e2e7bf',
  'name': '海沬绿',
  'pinyin': 'haimeilv',
  'LAB': [90.35, -8.33, 18.94]
}, {
  'CMYK': [28, 4, 44, 0],
  'RGB': [208, 222, 170],
  'hex': '#d0deaa',
  'name': '姚黄',
  'pinyin': 'yaohuang',
  'LAB': [86.28, -13.42, 23.99]
}, {
  'CMYK': [44, 3, 61, 0],
  'RGB': [178, 207, 135],
  'hex': '#b2cf87',
  'name': '橄榄石绿',
  'pinyin': 'ganlanshilv',
  'LAB': [79.52, -21.91, 32.66]
}, {
  'CMYK': [62, 0, 76, 0],
  'RGB': [140, 194, 105],
  'hex': '#8cc269',
  'name': '水绿',
  'pinyin': 'shuilv',
  'LAB': [73, -33.47, 39.09]
}, {
  'CMYK': [42, 3, 67, 0],
  'RGB': [183, 208, 122],
  'hex': '#b7d07a',
  'name': '芦苇绿',
  'pinyin': 'luweilv',
  'LAB': [79.94, -22.15, 39.87]
}, {
  'CMYK': [28, 6, 66, 0],
  'RGB': [210, 217, 122],
  'hex': '#d2d97a',
  'name': '槐花黄绿',
  'pinyin': 'huaihuahuanglv',
  'LAB': [84.34, -16.12, 45.8]
}, {
  'CMYK': [41, 4, 76, 0],
  'RGB': [186, 207, 101],
  'hex': '#bacf65',
  'name': '苹果绿',
  'pinyin': 'pingguolv',
  'LAB': [79.61, -22.7, 49.75]
}, {
  'CMYK': [58, 1, 88, 0],
  'RGB': [150, 194, 78],
  'hex': '#96c24e',
  'name': '芽绿',
  'pinyin': 'yalv',
  'LAB': [73.29, -32.62, 52.39]
}, {
  'CMYK': [19, 9, 84, 1],
  'RGB': [226, 216, 73],
  'hex': '#e2d849',
  'name': '蝶黄',
  'pinyin': 'diehuang',
  'LAB': [84.87, -12.86, 68.41]
}, {
  'CMYK': [38, 8, 94, 1],
  'RGB': [190, 201, 54],
  'hex': '#bec936',
  'name': '橄榄黄绿',
  'pinyin': 'ganlanhuanglv',
  'LAB': [77.86, -21.4, 67.4]
}, {
  'CMYK': [81, 0, 100, 0],
  'RGB': [91, 174, 35],
  'hex': '#5bae23',
  'name': '鹦鹉绿',
  'pinyin': 'yingwulv',
  'LAB': [63.85, -48.02, 58.14]
}, {
  'CMYK': [84, 64, 94, 45],
  'RGB': [37, 61, 36],
  'hex': '#253d24',
  'name': '油绿',
  'pinyin': 'youlv',
  'LAB': [23.19, -15.46, 12.54]
}, {
  'CMYK': [0, 1, 4, 0],
  'RGB': [255, 254, 248],
  'hex': '#fffef8',
  'name': '象牙白',
  'pinyin': 'xiangyabai',
  'LAB': [99.58, -0.71, 2.96]
}, {
  'CMYK': [3, 5, 8, 0],
  'RGB': [248, 244, 237],
  'hex': '#f8f4ed',
  'name': '汉白玉',
  'pinyin': 'hanbaiyu',
  'LAB': [96.31, 0.13, 3.82]
}, {
  'CMYK': [0, 1, 3, 0],
  'RGB': [255, 254, 249],
  'hex': '#fffef9',
  'name': '雪白',
  'pinyin': 'xuebai',
  'LAB': [99.6, -0.53, 2.49]
}, {
  'CMYK': [4, 4, 8, 0],
  'RGB': [247, 244, 237],
  'hex': '#f7f4ed',
  'name': '鱼肚白',
  'pinyin': 'yudubai',
  'LAB': [96.24, -0.21, 3.7]
}, {
  'CMYK': [12, 12, 16, 0],
  'RGB': [228, 223, 215],
  'hex': '#e4dfd7',
  'name': '珍珠灰',
  'pinyin': 'zhenzhuhui',
  'LAB': [89, 0.31, 4.5]
}, {
  'CMYK': [16, 15, 20, 1],
  'RGB': [218, 212, 203],
  'hex': '#dad4cb',
  'name': '浅灰',
  'pinyin': 'qianhui',
  'LAB': [85.15, 0.49, 5.16]
}, {
  'CMYK': [28, 5, 30, 5],
  'RGB': [187, 181, 172],
  'hex': '#bbb5ac',
  'name': '铅灰',
  'pinyin': 'qianhui',
  'LAB': [73.92, 0.52, 5.32]
}, {
  'CMYK': [28, 25, 30, 5],
  'RGB': [187, 181, 172],
  'hex': '#bbb5ac',
  'name': '中灰',
  'pinyin': 'zhonghui',
  'LAB': [73.92, 0.52, 5.32]
}, {
  'CMYK': [42, 40, 43, 23],
  'RGB': [134, 126, 118],
  'hex': '#867e76',
  'name': '瓦灰',
  'pinyin': 'wahui',
  'LAB': [53.27, 1.56, 5.43]
}, {
  'CMYK': [43, 40, 44, 42],
  'RGB': [132, 124, 116],
  'hex': '#847c74',
  'name': '夜灰',
  'pinyin': 'yehui',
  'LAB': [52.48, 1.56, 5.45]
}, {
  'CMYK': [42, 42, 45, 27],
  'RGB': [128, 118, 110],
  'hex': '#80766e',
  'name': '雁灰',
  'pinyin': 'yanhui',
  'LAB': [50.3, 2.38, 5.78]
}, {
  'CMYK': [42, 42, 46, 27],
  'RGB': [129, 119, 110],
  'hex': '#81776e',
  'name': '深灰',
  'pinyin': 'shenhui',
  'LAB': [50.67, 2.2, 6.32]
}]

export {
  rgb2lab,
  ChinaColors,
  hexToRgba
}
