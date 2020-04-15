<template>
  <div class="groups">
    <div class="header">
      <h2>Groups</h2>
      <input placeholder="Search groups" v-model="searchText" type="text"/>
      <div class="create" @click="setCreating">
        Add a New Group
      </div>
    </div>
    <p v-if="error" class="error">{{error}}</p>
    <div class="create-group" v-if="creating">
      <p v-if="!user" class="error">You must be signed in to create a group!</p>
      <form v-else>
        <input placeholder="Group Name" v-model="name">
        <textarea placeholder="Description" v-model="description"/>
        <button type="button" @click="stopCreating">Cancel</button>
        <button type="submit" @click.prevent="create">Done</button>
      </form>
    </div> 
    <GroupList :groups="displayGroups"/>
  </div>
</template>

<script>
import axios from 'axios';
import GroupList from '@/components/GroupList.vue';
export default {
  name: 'Groups',
  data() {
    return {
      searchText: '',
      creating: false,
      error: '',
      name: '',
      description: '',
      groups: []
    }
  },
  created() {
    this.getGroups();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    displayGroups() {
      if (!this.searchText) {
        return this.groups;
      } else {
        return this.groups.filter(group => group.name.toLowerCase().search(this.searchText.toLowerCase()) >= 0);
      }
    }
  },

}
</script>