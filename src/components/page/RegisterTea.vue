<template>
    <div style="width: 100%;height: 100%;" :style="bg">
        <div id="div1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="部门" prop="department">
                    <el-select type="password" v-model="ruleForm.department" placeholder="请选择班级">
                        <el-option
                                v-for="item in departmentList"
                                :key="item.department_ID"
                                :label="item.department_NAME"
                                :value="item.department_ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="工号" prop="num">
                    <el-input v-model="ruleForm.num">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">确认</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RegisterTea",
        data(){
            return{
                ruleForm:{
                    department:'',
                    name:'',
                    num:'',
                },
                bg:{
                    backgroundImage:'url('+require('@/assets/img/login-bg.jpg')+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%"
                },
                rules:{
                    department:[
                        {required: true, message: '请输入部门', trigger: 'blur'},
                    ],
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    num:[
                        {required: true, message: '请输入工号', trigger: 'blur'},
                    ]
                },
                departmentList:[]
            }
        },
        mounted() {
            let api=this.$api.userApi.listDepartment;
            this.axios(api).then(response=>{
                // console.log(response);
                this.departmentList=response.data.data;
            })
        },
        methods:{
            submit(){
                let api=this.$api.userApi.addTeacher;
                api.data={
                    DEPARTMENT_ID:this.ruleForm.department,
                    TEACHER_NAME:this.ruleForm.name,
                    TEACHER_NUM:this.ruleForm.num,
                    USER_ID:localStorage.getItem('id')
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '您已完成注册',
                            type: 'success'
                        });
                        this.$router.push('/');
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '信息上传失败'
                        });
                    }
                })
            }
        }
    }
</script>

<style scoped>
    #div1{
        top:50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
    }
</style>
