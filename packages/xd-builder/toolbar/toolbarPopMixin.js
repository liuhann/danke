import { Popover, Tooltip, Switch, Form, FormItem, InputNumber, Checkbox, Slider } from 'element-ui'
export default {
  components: {
    [Popover.name]: Popover,
    [Tooltip.name]: Tooltip,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Switch.name]: Switch,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Checkbox.name]: Checkbox
  },
  props: {
    element: {
      type: Object
    },
    elements: {
      type: Array
    },
    work: {
      type: Object
    },
    scene: {
      type: Object
    }
  }
}
