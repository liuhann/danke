<template>
  <div id="left-tick-list" class="left-aside-content">
    <div class="list-table">
      <div v-for="tick in ticks" :key="tick.id" class="tick-entry">
        <div class="info">
          <div>{{ tick.name }}</div>
          <div class="sum">时长：{{ formatAudioSecondShow(tick.dura) }} 适用于: {{ tick.ticks.length }} 场景 </div>
        </div>
        <div class="play" @click="applyTick(tick)"><i class="el-icon-video-play" /></div>
      </div>
    </div>
  </div>
</template>
<script>

import RestDAO from '../../utils/restdao.js'
import { formatAudioSecondShow } from '../../utils/string'
import { assignVariables } from '../mixins/renderUtils'

export default {
  name: 'TickList',
  data () {
    return {
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      ticks: [],
      dragging: false
    }
  },
  created () {
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  mounted () {
    this.loadAudios()
  },

  methods: {
    formatAudioSecondShow,
     async loadAudios () {
      const response = await this.audiodao.list({
        page: this.pagination.current,
        count: this.pagination.pageSize
      })

      this.ticks = response.list
      this.pagination.total = response.total
    },

    applyTick (tick) {
      this.$emit('insert', tick)
    }
  }
}
</script>

<style lang="scss">
#left-tick-list {
  .list-table {
    .tick-entry {
      line-height: 46px;
      color: #efefef;
      display: flex;
      font-size: 1.5rem;
      margin-bottom: 10px;
      cursor: pointer;

      .info {
        flex: 1;
        line-height: 28px;
        .sum {
          font-size: 10px;
          color: #bbb;
          line-height: 16px;;
        }
      }
      .play {
        cursor: pointer;
        font-size: 24px;
        width: 32px;
        &:hover {
          color:gainsboro;
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
