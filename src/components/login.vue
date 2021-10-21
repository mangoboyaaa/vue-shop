<template>
  <div class="back">
    <div class="zhuce">
      <div class="touxiang">
        <!-- 顶部头像 -->
        <img class="tupian1" src="../assets/logo.png" alt="" />
      </div>
      <el-form
        ref="biaodan"
        :rules="loginFormRules"
        :model="loginForm"
        class="zhongjian"
        label-width="0px"
      >
        <el-form-item class="elform" prop="username">
          <!-- 用户名 -->
          <el-input
            v-model="loginForm.username"
            class="input1"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item class="elform" prop="password">
          <!-- 密码 -->
          <el-input
            type="password"
            v-model="loginForm.password"
            class="input1"
            prefix-icon="el-icon-s-platform"
          ></el-input>
        </el-form-item>
        <el-form-item class="button1">
          <!-- 按钮 -->
          <el-button type="primary" @click="denglu">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在3到10个字符",
            trigger: "blur",
          },
        ] /* 验证用户名 */,
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            in: 3,
            max: 10,
            message: "长度在3到10个字符",
            trigger: "blur",
          },
        ] /* 验证密码 */,
      },
    };
  },
  methods: {
    reset() {
      //重置表单（element ui方法）
      this.$refs.biaodan.resetFields();
    },

    denglu() {
      //登录验证（element ui方法）
      this.$refs.biaodan.validate(async (value) => {
        if (!value) {
          return;
        }
        //利用 await以及async将promiss简化
        /* 解构赋值 */ const { data: res } = await this.$http.post(
          "login",
          this.loginForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("登陆失败");
        } else {
          this.$message.success("登陆成功");
          /* 将登陆成功后的token存放在sessionStorage
         （项目中只要出现其他接口，就必须登陆在能访问，token只在当前打开页面生效，所以保存在sessionstorage）
 */
          window.sessionStorage.setItem("token", res.data.token);
          /* 通过编程式导航跳转 */
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>

<style scoped>
.back {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.zhuce {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 3px;
}
.touxiang {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;

  box-shadow: 0 0 10px greenyellow;
  margin-left: 150px;
  margin-top: -100px;
  background-color: white;
}
.tupian1 {
  height: 100%;
  width: 100%;

  left: 50%;
  border-radius: 50%;
  border: 1px solid green;
}

.button1 {
  padding-left: 145px;
}
.zhongjian {
  margin-top: 30px;
}
.input1 {
  width: 350px;
}
.elform {
  margin-left: 50px;
}
</style>