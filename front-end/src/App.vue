<template>
  <div id="app">
    <div id="header">
      <img id="logo" src="/images/logo.png" alt="logo"/>
      <h1>BookGroup</h1>
      <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/books">Books</router-link>
        <router-link to="/groups">Groups</router-link>
      </div>
    </div>
    <router-view/>
    <div id="footer">
      <a href='https://github.com/benocarlson/bookgroup-website'>
        Visit the GitHub repository for this website
      </a>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
}

#nav {
  width: 50%;
  display: flex;
  justify-content: space-evenly;
}

.error {
  color: #b00;
  border: 1px solid #b00;
  border-radius: 3px;
  padding: 3px 10px;
  margin: 10px auto;
  width: 500px;
}

#footer {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 3px solid #111;
  background: #FFF;
  margin-top: 40px;
}

#footer a {
  padding: 30px;
  border-radius: 10px;
}

#footer a:link, #footer a:visited {
  background: #999;
  color: #000;
  text-decoration: none;
}

#footer a:hover, #footer a:visited:hover {
  background: #666;
  color: #000;
}
</style>
