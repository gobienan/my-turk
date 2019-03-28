<template>
  <div class="BaseHeadline">
    <router-link
      v-if="route"
      class="BackButton"
      :to="{ name: route.paths, params: route.params }"
    >
      <i class="fas fa-angle-left"></i>
      <span>{{ route.name }}</span>
    </router-link>
    <div v-if="prime">
      <h1 class="Title">{{ title }}</h1>
      <h2 class="Description">{{ description }}</h2>
    </div>
    <div v-else>
      <h2 class="Title Title--small">{{ title }}</h2>
      <span v-if="meta" class="Meta">{{ meta }}</span>
      <h3 class="Description Description--small">{{ description }}</h3>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BaseHeadline',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    meta: {
      type: String,
      default: '',
    },
    prime: Boolean,
    route: {
      type: () => {},
      default: {},
      name: {
        type: String,
        default: '',
      },
      path: {
        type: String,
        default: '',
      },
      params: Object,
    },
  },
}
</script>
<style lang="scss">
.BaseHeadline {
  margin-bottom: 56px;
  color: color(text-dark);
  line-height: 1.25;

  > div {
    position: relative;
  }

  .BackButton {
    position: absolute;
    left: 40px;
    font-size: rem(13px);
    top: -32px;
    transition: all 0.2s ease-out;
    cursor: pointer;
    padding: 5px;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;

    .fa-angle-left {
      transition: all 0.2s ease-out;
      transform: translateX(-5px);
    }

    &:hover {
      .fa-angle-left {
        transform: translateX(-10px);
      }
    }
  }

  .Title {
    font-size: rem(40px);
    font-family: font(headline);
    max-width: 80%;
    line-height: 1.25;
    margin-bottom: 0;

    &.Title--small {
      font-size: rem(30px);
    }
  }

  .Description {
    font-size: rem(35px);
    font-family: font(headline);
    font-weight: 400;
    margin: 0;
    margin-top: 45px;

    &.Description--small {
      font-size: rem(25px);
      margin-top: 35px;
    }
  }

  .Meta {
    margin-top: 5px;
    font-size: rem(14px);
  }

  @media (min-width: breakpoint(tablet-portrait)) {
    padding: 0 40px;
  }
}
</style>
