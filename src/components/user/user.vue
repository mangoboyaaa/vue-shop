<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 卡片 -->
      <!-- 搜索 添加 -->

      <el-row>
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            class="button1"
            type="primary"
            @click="addDialogVisible = true"
          >
            添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="grey"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!-- 分页 -->
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>  <!-- 修改用户的对话框 -->
    <el-dialog    
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
 @close="editDialogClosed"
 >
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
  <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {

    var checkEmail=(rule,value,cb)=>{   /* 验证邮箱 */
       const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value))
      {
        return cb()
      }
    cb(new Error('请输入合法邮箱'))
   };
    var checkMobile=(rule,value,cb)=>{  /* 验证手机号 */
      const regMobile =/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if(regMobile.test(value))
      {
        return cb()
      }
   cb(new Error('请输入合法手机号'))
    };
    return {
      queryInfo: {
        //获取用户列表的参数对象
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false /* 添加用户对话框 */,
      addForm: {
        username:'',
        email:'',
        mobile:'',
        password:''
      },
      editForm:{

      },  /* 修改用户暂存 */
      editDialogVisible:false,  /* 修改用户对话框 */
      addFormRules:{
        username:[
          {
            required:true,message:'请输入用户名',trigger:'blur'
          },{
            min:3,
            max:10,
            message:'用户名的长度在3~10个长度之间'
          }
        ],
        email:[{
            required:true,message:'请输入邮箱',trigger:'blur'
          },{
 validator:checkEmail,trigger:'blur'/* 自定义规则 */
          }],
        mobile:[{
            required:true,message:'请输入手机号',trigger:'blur'
          },{
 validator:checkMobile,trigger:'blur' /* 自定义规则 */
          }],
        password:[{
            required:true,message:'请输入密码',trigger:'blur'
          },{
            min:6,
            max:15,
            message:'密码的长度在6~15个长度之间'
          }]
      },
      editFormRules:{
        email:[{
            required:true,message:'请输入邮箱',trigger:'blur'
          },{
 validator:checkEmail,trigger:'blur'/* 自定义规则 */
          }],
        mobile:[{
            required:true,message:'请输入手机号',trigger:'blur'
          },{
 validator:checkMobile,trigger:'blur' /* 自定义规则 */
          }],
      }
    };
  },
  methods: {

    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
    async userStateChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );

      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.access("更新用户状态成功");
    },
    addDialogClose(){
         /* 监听添加用户对话框的关闭事件 */
         this.$refs.addFormRef.resetFields()
    },
    addUser(){  /* 添加新用户 */
         this.$refs.addFormRef.validate(async valid=>{
           if(!valid) return
           /* 可以发起添加用户的网络请求 */
          const {data:res}=await this.$http.post('users',this.addForm)
      if(res.meta.status!==201){
        this.$message.error('添加用户失败')
      }
      this.$message.success('添加用户成功')
      this.addDialogVisible = false
      this.getUserList()
         })
    },
    async showEditDialog(id){  /* 修改用户信息 */
     this.editDialogVisible=true
     const {data:res}=await this.$http.get('users/'+id)
     if(res.meta.status!==200) return this.$message.error('查询失败')
     this.editForm=res.data
 
 },
 editDialogClosed(){   /* 监听修改对话框的关闭事件 */
       this.$refs.editFormRef.resetFields()
 },
 editUserInfo(){
     this.$refs.editFormRef.validate(async valid=>{  /* 调用$ref上的eidtform上的balidate方法进行表单验证 */
       if(!valid) return
       const {data:res} =await this.$http.put('users/'+this.editForm.id,{
        email:this.editForm.email,mobile:this.editForm.mobile
       })
       if(res.meta.status!==200) return this.$message.error('修改失败')
      
      
      this.editDialogVisible=false
      this.getUserList() /* 刷新用户列表 */
      return this.$message.success('修改成功')

     })
 },
 async removeUserById(id){
     const confirmResult= await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          /* 如果用户确认删除，则返回值为字符串 confirm
             如果取消删除，返回字符串cancel */
        }).catch(err=> err)  /* 箭头函数简写 */
         if(confirmResult!=='confirm')
          return this.$message.info('已取消')
      const{data:res}=  await this.$http.delete('users/'+id)
    if(res.meta.status!==200) return this.$message.error('删除失败')
         
    this.$message.success('删除成功')
    this.getUserList()


         
  },
  },
  
  created() {
    this.getUserList();
  },
  
};
</script>

<style scoped>
.button1 {
  margin-left: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 15px;
}
</style>