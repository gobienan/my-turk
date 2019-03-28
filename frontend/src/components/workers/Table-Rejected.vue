<template>
  <div class="Table">
    <BaseRow v-if="!workers" light>
      <span class="is-loading is-wide">WorkerID</span>
      <span class="is-loading is-wide">AssignmentID</span>
      <span class="is-loading is-narrow align-right">Started</span>
      <span class="is-loading is-narrow align-right">Finished</span>
      <span class="is-loading is-narrow align-right">Rejected</span>
    </BaseRow>

    <BaseRow v-else light>
      <span class="is-wide">WorkerID</span>
      <span class="is-wide">AssignmentID</span>
      <span class="is-narrow align-right">Started</span>
      <span class="is-narrow align-right">Finished</span>
      <span class="is-narrow align-right">Rejected</span>
    </BaseRow>

    <BaseRow v-for="worker in workers" :key="worker.id">
      <span class="is-wide">
        {{ worker.id }}&nbsp;
        <BaseCopy :value="worker.id" />
      </span>
      <span class="is-wide">
        {{ worker.assignmentID }}&nbsp;
        <BaseCopy :value="worker.assignmentID" />
      </span>

      <span class="is-narrow align-right">
        <div>{{ worker.started.time }}</div>
        <div class="is-small">{{ worker.started.date }}</div>
      </span>

      <span class="is-narrow align-right">
        <div>{{ worker.finished.time || '' }}</div>
        <div class="is-small">{{ worker.finished.date || '' }}</div>
      </span>

      <span class="is-narrow align-right">
        <div>{{ worker.rejected.time || '' }}</div>
        <div class="is-small">{{ worker.rejected.date || '' }}</div>
      </span>
    </BaseRow>
  </div>
</template>
<script>
import BaseCopy from '@/components/BaseCopy.vue'
import BaseRow from '@/components/BaseRow.vue'

export default {
  name: 'TableWaiting',
  components: {
    BaseCopy,
    BaseRow,
  },
  props: {
    workers: {
      type: Array,
      default: null,
    },
  },
  data: () => ({}),
}
</script>
<style lang="scss">
.Table {
  display: flex;
  flex-wrap: wrap;
}
</style>
