<template>
  <div class="App">
    <div class="Nav">
      <router-link to="/">Overview</router-link> |
      <router-link to="/experiment">Experiment</router-link> |
      <router-link to="/workers">Workers</router-link>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
.App {
  color: #2c3e50;
  padding: 40px;
  height: 100%;

  > * {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.Nav {
  display: none;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.4s;
  transition-property: opacity;
  transition-timing-function: $ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
