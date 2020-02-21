<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 修改密码</el-breadcrumb-item>
                <!--<el-breadcrumb-item>基本表单</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <br/>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                 style="width: 30%">
            <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm.oldPass"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPass1">
                <el-input type="password" v-model="ruleForm.newPass1">
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPass2">
                <el-input type="password" v-model="ruleForm.newPass2">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="modifyPassword">修改密码</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "ModifyPass",
        data() {
            return {
                ruleForm: {
                    oldPass: '',
                    newPass1: '',
                    newPass2: ''
                },
                rules: {
                    oldPass: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'}
                    ],
                    newPass1: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '长度在6到12个字符', trigger: 'blur'}
                    ],
                    newPass2: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '长度在6到12个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            modifyPassword() {
                if (this.ruleForm.newPass1 !== this.ruleForm.newPass2) {
                    this.$notify.error({
                        title: '错误',
                        message: '两次输入的密码不一致'
                    });
                } else {
                    let api = this.$api.userApi.changePassword;
                    api.data = {
                        newPwd: this.$md5(this.ruleForm.newPass1),
                        oldPwd: this.$md5(this.ruleForm.oldPass),
                        username: localStorage.getItem('userName')
                    };
                    this.axios(api).then(response => {
                        console.log(response);
                        if(response.data.code===0){
                            this.$notify({
                                title: '成功',
                                message: '密码修改成功',
                                type: 'success'
                            });
                            this.$router.push('/login');
                        }else{
                            this.$notify.error({
                                title: '失败',
                                message: '密码修改失败'
                            });
                        }
                    })
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
