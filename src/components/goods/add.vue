<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 面包屑导航 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤栏 -->
      <el-steps
        :space="200"
        :active="active - 0"
        finish-status="success"
        align-center
      >
        <!-- active-0 使active从字符串转换为 数字类型 -->
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- name的改变会导致v-model绑定的值的改变，但是接收到的是一个字符串 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 复选框组 -->
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, id) in item.attr_vals"
                  :key="id"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的api地址 -->
            <el-upload
              
              action="https://lianghj.top:8888/api/private/v1/upload" 
              
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccsee"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
            v-model="addForm.goods_introduce"
            >

            </quill-editor>
              <!-- 添加商品的按钮 -->
  <el-button type="primary" class="btnedit" @click="add">
    添加商品
  </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%"
  >
   <img :src="previewPath" alt="" class="previewImg">
 
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'  //导入深拷贝所需要的包
export default {
  data() {
    return {
      active: "0", //通过这个使 步骤条和tab栏区域绑定
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        pics:[],  //图片的数组
        goods_introduce:'' ,//富文本编辑器（商品的详情描述）
        attrs:[]
      }, //添加商品的表单数据对象
      cateList: [], //商品分类列表
      addFormRules: {
        //添加的校验规则
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      }, //添加商品的验证规则
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableData: [], //动态参数列表数据
      onlyTableData: [], //静态参数列表数据
     
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewPath:'',
      previewVisible:false,
    };

  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //获取所有商品数据

      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []; //指定只能选择三级标签
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      //activeName 是当前将要到的标签页的name
      //oldactivename是当前标签页的name
      
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      if (this.active === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        );

        if (res.meta.status !== 200) return this.$message.error("请求失败");
      

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.active === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("请求失败");
      
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file){
     //处理图片预览操作
    this.previewPath=file.response.data.url
    this.previewVisible=true
    },
    handleRemove(file){
//处理图片移除操作
const filePath=file.response.data.tmp_path  //当前要移除的图片的临时路径
const i = this.addForm.pics.findIndex(x=>
x.pic===filePath)//找到所对应的图片的索引值
    this.addForm.pics.splice(i,1)
    //移除
    },  
    
    handleSuccsee(response){
//监听图片上传成功事件
     const picInfo={
       pic:response.data.tmp_path
     }  //拿到对象
     this.addForm.pics.push(picInfo) //将图片放到addform
     console.log(this.addForm.pics)
    },
     add(){

  this.$refs.addFormRef.validate(async valid=>{
    if(!valid)
    return this.$message.error('请填写必要的表单项') //校验表单
 
  //lodash(在本组件的行为区导入) cloneDeep(obj) 实现深拷贝
  const form=_.cloneDeep(this.addForm)
    form.goods_cat=form.goods_cat.join(',')
   
    //处理动态参数
   this.manyTableData.forEach(item=>{
     const newInfo={
       attr_id: item.attr_id,
       attr_values:item.attr_vals.join(' ')
     }
     this.addForm.attrs.push(newInfo)
   })
    //处理动态属性
    this.onlyTableData.forEach(item=>{
      const newInfo={
        attr_id:item.attr_id,
        attr_values:item.attr_values
      }
      this.addForm.attrs.push(newInfo)
    })
    form.attrs=this.addForm.attrs
     console.log(form)
     const {data:res}=await this.$http.post('goods',form)
     if(res.meta.status!==201) return this.$message.error('请求失败')
      this.$message.success('请求成功')
      this.$router.push('/goods')
      
       })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2];
      return null;
    },
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnedit{
  margin-top: 15px;
}
</style>