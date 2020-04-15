<template>
  <div class="home">
    <User v-if="user"/>
    <Login v-else/>
  </div>
</template>

<script>
import axios from 'axios';
import Login from '@/components/Login.vue';
import User from '@/components/User.vue';
export default {
  name: 'Home',
  components: {
    Login,
    User
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>
