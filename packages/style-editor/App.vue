<template>
  <div id="app">
    <div class="header">
      <div class="form-control">
        <select v-model="deviceName">
          <option v-for="device in devices" :key="device.device" :value="device.device" :label="device.device">{{device.device}}</option>
        </select>
        <input v-model="device.width" type="number">
        x
        <input v-model="device.height" type="number">
        <select v-model="zoom">
          <option value="0.25">25%</option>
          <option value="0.5">50%</option>
          <option value="0.75">75%</option>
          <option value="1">100%</option>
        </select>
      </div>
    </div>
    <div class="frames">
      <div class="config-box">
        <prop-config :element="element" :animations="animations" fontable @file-add="fileAdded" @file-remove="fileRemoved"></prop-config>
      </div>
      <div class="preview">
        <div class="device" :style="containerStyle">
          <div class="element" :style="elementStyle">{{element.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PropConfig from './components/PropConfig'
import template, { simplify } from './model/element'
import { getElementStyle } from './utils/styles'
import { devices, animations } from './build-in'

function clone (obj) {
  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj
  // Handle Array
  if (obj instanceof Array) {
    let copy = []
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }
  // Handle Object
  if (obj instanceof Object) {
    let copy = {}
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }
  return obj
}

export default {
  name: 'StyleEditor',
  components: { PropConfig },
  computed: {
    containerStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    elementStyle () {
      return getElementStyle(this.element, this.device)
    },
    pretty () {
      return JSON.stringify(simplify(this.element, template), null, 2)
    }
  },
  data () {
    return {
      zoom: 1,
      deviceName: 'Galaxy S9+',
      device: {
        width: 320,
        height: 540
      },
      devices: devices,
      animations: animations,
      element: clone(template)
    }
  },
  watch: {
    deviceName () {
      for (let device of this.devices) {
        if (device.device === this.deviceName) {
          this.device.width = device.vp[0]
          this.device.height = device.vp[1]
        }
      }
    }
  },
  methods: {
    fileAdded (file) {
      console.log(file)
    },
    fileRemoved (file) {
      console.log(file)
    }
  }
}
</script>

<style lang="less">

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  color: #2c3e50;

  height: 100%;
  .header {
    background: #3e3e3e;
    height: 42px;
    line-height: 42px;
    color: #fff;
    label {
      font: 12px/1.2 'HelveticaNeue-Light','HelveticaNeue',Helvetica,'Roboto-Thin',Arial,sans-serif-light;
      color: #7e7e7e;
      margin: 0 0 2px;
      letter-spacing: .04em;
    }
    select {
      background-color: #3e3e3e;
      color: #fafafa;
      border-color: #3e3e3e;
      font-family: 'TeXGyreAdventorBold';
      padding: 0 10px;
    }
    input {
      background-color: #3e3e3e;
      border: 1px solid #6f6f6f;
      color: #fff;
      padding: 4px;
      width: 48px;
    }
  }
  .frames {
    height: calc(100% - 42px);
    display: flex;
    background-color: #FAFAFA;
  }
  .code {
    width: 320px;
    //border-right: 1px solid #0ae;
  }
  .preview {
    flex: 1;
    background-color: #FAFAFA;
    overflow: auto;
    .device {
      position: relative;
      background: #fff;
      margin: 20px auto;
      border: 1px solid #d6d9dc;
      border-radius: 3px;
      box-shadow: 0 2px 8px rgba(59,64,69,0.1);
    }
  }
  .config-box {
    overflow-y: auto;
    width: 300px;
    padding: 10px;
  }
}
::-webkit-scrollbar {
  width: 6px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  background-color: #0ae;
  background-image: -webkit-gradient(linear, 0 0, 0 100%, color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.5, transparent), to(transparent));
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}
</style>
