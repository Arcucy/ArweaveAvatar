<template>
  <div class="notice">
    Developed by
    <a href="https://github.com/AyakaLab">Ayaka Lab</a>
    for Project
    <a href="https://github.com/AyakaLab/ArcLight">ArcLight</a>
  </div>
</template>

<style scoped>
.notice {
  position: fixed;
  color: rgb(54, 54, 54);
  bottom: 30px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-duration: 2s;
}

@media screen and (max-width: 400px){
  .notice {
    font-size: 12px;
  }
}

a {
  text-decoration: none;
  color: #E56D9B;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
