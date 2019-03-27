<template>
  <div class="BaseWrapper" :class="[{'is-red':red},{'is-green':green},{'is-gray-dark':grayDark},{'is-gray-light':grayLight}]">

    <div class="TitleWrapper">
      <h2 class="Title" v-html="title"></h2>
    </div>

    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BaseWrapper',
  props: {
    title: String,
    items: String,
    red: Boolean,
    green: Boolean,
    grayDark: Boolean,
    grayLight: Boolean,
  },
}

</script>
<style lang="scss">
.BaseWrapper {
  $outdent: 40px;
  background: #FFFFFF;
  box-shadow: 4px 20px 35px 0px rgba(0, 0, 0, 0.10);
  border-radius: 25px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  overflow: hidden;
  width: calc(100% + #{$outdent * 2});
  transform: translateX(-$outdent);
  margin-bottom: 60px;

  &:last-of-type {
    margin-bottom: 0px;
  }

  &.is-red {
    .TitleWrapper {
      background-color: color(red);
    }
  }

  &.is-green {
    .TitleWrapper {
      background-color: color(green);
    }
  }

  &.is-gray-light {
    .TitleWrapper {
      background-color: color(gray-light);
    }

    .Title {
      color: color(text);
    }
  }

  &.is-gray-dark {
    .TitleWrapper {
      background-color: color(gray-dark);
    }
  }

  .TitleWrapper {
    width: calc(100% + 80px);
    transform: translate(-40px, -20px);
    padding: 10px 40px;

  }

  .Title {
    font-size: rem(20px);
    color: color(text-white);
    font-weight: 700;
  }

  .Table {
    width: calc(100% + #{$outdent * 2});
    transform: translateX(-$outdent);
  }

  @media (min-width: breakpoint(tablet-portrait)) {
    width: 100%;
    transform: translateX(0);
  }
}

</style>
