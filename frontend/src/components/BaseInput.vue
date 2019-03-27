<template>
  <div class="BaseInput">
    <input :type="type" name="" v-model="mValue">
    <label class="Label">{{label}}</label>
  </div>
</template>
<script>
export default {
  name: 'BaseInput',
  props: {
    label: String,
    type: {
      type: String,
      default: ''
    },
    value: String
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
        let key = this.label.toLowerCase();
        key = key.replace(/ ([a-z])/g, (m, w) => w.toUpperCase());
        this.$emit('keyPress', {
          [key]: value
        });
      },
    },
  },
  methods: {
    handleKeyPress() {

    }
  }
}

</script>
<style lang="scss">
.BaseInput {
  background-color: color(bg);
  position: relative;
  padding: 10px 18px;
  width: 100%;

  .Label {
    position: absolute;
    left: 18px;
    top: 10px;
    transform: translateY(-30px);
    font-size: rem(12px);
    transition: all .2s ease-out;
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

    &:focus {
      +.Label {
        transform: translateY(-30px);
        font-size: rem(12px);
      }
    }
  }
}

</style>
