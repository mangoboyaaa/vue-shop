<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cataList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="tree"
      >
        <!-- 是否有效 -->
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0"> 一级 </el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >
            二级
          </el-tag>
          <el-tag size="mini" type="warning" v-else> 三级 </el-tag>
        </template>
        <template slot="opt" scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">
            编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-edit"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 商品分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50"
    @close="addCateDialogClose">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRoles"
        :ref="addCateFormRef"
        label-width="100px"
        
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="addCateForm"
        :rules="addCateFormRoles"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="父级分类" prop="cat_pid">
          <div class="block">
            <!-- options用来指定数据源 props用来指定配置对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              expandTrigger="hover"
              :props="cascaderProps"
              @change="handleChange"
              clearable

              change-on-select
            
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
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
      cataList: [], //商品分类的数据列表
      querInfo: {
        /* 查询条件 */
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      addCateDialogVisible: false, //控制分类对话框的显示与删除
      selectedKeys: [] /* 选中的选择器的级别数组 */,
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", //表示当前列定义为模板列
          template: "isok", //表示当前列使用模板名称
        },
        {
          label: "排序",
          type: "template", //表示当前列定义为模板列
          template: "order", //表示当前列使用模板名称
        },
        {
          label: "操作",
          type: "template", //表示当前列定义为模板列
          template: "opt", //表示当前列使用模板名称
        },
      ],
      addCateForm: {
        cat_name: "", //将要添加的分类名称
        cat_pid: 0, //父级分类的id
        cat_level: 0, //分类的等级，默认添加的是一级分类
      }, //添加分类的表单
      addCateFormRoles: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      }, //添加分类表单的校验规则
      addCateFormRef: {},
      total: 0, //总数据条数
      parentCateList: [], //父级分类列表
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", this.querInfo);
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.cataList = res.data;
      this.total = res.data.length;
     
    },
    handleSizeChange(newSize) {
      //监听pagesize改变
      (this.querInfo.pagesize = newSize), this.getCateList();
    },
    handleCurrentChange(newPage) {
      //监听pagenum的改变
      (this.querInfo.pagenum = newPage), this.getCateList();
    },
    showCateDialog() {
      //先获取父级的数据列表
      this.getParentCateDialog();
      this.addCateDialogVisible = true;
    },
    async getParentCateDialog() {
      //获取父级分类的数据列表
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.parentCateList = res.data;
    },
    handleChange() {
      //如果selectedkeys中数组的length大于0 说明选中的父级分类，反之说明没有选择任何父级分类
     if(this.selectedKeys.length>0)
        {
            
            this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level=this.selectedKeys.length
        return
        } 
        else{
            this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0

        }
    
    },
    //添加表单的确定按钮方法
     addCate(){
         this.$refs.addCateFormRef.validate(async valid=>{
           if(!valid) return
          const {data:res}=await this.$http.post('categories',this.addCateForm)
          if(res.meta.status!==201)
          return this.$message.error('请求失败')
          this.$message.success('请求成功')
          this.addCateDialogVisible=false
          this.getCateList()
         })
    },
    addCateDialogClose(){
        //监听对话框的关闭事件
     
      
        this.selectedKeys=[]
         this.addCateForm.cat_name=''
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
    
   
    }
  },
  created() {
    this.getCateList();
  },
};
</script>

<style scoped>
.tree {
  margin-top: 15px;
}
</style>