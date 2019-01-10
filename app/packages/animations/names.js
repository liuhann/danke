const outs = {
  'scale-out': '放大',
  'flip-out': '翻转',
  'slide-out': '',
  'fade-out': '',
  'bounce-out': '',
  'rotate-out': '',
  'slit-out': '',
  'puff-out': '',
  'swing-out': ''
}
const entrance = {
  'scale-in': '',
  'rotate-in': '',
  'flip-in': '',
  'slit-in': '',
  'slide-in': '',
  'bounce-in': '',
  'swing-in': '',
  'fade-in': ''
}
const attention = {
  'vibrate-1': '',
  'vibrate-2': '',
  'vibrate-3': '',
  'flicker-1': '',
  'flicker-5': '',
  'flicker-4': '',
  'flicker-3': '',
  'flicker-2': '',
  'jello-horizontal': '',
  'jello-vertical': '',
  'jello-diagonal-1': '',
  'jello-diagonal-2': '',
  'wobble-hor-bottom': '',
  'wobble-hor-top': '',
  'wobble-ver-left': '',
  'wobble-ver-right': '',
  'bounce-top': '',
  'bounce-bottom': '',
  'bounce-left': '',
  'bounce-right': '',
  'ping': '',
  'pulsate-fwd': '',
  'pulsate-bck': '',
  'heartbeat': '',
  'blink-2': '',
  'blink-1': ''
}

const text = {
  'text-focus-in': '',
  'text-blur-out': '',
  'tracking-in': '',
  'tracking-out': ''
}
const background = {
  'kenburns': '',
  'bg-pan': ''
}

