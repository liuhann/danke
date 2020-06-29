<template>
<div id="my-packs">
  <div class="content-title">
    矢量图库
  </div>
  <div class="pack-container vector">
    <div class="pack add">
      <i class="el-icon-plus" @click="newPack"/>
    </div>
    <div class="pack" v-for="pack in packs" :key="pack._id" @click="openPack(pack._id)">
      <div class="pack-svgs">
        <div class="svg" v-for="svg in pack.children" :key="svg._id" :style="variableValues(svg)">
          <div class="styled-box" v-html="svg.content">
          </div>
        </div>
      </div>
      <div class="pack-meta">
        <div class="name">
          {{pack.name}}
        </div>
        <div class="desc">
          {{pack.desc}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
export default {
  name: 'MyVectorPacks',
  components: {
    [Dialog.name]: Dialog
  },
  data () {
    return {
      type: 'vector',
      packs: [],
      dialogVisible: false
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
  },
  mounted () {
    this.loadMyPacks()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadMyPacks'
  },
  methods: {
    async loadMyPacks() {
      const result = await this.packdao.list({
        type: this.type,
        creator: this.ctx.user.id,
        subcount: 4
      })
      this.packs = result.list
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
    async newPack () {
      const pack = await this.packdao.create({
        type: this.type,
        name: '图库'
      })
      this.$router.push('pack/' + pack.object._id)
    },
    openPack (id) {
      this.$router.push('pack/' + id)
    }
  }
}
</script>

<style lang="scss">
#my-packs {
  .pack-container {
    display: flex;
    flex-wrap: wrap;
    .pack {
      border: 1px solid #eee;
      border-radius: 8px;
      width: 240px;
      height: 280px;
      margin: 12px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      &.add {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color: var(--mainColor);
      }
      &:hover {
        border: 1px solid var(--mainColor);
      }
      .pack-meta {
        padding: 10px;
        background-color: var(--mainColor);
        color: #fff;
        font-size: 20px;
        .name {
          cursor: pointer;
        }
        .el-icon-star-off {
          margin-top: 5px;
          float: right;
        }
        .desc {
          font-size: 12px;
        }
      }
      .pack-svgs {
        padding: 10px 20px 0 20px;
        display: flex;
        flex-wrap: wrap;
        height: 200px;
        .svg {
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          .styled-box {
            svg {
              width: 72px;
              height: 72px;
            }
          }
        }
      }
    }
  }
}
</style>
