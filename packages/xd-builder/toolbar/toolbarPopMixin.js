import { Popover, Tooltip, Switch, Form, FormItem, InputNumber, Checkbox, Slider, Button, ButtonGroup, Select, Option } from 'element-ui'
export default {
  components: {
    [Popover.name]: Popover,
    [Tooltip.name]: Tooltip,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Switch.name]: Switch,
    [InputNumber.name]: InputNumber,
    [Slider.name]: Slider,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [ButtonGroup.name]: ButtonGroup
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
