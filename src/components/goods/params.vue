<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片界面 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon=""
      >
      </el-alert>
      <el-row>
        <el-col class="span1">
          <span> 选择商品分类 </span>
          <!-- 选择商品分类的级联选择框 -->

          <el-cascader
            v-model="selectedCateKeys"
            :options="ParamsList"
            :props="cateProps"
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDataBtn"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <!-- 动态参数表格 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  class="tag1"
                  closable
                  v-for="(items, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >
                  {{ items }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
              <!-- 索引列 --></el-table-column
            >
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDataBtn"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <!-- 静态属性表格 -->
            <el-table-column type="expand">
              <template scope="scope">
                <el-tag
                  class="tag1"
                  closable
                  v-for="(items, i) in scope.row.attr_vals"
                  :key="i"
                  @close="handleClose(i,scope.row)"
                >
                  {{ items }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
              <!-- 索引列 --></el-table-column
            >
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDataDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        ref="addDataListRef"
        :model="addDataList"
        label-width="80px"
        :rules="addDataListRules"
      >
        <el-form-item :label="activityName" prop="attr_name">
          <el-input v-model="addDataList.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataListForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDataDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form ref="editDataListRef" :model="editDataList" label-width="80px">
        <el-form-item :label="activityName" prop="attr_name">
          <el-input v-model="editDataList.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDataListForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ParamsList: [] /* 商品分类列表 */,
      cateProps: {
        /* 级联选择器的配置对象 */ value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCateKeys: [] /* 级联选择框双向绑定到的数组 */,
      activeName: "many", //被激活的页签的名称
      onlyTableData: [], //静态参数数据
      manyTableData: [], //动态参数数据
      addDataList: {
        attr_name: "",
      }, //添加参数对话框

      addDataDialogVisible: false, //添加参数对话框可视性
      addDataListRef: {},
      addDataListRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      editDataDialogVisible: false, //展示修改对话框
      editDataListRef: {},
      editDataList: [],
    };
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$http.get("categories/");
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.ParamsList = res.data;
    },
    handleChange() {
      /* 级联选择框选中项变化，会触发这个函数 */
      /* 根据所选分类的id，和当前所处的面板，获取对应的参数 */
      this.getTabPainData();

    },
    handleTabClick() {
      this.getTabPainData();
    },
    async getTabPainData() {
      const { data: res } = await this.$http.get(
        "categories/" + this.cateId + "/attributes",
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split("") : [];
        item.inputVisible = false; //控制按钮与文本框的切换显示
        item.inputValue = ""; //文本框输入的内容
        /* 写在这里而不写在data中是为了防止所有的tag公用 */
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else this.onlyTableData = res.data;
    },
    addDataBtn() {
      /* 弹出添加对话框 */

      this.addDataDialogVisible = true;
    },
    addDataListForm() {
      /* 确认添加对话框 */
      this.$refs.addDataListRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post(
          "categories/" + this.cateId + "/attributes",
          {
            attr_name: this.addDataList.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");

        this.addDataDialogVisible = false;
        this.getTabPainData();
      });
    },
    addDialogClose() {
      /* 监听添加对话框的关闭事件 */
      this.$refs.addDataListRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editDataListRef.resetFields();
    },
    async showEditDialog(id) {
      /* 展示修改对话框 */
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName, //查询当前参数的Id
          },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.editDataList = res.data;

      this.editDataDialogVisible = true;
    },
    editDataListForm() {
      //监听修改确认
      this.$refs.editDataListRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editDataList.attr_id}`,
          {
            attr_name: this.editDataList.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("请求失败");
        this.$message.success("请求成功");
        this.getTabPainData();
        this.editDataDialogVisible = false;
      });
    },
    async deleteData(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消了删除");

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getTabPainData();
    },
    async handleInputConfirm(row) {
    
      //文本框失去焦点或者按下回车都会触发
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      //如果没有return证明由输入内容，等待用户后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveData(row);
      
    },
    async saveData(row) {
      //需要发起请求保存该次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(""),
          attr_sel: row.attr_sel,
        }
      );
      
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      
    },
    showInput(scope) {
      //点击隐藏按钮，显示文本框
      scope.inputVisible = true;
      this.$nextTick((_) => {
        //$nextTick方法作用 当页面上元素被重新渲染后，触发回调
        //让文本框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleClose(i,row) {
      row.attr_vals.splice(i, 1);
      this.saveData(row);
    },
  },
  computed: {
    //如果按钮需要被禁用返回true
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      else return false;
    },
    cateId() {
      if (this.selectedCateKeys.length !== 3) return null;
      return this.selectedCateKeys[2];
    },
    titleText() {
      /* 动态计算标题文本 */
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
    activityName() {
      if (this.activeName === "many") return "参数名称";
      return "属性名称";
    },
  },
  created() {
    this.getParamsList();
  },
};
</script>

<style scoped>
.span1 {
  margin: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>