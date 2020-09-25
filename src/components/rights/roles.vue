<template>
  <div>
        <!-- .TODO:  面包屑导航 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">

        <!-- 当路径为 '/  会自动跳转到 welcome页面-->
         <el-breadcrumb-item :to="{ path: '/welcome' }" >首页</el-breadcrumb-item>
         <el-breadcrumb-item>权限管理</el-breadcrumb-item>
         <el-breadcrumb-item>角色列表</el-breadcrumb-item>

      </el-breadcrumb>

      
      <!-- .TODO: 卡片区域 -->
    <el-card class="box-card"> 

        <el-button type="info" @click='addRoleVisible = true'>添加角色</el-button>

                <!-- .FIXME: 表格区域 -->
                <el-table :data="rolesList"  style="width:  100%" stripe border > 
                  <!-- 展开行数据  expand -->
             <el-table-column   type="expand"  width="50">

                 <template v-slot='scoped'>
                 <!-- {{scoped.row.id}} -->
                
                  <!-- 先用一个 el-row包裹着el-col 进行区域分割 -->
                  <!-- 遍历数据需要在行上,这样显示就是一行一行的显示 -->
                 <!-- 每一项默认加上下边框,如果 索引是0加上上边框,否则不加-->
               <el-row  :class="['bb',i1==0?'bt':'']"    v-for="(item1,i1)  in scoped.row.children" :key='item1.id'>

                <!-- 第一列分5份  渲染一级权限-->
                <el-col :span="5">

               <el-tag closable>{{item1.authName}} </el-tag><span class="el-icon-arrow-right"></span>


               </el-col >
      
               <!-- 第二列分19份  渲染二级和三级权限 -->
              <el-col :span="19">

             <!-- 继续在 el-row 里面遍历数据,这样可以在一行一行显示  渲染二级权限 -->
             <el-row v-for="item2 in item1.children" :key="item2.id">

                 <el-col :span="8">
                <el-tag type="success" closable>{{item2.authName}}</el-tag><span class="el-icon-arrow-right"></span>

                 </el-col>

                 <el-col :span="16">
                     <!-- el-tag 的触发事件 close,给三级权限加了删除权限事件  deleteRights-->
                  <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close='deleteRights(scoped.row,item3.id)'>{{item3.authName}}</el-tag>
                 </el-col>

                </el-row>
            </el-col >
        </el-row>
                        
     </template>

             </el-table-column>

            <el-table-column   prop="roleName" label="角色名称"  width="400">  </el-table-column>

           <el-table-column   prop="roleDesc"  label="角色描述" width="400" >  </el-table-column>

           <el-table-column   label="操作"  >
             <!-- 组件与组件之间只能放插槽来渲染 -->
             <!-- 通过 v-solt='scoped'获取插槽绑定的数据  -->
             <template v-slot='scoped'>

              ID: {{scoped.row.id}}

             <!-- 点击修改的按钮 触发修改用户的对话框 -->
             <el-button size="mini" type="primary" icon="el-icon-edit" @click='editRoleMan(scoped.row.id)' >编辑</el-button>
             <el-button size="mini" type="warning" icon="el-icon-delete" @click='removeRoleById(scoped.row.id)'>删除</el-button>
                
                      
           <el-button size="mini" type="danger" icon="el-icon-setting" @click='fenPeiRights(scoped.row)'>分配权限</el-button>
                               
          </template>   
       </el-table-column>
                </el-table>


               <!-- .FIXME: 添加角色对话框 -->
                  <!-- 设置 visible属性,接收布尔值,当为 true时显示 Dialog   -->
                  <!--   close 	Dialog 关闭的回调函数 -->
                 <el-dialog
                      title="添加角色"
                      :visible.sync="addRoleVisible"
                      width="50%"

                      @close='addRoleClose'
                 >
                   <!-- 表单内容  model 属性绑定一个表单对象 addForm , input 双向绑定这个表单对象的属性-->
                   <!-- input 只有加了 prop 属性,input的内容才会显示 -->
                   <!-- 属性绑定校验规则  :rules='addFormRules'-->
                   <!-- 添加 ref属性,这样在 对话框中就可以获取 el-form中的方法 -->
                    <el-form  :model="addRolesMan" label-width="80px"  ref="addRoleRef" :rules='addRolesRules'>
                          
                          <!-- 分别双向绑定这个表单对象里面的属性 -->
                          <!-- prop 接收规则里面的属性-->
                         <el-form-item label="角色名称"   prop='roleName' >
                             <el-input v-model="addRolesMan.roleName"></el-input>
                          </el-form-item>

                             <el-form-item label="角色描述"   prop='roleDesc'>
                             <el-input v-model="addRolesMan.roleDesc"></el-input>
                          </el-form-item>


                    </el-form>

                    <span slot="footer" class="dialog-footer">
                            
                   <!-- 点击取消退出对话框 -->
                   <!-- 点击确认 进行  预校验 ==> 发送请求 ==> 重新渲染数据 ==> 清空表单 -->
                       <el-button  type="danger"  @click="addRoleVisible = false">取 消</el-button>
                       <el-button type="primary"  @click="addRoleMan">确 定</el-button>
                     </span>
                </el-dialog>


               <!-- .FIXME: 修改角色对话框 -->
                  <!-- 设置 visible属性,接收布尔值,当为 true时显示 Dialog   -->
                  <!--   close 	Dialog 关闭的回调函数 -->
                 <el-dialog
                      title="编辑角色"
                      :visible.sync="editRoleVisible"
                      width="50%"

                      @close='addRoleClose'
                 >
                   <!-- 表单内容  model 属性绑定一个表单对象 addForm , input 双向绑定这个表单对象的属性-->
                   <!-- input 只有加了 prop 属性,input的内容才会显示 -->
                   <!-- 属性绑定校验规则  :rules='addFormRules'-->
                   <!-- 添加 ref属性,这样在 对话框中就可以获取 el-form中的方法 -->
                     <!-- 需要跟添加角色里的 ref 不一样用来区分表单 -->
                    <el-form  :model="addRolesMan" label-width="80px"  ref="editRoleRef" :rules='addRolesRules'>
                          
                          <!-- 分别双向绑定这个表单对象里面的属性 -->
                          <!-- prop 接收规则里面的属性-->
                         <el-form-item label="角色名称"   prop='roleName' >
                             <el-input v-model="addRolesMan.roleName"></el-input>
                          </el-form-item>

                             <el-form-item label="角色描述"   prop='roleDesc'>
                             <el-input v-model="addRolesMan.roleDesc"></el-input>
                          </el-form-item>


                    </el-form>

                    <span slot="footer" class="dialog-footer">
                            
                   <!-- 点击取消退出对话框 -->
                   <!-- 点击确认 进行  预校验 ==> 发送请求 ==> 重新渲染数据 ==> 清空表单 -->
                       <el-button  type="danger"  @click="editRoleVisible = false">Cancel</el-button>
                       <el-button type="primary" @click='tiJiaoRole' >GOGO</el-button>
                     </span>
                </el-dialog>

               
                <!-- .FIXME: 编辑权限对话框 -->
                  <!-- 设置 visible属性,接收布尔值,当为 true时显示 Dialog   -->
              
                  <!--   close 	Dialog 关闭的回调函数 -->
                  <el-dialog title="分配权限"  :visible.sync="editRightsVisible" 
                   width="50%" 
                   @close='postKeysClosed' >
                    
                    <!-- rightsList 为权限列表数据 -->
                    <!-- treeProp 为树形结构的配置项 -->
                    <!-- show-checkbox 复选框 -->
                    <!-- default-expand-all 每一项默认展示 -->

                    <!-- node-key   每个树节点用来作为唯一标识的属性 id为唯一值 -->
                   <!-- default-cheecked-keys 默认选中的节点的 key 的数组,需要属性绑定  --> 
                    <el-tree 
                    :data="rightsList"
                    :props="treeProp"
                    show-checkbox
                    default-expand-all
                    node-key='id'
                    :default-checked-keys=keys

                    ref = "treeRef"
                    
                    >
                    </el-tree>
                    <span slot="footer" class="editRightsVisible-footer"> 

                         <el-button @click="editRightsVisible = false" type="warning">取 消</el-button>
                         <el-button type="primary" 
                         @click='postRightsByKeys'>确 定</el-button>
 
                 </span>
                 </el-dialog>
   
      </el-card>
  </div>
