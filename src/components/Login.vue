<template>
  <div class="login-block">
    <h2>Sign In</h2>
    <form class="login-form" action="">
      <div>
        <label>Username or Email</label>
        <input class="form-input"type="text" v-model="username"/>
      </div>
      <div>
        <label>Password</label>
        <input class="form-input" type="password" v-model="password"/>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: ''
      }
    }
  }
</script>

<style lang="scss" scoped>

  .login-block {
    width: 25%;
    margin: 0 auto;
    text-align: left;
    box-sizing: border-box;
  }

  .form-input {
    display: block;
    padding: 10px;
    border: 1px solid #d8d3d3;
    width: 100%;
    margin: 15px 0;
  }

  button[type="submit"] {
    background: #42b882;
    padding: 10px 15px;
    border: none;
    float: right;
  }


</style>
