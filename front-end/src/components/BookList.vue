<template>
  <div class="booklist">
    <p v-if="error" class="error">{{error}}</p>
    <div class="books">
      <div class="book" v-for="book in books" :key="book._id">
        <h2>{{book.title}}</h2>
        <h3>by {{book.author}}</h3>
        <img :src="book.coverImagePath" />
        <p>{{book.description}}</p>
        <p v-if="user"><a @click="toggleFave(book)"><i :class="'fas fa-star ' + faveStatus(book)"></i></a></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "BookList",
  props: {
    books: Array
  },
  data() {
    return {
      error: ''
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async toggleFave(book) {
      try {
        if (!this.$root.$data.user.favorites.map(fave => fave._id).includes(book._id)) {
          console.log("add fave");
          await axios.put("/api/users/fave/" + book._id);
        } else {
          console.log("remove fave");
          await axios.put("/api/users/unfave/" + book._id);
        }
      } catch (error) {
        this.error = error.response.data.message;
      }
      this.$emit('refresh');
    },
    faveStatus(book) {
      if (this.$root.$data.user.favorites.map(fave => fave._id).includes(book._id)) {
        return "fave";
      } else {
        return "no-fave"
      }
    },
  }

}
</script>

<style scoped>
.fave {
  color: gold;
}

.no-fave {
  color: #bbb;
}

.book img {
  max-width: 500px;
}
</style>