</template>

<script>
export default {
    data(){

        return {

            // FIXME 角色列表数据
            rolesList:[],

            // FIXME 添加角色 input表单数据
            addRolesMan:{
                roleId:'',
                roleName:'',
                roleDesc:'',

            },

            // FIXME 权限列表的数据
            rightsList:[],

            // FIXME  树形结构的配置项 tree
            treeProp:{
                // 标准树形是以哪一个节点
               children:'children',
                //  用户看见的文字
                label:'authName',
            },
            
            // FIXME 控制添加角色的对话框打开状态
            addRoleVisible:false,

            // FIXME 控制编辑角色的对话框打开状态
            editRoleVisible:false,

            // FIXME 控制修改权限的对话框打开状态
            editRightsVisible:false,

            // FIXME 添加角色对话框校验规则
             addRolesRules: {

                //  角色名称校验规则
                 roleName: [
                   { required: true, message: '请输入正确角色名称', trigger: 'blur' },
                   { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                        ],
                //  角色描述校验规则
                 roleDesc: [
                   { required: true, message: '请输入正确角色描述', trigger: 'blur' },
                   { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                        ],
              },

            // FIXME 给每一个树节点设置唯一标识
             id:'',

            // FIXME 存储所有的三级权限的 id 的数组 (默认选中)
             keys:[],
         
        }

    },

    // 方法
    methods:{


        // TODO 获取用户数据
        async  getRolesList(){


          // 1.发送请求 获取所有的角色列表数据
          const {data:res} = await this.$http.get('roles');
          //  console.log(res);

            // 2.根据返回的状态码判断是否将数据赋值给 rolesList
            if(res.meta.status !=200) return this.$message.error('获取角色列表数据失败')

            // 3.将获取的数据赋值给 rolesList
            this.rolesList = res.data;
        },

        // TODO 对话框的 close 事件,重置表单
        addRoleClose(){
            this.$refs.addRoleRef.resetFields()
        },

        
        // TODO 添加角色
        addRoleMan(){
            //   console.log(666);

            // 1.先进行预校验
            this.$refs.addRoleRef.validate(async res=>{
                //   console.log(res);

                // 根据返回的布尔值确认是否发送请求添加角色
                if(!res) return this.$message.error('预校验失败')
              
              //   2.发送请求添加角色
              const {data:val} = await this.$http.post('roles',this.addRolesMan)

                console.log(val);

                // 3.根据返回的状态码确认是否重新渲染数据
                if(val.meta.status !=201) return this.$message.error('新建角色请求失败')
                this.$message.success('创建角色成功')

                // 4.关闭对话框
                this.addRoleVisible = false;

                // 5.重新渲染页面
                this.getRolesList();

            })
        },

        // TODO  删除角色
      async removeRoleById(id){

            // console.log(id);

          // 1.先弹出 MessageBox弹出框
          const res =  await  this.$confirm('此操作将永久删除改 角色, 是否继续?', '再见了弟弟', {
          confirmButtonText: 'GOGO',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).catch(err=>err)

          // console.log(res);

          // 根据返回的字符串确认 操作
          if(res!='confirm') return this.$message.error('长点心吧弟弟,黑桃A都没了')

          // 3.根据id删除对应的数据
          const {data:val} = await this.$http.delete(`roles/${id}`);

            // console.log(val);
            // 4.根据返回的状态码 确认是否删除数据
            if(val.meta.status != 200) return this.$message.error('连数据都删除不了的five')

            // 5.重新渲染页面
            this.getRolesList();


        },


         // TODO 编辑角色 (获取数据)
       async  editRoleMan(id){

            //    console.log(id)   
            
            // 1.根据id发送请求获取数据
          const {data:res} = await this.$http.get(`roles/${id}`);
            // console.log(res);

            // 根据返回的状态码 确认是否将获取的数据重新赋值
            if(res.meta.status !=200) return this.$message.error('获取当前数据失败')
            
            // 重新赋值
            this.addRolesMan = res.data;

            // 打开对话框
            this.editRoleVisible = true;

         },


        // TODO 编辑角色 (渲染数据)
        tiJiaoRole(){
            // console.log(66);

            // 1.先进行预校验
            this.$refs.editRoleRef.validate(async res=>{
                //   console.log(res);
                // 根据返回的布尔值确认是否发送请求添加角色
                if(!res) return this.$message.error('预校验失败')

                // 2.提交数据并重新渲染
                const {data:val} = await this.$http.put(`roles/${this.addRolesMan.roleId}`,{
                   roleName:this.addRolesMan.roleName,
                roleDesc:this.addRolesMan.roleDesc,
                })
                  // console.log(val);

                  // 3.根据返回的状态码 确认是否重新渲染数据
                  if(val.meta.status !=200) return this.$message.error('编辑角色失败')

                  // 4.关闭对话框
                  this.editRoleVisible = false;

                  // 5.重新渲染
                  this.getRolesList();

                
            })
          
        },


        // TODO  删除指定id角色指定id的权限
         async  deleteRights(role,rightId){

                   //console.log(role,rightId); // 角色对象  权限ID

                //  首先会有 MessageBox 弹出框,根据返回的字符串判断操作
                 const  res  = await this.$confirm('这个权限爷不要了', '各单位注意', {
               // 1. 确认会返回一个 confirm  字符串
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                    //2. catch 会把错误获取并返回  cancel字符串
             }).catch(err=>err);

            //    console.log(res); // confirm

            if(res!='confirm')  return this.$message.info('长点心吧徐爷的黑桃A都没了')

            // 3.根据 角色id 和 权限id 删除对应的权限
            const {data:val} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            //console.log(val);

            if(val.meta.status !=200) return this.$message.success('权限删除失败');
            this.$message.success('您的权限已经GG了')

            // 因为删除了权限之后 页面会进行重载
            // 需要手动调用函数渲染页面     this.getRolesList()
            // 返回的 data 是当前角色下最新的权限列表,可以直接将这个列表重新赋值给当期那行的 children节点
            role.children = val.data;
              // console.log(val.data);
             
            },


        // TODO 分配权限 渲染树状结构
         async  fenPeiRights(role){
                
                // 1.打开对话框
                this.editRightsVisible = true;

                // 2.发送请求 获取树状权限数据
                const {data:res} = await this.$http.get('rights/tree');
                //   console.log(res);

                if(res.meta.status !=200) return this.$message.error('获取权限失败')
                // console.log(res.data);
                // 将获取的数据赋值给 rightsList
                this.rightsList = res.data;
                //  console.log(this.rightsList);

                // 传过来的角色对象
                 // console.log(role);

                  // 3.将传过来的角色id赋值给 node-key 设置的 id(唯一标识)
                  this.id = role.id;

                  // 4.调用函数递归获取所有的三级权限的 id(数据会返回到 keys)
                  this.getDeepFullKeys(role,this.keys);

                  // console.log(this.keys);  所有三级权限 id 的数组
            },


        // TODO  递归获取所有的三级权限的 id,用来设置 tree的默认选中
         getDeepFullKeys(ele,arr){

          //  1.如果第一层遍历中 (遍历传进来的角色) 存在三级权限  就将三级权限的id放进数组 arr里(没有children节点即为三级权限)
          if(!ele.children) return arr.push(ele.id);

          //  2.第二层遍历 ele.children (传进来的角色的所有children节点)
          // 再第二层遍历里面调用自己,进行递归
           ele.children.forEach(item => this.getDeepFullKeys(item,arr))
         },
          
        // TODO  当对话框关闭之后,将 keys 数组重置,保证下一次点开对话框追加的数组是一个空数组,防止 keys 数组被无线追加数据
          postKeysClosed(){
            this.keys = [];
          },

        //.TODO:  最后确认给角色分配指定的权限 
       async  postRightsByKeys(){

              // .FIXME: 1. 全选的三级权限的 id数组
               //console.log(this.$refs.treeRef.getCheckedKeys()); // [123,129,134]
               var arr1 = this.$refs.treeRef.getCheckedKeys();

              // .FIXME: 2.半选的三级权限的 id数组              
                //console.log(this.$refs.treeRef.getHalfCheckedKeys());//[101,121,103,111]
                var arr2 = this.$refs.treeRef.getHalfCheckedKeys();

               // .FIXME: 3.将两个数组合并并转为字符串 (发送请求需要携带的参数是 字符串)
               var arr = [...arr1,...arr2];
                //  console.log(arr);
               
              //  以逗号分割的字符串
               var str =  arr.join(',');
                //  console.log(str);

               // .FIXME: 4. 根据角色id发送请求
                const {data:res} = await this.$http.post(`roles/${this.id}/rights`,{
                  rids:str
                })
                  // console.log(res);

                //.FIXME: 5.根据返回的状态码 判断是否重新渲染 tree树状图以及提醒分配角色权限成功并退出对话框
                if(res.meta.status !=200)  return this.$message.error('您瞧瞧你那B样')

                // 退出对话框
                this.editRightsVisible = false;
                // 重新渲染页面
                this.getRolesList();
                // 提醒成功
                this.$message.success('分配角色权限成功')
     
         }

    },

    //.FIXME: 钩子函数
    created(){

        // 调用获取角色列表的方法
        this.getRolesList();
    }

}
</script>

<style lang='less' scope>
// tab标签
.el-tag {
    margin: 10px;
}

// 上边框
.bt {
    border-top: 1px solid #ccc;
}

// 下边框
.bb {
    border-bottom: 1px solid #ccc;
}

// 行
.el-row {
    display: flex;
    align-items: center;
}

</style>