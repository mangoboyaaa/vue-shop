<template>
  <div>
      <el-button type="info" @click="out">退出</el-button>
  </div>
</template>

<script>
export default {
     
methods:{
 out(){
   window.sessionStorage.clear()
   this.$router.push('/login')  //退出功能:1.清除token 2.跳转到初始页面
 },
}
}
</script>

<style scoped>

</style>