<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
           
            clearable
            
          >
            <el-button
              slot="append"
              icon="el-icon-search"
             
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addRolesVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" boeder stripe>
        <!-- 角色列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二、三级权限 -->
              <el-col :span="19">
                <!-- 通过循环渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="rolesEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="rolesDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editRolesClosed"
    >
      <el-form :model="editRolesForm" ref="editRolesFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="email">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolesClosed"
    >
      <el-form
        :model="addRolesForm"
        ref="addRolesFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形空间 -->
      <el-tree
        show-checkbox
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
     
      editRolesVisible: false,
      editRolesForm: {},
      addRolesVisible: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      roleId:'',
      defKeys: [] /* 三级节点勾选 */,
      treeProps: {
        label: "authName",
        children: "children",
      },
      rightsList: [], //获取权限列表
      setRightDialogVisible: false,
    };
  },

  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      console.log(res.data);
      console.log(this.$refs);
    },
    async rolesEdit(id) {
      this.editRolesVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.editRolesForm = res.data;
      console.log(this.editRolesForm);
    },
    async rolesDelete(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getRolesList();
    },
    editRolesClosed() {
      this.$refs.editRolesFormRef.resetFields();
    },
    addRolesClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },
    editRolesInfo() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );

        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.editRolesVisible = false;
        this.getRolesList();
        return this.$message.success("修改成功");
      });
    },
    addRoles() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.addRolesVisible = false;
        this.getRolesList();
      });
    },
    
    async removeRightById(role, rightId) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      /* this.getRolesList()
       */
      roles.children = res.data;
    },
    async showSetRightDialog(role) {
      //展示分配权限的对话框
      //获取所有权限数据
      this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("请求权限失败");
      this.rightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    getLeafKeys(node, arr) {
      /* 通过递归获取角色下所有三级权限的id并保存到defKeys */
      if (!node.children)
        /* 如果当前node节点没有children属性，则为三级节点 */
        return arr.push(node.id);
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed(){ /* 监听分配权限对话框的关闭事件 */
       this.defKeys=[]
    },
    async allowRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
     const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
     if(res.meta.status!==200) return this.$message.error('请求失败')
       this.getRolesList()
       this.setRightDialogVisible=false
   
   
   
   }
  },
  created() {
    this.getRolesList();
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px, solid, #eee;
}
.bdbottom {
  border-bottom: 1px, solid, #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>