<template>
  <section class="section">
    <div class="columns is-multiline">
      <div class="column is-one-quarter">
        <div class="card">
          <div class="card-image">
            <figure class="image is-3by2">
              <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">John Smith</p>
                <p class="subtitle is-6">@johnsmith</p>
              </div>
            </div>

            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus nec iaculis mauris. <a>@bulmaio</a>.
              <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-quarter">
        <div class="card">
          <div class="card-image">
            <figure class="image is-2by3">
              <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">John Smith</p>
                <p class="subtitle is-6">@johnsmith</p>
              </div>
            </div>

            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus nec iaculis mauris. <a>@bulmaio</a>.
              <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-quarter">
        Second column
      </div>
      <div class="column is-one-quarter">
        Third column
      </div>
      <div class="column is-one-quarter">
        4 column
      </div>
      <div class="column is-one-quarter">
        5 column
      </div>
      <div class="column is-one-quarter">
        Third column
      </div>
      <div class="column is-one-quarter">
        4 column
      </div>
      <div class="column is-one-quarter">
        5 column
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WorkList',
  props: {
    works: {
      type: Array
    }
  }
}
</script>

<style lang="scss">

</style>
