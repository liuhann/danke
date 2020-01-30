<template>
  <header>
    <logo-wrapper></logo-wrapper>
    <div class="empty"></div>
    <slot></slot>
  </header>
</template>
#
<script>
import LogoWrapper from './LogoWrapper'
export default {
  name: 'DankeHeader',
  components: { LogoWrapper }
}
</script>

<style lang="scss">
@height: 56px;
@padding: 10px;
header {
  display: flex;
  height: @height;
  line-height: @height;
  background: #0B2239;
  color: #fff;
  .empty {
    flex: 1;
  }
  .icon-head {
    margin: 10px;
    background: #c3c3c3;
    width: 36px;
    font-size: 24px;
    border-radius: 24px;
    text-align: center;
    line-height: 36px;
  }
  .icon-add {
    padding: 10px;
    font-size: 24px;
    line-height: 36px;
  }

  .logo-wrapper {
    padding: @padding 10px;
    display: flex;
    justify-content: center;
    .sf {
      color: #fff;
      font-size: @height * 0.4;
      line-height: @height - 2 * @padding;
    }
    svg {
      width: @height - 2 * @padding;
      height: @height - 2 * @padding;
    }
  }
}

</style>
