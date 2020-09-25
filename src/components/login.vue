<template>
  <div class="login">
    <div class="login_box">

      <!-- TODO logo区域 -->
      <div class="logo">
        <!-- logo -->
        <!-- <img src="../assets/logo.png" alt /> -->
        <img src="../assets/uploads/2.jpg" alt="">
      </div>

      <!-- TODO 表单区域 -->
      <!-- 给表单属性绑定 一个数据绑定对象  -->
      <!-- 然后再表单里面双向绑定 这个数据绑定对象的属性上 -->
      <el-form class="form" :model='formmsg' :rules='loginRules' ref="ruleForm">

        <!-- 账号  prop 添加验证规则对象里面的属性-->
        <el-form-item prop='username'>
          <el-input prefix-icon="el-icon-user" v-model="formmsg.username"></el-input>
        </el-form-item>

        <!-- 密码  prop 添加验证规则对象里面的属性-->
        <el-form-item prop='password'>
          <el-input prefix-icon="el-icon-unlock" v-model="formmsg.password" type='password'></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click='login'>登录</el-button>
          <el-button type="warning" round @click='resetForm'>重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {

    data(){

        return {

        // 这是登录表单的数据绑定对象
            formmsg:{
                username:'admin',
                password:'123456',
            },

               // 表单的验证规则对象    规则里面的  username 和 password 必须和上面 formmsg里面的属性一样
            loginRules: {
                  //  验证用户名是否合法
                username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
                // 验证密码是否合法
                password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ]
        }
    }
},

methods:{

    //.TODO: 重置表单内容 并移除校验规则
    resetForm(){

        console.log(this); // vue 组件 VueComponent
        console.log(this.$refs); // {ruleForm: VueComponent}

        this.$refs.ruleForm.resetFields();
     
    },

    //.TODO: 登录
    login(){
        //   console.log(666);

        // TODO 发送表单之前先对表单进行预校验
        // async放在离得最近的方法上,不然 await接收不到async返回的 promise对象
        this.$refs.ruleForm.validate(async val=>{

       // TODO val 是一个布尔值 true表示表单预校验通过,可以发送请求,false表示没有通过表单验证,不允许发送请求
            //   console.log(val); 

            //   如果不是 true就 return,反之发送请求
            if(!val) return
             // console.log(this); // vue 组件  VueComponent

             // TODO 前面已经写过基地址 data是返回数据里面的一个属性,并重命名为res
            //  需要携带 一个 username 和 password 的对象
              const {data:res} =  await this.$http.post('login',this.formmsg)
               // console.log(res);
            //  console.log(res.meta.status);

            // TODO 判断状态码 确认弹出框消息
              //console.log(this);  //Vue实例
            if(res.meta.status !=200)   return this.$message.error({message:'登录失败'})

               this.$message.success({message:'登录成功'})

               // TODO 在登录成功之后将返回的 token 令牌保存在本地
                 //console.log(res.data.token); // token令牌
                 sessionStorage.setItem('token',res.data.token)
           
             // TODO 跳转到 home页面 (利用编程式导航)
             this.$router.push('/home');
            


            // const res = await this.$http.post('login',this.formmsg)
            // console.log(res.data);
        
        })

       
    }
}
}
</script>

<style lang='less' scope>
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;


  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #006374;
    border-radius: 8px;
    box-shadow: 2px 3px 3px rgba(255, 255, 255, 0.6);
    // box-shadow: 0 3px 8px rgba(0, 0, 0, .15);


// logo区域
    .logo {
      position: absolute;
      left: 50%;
      top: -75px;
      transform: translate(-50%);
      width: 130px;
      height: 130px;
      background-color: pink;
      border: 3px solid #ccc;
      border-radius: 50%;
      overflow: hidden;
      padding: 10px;
      img {
        width: 100%;
        background-color: #ccc;
        border-radius: 50%;
      }
    }

// 表单区域
   .form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .btns {
    float: right;
  }

  input {
    background-color: #B85798;
    color: brown;
    font-size: 20px;
  }

 .el-input__icon {
   color: #FF1493;
 }

   }

  }

}
</style>



