<template>
  <div class="group-view">
    <div class="header">
      <div class='info'>
        <h2>{{group.name}}</h2>
        <h3>{{group.description}}</h3>
      </div>
      <div v-if="isMember" class='member-controls'>
        <div class='tab' @click='setSharing'>Share a Book</div>
        <div class='tab' v-if="isAdmin" @click='deleteGroup'>Delete Group</div>
        <div class='tab' v-else @click='leave'>Leave Group</div>
      </div>
      <div class='tab' v-else @click='join'>Join Group</div>
    </div>
    <form v-if="sharing" class="new-book pure-form">
      <fieldset>
        <select class="select-book" v-model="selection">
          <option v-for="book in books" :key="book._id" :value="book">{{book.title}}</option>
        </select>
        <button class="pure-button" type="button" @click="stopSharing">Cancel</button>
        <button class="pure-button" type="submit" :disabled="!selection" @click.prevent="addBook">Share to Group</button>
      </fieldset>
      <img v-if="selection" :src="selection.coverImagePath"/>
    </form>
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
      if (!this.selection) return;
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

<style scoped>

.group-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.member-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.new-book {
  padding: 5px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #BBB;
  border-radius: 10px;
}

.new-book button, .new-book select {
  margin: 10px;
}

.info {
  width: 50%;
}

.info h2, .info h3 {
  width: 100%;
}

.new-book img {
  max-width: 200px;
  margin: 10px;
}

</style>