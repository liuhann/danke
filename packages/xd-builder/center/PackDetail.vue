<template>
<div id="pack-detail">
  <div class="content-title" v-if="!metaEditing">
    <span>{{pack.name}}</span>
    <button class="plain small" @click="editPackMeta" v-if="pack.creator === userId">编辑</button>
    <div class="desc">{{pack.desc}}</div>
  </div>
  <div class="pack-meta" v-if="metaEditing">
    <div class="title">
      <input v-model="pack.name" />
    </div>
    <div class="desc">
      <input class="small" v-model="pack.desc" /> <button class="small" @click="savePackMeta">保存</button> <button class="plain small" @click="editPackMeta">取消</button>
    </div>
  </div>
  <div class="pack-sharing" v-if="pack.creator === userId">
    <button class="plain small" @click="editPackMeta">分享</button>
  </div>
  <div class="pack-sharing" v-if="pack.creator !== userId">
    <button class="plain small" @click="editPackMeta">收藏</button>
  </div>
  <div class="element-list-container">
    <div class="list">
        <el-upload
          v-if="pack.creator === userId"
          action="https://www.danke.fun/"
          accept="image/svg+xml"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="fileChange"
          multiple>
          <div class="add box">
            <i class="el-icon-plus" />
          </div>
        </el-upload>
      <div v-for="(svg, index) in svgs" :key="index" class="box">
        <div class="svg-container" :style="variableValues(svg)">
          <div class="styled-box" v-html="svg.content">
          </div>
        </div>
        <div class="variables">
          <el-color-picker v-for="(variable, index) in svg.variables" :key="index" v-model="variable.value" size="mini"/>
        </div>
        <div class="item-btns" v-if="svg.creator === userId">
          <i class="el-icon-delete" @click="confirmDelete(svg)"></i>
          <i class="el-icon-edit" @click="edit(svg)"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../../common/dao/restdao'
import { Icon, ColorPicker, Upload, MessageBox, Loading } from 'element-ui'

export default {
  name: 'PackDetail',
  components: {
    [ColorPicker.name]: ColorPicker,
    [Upload.name]: Upload
  },
  data () {
    return {
      metaEditing: false,
      pack: {},
      svgs: []
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
    // fetch the data when the view is created and the data is
    // already being observed
  },
  computed: {
    userId () {
      return this.ctx.user.id
    },
    isPackCreator () {
      return this.pack.creator === this.ctx.user.id
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fileChange (file, fileList) {
      const vi = this
      const fileReader = new FileReader()
      fileReader.onload = async function(fileLoadedEvent) {
        const svgElement = {
          pack: vi.pack._id,
          name: file.name
        }
        let textFromFileLoaded = fileLoadedEvent.target.result
        Object.assign(svgElement, vi.replaceFillColorWithVariables(textFromFileLoaded))
        console.log(textFromFileLoaded,  svgElement)
        await vi.svgdao.create(svgElement)
        vi.fetchData()
      };
      fileReader.readAsText(file.raw, "UTF-8")
    },

    /**
     * 获取及替换颜色操作
     */
    replaceFillColorWithVariables (svg) {
      let content = svg
      let rgbRegex = /[rR][gG][Bb][Aa]?[\\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\\.\\d{1,2}|1|0)?[\\)]{1}/g
      let colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb[a]?\([^)]+\)/g
      const colorMatched = svg.match(colorRegex);
      const colorList = Array.from(new Set(colorMatched))
      const variables = []
      for (let i = 0; i < colorList.length; i++) {
        variables.push({
          'name': 'fillColor' + i,
          'value': colorList[i],
          'label': '颜色' + i,
          'type': 'color'
        })
        content = content.replace(new RegExp(colorList[i].replace('(', '\\(').replace(')', '\\)'), 'gm'), `var(--fillColor${i})`)
      }
      content = content.replace(/<g>\s+<\/g>/g, '')
      return {
        content,
        variables
      }
    },

    editPackMeta () {
      this.metaEditing = !this.metaEditing
    },

    savePackMeta () {
      this.packdao.patch(this.pack._id, this.pack)
      this.metaEditing = false
    },

    addNewSVG () {
      this.$router.push('../svg/edit?pack=' + this.pack._id)
    },

    variableValues (svg) {
      const styles = {}
      for (let variable of svg.variables) {
        Object.assign(styles, {
          [`--${variable.name}`]: variable.value
        })
      }
      return styles
    },

    // 新窗口编辑
    edit (svg) {
      this.$router.push('../svg/edit?id=' + svg._id)
    },

    async confirmDelete (svg) {
      await MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示')
      await this.svgdao.delete(svg)
      this.svgs = this.svgs.filter(item => item._id !== svg._id)
    },

    // 目前暂无提示 直接删除
    async remove (style) {
      if (confirm('确认删除样式')) {
        await this.svgdao.delete(style)
        this.fetchData()
      }
    },

    async fetchData () {
      this.svgs = []
      const instance = Loading.service({
        target: '.element-list-container'
      })
      this.pack = await this.packdao.getOne(this.$route.params.id)
      const result = await this.svgdao.list({
        pack: this.pack._id,
        count: 100
      })
      this.svgs = result.list
      instance.close()
    }
  }
}
</script>

<style lang="scss">
#pack-detail {
  .content-title {
    .desc {
      font-size: 14px;
      color: #888;
      line-height: 26px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    button.plain {
      margin-right: 30px;
      display: none;
    }
    &:hover {
      button.plain {
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
  .pack-meta {
    padding: 20px;
    >div {
      margin-top: 10px;
      input {
        width: 400px;
      }
    }
  }
  .element-list-container {
    .list {
      display: flex;
      flex-wrap: wrap;
      .box {
        border: 1px solid #eee;
        margin: 10px;
        width: 160px;
        height: 160px;
        border-radius: 6px;
        position: relative;
        .variables {
          position: absolute;
          right: 5px;
          top: 5px;
        }
        .svg-container {
          width: 100%;
          height: 100px;
          margin-top: 30px;
          padding: 0 30px;
          .styled-box {
            width: 100px;
            height: 100px;
            svg {
              width: 100px;
              height: 100px;
            }
          }
        }
        &:hover {
          transition: border-color .3s linear;
          border-color: var(--mainColor);
          .item-btns {
            display: initial;
          }
        }
        .item-btns {
          display: none;
          position: absolute;
          bottom: 10px;
          right: 10px;
          text-align: right;
          i {
            font-size: 15px;
            cursor: pointer;
            margin: 0 10px;
            &:hover {
              color: var(--mainColor)
            }
          }
        }
      }
      .add {
        cursor: pointer;
        border: 2px dashed var(--mainColorHover);
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
          padding: 10px 20px;
        }
        &:hover {
          border: 2px dashed var(--mainColor);
        }
        i {
          font-size: 26px;
          color: var(--mainColor);
        }
      }
    }
  }
}
</style>