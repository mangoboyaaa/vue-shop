<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="listInfo.query"
            clearable
            @clear="getList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addGoods"> 添加商品 </el-button>
        </el-col>
      </el-row>
      <!-- 索引列 -->
      <el-table :data="goodslist" stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="60"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="goodsedit(scope.row.goods_id)">
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="goodsdelete(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--  分页功能 -->

      <el-pagination
        @size-change="listSizeChange"
        @current-change="listCurrentChange"
        :current-page="listInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="listInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodslist: [], //商品列表
      listInfo: {
        query: "", //查询参数对象
        pagenum: 1,
        pagesize: 10,
      },
      total: 0, //商品总数
    };
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.listInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    listSizeChange(newSize) {
      this.listInfo.pagesize = newSize;
      this.getList();
    },
    listCurrentChange(newPage) {
      this.listInfo.pagenum = newPage;
      this.getList();
    },
   async goodsdelete(id){
        
        const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => err);
        if(confirmResult !== 'confirm') return this.$message.info('取消了删除')
        const {data:res} = await this.$http.delete('goods/'+id)  
        if(res.meta.status!==200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getList()
    },
    async goodsedit(id){
        const {data:res} = await this.$http.put('goods/'+id,{

        })
        if(res.meta.status!==201) return this.$message.error(请求失败)
        this.$message.success('请求成功')

    },
    addGoods(){
        this.$router.push('/goods/add')
    }
  },
  created() {
    this.getList();
  },
};
</script>

<style scoped>
</style>