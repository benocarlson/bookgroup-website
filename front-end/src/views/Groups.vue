<template>
  <div class="groups">
    <div class="header">
      <h2>Groups</h2>
      <input placeholder="Search groups" v-model="searchText" type="text"/>
      <div class="tab" @click="setCreating">
        Add a New Group
      </div>
    </div>
    <p v-if="error" class="error">{{error}}</p>
    <div class="create-group" v-if="creating">
      <p v-if="!user" class="error">You must be signed in to create a group!</p>
      <form v-else class="pure-form">
        <fieldset>
          <input placeholder="Group Name" v-model="name">
        </fieldset>
        <fieldset>
          <textarea placeholder="Description" v-model="description"/>
        </fieldset>
        <fieldset>
          <button class="pure-button" type="button" @click="stopCreating">Cancel</button>
          <button class="pure-button" :disabled="!name" type="submit" @click.prevent="create">Done</button>
        </fieldset>
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
  components: {
    GroupList
  },
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
    this.getUser();
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
  methods: {
    async getUser() {
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getGroups() {
      try {
        this.error = '';
        this.response = await axios.get("/api/groups");
        this.groups = this.response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    setCreating() {
      this.creating = true;
    },
    stopCreating() {
      this.creating = false;
      this.name = '';
      this.description = '';
    },
    async create() {
      try {
        this.error = '';
        await axios.post("/api/groups", {
          name: this.name,
          description: this.description
        });
        this.creating = false;
        this.name = '';
        this.description = '';
        this.getGroups();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
  }
}
</script>

<style scoped>
form {
  width: 50%;
  border: 1px solid #55a;
  border-radius: 4px;
  margin: 20px;
}

form button {
  margin: 5px;
}
.create-group {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>