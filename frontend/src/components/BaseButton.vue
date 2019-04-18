<template>
  <div
    class="BaseButton"
    :class="[
      { 'is-prime': prime },
      { 'is-second': second },
      { 'is-square': square },
      { 'is-inline': inline },
      { 'is-red': red },
      { 'is-green': green },
      { 'is-gray-light': grayLight },
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
    <span>{{ title }}</span>
  </div>
</template>
<script>
export default {
  name: 'BaseButton',
  props: {
    prime: {
      type: Boolean,
      default: false,
    },
    second: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    square: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    red: {
      type: Boolean,
      default: false,
    },
    green: {
      type: Boolean,
      default: false,
    },
    grayLight: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss">
.BaseButton {
  background-color: color(gray-dark);
  border-radius: 50px;
  text-transform: uppercase;
  padding: 16px 27px;
  font-size: rem(12px);
  color: color(text-white);
  display: inline-block;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
  transition: all 0.2s $ease;
  user-select: none;
  box-shadow: 0px 2px 20px 0 rgba(lighten(color(gray-dark), 10%), 0);

  &:hover {
    box-shadow: 0px 5px 20px 0 rgba(lighten(color(gray-dark), 10%), 0.5);
    transform: translateY(-3px);
  }

  &.is-square {
    padding: 12px 20px;
    border-radius: 0;
    font-size: rem(12px);

    &.is-prime {
      padding: 12px 40px;
    }
  }

  &.is-red {
    background-color: color(red);

    &:hover {
      box-shadow: 0px 5px 20px 0 lighten(color(red), 10%);
    }
  }

  &.is-green {
    background-color: color(green);

    &:hover {
      box-shadow: 0px 5px 20px 0 rgba(color(green), 0.5);
    }
  }

  &.is-gray-light {
    background-color: color(gray-light);

    &:hover {
      box-shadow: 0px 5px 20px 0 rgba(color(gray-light), 0.5);
    }
  }

  &.is-second {
    background-color: transparent;
    color: color(gray-dark);
    border: solid 2px color(gray-dark);

    &:hover {
      transform: translateY(0px);
      background-color: rgba(color(gray-dark), 0.25);
      box-shadow: none;
    }

    &.is-gray-light {
      color: lighten(color(gray-dark), 30%);
      box-shadow: none;
      border: none;

      &:hover {
        color: lighten(color(gray-dark), 0%);
        background-color: rgba(lighten(color(gray-dark), 30%), 0.1);
      }
    }

    &.is-red {
      color: color(red);
      border: none;

      &:hover {
        background-color: rgba(color(red), 0.1);
      }
    }

    &.is-green {
      color: color(green);
      border: none;

      &:hover {
        background-color: rgba(color(green), 0.1);
      }
    }
  }
}
</style>
