<template>
<div id="my-packs">
  <div class="content-title">
    <span>我的设计图库</span>
    <button class="small plain" @click="newPack">新增</button>
  </div>
  <div class="pack-container">
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
  <div class="content-title">
    <span>热门图库</span>
  </div>
  <div class="pack-container">
    <div class="pack" v-for="pack in popularPacks" :key="pack._id">
      <div class="pack-svgs">
        <div class="svg" v-for="svg in pack.children" :key="svg._id" :style="variableValues(svg)">
          <div class="styled-box" v-html="svg.content">
          </div>
        </div>
      </div>
      <div class="pack-meta">
        <i class="el-icon-star-off"></i>
        <div class="name" @click="openPack(pack._id)">
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
import RestDAO from '../../common/dao/restdao'
export default {
  name: 'MyPacks',
  components: {
    [Dialog.name]: Dialog
  },
  data () {
    return {
      packs: [],
      popularPacks: [],
      starredPacks: [],
      dialogVisible: false
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.stardao = new RestDAO(this.ctx, 'danke/starpack')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
  },
  mounted () {
    this.loadMyPacks()
    this.loadPopularPacks()
    this.loadStarredPacks()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'loadMyPacks'
  },
  methods: {
    async loadStarredPacks () {
      const result = await this.stardao.list({
        creator: this.ctx.user.id,
        parentKey: 'from',
        subcount: 4
      })
      this.packs = result.list
    },
    async loadMyPacks() {
      const result = await this.packdao.list({
        creator: this.ctx.user.id,
        subcount: 4
      })
      this.packs = result.list
    },
    async loadPopularPacks () {
      const result = await this.packdao.list({
        creator: '15011245191',
        count: 10,
        subcount: 4
      })
      this.popularPacks = result.list
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
        name: '图库'
      })
      this.$router.replace('pack/' + pack.object._id)
    },
    openPack (id) {
      this.$router.push('pack/' + id)
    }
  }
}
</script>

<style lang="scss">
#my-packs {
  .content-title {
    button {
      margin-left: 20px;
    }
  }
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
      cursor: pointer;
      overflow: hidden;
      &:hover {
        border: 1px solid var(--mainColor);
      }
      .pack-meta {
        padding: 10px;
        background-color: var(--mainColor);
        color: #fff;
        font-size: 20px;
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