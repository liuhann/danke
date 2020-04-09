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
      dialogVisible: false
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
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