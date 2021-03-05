<template>
  <div id="anime-play" />
</template>

<script>
import RestDAO from '../utils/restdao'
import { getWorkImages } from '../xd-builder/utils/workActions'
import { getImageUrl } from '../utils/getImageUrl'

export default {
  name: "AnimePlay",
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    async onMounted () {
      let workId = this.$route.query.work
      if (workId) {
        const work = await this.workdao.getOne(workId)

        const rootEl = this.$el

        rootEl.style.width = work.viewBox.width + 'px'
        rootEl.style.height = work.viewBox.height + 'px'

        await this.preloadResources()
      }
    },

    async loadImage(src, alt = '') {
      return new Promise(function(resolve) {
        const image = document.createElement('img');

        image.setAttribute('alt', alt);
        image.setAttribute('src', src);

        image.addEventListener('load', function() {
          resolve(image);
        });
      });
    },

    async preloadResources (work) {
      const elementUrls = getWorkImages(work)

      const imgs = {}

      for (let elementId in Object.keys(elementUrls)) {
        imgs[elementId] = this.loadImage(getImageUrl(elementUrls[elementId]))
      }
      await Promise.all(Object.values(imgs))
      return imgs
    },

    existScene (index) {

    },

    enterScene (index) {

    }
  }
}
</script>

<style scoped>

</style>