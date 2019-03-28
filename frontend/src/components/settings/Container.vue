<template>
  <BaseWrapper
    title="Experiment Settings"
    :gray-dark="modes.development"
    :green="modes.sandbox"
    :red="modes.production"
  >
    <div class="Container">
      <BaseInput
        v-for="(item, i) in items"
        :key="i"
        :label="item.name || item"
        :value="item.value"
        @keyPress="handleKeyPress"
      />

      <BaseSelect :options="options" label="Endpoint" @onChange="handleSelectChange"/>
    </div>
  </BaseWrapper>
</template>
<script>
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseWrapper from '@/components/BaseWrapper.vue'

export default {
  name: 'Grid',
  components: {
    BaseInput,
    BaseSelect,
    BaseWrapper,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    endpoint: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    settings: {},
    modes: {
      development: true,
      sandbox: false,
      production: false,
    },
    options: [
      { value: 'development', label: 'Development', isSelected: true },
      { value: 'sandbox', label: 'Sandbox', isSelected: false },
      { value: 'production', label: 'Production', isSelected: false },
    ],
  }),
  watch: {
    endpoint: {
      immediate: true,
      handler: function(val) {
        this.options.forEach(o => {
          o.value === val ? (o.isSelected = true) : (o.isSelected = false)
        })
        for (let mode in this.modes) {
          this.modes[mode] = false
        }
        this.modes[val] = true
      },
    },
  },
  methods: {
    handleKeyPress(option) {
      Object.assign(this.settings, option)
      this.$emit('updateSettings', this.settings)
    },
    handleSelectChange(val) {
      Object.assign(this.settings, val)
      this.$emit('updateSettings', this.settings)
    },
  },
}
</script>
<style scoped lang="scss">
.Container {
  position: relative;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 34px 20px;
  transform: translateX(-20px);
  width: calc(100% + 20px);
  padding: 30px 0 20px;
}
</style>
