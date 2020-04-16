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
  color: #000;
  background: #CCCCEE
}

#header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
}

h1 {
  font-size: 3em;
  margin-left: 10px;
}

#nav {
  width: 50%;
  display: flex;
  justify-content: space-evenly;
}

#nav a, #nav a:visited {
  color: #008;
  padding: 10px;
  background: #BBBBEE;
}

.error {
  color: #b00;
  border: 1px solid #b00;
  border-radius: 3px;
  padding: 3px 10px;
  margin: 10px auto;
  width: 500px;
}

.header {
  display: flex;
  justify-content: space-between;
  background: #88C;
  color: #000;
  align-items: center;
  width: 100%;
}

.header h2 {
  font-size: 2em;
}

.header h2, .header h3 {
  width: 50%;
  margin-left: 20px;
  text-align: left;
}

.tab {
  margin-right: 20px;
  background: #57a;
  border: 1px solid #458;
  padding: 5px;
  border-radius: 3px;
}

.tab:hover {
  background: #458;
  cursor: pointer;
}

#footer {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 3px solid #111;
  background: #88C;
  margin-top: 40px;
}

#footer a {
  padding: 30px;
  border-radius: 10px;
}

#footer a:link, #footer a:visited {
  background: #57a;
  color: #000;
  text-decoration: none;
}

#footer a:hover, #footer a:visited:hover {
  background: #458;
  color: #000;
}
</style>
