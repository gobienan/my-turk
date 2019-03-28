<template>
  <div class="Overview">
    <BaseHeadline
      :route="backbutton"
      prime
      title="myTurk"
      description="Overview of your experiments"
    />

    <BaseWrapper title="Production" red>
      <Table
        :experiments="experiments.production"
        @createHIT="createHIT"
        @onHitDeleteClick="handleDeleteHIT"
      />
    </BaseWrapper>

    <BaseWrapper title="Sandbox" green>
      <Table
        :experiments="experiments.sandbox"
        @createHIT="createHIT"
        @onHitDeleteClick="handleDeleteHIT"
      />
    </BaseWrapper>

    <BaseWrapper title="Development" gray-dark>
      <Table :experiments="experiments.development"/>
    </BaseWrapper>

    <BaseButton prime title="add experiment" @click="addExperiment"/>

    <BaseModal
      :visible="modalIsVisible"
      title="Delete HIT"
      :cancel="{ label: 'cancel' }"
      :accept="{ label: 'delete', type: 'warning' }"
      @onAccept="deleteHIT"
      @onCancel="closeModal"
    >
      <p>Are you sure you want to delete this HIT?</p>
    </BaseModal>
  </div>
</template>
<script>
import BaseButton from '@/components/BaseButton.vue'
import BaseHeadline from '@/components/BaseHeadline.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseWrapper from '@/components/BaseWrapper.vue'
import Table from '@/components/overview/Table.vue'
import api from '@/api'

export default {
  name: 'Tags',
  components: {
    BaseHeadline,
    BaseModal,
    BaseWrapper,
    BaseButton,
    Table,
  },
  data: () => ({
    backbutton: {
      paths: 'login',
      name: 'Click here to SignOut',
      params: { loggedOut: true },
      hit: {},
    },
    modalIsVisible: false,
    experiments: {},
  }),
  mounted: async function() {
    this.getExperiments()
  },
  methods: {
    async getExperiments() {
      let result = await api.getExperiments({ groupBy: 'endpoint' })
      console.log(result)
      if (result.success) {
        this.experiments = result.data
        this.experiments.production = result.data.production || []
        this.experiments.sandbox = result.data.sandbox || []
        this.experiments.development = result.data.development || []
      }
    },
    async addExperiment() {
      let res = await api.addExperiment()

      if (res.success) {
        this.$router.push({
          name: 'settings',
          params: { addExperiment: true },
          query: { id: res.data.id },
        })
      } else {
        this.$toasted.show(res.message, {
          type: 'error',
          position: 'bottom-right',
          duration: 3000,
        })
      }
    },
    async createHIT(experiment) {
      console.log(experiment)
      let res = await api.createHIT(experiment)
      console.log(res)

      if (res.success) {
        this.$toasted.success(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
        let hit = res.data.HIT
        experiment = this.addHITtoExperiment(experiment, hit)

        let id = experiment._id
        await api.saveSettings({ id, experiment })
        this.getExperiments()
      } else {
        this.$toasted.error(res.message, {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    },
    addHITtoExperiment(experiment, hit) {
      let hitID = hit.HITId
      let maxAssignments = hit.MaxAssignments
      let available = hit.NumberOfAssignmentsAvailable
      let pending = hit.NumberOfAssignmentsPending
      let completed = hit.NumberOfAssignmentsCompleted
      let creationTime = hit.CreationTime
      let title = hit.Title
      let status = hit.HITStatus
      let waitingForApproval = maxAssignments - available - completed - pending

      let mHIT = {
        id: hitID,
        title: title,
        available: `${available} / ${maxAssignments} `,
        pending: `${pending} / ${maxAssignments} `,
        waitingForApproval: `${waitingForApproval} / ${maxAssignments} `,
        completed: `${completed} / ${maxAssignments} `,
        creationTime: creationTime,
        status: status,
      }

      if (!experiment.hits) {
        experiment.hits = []
      }
      experiment.hits.push(mHIT)
      return experiment
    },
    handleDeleteHIT(hit) {
      this.modalIsVisible = true
      this.hit = hit
    },
    async deleteHIT() {
      let id = this.hit.id
      console.log(api)
      let res = await api.deleteHIT({ id })

      this.modalIsVisible = false
      this.hit = {}

      if (res.success) {
        this.getExperiments()

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
    closeModal() {
      this.modalIsVisible = false
    },
  },
}
</script>
<style lang="scss">
.Overview {
  position: relative;

  > .BaseButton.is-prime {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
