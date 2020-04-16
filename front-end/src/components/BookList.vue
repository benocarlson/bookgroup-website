<template>
  <div class="booklist">
    <p v-if="error" class="error">{{error}}</p>
    <div class="books">
      <div class="book" v-for="book in books" :key="book._id">
        <div class="title">
        <h2>{{book.title}}</h2><a v-if="user" class="favorindicator" @click="toggleFave(book)"> <i :class="'fas fa-star ' + faveStatus(book)"></i></a>
        </div>
        <h3>by {{book.author}}</h3>
        <img :src="book.coverImagePath" />
        <p>{{book.description}}</p>
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
          await axios.put("/api/users/fave/" + book._id);
        } else {
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

.booklist {
  width: 100%;
}

.fave {
  color: gold;
}

.no-fave {
  color: #bbb;
}

.book img {
  max-width: 70%;
}

.books {
  display: flex;
  flex-wrap: wrap;
}

.book {
  width: 40%;
  margin: 4%;
  background: #aac;
  border-radius: 10px;
}

.title {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.favorindicator {
  background: #229;
  border-radius: 50%;
  padding: 5px;
}

.favorindicator:hover {
  background: #669;
  cursor: pointer;
}

</style>