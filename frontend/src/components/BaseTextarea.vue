<template>
  <div class="BaseTextarea">
    <textarea v-model="mValue" :type="type" name></textarea>
    <label class="Label">{{ label }}</label>
  </div>
</template>
<script>
export default {
  name: 'BaseTextarea',
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
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
}
</script>
<style lang="scss">
.BaseTextarea {
  background-color: color(bg);
  position: relative;
  width: 100%;
  margin: 20px 0;

  .Label {
    position: absolute;
    left: 14px;
    top: 10px;
    transform: translateY(-30px);
    font-size: rem(12px);
    transition: all 0.2s ease-out;
  }

  textarea {
    outline: none;
    margin: 0;
    padding: 10px;
    border-color: color(gray-dark);
    background-color: transparent;
    resize: none;
    font-family: font(regular);
    width: 100%;
    font-size: rem(14px);
    height: 100px;
    display: block;
    box-shadow: 2px 2px 0px 0 rgba(lighten(color(gray-dark), 10%), 0.2);
    line-height: 1.5;

    &:focus {
      + .Label {
        transform: translateY(-30px);
        font-size: rem(12px);
      }
    }
  }
}
</style>
