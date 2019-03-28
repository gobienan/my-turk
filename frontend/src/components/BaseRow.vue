<template>
  <div class="BaseRow" :class="[{ 'is-bold': bold }, { 'is-light': light }]">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BaseRow',
  props: {
    title: {
      type: String,
      default: '',
    },
    light: Boolean,
    bold: Boolean,
  },
}
</script>
<style lang="scss">
.BaseRow {
  color: color(text);
  font-weight: 500;
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  padding: 0 40px;
  font-size: rem(14px);

  &::before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(black, 0.2);
  }

  &:last-child {
    .BaseRow {
      padding: 0;

      &:last-child {
        padding-bottom: 0px;
      }
    }

    &::before {
      display: none;
    }
  }

  .BaseRow {
    padding: 0;

    &:last-child {
      padding-bottom: 20px;
    }

    > span {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    &::before {
      display: none;
    }
  }

  &.is-bold {
    font-weight: 900;
    font-size: rem(16px);

    > span {
      line-height: rem(25);
    }
  }

  &.is-light {
    font-weight: 400;
    font-size: rem(14px);
    color: color(text-light);

    > span {
      padding: 0;
      padding-bottom: 8px;
    }
  }

  > span {
    letter-spacing: 0.47px;
    position: relative;
    padding: 20px 0;
    line-height: 1.25;
    flex: 1.5;
    align-self: baseline;

    &:not(:last-of-type) {
      padding-right: 12px;
    }

    &.is-narrow {
      flex: 1;
    }

    &.is-wide {
      flex: 3;
    }

    &.align-right {
      text-align: right;
    }

    &.align-center {
      text-align: center;
    }
  }

  .is-small {
    font-size: rem(12px);
    color: color(text-light);
  }
}
</style>
