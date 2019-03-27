<template>
  <div class="Table">
    <BaseRow light v-if="!workers">
      <span class="is-loading  is-wide">WorkerID</span>
      <span class="is-loading  is-wide">AssignmentID</span>
      <span class="is-loading  is-narrow align-right">Started</span>
      <span class="is-loading  is-narrow align-right">Finished</span>
      <span class="is-loading  align-right">Accept / Reject</span>
    </BaseRow>

    <BaseRow light v-else>
      <span class="is-wide">WorkerID</span>
      <span class="is-wide">AssignmentID</span>
      <span class="is-narrow align-right">Started</span>
      <span class="is-narrow align-right">Finished</span>
      <span class="align-right">Accept / Reject</span>
    </BaseRow>

    <BaseRow v-for="worker in workers" :key="worker.id">
      <span class="is-wide">{{worker.id}}&nbsp;
        <BaseCopy :value="worker.assignmentID" />
      </span>
      <span class="is-wide">{{worker.assignmentID}}&nbsp;
        <BaseCopy :value="worker.assignmentID" />
      </span>

      <span class="is-narrow align-right">
        <div>{{worker.started.time}}</div>
        <div class="is-small">{{worker.started.date}}</div>
      </span>

      <span class="is-narrow align-right">
        <div>{{worker.finished.time || ''}}</div>
        <div class="is-small">{{worker.finished.date || ''}}</div>
      </span>
      <span class="align-right">
        <span class="Anchor" @click="onApprove(worker.assignmentID)">accept</span>
        &nbsp;/&nbsp;
        <span class="Anchor" @click="onReject(worker.assignmentID)">reject</span>
      </span>

    </BaseRow>
  </div>
</template>
<script>
import BaseCopy from "@/components/BaseCopy.vue";
import BaseRow from "@/components/BaseRow.vue";

export default {
  name: "TableWaiting",
  components: {
    BaseCopy,
    BaseRow,
  },
  props: {
    workers: {
      type: Array,
      default: null
    },
  },
  data: () => ({}),
  methods: {
    onApprove(id) {
      this.$emit('onApprove', id);
    },
    onReject(id) {
      this.$emit('onReject', id);
    }
  }
};

</script>
<style lang="scss">
.Table {
  display: flex;
  flex-wrap: wrap;

  [class*="fa-thumbs-"] {
    cursor: pointer;
  }
}

</style>
