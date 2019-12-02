<template>
<div class="card-wrapper" :class="isBack ? element.flip: ''">
  <div class="card">
    <div class="front">
      <img :src="element.front" />
    </div>
    <div class="back">
      <img :src="element.back" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      isBack: false
    }
  },
  mounted () {
    if (this.element.delay) {
      setTimeout(this.toggleBack.bind(this), this.element.delay)
    }
  },
  name: 'Flip',
  methods: {
    toggleBack () {
      this.isBack = true
    }
  }
}
</script>

<style lang="scss">
.card-wrapper {
  display: inline-block;
  perspective: 1000px;

  //--------------------------------------------------
  // CARD FLIP RIGHT
  //--------------------------------------------------
  .card {
    position: relative;
    cursor: pointer;
    transition-duration: 0.6s;
    transition-timing-function: ease-in-out;
    transform-style: preserve-3d;

    .front, .back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      transform: rotateX(0deg);
    }
    .front {
      z-index: 2;
    }
  }

  //--------------------------------------------------
  // CARD FLIP RIGHT
  //--------------------------------------------------
  &, &.flip-right {
    .card {
      .back {
        transform: rotateY(180deg);
      }
    }

    &:hover {
      .card {
        transform: rotateY(180deg);
      }
    }
  }

  //--------------------------------------------------
  // CARD FLIP LEFT
  //--------------------------------------------------
  &.flip-left {
    .card {
      .back {
        transform: rotateY(-180deg);
      }
    }

    &:hover {
      .card {
        transform: rotateY(-180deg);
      }
    }
  }

  //--------------------------------------------------
  // CARD FLIP UP
  //--------------------------------------------------
  &.flip-up {
    .card {
      .back {
        transform: rotateX(180deg);
      }
    }

    &:hover {
      .card {
        transform: rotateX(180deg);
      }
    }
  }

  //--------------------------------------------------
  // CARD FLIP DOWN
  //--------------------------------------------------
  &.flip-down {
    .card {
      .back {
        transform: rotateX(-180deg);
      }
    }

    &:hover {
      .card {
        transform: rotateX(-180deg);
      }
    }
  }

  //--------------------------------------------------
  // DIAGONAL RIGHT
  //--------------------------------------------------
  &.flip-diagonal-right {
    .card {
      .back {
        transform: rotate3d(1, 1, 0, 180deg);
      }
    }

    &:hover {
      .card {
        transform: rotate3d(1, 1, 0, 180deg);
      }
    }
  }

  //--------------------------------------------------
  // DIAGONAL LEFT
  //--------------------------------------------------
  &.flip-diagonal-left {
    .card {
      .back {
        transform: rotate3d(1, 1, 0, -180deg);
      }
    }

    &:hover {
      .card {
        transform: rotate3d(1, 1, 0, -180deg);
      }
    }
  }

  //--------------------------------------------------
  // INVERTED DIAGONAL RIGHT
  //--------------------------------------------------
  &.flip-inverted-diagonal-right {
    .card {
      .back {
        transform: rotate3d(-1, 1, 0, 180deg);
      }
    }

    &:hover {
      .card {
        transform: rotate3d(-1, 1, 0, 180deg);
      }
    }
  }

  //--------------------------------------------------
  // INVERTED DIAGONAL LEFT
  //--------------------------------------------------
  &.flip-inverted-diagonal-left {
    .card {
      .back {
        transform: rotate3d(1, -1, 0, 180deg);
      }
    }

    &:hover {
      .card {
        transform: rotate3d(1, -1, 0, 180deg);
      }
    }
  }
}
</style>
