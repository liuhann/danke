export default {
  data () {
    return {
      actionStack: [],
      actionStackMax: 50,
      actionIndex: -1
    }
  },
  computed: {
    undoable() {
      return this.actionIndex > 0
    },
    redoable () {
      return this.actionIndex < this.actionStack.length - 1
    }
  },
  created () {},

  methods: {
    takeSnapshot () {
      const action = {
        scene: this.work.scenes.indexOf(this.currentScene),
        workString: JSON.stringify(this.work)
      }
      // action index on stack tail: push
      if (this.actionIndex === this.actionStack.length - 1) {
        this.actionStack.push(action)
      } else {
        // not stack tail, clear redo list
        this.actionStack.splice(this.index)
        this.actionStack.push(action)
      }
      // shift out old actions
      while (this.actionStack.length > this.actionStackMax) {
        this.actionStack.shift()
      }
      // point to stack tail
      this.actionIndex = this.actionStack.length - 1
    },

    recoverSnapShot (snapshot) {
      this.work = JSON.parse(snapshot.workString)
      this.currentScene = this.work.scenes[snapshot.scene]
    },

    redo () {
      if (this.redoable) {
        this.actionIndex ++
        this.recoverSnapShot(this.actionStack[this.actionIndex])
      }
    },

    undo () {
      if (this.undoable) {
        this.actionIndex --
        this.recoverSnapShot(this.actionStack[this.actionIndex])
      }
    }
  }
}
