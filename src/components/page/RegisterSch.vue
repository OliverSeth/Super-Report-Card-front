<template>
    <div style="height: 100%;width: 100%" :style="bg">
        <div id="div1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="国家" prop="country">
                    <el-input v-model="ruleForm.country"></el-input>
                </el-form-item>
                <el-form-item label="省份" prop="province">
                    <el-input v-model="ruleForm.province">
                    </el-input>
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="ruleForm.city">
                    </el-input>
                </el-form-item>
                <el-form-item label="学校名" prop="schoolname">
                    <el-input v-model="ruleForm.schoolname">
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
        name: "RegisterSch",
        data(){
            return{
                ruleForm:{
                    country:'',
                    province:'',
                    city:'',
                    schoolname:''
                },
                bg:{
                    backgroundImage:'url('+require('@/assets/img/login-bg.jpg')+')',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:"100%"
                },
                rules:{
                    country: [
                        {required: true, message: '请输入国家', trigger: 'blur'},
                    ],
                    province: [
                        {required: true, message: '请输入省份', trigger: 'blur'},
                    ],
                    city:[
                        {required: true, message: '请输入城市', trigger: 'blur'},
                    ],
                    schoolname: [
                        {required: true, message: '请输入学校名', trigger: 'blur'},
                    ]
                }
            }
        },
        methods:{
            submit(){
                let api=this.$api.userApi.addSchool;
                api.data={
                    country:this.ruleForm.country,
                    province:this.ruleForm.province,
                    city:this.ruleForm.city,
                    schoolname:this.ruleForm.schoolname,
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
