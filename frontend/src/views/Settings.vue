<template>
  <div class="Settings">
    <BaseHeadline
      :route="backbutton"
      :title="settings.internalName || 'Add experiment'"
      :description="`You are in ${settings.endpoint} mode`"
    />

    <Container
      :groups="settingsInput"
      :endpoint="settings.endpoint"
      :has-hits="experiment.hits.length > 0"
      @updateSettings="updateSettings"
    />

    <div class="ButtonWrapper">
      <BaseButton
        second
        square
        title="Delete Experiment"
        :red="true"
        @click="handleDelete"
      />
      <BaseButton
        prime
        square
        title="Save Settings"
        :green="true"
        @click="handleSave"
      />
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
          experimentName: '',
          title: '',
          description: '',
          entrypoint: '',
          available: '0 / 0',
          pending: '0 / 0',
          waitingForApproval: '0 / 0',
          completed: '0 / 0',
          keywords: '',
          awardQualificationName: '',
          awardQualificationDescription: '',
          awardQualificationId: '',
          hitExpiresAfterDays: '',
          assignmentDurationInMinutes: '',
          assignmentsPerHit: '',
          defaultRequirements: false,
          rewardPerAssignment: '',
          hits: [],
          endpoint: 'sandbox',
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
        title: 'Internal Settings',
        items: [
          {
            name: 'Experiment Name',
            value: 'This is the experiment name for myturk',
          },
        ],
      },
      {
        title: 'Informations for the workers',
        items: [
          {
            name: 'Title',
            value: 'This is the title shown to workers',
          },
          {
            name: 'Description',
            value: 'Tell me something about this experiment',
          },
          {
            name: 'Keywords',
            value: 'user test, data completion, information extraction',
          },
        ],
      },

      {
        title: 'Qualification and Rewards',
        items: [
          {
            name: 'Award Qualification name',
            value: '',
          },
          {
            name: 'Award Qualification description',
            value: '',
          },
          {
            name: 'Award Qualification ID',
            value: '',
            disabled: true
          },
          {
            name: 'Reward per Assignment',
            value: '',
          },
        ],
      },
      {
        title: 'Hit and Assignments',
        items: [
          {
            name: 'Hit expires after (days)',
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
        ],
      },
      {
        title: 'Requirements and Entrypoint',
        items: [
          {
            name: 'Default Requirements',
            hint: 'us-based, 95% approval, more than 1.000 hits',
            type: 'checkbox',
            value: false
          },
          {
            name: 'Entrypoint',
            value: '',
          },
        ],
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
      // if(!value) {return}
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
          duration: 5000,
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
        console.log('result', result)

        if (result.success) {
          this.settings = result.data[0]
        }
      }
      this.settingsInput.map(elem => {
        elem.items.forEach(item => {
          let key = this.hyphensToCamelCase(item.name)
          item.value = this.settings[key]
          return item
        })
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
    padding-bottom: 30px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
  }

  .BaseButton.is-prime {
    margin-left: 10px;
    margin-top: 0;
  }
}
</style>
