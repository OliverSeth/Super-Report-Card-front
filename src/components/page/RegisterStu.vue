<template>
    <div :style="bg" style="width: 100%;height: 100%">
        <div id="div1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="班级" prop="class">
                    <el-select type="password" v-model="ruleForm.class" placeholder="请选择班级">
                        <el-option
                                v-for="item in classList"
                                :key="item.class_ID"
                                :label="item.class_NAME"
                                :value="item.class_ID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="学号" prop="num">
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
        name: "Register",
        data(){
            return{
                classList:[],
                ruleForm:{
                    class:'',
                    name:'',
                    num:''
                },
                bg:{
                    backgroundImage:'url('+require('@/assets/img/login-bg.jpg')+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%"
                },
                rules:{
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    num:[
                        {required: true, message: '请输入学号', trigger: 'blur'},
                    ],
                    class:[
                        {required: true, message: '请选择班级', trigger: 'blur'},
                    ]
                }
            }
        },
        methods:{
            submit(){
                let api=this.$api.userApi.addStudent;
                // console.log(this.ruleForm.class);
                api.data={
                    CLASS_ID:this.ruleForm.class,
                    STUDENT_NAME:this.ruleForm.name,
                    STUDENT_NUM:this.ruleForm.num,
                    USER_ID:localStorage.getItem('id')
                };
                this.axios(api).then(response=>{
                    console.log(response);
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
        },
        mounted() {
            let api=this.$api.userApi.listClass;
            this.axios(api).then(response=>{
                // console.log(response);
                this.classList=response.data.data;
                console.log(this.classList);
            })
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
