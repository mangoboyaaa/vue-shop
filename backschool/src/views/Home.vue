<template>
  <div class="home">
    <input type="text" v-model="word" />
    <input type="text" v-model="door" />

    <button @click="denglu">登录</button>
    <el-upload
  action="https://jsonplaceholder.typicode.com/posts/"
  list-type="picture-card"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      word: "",
      door: "",

    };
  },
  methods: {
    denglu() {
      this.$bus.a = this.word;
      this.$bus.b = this.door;
    
      this.$router.push("/home2");
    },
    
  },
};
</script>
