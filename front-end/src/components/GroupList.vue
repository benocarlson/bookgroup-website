<template>
  <div class="grouplist">
    <p class="error" v-if="error">{{error}}</p>
    <div class="groups">
      <div @click="viewGroup(group)" class="group" v-for="group in groups" :key="group._id">
        <h2>{{group.name}}</h2>
        <p>{{group.description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupList',
  props: {
    groups: Array
  },
  data() {
    return {
      error: ''
    }
  },
  methods: {
    viewGroup(group) {
      this.$router.push('/groups/' + group._id);
    }
  }
}
</script>

<style scoped>
.groups {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
}

.group {
  border-bottom: 1px solid #000;
  text-align: left;
}

.group:first {
  border-top: 1px solid #000;
}

.group:hover {
  background: #bbe;
}

.group h2, .group p {
  margin-left: 20px;
}
</style>