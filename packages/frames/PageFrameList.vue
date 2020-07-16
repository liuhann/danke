<template>
  <div id="page-frames-list"
       class="site-page"
  >
    <el-button size="mini" @click="newObject">新建</el-button>
    <div class="main-frame">
      <div class="table-frame-list" style="display:flex;">
        <el-tabs v-model="group" tab-position="left" style="height: calc(100vh - 90px)" @tab-click="groupChange">
          <el-tab-pane v-for="g in groups" :key="g" :label="g" :name="g" />
        </el-tabs>
        <el-table :data="filteredFrames" size="mini" :show-header="false" @current-change="handleCurrentChange">
          <el-table-column type="index" />
          <el-table-column prop="direction" label="组" sortable />
          <el-table-column prop="name" label="名称" />
        </el-table>
      </div>
      <div class="animation-box">
        <div class="animation-preview" :style="boxStyle">
          <img :src="CLOUD_HILL" :style="chillStyle" :class="animation && animation.name">
        </div>
        <el-form size="mini" class="refresh" label-width="80px">
          <el-form-item label="名称">
            {{ animation.name }}
          </el-form-item>
          <el-form-item label="带遮罩">
            <el-checkbox v-model="hasMask" />
          </el-form-item>
          <el-form-item label="视角">
            <el-input-number v-model="perspective" size="mini" controls-position="right" />px
          </el-form-item>
          <el-form-item v-for="variable in animation.variables" :key="variable.name" :label="variable.label">
            <el-input v-model="variable.value" size="mini" :width="200" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh-right" @click="refreshCurrent" />
            <el-button icon="el-icon-edit" @click="edit(animation)" />
            <el-button icon="el-icon-delete" @click="deleteObject(animation)" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../site/components/NavBar.vue'
import CLOUD_HILL from './cloud-hill.webp'
import { Pagination, Button, InputNumber, Checkbox, Form, FormItem, Input, Table, TableColumn, MessageBox, Select, Option, Tabs, TabPane } from 'element-ui'
import types from './types'
import RestDAO from '../utils/restdao.js'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { assignVariables } from '../xd-builder/mixins/renderUtils'
export default {
  name: 'PageFrameList',
  components: {
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [InputNumber.name]: InputNumber,
    [Form.name]: Form,
    [Input.name]: Input,
    [Table.name]: Table,
    [Select.name]: Select,
    [Option.name]: Option,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [TableColumn.name]: TableColumn,
    [FormItem.name]: FormItem
  },
  data () {
    return {
      allFrames: [],
      filteredFrames: [],
      groups: [],
      hasMask: false,
      types,
      type: '',
      perspective: 400,
      showAnimationChoose: false,
      group: '',
      animation: {},
      animations: [],
      restPath: 'danke/animation',
      CLOUD_HILL
    }
  },
  computed: {
    chillStyle () {
      if (this.hasMask) {
        return {
          maskImage: 'url(http://image.danke.fun/15011245191/images/mGuzU_K7ro_.svg)'
        }
      } else {
        return {}
      }
    },

    boxStyle () {
      const style = {
        perspective: this.perspective + 'px'
      }
      if (this.animation) {
        assignVariables(style, this.animation.variables)
      }
      return style
    }
  },
  created () {
    this.styleRegistry = new StyleRegistry()
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },

  mounted () {
    // this.loadAllFrames()
    this.loadGroups ()
  },

  methods: {
    async loadGroups () {
       this.groups = await this.framedao.distinct('group')
       this.group = this.groups[0]
       this.groupChange()
    },
    typeChange () {
      this.groups = Array.from(new Set(this.allFrames.filter(f => f.type === this.type).map(f => f.group)))
      this.group = this.groups[0]
      this.groupChange()
    },

    async groupChange () {
      this.filteredFrames = (await this.framedao.list({
        group: this.group
      })).list
      if (this.filteredFrames.length) {
        this.handleCurrentChange(this.filteredFrames[0])
      }
    },

    typeFilterHandler(value, row, column) {
      return row['type'] === value;
    },
    groupFilterHandler(value, row, column) {
      return row['group'] === value;
    },

    handleCurrentChange (val) {
      if (val) {
        this.styleRegistry.addFrame(val)
        this.animation = val
        this.animation.delay = 0
      }
    },

    async loadAllFrames () {
      const response = await this.framedao.list({count: 10000})
      this.allFrames = response.list

      this.animation = this.allFrames[22]
      this.styleRegistry.addFrame(this.animation)

      this.type = this.types[0].value
      this.typeChange()
    },

    refreshCurrent () {
      const replayStore = this.animation.name
      this.animation.name = ''
      setTimeout(() => {
        this.animation.name = replayStore
      }, 200)
    },

    animationChange (animation) {
      this.animation = animation
      this.animation.delay = 0
      this.styleRegistry.addFrame(this.animation)
    },

    newObject () {
      window.open('/frame/edit')
    },
    objectUpdated () {
      for (let object of this.objects) {
        this.styleRegistry.addFrame(object)
      }
    },
    // 鼠标移动上面之后会进行frame演示
    animationMouseEnter (animation) {
      animation.dataName = animation.name
      animation.name = ''
      setTimeout(() => {
        animation.name = animation.dataName
      }, 300)
    },

    async deleteObject (object) {
      await this.framedao.delete(object)
      await this.groupChange()
    },

    // 新窗口编辑
    edit (object) {
      window.open('/frame/edit?id=' + object._id)
    }
  }
}
</script>

<style lang="scss">
#page-frames-list {
  min-height: 100%;
  color: #0a0a0a;
  font-size: 16px;
  padding: 20px;

  .main-frame {
    margin-top: 40px;
    display: flex;
    .table-frame-list {
      width: 430px;
    }
  }
  .body {
    margin: 0 30px;
    width: 100%;
  }
  .list-section {
    background: #fff;
    .category {
      margin-top: 20px;
      text-align: left;
      color: #666;
      cursor: pointer;
      margin-bottom: 20px;
      >span {
        padding: 10px 0;
        margin: 0 20px;
        &:hover, &.checked {
          color: #00bf72;
          border-bottom: 2px solid #00bf72;
        }
      }
    }
  }

  .animations {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .animation {
      width: 20%;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &.current {
        background: #00c4cc;
        color: #fff;
      }
    }
  }

  .animation-box {
    height: 480px;
    flex: 1;
    display: flex;
    .animation-preview {
      overflow: hidden;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 240px;
      height: 200px;
      mask-repeat: no-repeat;
    }
    .refresh {
      width: 320px;
      border: 1px solid #eee;
      border-radius: 5px;
      background: #fbfbfb;
    }
  }

  .type-groups {
    display: flex;
    flex-wrap: wrap;
    .group {
      width: 100px;
      height: 100px;
      cursor: pointer;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px;
      background-color: #efefef;
      &.current {
        background: #00c4cc;
        color: #fff;
      }
    }
    margin-bottom: 10px;
  }
}

</style>
