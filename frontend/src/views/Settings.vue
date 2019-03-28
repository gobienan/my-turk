<template>
  <div class="Settings">
    <BaseHeadline
      :route="backbutton"
      :title="settings.internalName || 'Add experiment'"
      :description="`You are in ${settings.endpoint} mode`"
    />

    <Container
      :items="settingsInput"
      :endpoint="settings.endpoint"
      @updateSettings="updateSettings"
    />

    <div class="ButtonWrapper">
      <BaseButton second square title="Delete Experiment" :red="true" @click="handleDelete"/>
      <BaseButton prime square title="Save Settings" :green="true" @click="handleSave"/>
    </div>
    <BaseModal
      :visible="modalIsVisible"
      title="Delete Experiment"
      :cancel="{ label: 'cancel' }"
      :accept="{ label: 'delete', type: 'warning' }"
      @onAccept="deleteExperiment"
      @onCancel="closeModal"
    >
      <p>Are you sure you want to delete the experiment?</p>
    </BaseModal>
  </div>
</template>
<script>
import BaseButton from '@/components/BaseButton.vue'
import BaseHeadline from '@/components/BaseHeadline.vue'
import BaseModal from '@/components/BaseModal.vue'

import Container from '@/components/settings/Container.vue'

import api from '@/api'

export default {
  name: 'Tags',
  components: {
    BaseButton,
    BaseHeadline,
    BaseModal,
    Container,
  },
  props: {
    experiment: {
      type: Object,
      default: function() {
        return {
          internalName: 'This is the project name',
          title: 'This is the title shown to workers',
          description: 'Tell me something about this experiment',
          externalUrl: '',
          available: '0 / 0',
          pending: '0 / 0',
          waitingForApproval: '0 / 0',
          completed: '0 / 0',
          keywords: 'user test, data completion, information extraction',
          awardQualificationUponCompletion: '',
          hitDurationInMinutes: '',
          assignmentDurationInMinutes: '',
          assignmentsPerHit: '',
          defaultRequirements: 'us-based, 95% approval, more than 1.000 hits',
          rewardPerAssignment: '',
          endpoint: 'development',
        }
      },
    },
    addExperiment: Boolean,
    initial: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    modalIsVisible: false,
    backbutton: {
      paths: 'overview',
      name: 'back to Overview',
    },
    settings: {},
    settingsInput: [
      {
        name: 'Internal Name',
        value: 'This is the project name',
      },
      {
        name: 'Title',
        value: 'This is the title shown to workers',
      },
      {
        name: 'Description',
        value: 'Tell me something about this experiment',
      },
      {
        name: 'External URL',
        value: '',
      },
      {
        name: 'Keywords',
        value: 'user test, data completion, information extraction',
      },
      {
        name: 'Award Qualification upon completion',
        value: '',
      },
      {
        name: 'Default Requirements',
        value: 'us-based, 95% approval, more than 1.000 hits',
      },
      {
        name: 'Hit duration in minutes',
        value: '',
      },
      {
        name: 'Assignment duration in minutes',
        value: '',
      },
      {
        name: 'Assignments per HIT',
        value: '',
      },
      {
        name: 'Reward per Assignment',
        value: '',
      },
    ],
  }),
  watch: {
    experiment: {
      immediate: true,
      handler: function(experiment) {
        this.settings = experiment
      },
    },
  },
  mounted: function() {
    this.loadExperimentSettings()
  },
  methods: {
    updateSettings(settings) {
      this.settings = Object.assign(this.settings, settings)
    },
    hyphensToCamelCase(value) {
      let key = value.toLowerCase()
      key = key.replace(/ ([a-z])/g, (m, w) => w.toUpperCase())
      return key
    },
    async handleSave() {
      let id = this.$route.query.id || ''
      let settings = this.settings
      console.log(settings)

      let res = await api.saveSettings({ id, experiment: settings })

      if (res.success) {
        this.$toasted.success(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
      } else {
        this.$toasted.error(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    },
    async handleDelete() {
      this.modalIsVisible = true
    },
    closeModal() {
      this.modalIsVisible = false
    },
    async deleteExperiment() {
      let id = this.$route.query.id || ''
      let res = await api.deleteExperiment({ id })

      if (res.success) {
        this.$router.push({ name: 'overview' })
        this.$toasted.error(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    },
    async loadExperimentSettings() {
      let id = this.$route.query.id

      if (!this.addExperiment && this.initial && id) {
        let result = await api.getExperiments({ id })

        if (result.success) {
          this.settings = result.data[0]
        }
      }
      this.settingsInput.map(elem => {
        let key = this.hyphensToCamelCase(elem.name)
        elem.value = this.settings[key] || ''
        return elem
      })
    },
  },
}
</script>
<style lang="scss">
.Settings {
  position: relative;

  .ButtonWrapper {
    top: 0;
    right: 0;
    padding-bottom: 50px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
  }

  .BaseButton.is-prime {
    margin-left: 10px;
  }
}
</style>
