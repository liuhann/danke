import { Input, Popover, Tooltip, Switch, Form, FormItem, InputNumber, Checkbox, Slider, Button, ButtonGroup, Select, Option, RadioGroup, Radio, ColorPicker, Tabs, TabPane, Upload } from 'element-ui'
import PopWrapper from './PopWrapper.vue'
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
    [ButtonGroup.name]: ButtonGroup,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [ColorPicker.name]: ColorPicker,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Input.name]: Input,
    [Upload.name]: Upload,
    PopWrapper
  },
  props: {
    variable: {
      type: Object
    },
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
