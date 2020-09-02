<template>
  <div>
    <router-link to="./" class="header">
      <img src="../assets/logo.png" class='logo'/>
      <h2 class="title">Arweave Avatar</h2>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style scoped>

.header {
  display: flex;
  margin: 2rem auto;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: #000;
}

.logo {
  margin-right: 1rem;
  width: 100px;
  height: 100px;

  animation-name: jump;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
  animation-duration: 2s;
}

@keyframes jump {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-30px);}
  60% {transform: translateY(-15px);}
}
</style>