const animations = ['scale-out-top',
  'scale-out-center',
  'scale-out-tr',
  'scale-out-right',
  'scale-out-br',
  'scale-out-bottom',
  'scale-out-bl',
  'scale-out-left',
  'scale-out-hor-right',
  'scale-out-hor-left',
  'scale-out-horizontal',
  'scale-out-tl',
  'scale-out-ver-bottom',
  'scale-out-ver-top',
  'scale-out-vertical',
  'flip-out-hor-top',
  'flip-out-diag-1-bl',
  'flip-out-diag-1-tr',
  'flip-out-ver-right',
  'flip-out-ver-left',
  'flip-out-hor-bottom',
  'flip-out-diag-2-tl',
  'flip-out-diag-2-br',
  'slide-out-top',
  'slide-out-tr',
  'slide-out-right',
  'slide-out-br',
  'slide-out-bottom',
  'slide-out-bl',
  'slide-out-left',
  'slide-out-tl',
  'fade-out',
  'fade-out-bck',
  'fade-out-fwd',
  'fade-out-top',
  'fade-out-tr',
  'fade-out-right',
  'fade-out-tl',
  'fade-out-left',
  'fade-out-bl',
  'fade-out-bottom',
  'fade-out-br',
  'bounce-out-top',
  'bounce-out-right',
  'bounce-out-bottom',
  'bounce-out-left',
  'bounce-out-bck',
  'bounce-out-fwd',
  'kenburns-top',
  'kenburns-top-right',
  'kenburns-right',
  'kenburns-bottom-right',
  'kenburns-bottom',
  'kenburns-bottom-left',
  'kenburns-left',
  'kenburns-top-left',
  'bg-pan-left',
  'bg-pan-right',
  'bg-pan-top',
  'bg-pan-bottom',
  'bg-pan-tr',
  'bg-pan-br',
  'bg-pan-bl',
  'bg-pan-tl',
  'scale-down-center',
  'scale-down-top',
  'scale-down-tr',
  'scale-down-right',
  'scale-down-br',
  'scale-down-bottom',
  'scale-down-hor-right',
  'scale-down-hor-left',
  'scale-down-hor-center',
  'scale-down-tl',
  'scale-down-left',
  'scale-down-ver-bottom',
  'scale-down-bl',
  'scale-down-ver-center',
  'scale-down-ver-top',
  'scale-up-tr',
  'scale-up-tl',
  'scale-up-ver-bottom',
  'scale-up-left',
  'scale-up-ver-top',
  'scale-up-bl',
  'scale-up-ver-center',
  'scale-up-right',
  'scale-up-br',
  'scale-up-bottom',
  'scale-up-hor-right',
  'scale-up-hor-left',
  'scale-up-hor-center',
  'scale-up-top',
  'scale-up-center',
  'scale-in-center',
  'scale-in-top',
  'scale-in-tr',
  'scale-in-right',
  'scale-in-br',
  'scale-in-bottom',
  'scale-in-hor-right',
  'scale-in-hor-left',
  'scale-in-hor-center',
  'scale-in-tl',
  'scale-in-ver-bottom',
  'scale-in-left',
  'scale-in-ver-top',
  'scale-in-bl',
  'scale-in-ver-center',
  'rotate-in-2-cw',
  'rotate-in-2-ccw',
  'rotate-in-2-fwd',
  'rotate-in-2-bck',
  'rotate-in-2-tr-cw',
  'rotate-in-2-tr-ccw',
  'rotate-in-2-tl-ccw',
  'rotate-in-2-tl-cw',
  'rotate-in-2-bl-ccw',
  'rotate-in-2-bl-cw',
  'rotate-in-2-br-ccw',
  'rotate-in-2-br-cw',
  'flip-in-hor-bottom',
  'flip-in-hor-top',
  'flip-in-ver-right',
  'flip-in-ver-left',
  'flip-in-diag-1-tr',
  'flip-in-diag-1-bl',
  'flip-in-diag-2-tl',
  'flip-in-diag-2-br',
  'slit-in-vertical',
  'slit-in-horizontal',
  'slit-in-diagonal-1',
  'slit-in-diagonal-2',
  'slide-in-top',
  'slide-in-bl',
  'slide-in-bottom',
  'slide-in-br',
  'slide-in-right',
  'slide-in-tr',
  'slide-in-tl',
  'slide-in-left',
  'slide-in-fwd-center',
  'slide-in-fwd-bottom',
  'slide-in-fwd-br',
  'slide-in-fwd-right',
  'slide-in-fwd-tr',
  'slide-in-fwd-tl',
  'slide-in-fwd-top',
  'slide-in-fwd-left',
  'slide-in-fwd-bl',
  'slide-in-bck-center',
  'slide-in-bck-top',
  'slide-in-bck-tr',
  'slide-in-bck-right',
  'slide-in-bck-br',
  'slide-in-bck-bottom',
  'slide-in-bck-bl',
  'slide-in-bck-left',
  'slide-in-bck-tl',
  'bounce-in-top',
  'bounce-in-bck',
  'bounce-in-fwd',
  'bounce-in-left',
  'bounce-in-bottom',
  'bounce-in-right',
  'swing-in-top-fwd',
  'swing-in-bottom-bck',
  'swing-in-bottom-fwd',
  'swing-in-right-bck',
  'swing-in-right-fwd',
  'swing-in-top-bck',
  'swing-in-left-bck',
  'swing-in-left-fwd',
  'fade-in',
  'fade-in-right',
  'fade-in-tr',
  'fade-in-tl',
  'fade-in-top',
  'fade-in-left',
  'fade-in-bck',
  'fade-in-bl',
  'fade-in-fwd',
  'fade-in-bottom',
  'fade-in-br',
  'rotate-out-2-cw',
  'rotate-out-2-tr-ccw',
  'rotate-out-2-tl-ccw',
  'rotate-out-2-tr-cw',
  'rotate-out-2-tl-cw',
  'rotate-out-2-fwd',
  'rotate-out-2-bl-ccw',
  'rotate-out-2-bck',
  'rotate-out-2-bl-cw',
  'rotate-out-2-ccw',
  'rotate-out-2-br-ccw',
  'rotate-out-2-br-cw',
  'slit-out-horizontal',
  'slit-out-diagonal-2',
  'slit-out-diagonal-1',
  'slit-out-vertical',
  'slide-out-fwd-center',
  'slide-out-fwd-bottom',
  'slide-out-fwd-br',
  'slide-out-fwd-right',
  'slide-out-fwd-tr',
  'slide-out-fwd-tl',
  'slide-out-fwd-top',
  'slide-out-fwd-left',
  'slide-out-fwd-bl',
  'puff-out-bottom',
  'puff-out-br',
  'puff-out-ver',
  'puff-out-right',
  'puff-out-hor',
  'puff-out-tr',
  'puff-out-tl',
  'puff-out-top',
  'puff-out-left',
  'puff-out-center',
  'puff-out-bl',
  'swing-out-top-bck',
  'swing-out-bottom-fwd',
  'swing-out-bottom-bck',
  'swing-out-right-fwd',
  'swing-out-right-bck',
  'swing-out-top-fwd',
  'swing-out-left-fwd',
  'swing-out-left-bck',
  'tracking-in-expand',
  'tracking-in-expand-fwd',
  'tracking-in-expand-fwd-top',
  'tracking-in-expand-fwd-bottom',
  'tracking-in-contract',
  'tracking-in-contract-bck',
  'tracking-in-contract-bck-top',
  'tracking-in-contract-bck-bottom',
  'tracking-out-contract',
  'tracking-out-expand-fwd',
  'tracking-out-expand',
  'tracking-out-contract-bck-bottom',
  'tracking-out-contract-bck-top',
  'tracking-out-contract-bck',
  'tracking-out-expand-fwd-bottom',
  'tracking-out-expand-fwd-top',
  'text-focus-in',
  'focus-in-expand',
  'focus-in-expand-fwd',
  'focus-in-contract',
  'focus-in-contract-bck',
  'text-blur-out',
  'blur-out-expand-fwd',
  'blur-out-expand',
  'blur-out-contract-bck',
  'blur-out-contract',
  'vibrate-1',
  'vibrate-2',
  'vibrate-3',
  'flicker-1',
  'flicker-5',
  'flicker-4',
  'flicker-3',
  'flicker-2',
  'jello-horizontal',
  'jello-vertical',
  'jello-diagonal-1',
  'jello-diagonal-2',
  'wobble-hor-bottom',
  'wobble-hor-top',
  'wobble-ver-left',
  'wobble-ver-right',
  'bounce-top',
  'bounce-bottom',
  'bounce-left',
  'bounce-right',
  'ping',
  'pulsate-fwd',
  'pulsate-bck',
  'heartbeat',
  'blink-2',
  'blink-1']

export default {
  entrance,
  outs,
  animations,
  background,
  attention,
  text
}
