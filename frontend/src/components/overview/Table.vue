<template>
  <div class="Table">
    <BaseRow light v-if="!experiments">
      <span class="is-loading">Title</span>
      <span class="is-loading is-wide">Description</span>
      <span class="is-loading is-narrow align-right">Available</span>
      <span class="is-loading is-narrow align-right">Pending</span>
      <span class="is-loading is-narrow align-right">Waiting</span>
      <span class="is-loading is-narrow align-right">Completed</span>
      <span class="is-loading is-narrow">blub</span>
    </BaseRow>

    <BaseRow light v-else>
      <span>Title</span>
      <span class="is-wide">Description</span>
      <span class="is-narrow align-right">Available</span>
      <span class="is-narrow align-right">Pending</span>
      <span class="is-narrow align-right">Waiting for approval</span>
      <span class="is-narrow align-right">Completed</span>
      <span class="is-narrow"></span>
    </BaseRow>
    
    <BaseRow bold v-for="experiment in experiments" :key="experiment._id">
      <span class="Anchor" @click="onExperimentClick(experiment)">
        {{experiment.internalName}}&nbsp;<i class="far fa-edit"></i>
      </span>
      <span class="is-wide">{{experiment.description}}</span>
      <span class="is-narrow align-right">{{experiment.available}}</span>
      <span class="is-narrow align-right">{{experiment.pending}}</span>
      <span class="is-narrow align-right">{{experiment.waitingForApproval}}</span>
      <span class="is-narrow align-right">{{experiment.completed}}</span>
      <span class="is-narrow align-center">
        <BaseButtons second square title="new hit" v-if="experiment.endpoint!=='development'" @click="onNewHitClick(experiment)" />
      </span>

      <BaseRow v-for="hit in experiment.hits" :key="hit.id">
        <span class="Anchor" @click="onHitClick(hit)">HIT</span>
        <span class="is-wide">{{hit.id}}&nbsp;
          <BaseCopy :value="hit.id" />
        </span>
        <span class="is-narrow align-right">{{hit.available}}</span>
        <span class="is-narrow align-right">{{hit.pending}}</span>
        <span class="is-narrow align-right">{{hit.waitingForApproval}}</span>
        <span class="is-narrow align-right">{{hit.completed}}</span>
        <span class="is-narrow align-center">
          <span class="Anchor" @click="onHitDeleteClick(hit)"></span>
        </span>
      </BaseRow>

    </BaseRow>
  </div>
</template>
<script>
import BaseButtons from "../BaseButton.vue";
import BaseCopy from "../BaseCopy.vue";
import BaseRow from "../BaseRow.vue";

export default {
  name: "Tags",
  components: {
    BaseButtons,
    BaseCopy,
    BaseRow,
  },
  props: {
    experiments: {
      type: Array,
      default: null
    },
  },
  data: () => ({}),
  methods: {
    onExperimentClick(experiment) {
      this.$router.push({
        name: 'settings',
        query: { id: experiment._id },
        params: { experiment: experiment, initial: false }
      });
    },
    onHitClick(hit) {
      this.$router.push({
        name: 'workers',
        params: {
          id: hit.id,
          title: hit.title,
          creationTime: hit.creationTime
        },
        query: { id: hit.id },
      });
    },
    onNewHitClick(experiment) {
      this.$emit('createHIT', experiment);
    },
    onHitDeleteClick(hit) {
      this.$emit('onHitDeleteClick', hit);
    }
  }
};

</script>
<style lang="scss">
.Table {
  display: flex;
  flex-wrap: wrap;
}

</style>
