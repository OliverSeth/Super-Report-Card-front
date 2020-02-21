<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">超级成绩单管理系统</div>
            <el-form :model="ruleForm" label-width="0px" class="ms-content" :rules="rule" v-enterToNext="true">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="login">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <!--<el-form-item prop="radio">-->
                    <!--<el-radio-group v-model="ruleForm.radio">-->
                        <!--<el-radio :label="3">学生</el-radio>-->
                        <!--<el-radio :label="6">教师</el-radio>-->
                        <!--<el-radio :label="9">学校管理员</el-radio>-->
                    <!--</el-radio-group>-->
                <!--</el-form-item>-->

                <div class="login-btn" style="margin-top: 30px;">
                    <el-button type="primary" @click="register" style="width: 100px;">注册</el-button>
                    <el-button type="primary" @click="login" style="width: 100px;margin-left: 30px">
                        登录
                    </el-button>
                    <!--<el-button type="primary" @click="modify" style="width: 100px;margin-left: 30px">改密</el-button>-->
                </div>
                <!--<p class="login-tips">Tips : 用户名和密码随便填。</p>-->
            </el-form>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5';


    export default {
        name: 'login',
        data() {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    radio: 3,
                },
                rule: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '请输入3到10个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '请输入6到12个字符', trigger: 'blur'}
                    ]
                }
                // rules: {
                //     username: [
                //         {required: true, message: '请输入用户名', trigger: 'blur'}
                //     ],
                //     password: [
                //         {required: true, message: '请输入密码', trigger: 'blur'}
                //     ]
                // }
            }
        },
        created() {
            localStorage.clear()
        },
        // directives:{
        //     enterToNext:{
        //
        //     }
        // },
        mounted() {
            // location.reload();
            // this.$router.push('/')
        },
        methods: {
            register() {
                this.$router.push('/register');
//                if(this.ruleForm.radio!==3&&this.ruleForm.radio!==6&&this.ruleForm.radio!==9){
//                    this.$notify.error({
//                        title: '错误',
//                        message: '请选择身份'
//                    });
//                    return;
//                }
//                let api = this.$api.userApi.register;
//                api.data = {
//                    username: this.ruleForm.username,
//                    password: md5(this.ruleForm.password)
//                };
//                this.axios(api).then(response => {
//                    // console.log(response)
//                    if (response.data.code === 0) {
//                        localStorage.setItem('username', this.ruleForm.username);
//                        localStorage.setItem('id',response.data.data);
//                        this.$message({
//                            message: '注册成功',
//                            type: 'success'
//                        });
//                        // this.ruleForm.password = ''
//                        if(this.ruleForm.radio===3){
//                            this.$router.push('/register-stu');
//                        }else if(this.ruleForm.radio===6){
//                            this.$router.push('/register-tea');
//                        }else if(this.ruleForm.radio===9){
//                            this.$router.push('/register-sch');
//                        }
//                    } else if (response.data.code === 1) {
//                        this.$message.error('用户名已存在');
//                        this.ruleForm.username = '';
//                        this.ruleForm.password = ''
//                    }
//                })
            },
            login() {
                // this.$router.push('/');
                // location.reload();
                let api = this.$api.userApi.login;
                api.data = {
                    username: this.ruleForm.username,
                    password: md5(this.ruleForm.password)
                };
                this.axios(api).then((response) => {
                    // this.$router.push('/');
                    console.log(response);
                    if (response.data.code === 0) {
                        localStorage.setItem('id', response.data.data);
                        let url = 'http://114.115.153.14:8080/SRC/user/authority';
                        this.axios(url, {
                            params: {
                                USER_ID: response.data.data
                            }
                        }).then((res) => {
                            localStorage.setItem('role', res.data.data);
                            localStorage.setItem('userName', this.ruleForm.username);
                            let role = localStorage.getItem('role');
                            console.log(role);
                            if (role === '3') {
                                this.$router.push('/dashboard-s');
                            } else if (role === '2') {
                                this.$router.push('/dashboard');
                            }else if(role==='1'){
                                this.$router.push('/dashboard-a');
                            }
                        });
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        });

                        // }else{
                        //     this.$router.push('/dashboard-s');
                        // }
                    } else {
                        this.$message.error('用户名或密码错误');
                    }
                })
            },
            modify() {
                let api = this.$api.userApi.changePassword;
                api.data = {
                    newPwd: md5('s'),
                    oldPwd: 'stu00',
                    username: 's'
                };
                this.axios(api).then(response => {
                    console.log(response);
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username', this.ruleForm.username);
                        this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #000000;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
