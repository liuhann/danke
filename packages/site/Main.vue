<template>
  <div id="site">
    <nav-bar></nav-bar>
    <section class="section">
      <div class="tabs">
        <ul>
          <li v-for="channel in channels" :key="channel.value" :class="currentChannel === channel.value? 'is-active' : ''" @click="switchChanel(channel.value)"><a>{{ channel.label }}</a></li>
        </ul>
      </div>
      <div class="columns is-mobile is-multiline work-list">
        <div v-for="work in currentChannelWorks" :key="work.id" class="column work-container" :class="channelColumnSize">
          <figure class="image is-1by1" :class="currentChannel"> 
            <img :src="getImageUrl(work.snapshot, 240, 240)">
          </figure>
        </div>
      </div>
      <div class="columns">
      </div>
    </section>
    <nav-footer />
  </div>
</template>
<script>
import NavBar from './components/NavBar.vue'
import NavFooter from './components/NavFooter'
import channels from './channels'
import RestDAO from '../utils/restdao.js'
import { getImageUrl } from '../utils/getImageUrl'

export default {
  name: 'Main',
  components: { NavFooter, NavBar },
  data () {
    return {
      currentChannel: null,
      currentChannelWorks: [],
      channels
    }
  },
  computed: {
    channelColumnSize () {
      if (this.currentChannel === 'avatar') {
        return 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-one-third-mobile'
      } else {
        return 'is-1-widescreen is-2-desktop is-3-tablet is-one-third-mobile'
      }
    }
  },
  created () {
     this.workdao = new RestDAO(this.ctx, 'danke/work')
     this.switchChanel(channels[0].value)
  },
  mounted () {
  },
  methods: {
    viewport () {
      return this.workViewPort
    },
    switchChanel(channel) {
      this.currentChannel = channel
      this.loadChannelWorks()
    },

    async loadChannelWorks () {
      const result = await this.workdao.list({
        projection: 'updated,created,creator,name,id,frames,viewBox,title,author,avatar,color,snapshot',
        channels: this.currentChannel,
        page: this.page,
        count: this.count
      })
      this.currentChannelWorks = result.list
      this.total = result.total
      this.loading = false
    },
    listQuery () {
      return {
        'system.site': 'on',
      }
    },
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 96, 96)
      } else {
        return 'http://cdn.danke.fun/res/head.svg'
      }
    },
    getImageUrl,
    openWork (work) {
      window.open('/slide/' + work.id)
    },
  }
}
</script>

<style lang="scss">

.avatar {
  border: 1px solid #eee;
}

.shots-grid {
  margin-top: 108px;
  display: grid;
  list-style: none;
  grid-gap: 36px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  .scene-wrapper {
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px 0px rgba(62,66,66,0.13);
  }
  .scene {
    position: relative;
    overflow: hidden;
    .element {
      position: absolute;
    }
  }
}

.author-likes {
  margin: 10px 0;
  display: flex;
  img.avatar {
    border-radius: 50%;
  }
  .author {
    margin-left: 10px;
    color: #3d3d4e;
    font-weight: bold;
    line-height: 22px;
  }
}
.container-fluid {
  padding-left: 20px;
  padding-right: 20px;
}

@media (min-width: 768px) {
  .container-fluid {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (min-width: 1200px) {
  .container-fluid {
    padding-left: 72px;
    padding-right: 72px;
  }
}
@media (min-width: 1600px) {
  .container-fluid {
    padding-left: 72px;
    padding-right: 72px;
  }
  .shots-grid {
    grid-template-columns: repeat(auto-fill, minmax(336px, 1fr));
  }
}
</style>
