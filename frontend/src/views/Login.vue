<template>
  <div class="Login">
    <BaseHeadline
      title="Sing in to myTurk"
      description="The true method of knowledge is experiment. — William Blake"
    />
    <Container :items="login" @login="handleLogin" />
  </div>
</template>

<script>
import BaseHeadline from '@/components/BaseHeadline.vue'
import Container from '@/components/login/Container.vue'
import api from '@/api'

export default {
  name: 'Login',
  components: {
    BaseHeadline,
    Container,
  },
  props: {
    loggedOut: Boolean,
  },
  data: () => ({
    login: ['AWS Access Key ID', 'AWS Secret Access Key'],
  }),
  watch: {
    loggedOut: {
      immediate: true,
      handler: function(loggedOut) {
        if (loggedOut) {
          localStorage.setItem('token', JSON.stringify(''))
          this.$toasted.success('you are logged out', {
            position: 'bottom-right',
            duration: 2000,
          })
        }
      },
    },
  },

  methods: {
    //TODO: write mixin functions
    async handleLogin(credentials) {
      let res = await api.login(credentials)
      console.log(res)
      if (res.success) {
        localStorage.setItem('token', JSON.stringify(res.token))
        this.$toasted.success(res.message, {
          position: 'bottom-right',
          duration: 1500,
        })
        setTimeout(() => {
          this.$router.push({ path: 'overview' })
        }, 200)
      } else {
        this.$toasted.error(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    },
  },
}
</script>

<style lang="scss">
.Login {
  position: relative;
  width: 35%;
  min-width: 300px;
  max-width: 600px;
  display: flex;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  transform: translateY(-10%);
}
</style>
