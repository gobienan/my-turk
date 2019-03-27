<template>
  <BaseWrapper title="" green>
    <div class="Container">
      <span class="Hint">
        <i class="fas fa-info-circle"></i>
        <span>Your credentials might be under ./username/.aws/<br>
          Otherwise create new credentials <a href="https://docs.aws.amazon.com/de_de/sdk-for-net/v2/developer-guide/net-dg-setup.html#net-dg-signup" target="_blank">here</a>
        </span>
      </span>
      <BaseInput :label="items[0]" value="" type="text" @keyPress="handleKeyPress" />
      <BaseInput :label="items[1]" value="" type="password" @keyPress="handleKeyPress" />

    </div>
    <BaseButton square prime title="sign in" @click="handleLogin" />
  </BaseWrapper>

</template>
<script>
import BaseInput from "../BaseInput.vue";
import BaseButton from "../BaseButton.vue";
import BaseWrapper from "../BaseWrapper.vue";

export default {
  name: "Grid",
  components: {
    BaseInput,
    BaseButton,
    BaseWrapper
  },
  props: {
    items: Array
  },
  data: () => ({
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
  }),
  methods: {
    handleKeyPress({ awsAccessKeyId, awsSecretAccessKey }) {
      this.awsAccessKeyId = awsAccessKeyId || this.awsAccessKeyId;
      this.awsSecretAccessKey = awsSecretAccessKey || this.awsSecretAccessKey;
    },
    handleLogin() {
      let { awsAccessKeyId, awsSecretAccessKey } = this;
      this.$emit("login", { awsAccessKeyId, awsSecretAccessKey })
    }
  }
};

</script>
<style scoped lang="scss">
.BaseWrapper {

  .Container {
    position: relative;
    transform: translateX(-20px);
    width: calc(100% + 20px);
    padding: 30px 0 20px;
    display: grid;
    grid-gap: 30px 0;
  }

  .BaseButton {
    align-self: baseline;
    margin-left: -20px;
    margin-bottom: 10px;
  }

  .Hint {
    color: color(text-light);
    transform: translate(15px, -10px);
    font-size: rem(16px);
    display: flex;
    align-items: center;

    a,
    span {
      font-size: rem(12px);
      line-height: 1.5;
    }

    span {
      padding-left: 10px;
    }
  }
}

</style>
