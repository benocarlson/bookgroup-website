<template>
  <div class="login">
    <form class="inputs pure-form">
      <fieldset>
        <legend>Register with BookGroup</legend>
        <input placeholder="first name" v-model="firstName">
        <input placeholder="last name" v-model="lastName">
      </fieldset>
      <fieldset>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button" :disabled="disableRegister" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="registerError" class='error'>{{registerError}}</p>
    <form class="inputs pure-form">
      <fieldset>
        <legend>Login</legend>
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button" :disabled="disableLogin" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="loginError" class="error">{{loginError}}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      registerError: '',
      loginError: '',
    }
  },
  computed: {
    disableRegister() {
      return !this.firstName || !this.lastName || !this.username || !this.password;
    },
    disableLogin() {
      return !this.usernameLogin || !this.passwordLogin;
    }
  },
  methods: {
    async register() {
      this.registerError = '';
      this.loginError = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password) {
        this.registerError = 'Please fill out all fields!';
        return;
      }
      try {
        let response = await axios.post('/api/users', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.registerError = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.registerError = '';
      this.loginError = '';
      if (!this.usernameLogin || !this.passwordLogin) {
        this.loginError = 'Please fill out both fields!';
        return;
      }
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.loginError = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputs {
  width: 75%;
  border: 1px solid #777;
  border-radius: 5px;
  margin: 20px;
}

input {
  margin: 10px;
}

</style>