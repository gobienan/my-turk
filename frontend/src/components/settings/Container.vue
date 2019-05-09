<template>
  <BaseWrapper
    title="Experiment Settings"
    :green="modes.sandbox"
    :red="modes.production"
  >
    <div class="Container">
      <div v-for="(group, index) in groups" :key="index" class="Groups">
        <h3 v-if="group.title" class="GroupTitle">{{ group.title }}</h3>
        <template v-for="(item, i) in group.items">
          <BaseCheckbox
            v-if="item.type && item.type === 'checkbox'"
            :key="i"
            :label="item.name || item"
            :value="item.value"
            :hint="item.hint"
            @keyPress="handleKeyPress"
          />

          <BaseInput
            v-else
            :key="i"
            :label="item.name || item"
            :value="item.value"
            :disabled="item.disabled"
            :placeholder="item.placeholder || ''"
            @keyPress="handleKeyPress"
          />
        </template>
      </div>
      <BaseSelect
        :disabled="hasHits && modes.production"
        :options="options"
        label="Endpoint"
        @onChange="handleSelectChange"
      />
    </div>
  </BaseWrapper>
</template>
<script>
import BaseCheckbox from '@/components/BaseCheckbox.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseWrapper from '@/components/BaseWrapper.vue'

export default {
  name: 'Grid',
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    BaseWrapper,
  },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
    endpoint: {
      type: String,
      default: '',
    },
    hasHits: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    settings: {},
    modes: {
      sandbox: true,
      production: false,
    },
    options: [
      { value: 'sandbox', label: 'Sandbox', isSelected: true },
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
  transform: translateX(-20px);
  width: calc(100% + 20px);
  padding: 10px 0 20px;

  .Groups {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 34px 20px;
    margin-bottom: 50px;
  }
  .GroupTitle {
    grid-column-start: 1;
    grid-column-end: 3;
    margin-left: 17px;
    margin-bottom: 5px;
    margin-top: 0px;
  }
  .BaseInput, .BaseCheckbox {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .BaseSelect {
    width: calc(100% + 20px);
    grid-column-start: 1;
    grid-column-end: 3;
  }
}
</style>
