<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderDataList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="300">
          <template scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showprogressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
     <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="addressVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="editForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流信息的对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%"
  >
  <!-- 时间线 -->
    <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  
</el-dialog>

  </div>
</template>

<script>
import citydata from './citydata'
export default {
  
  data() {
    return {
      orderDataList: [],
      queryInfo: {
        query: '',
        //   当前页数
        pagenum: 1,
        // 当前页显示多少条数据
        pagesize:1,
      },
      editForm:{
        address1:[],
        address2:''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: `blur` },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: `blur` },
        ],
      },

      total: 0,
      addressVisible:false,  //编辑地址的对话框的显示
      progressVisible:false,  //物流信息对话框的显示
          citydata,  //级联选择器中的数据源
          progressInfo:[] //物流信息
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      
      this.orderDataList = res.data.goods;
      this.total=res.data.total
     
    },
    //展示物流进度的对话框
    async showprogressBox(){
  const {data:res}=await this.$http.get('/kuaidi/1106975712662')
  console.log(res)
  if(res.meta.status!==200) return this.$message.error('获取失败')
       this.progressInfo=res.data
       this.progressVisible=true
       
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showBox(){
         this.addressVisible=true
    },
    editDialogClosed(){
       this.$refs.editFormRef.resetFields()
    }
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>