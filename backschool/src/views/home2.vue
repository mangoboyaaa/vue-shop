<template>
  <div id="bak_0">  
       
        <form method="POST" name="myform52" action="">

  <div style="WIDTH: 100%; HEIGHT: 102px;background:url(https://jksb.v.zzu.edu.cn/imagesss/title316k.png);">
  <div style="width:100%;height:32px;line-height:32px;text-align:right">
      <a href="https://jksb.v.zzu.edu.cn/vls6sss/zzujksb.dll/logout?ptopid=sC6016583C9E74D73A90AE12E42CF716B">
      <span style="color:#00c;">〖切换账号〗</span></a>　</div></div><div style="width:100%;height:7px;BACKGROUND-IMAGE: url(/images/split5.png)">
      </div><div style="WIDTH: 100%; HEIGHT: 90px;"><div style="width:100%;height:32%;line-height:32px;text-align:left;">
          <span style="font-size:12px;color:#333;">获取时间：</span><span style="font-size:16px;color:#a0a;">{{time}}
              </span><span style="font-size:12px;color:#333;">有效期剩余 
                  </span><span  id="tim317" style="font-size:22px;color:#c00;font-weight:500;font-family:黑体;">{{minutes+'分'+seconds+'秒'}}</span>
                  </div><div style="width:100%;height:7px;BACKGROUND-IMAGE: url(/images/split5.png)"></div>
  <div class="div1" style="width:100%;min-height:25px;line-height:25px;font-size:18px;color:#00c;font-weight:500;font-family:黑体;">　
      <span class="span1" style="color:#00a">信息工程学院 {{this.$bus.a}}</span><br />　通行信息：郑州大学.{{this.$bus.b}}.<span class="rukou">入口</span><br />　出入身份：本科生<br />　
      <span style="color:#f00">提醒：未检索到你今天的出校记录</span></div>
<div v-if="true" style="width:100%;height:25px; background-color:#0085d2;" id="bian92a"></div><div style="width:100%;height:300px;">
    <div style="width:25px;height:100%; background-color:#0085d2;float:left" id="bian92b1"></div>
    <div style="width:300px;height:100%;float:left">
        <img src="https://xwss6.v.zzu.edu.cn/ben2vm/B/BC1183EF3C254EB49F8F01AC882F1682.jpg?sid=211026083235281430" style="width:300px;border:0px;" />
        </div><div style="width:25px;height:100%; background-color:#0085d2;float:right" id="bian92b2"></div>
        </div><div style="width:100%;height:25px; background-color:#0085d2;" id="bian92c">
            </div><div style="width:100%;height:7px;BACKGROUND-IMAGE: url(/images/split5.png)">
            </div><div style="width:100%;min-height:18px;line-height:18px;font-size:12px;color:#666;text-align:center">郑州大学疫情防控领导小组、保卫处、信息化办公室</div>  
  
</div>

<div style="width:1px;height:1px;">
  <iframe name="zzj_fun_426" id="zzj_fun_426s" src="https://jksb.v.zzu.edu.cn/vls6sss/zzujksb.dll/getsomething?ptopid=sC6016583C9E74D73A90AE12E42CF716B&sid=211026083235437297" marginwidth="0" marginheight="0" height="100%"
    width="100%" scrolling="no" border="0" frameborder="0" allowtransparency="true"></iframe>
</div>
<input type="hidden" name="ptopid" value="sC6016583C9E74D73A90AE12E42CF716B"><input type="hidden" name="sid" value="211026083235437493"></form>

<div style="width:100%;height:50px;"></div>
 
 <div class="layui-form-item">
                
 </div> 

    </div>
</template>

<script>

export default {
   data(){
       return{
     minutes: 10,
                    seconds: 0,
                    time:'',
                    color:'black'
       }
   },
  
   mounted(){
 this.add()
 this.getTime()
 setTimeout()
   },
   methods: {
       getTime(){
         var myDate=new Date()
         if(myDate.getMinutes()>=10)
         
         this.time=myDate.getMonth()+"月"+myDate.getDate()+'日'+' '+myDate.getHours()+':'+myDate.getMinutes()
      else
       this.time=myDate.getMonth()+"月"+myDate.getDate()+'日'+' '+myDate.getHours()+':0'+myDate.getMinutes()
      },

         num(n) {
                    return n < 10 ? '0' + n : '' + n
                },
                // 倒计时函数
                add() {
                    let time = window.setInterval( ()=> {
                        if (this.hours !== 0 && this.minutes === 0 && this.seconds === 0) {
                            this.hours -= 1;
                            this.minutes = 59;
                            this.seconds = 59;
                        } else if (this.hours === 0 && this.minutes !== 0 && this.seconds ===
                            0) {
                            this.minutes -= 1;
                            this.seconds = 59;
                        } else if (this.hours === 0 && this.minutes === 0 && this.seconds ===
                            0) {
                            this.seconds = 0
                            window.clearInterval(time)
                        } else if (this.hours !== 0 && this.minutes !== 0 && this.seconds ===
                            0) {
                            this.minutes -= 1;
                            this.seconds = 59;
                        } else {
                            this.seconds -= 1;
                        }
                    }, 1000)
                },setColor(){
                      
                }


   },
   watch: {
                // 监听数值变化
                second: {
                    handler(newVal) {
                        this.num(newVal)
                    }
                },
                minute: {
                    handler(newVal) {
                        this.num(newVal)
                    }
                },
                hour: {
                    handler(newVal) {
                        this.num(newVal)
                    }
                }
            },
            computed: {
                // 初始化数据
                second() {
                    return this.num(this.seconds)
                },
                minute() {
                    return this.num(this.minutes)
                },
                hour() {
                    return this.num(this.hours)
                }
            }


}
</script>

<style scoped>

#bak_0 {MARGIN:0 auto; left: 0;WIDTH: 350px; min-HEIGHT:540px;}
.rukou{
    background-color: green;
    color: yellow;
}
.div1{
    padding-left: 20px;
}
.span1{
    margin-left: 18px;
}


</style>