<template>
  <div>
    <div class="header">
      <div class='info'>
      <h1>{{group.name}}</h1>
      <h3>{{group.description}}</h3>
      </div>
      <div v-if="isMember" class='member-controls'>
        <button @click='setSharing'>Share a Book</button>
        <button v-if="isAdmin" @click='deleteGroup'>Delete Group</button>
        <button v-else @click='leave'>Leave Group</button>
      </div>
      <button v-else @click='join'>Join Group</button>
    </div>
    <div v-if="sharing" class="new-book">
      <select class="select-book" v-model="selection">
        <option v-for="book in books" :key="book._id" :value="book">{{book.title}}</option>
      </select>
      <button @click="stopSharing">Cancel</button>
      <button @click="addBook">Share to Group</button>
      <img v-if="selection" :src="selection.coverImagePath"/>
    </div>
    <BookList :books='groupBooks'/>
  </div>
</template>

<script>
import axios from 'axios';
import BookList from '@/components/BookList.vue';
export default {
  name: 'Group',
  components: {
    BookList,
  },
  data() {
    return {
      group: null,
      error: '',
      books: [],
      sharing: false,
      selection: ''
    }
  },
  created() {
    this.refresh();
  },
  computed: {
    groupBooks() {
      return this.group.books;
    },
    isMember() {
      if (!this.$root.$data.user) {
        return false;
      }
      return this.group.members.includes(this.$root.$data.user._id);
    },
    isAdmin() {
      return this.group.owner == this.$root.$data.user._id;
    }
  },
  methods: {
    async refresh() {
      try {
        let response = await axios.get("/api/books/");
        this.books = response.data;
        this.response = await axios.get("/api/groups/" + this.$route.params.id);
        this.group = this.response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async leave() {
      try {
        await axios.put("/api/groups/leave/" + this.group._id);
        this.refresh();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async join() {
      try {
        await axios.put("/api/groups/join/" + this.group._id);
        this.refresh();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async deleteGroup() {
      try {
        await axios.delete("/api/groups/" + this.group._id);
        this.$router.push("/groups");
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    setSharing() {
      this.sharing = true;
    },
    stopSharing() {
      this.sharing = false;
      this.selection = '';
    },
    async addBook() {
      try {
        await axios.put("/api/groups/add/" + this.group._id + "/" + this.selection._id);
        this.sharing = false;
        this.selection = '';
        this.refresh();
      } catch (error) {
        this.error = error.response.data.message;
      }
    }
  }
}
</script>