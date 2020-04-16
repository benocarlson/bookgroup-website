<template>
  <div>
    <div class="header">
      <h2>Books</h2>
      <input placeholder="Search all books" v-model="searchText" type="text"/>
      <div class="tab" @click="setCreating">
        Add a new Book
      </div>
    </div>
    <p v-if="error" class="error">{{error}}</p>
    <div id="create-book" v-if="creating">
      <form @submit.prevent="upload" class="pure-form">
        <fieldset>
          <input placeholder="Title" v-model="title">
        </fieldset>
        <fieldset>
          <input placeholder="Author" v-model="author">
        </fieldset>
        <fieldset>
          <div class="image-input" @click="chooseImage">
            <img class="upload-image" v-if="url" :src="url" />
            <div v-if="!url" class="placeholder">
              Upload a Photo of the Cover
            </div>
            <input class="fileInput" ref="fileInput" type="file" @input="fileChanged">
          </div> 
        </fieldset>
        <fieldset>
          <textarea placeholder="Description" v-model="description"/>
        </fieldset>
        <fieldset>
          <button class="pure-button" type="button" @click="stopCreating">Cancel</button>
          <button class="pure-button" :disabled="missingFields" type="submit">Done</button>
        </fieldset>
      </form>
    </div>
    <BookList @refresh="getBooks" :books="displayBooks"/>
  </div>
</template>

<script>
import axios from 'axios'
import BookList from '@/components/BookList.vue'
export default {
  name: "Books",
  components: {
    BookList
  },
  data() {
    return {
      searchText: '',
      creating: false,
      books: [],
      title: '',
      author: '',
      description: '',
      url: '',
      file: null,
      error: '',
    }
  },
  created() {
    this.getBooks();
  },
  computed: {
    displayBooks() {
      if (!this.searchText) {
        return this.books;
      } else {
        return this.books.filter(book => book.title.toLowerCase().search(this.searchText.toLowerCase()) >= 0);
      }
    },
    missingFields() {
      return !this.file || !this.title || !this.author;
    }
  },
  methods: {
    async getBooks() {
      try {
        this.response = await axios.get("/api/books");
        this.books = this.response.data;
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    fileChanged(event) {
      this.file = event.target.files[0];
      this.url = URL.createObjectURL(this.file)
    },
    setCreating() {
      this.creating = true;
    },
    stopCreating() {
      this.creating = false;
      this.author = '';
      this.title = '';
      this.url = '';
      this.file = null;
    },
    chooseImage() {
      this.$refs.fileInput.click()
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('book', this.file, this.file.name);
        formData.append('title', this.title);
        formData.append('author', this.author);
        formData.append('description', this.description);
        await axios.post("/api/books", formData);
        this.file = null;
        this.url = "";
        this.title = "";
        this.author = "";
        this.description = "";
        this.creating = false;
        this.getBooks();
      } catch (error) {
        this.error = error.response.data.message;
      }
    }
  }
}
</script>

<style scoped>

form {
  margin: 10px auto;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #55a;
  border-radius: 5px;
}

.image-input img {
  max-width: 75%;
}

.fileInput {
  display: none;
}

.placeholder {
  background: #DDF;
  width: 200px;
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
}

.placeholder:hover {
  background: #e6e6ff;
}

button {
  margin: 5px;
}
</style>