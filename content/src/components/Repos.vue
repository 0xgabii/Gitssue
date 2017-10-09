<template>
  <div class="repos">
    repos

    <div 
      class="repos__repo" 
      v-for="item in transformData"
      :key="item.id">
      {{item.name}} | {{item.issues}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Repos',
  props: {
    data: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    transformData() {
      return this.data.map(({
        id,
        name,
        full_name,
        open_issues_count,
        permissions,
      }) => ({
        id,
        name: permissions.admin ? name : full_name,
        issues: open_issues_count,
      }));
    },
  },
};
</script>
