<template>
  <div class="user-view">
    <div class="header">
      <h2>{{user.firstName}} {{user.lastName}}</h2>
      <div class="tab" @click="showFaves">
        Favorites
      </div>
      <div class="tab" @click="showGroups">
        My Groups
      </div>
      <div class="tab" @click="logout">
        Log Out
      </div>
    </div>
    <p class='error' v-if="error">{{error}}</p>
    <div class="favorites-view" v-if="showing === 'faves'">
      <p class="empty" v-if="favorites.length === 0">You have not marked any books as favorite!</p>
      <BookList @refresh="refresh" :books="favorites"/>
    </div>
    <div class="groups-view" v-if="showing === 'groups'">
      <p class="empty" v-if="groups.length === 0">You are not a member of any groups!</p>
      <GroupList :groups="groups"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BookList from '@/components/BookList.vue';
import GroupList from '@/components/GroupList.vue';
export default {
  name: 'User',
  components: {
    BookList,
    GroupList
  },
  created() {
    this.refresh();
  },
  data() {
    return {
      showing: 'faves',
      error: '',
      allGroups: []
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    favorites() {
      return this.$root.$data.user.favorites;
    },
    groups() {
      return this.allGroups.filter(group => group.members.includes(this.$root.$data.user._id));
    }
  },
  methods: {
    async refresh() {
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
        let gresponse = await axios.get('/api/groups');
        this.allGroups = gresponse.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    showFaves() {
      this.showing = 'faves';
    },
    showGroups() {
      this.showing = 'groups';
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>