<template>
  <div class="BaseSelect">
    <select v-model="selected" :disabled="disabled">
      <option v-for="(option, i) in options" :key="i" :value="option.value">{{
        option.label
      }}</option>
    </select>
    <label class="Label">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
  },
  data: () => ({}),
  computed: {
    selected: {
      get() {
        return this.options.find(o => o.isSelected).value
      },
      set(value) {
        let key = this.label.toLowerCase()
        key = key.replace(/ ([a-z])/g, (m, w) => w.toUpperCase())
        this.$emit('onChange', {
          [key]: value,
        })
      },
    },
  },
}
</script>
<style scoped lang="scss">
.BaseSelect {
  width: 100%;
  background-color: color(bg);
  position: relative;
  padding: 10px 18px;

  select {
    width: calc(100% - 10px);
    height: 100%;
    background-color: transparent;
    margin-left: -10px;
    border: none;
    font-family: font(regular);
    font-size: rem(14px);
    outline: none;
  }

  .Label {
    position: absolute;
    left: 18px;
    top: 10px;
    transform: translateY(-30px);
    font-size: rem(12px);
    transition: all 0.2s ease-out;
  }
}
</style>
