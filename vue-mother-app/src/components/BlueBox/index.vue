<template>
  <div class="BlueBox">
    <span>{{ welcomeWord }}</span>
    <el-button size="mini" type="primary" @click="handleClick">Element Button</el-button>
  </div>
</template>
<script>
export default {
  name: 'BlueBox',
  props: {
    welcomeWord: {
      type: String,
      default: 'A pink box with default settings'
    }
  },
  methods: {
    handleClick () {
      alert('clicker!')
    }
  }
}
</script>

<style lang="scss" scoped>
.BlueBox {
  width:300px;
  height:200px;
  line-height:1;
  margin: 0 auto;
  padding-top:60px;
  color:#fff;
  background:blue;
  border:1px solid blue;
  box-sizing: border-box;
  span {
    display:block;
    margin-bottom:30px;
  }
}
</style>
