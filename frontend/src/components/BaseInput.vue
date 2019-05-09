<template>
  <div class="BaseInput" :class="{ 'is-disabled': disabled }">
    <input v-model="mValue" :type="type" name :disabled="disabled" :placeholder="placeholder"/>
    <label class="Label">{{ label }}</label>
  </div>
</template>
<script>
export default {
  name: 'BaseInput',
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    placeholder:{
      type: String,
      default : ''
    }
  },
  data: () => ({}),
  computed: {
    mValue: {
      get() {
        return this.value
      },
      set(value) {
        // convert the label name to camelCase
        // eg:  AWS Access Key ID -> awsAccessKeyId
        let key = this.label.toLowerCase()
        key = key.replace(/ ([a-z])/g, (m, w) => w.toUpperCase())
        this.$emit('keyPress', {
          [key]: value,
        })
      },
    },
  },
  methods: {
    handleKeyPress() {},
  },
}
</script>
<style lang="scss">
.BaseInput {
  background-color: color(bg);
  position: relative;
  padding: 10px 18px;
  width: 100%;

  &.is-disabled {
    background-color: lighten(color(bg), 5%);
    .Label {
      top: 20px;
    }
  }
  
  .Label {
    position: absolute;
    left: 18px;
    top: 10px;
    transform: translateY(-30px);
    font-size: rem(12px);
    transition: all 0.2s ease-out;
  }

  input {
    outline: none;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    font-family: font(regular);
    width: 100%;
    font-size: rem(14px);
    &::placeholder {
      color: rgba(black, 0.4);
    }
    &:focus {
      + .Label {
        transform: translateY(-30px);
        font-size: rem(12px);
      }
    }
  }
}
</style>
