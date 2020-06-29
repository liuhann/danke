<template>
  <div id="tick-list">
    <a-button type="primary" @click="create">新增</a-button>
    <a-table 
      id="tick-list" 
      row-key="_id"
      size="small"
      :columns="columns"
      :data-source="audios"
      :pagination="pagination">
      <span slot="action" slot-scope="record">
        <a-icon type="delete" @click="removeAudio(record)" />
        <a-icon type="play-circle" @click="playAudio(record)" />
        <a @click="openAudio(record)">打开</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import antVueMixin from '../utils/ant-vue-mixins'
import RestDAO from '../utils/restdao.js'
export default {
  mixins: [antVueMixin],
  data () {
    return {
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      columns: [{
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 360
      }, {
        title: '时长',
        dataIndex: 'dura'
      }, {
        title: '打点数',
        dataIndex: 'ticks.length'
      }, {
        title: '操作',
        key: 'action',
        width: 120,
        scopedSlots: { customRender: 'action' }
      }],
      audios: []
    }
  },
  created () {
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  mounted () {
    this.loadAudios()
  },
  methods: {
    create () {
      window.open('/tick/edit')
    },
    async loadAudios () {
      const audios = await this.audiodao.list({
        page: this.pagination.current,
        count: this.pagination.pageSize
      })

      this.audios = audios.list
      this.pagination.total = audios.total
    },

    openAudio (audio) {
      window.open('/tick/edit?id=' + audio._id)
    },

    removeAudio (audio) {
      this.audio.delete()
    }
  }
}
</script>

<style>

</style>