<template>
<div id="scene-maker">
	<div class="tool-bar"></div>
	<div class="sider-bar"></div>

	<div class="scene-container" ref="container">
		<div class="device-drag"></div>
		<div class="device draggable-source" ref="device">
			<div class="element"></div>
		</div>
	</div>
	<div class="line"></div>
</div>
</template>

<script>
import { Draggable } from '@shopify/draggable'
import interact from 'interactjs'

export default {
	name: 'FullPageSceneMaker',
	mounted () {
    interact('.device')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
          interact.modifiers.restrict({
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          }),
        ],
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: this.dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
            Math.pow(event.pageY - event.y0, 2) | 0))
              .toFixed(2) + 'px');
        }
      });
	},
	methods: {
    dragMoveListener (event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}
	}
}
</script>

<style lang="scss">
html.has-navbar-fixed-top, body.has-navbar-fixed-top {
	padding-top: 0;
}

#scene-maker {
	position: relative;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #f5f5f4;
	.scene-container {
		position: absolute;
		left: 0;
		top: 36px;
		bottom: 0;
		right: 0;
		.device-drag {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 1;
		}
		.device {
			position: absolute;
			left: 20px;
			background-color: #fff;
			width: 200px;
			height: 299px;
			z-index: 100;
			.element {
				position: absolute;
				background-color: #0a0a0a;
				width: 30px;
				height: 30px;
			}
		}
	}
}
.line {
	margin:5px 0;
	height:	4px;
	background:
		repeating-linear-gradient(to right,red 0,red 5px,transparent 5px,transparent 7px);
	/*5px red then 2px transparent -> repeat this!*/
	background-size: 100% 1px;
	background-repeat: no-repeat;
}
</style>