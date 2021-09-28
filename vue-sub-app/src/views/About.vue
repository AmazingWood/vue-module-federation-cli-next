<template>
  <div class="about">
    <h1>This is an about page</h1>
    <blue-box welcome-word="From Sub App Remote Component" />
  </div>
</template>
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    BlueBox: defineAsyncComponent(() => import('motherApp/BlueBox'))
  }
}
</script>
