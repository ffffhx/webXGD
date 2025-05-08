<!-- src/components/layout/BasePage.vue -->
<template>
  <div class="base-page">
    <slot />
  </div>
</template>

<style scoped>
.base-page {
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  background-color: #fff;
  /* background-color: #6f4141; */
}
</style>
