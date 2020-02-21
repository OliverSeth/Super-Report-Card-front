<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="ruleForm" label-width="0px" class="ms-content" :rules="rule" v-enterToNext="true">
                <el-form-item prop="radio">
                    <el-radio-group v-model="radioT">
                        <el-radio :label="3">学生</el-radio>
                        <el-radio :label="6">教师</el-radio>
                    </el-radio-group>
                </el-form-item>


                <!--学生-->
                <el-form id="student" :model="ruleForm_Stu" :rules="rule_stu" ref="ruleForm"  class="demo-ruleForm" style="margin-top: 40px;">
                    <el-form-item label="班级" prop="class" labelWidth="50px">
                        <el-select type="password" v-model="ruleForm_Stu.class" placeholder="请选择班级">
                            <el-option
                                    v-for="item in classList"
                                    :key="item.class_ID"
                                    :label="item.class_NAME"
                                    :value="item.class_ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name" labelWidth="50px">
                        <el-input v-model="ruleForm_Stu.name" style="width: 300px;">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="学号" prop="num" labelWidth="50px">
                        <el-input v-model="ruleForm_Stu.num" style="width: 300px;">
                        </el-input>
                    </el-form-item>

                    <div class="hint">默认用户名密码为学生学号。</div>
                    <el-form-item>
                        <el-button type="primary" @click="studentR">添加学生</el-button>
                        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                    </el-form-item>
                </el-form>


                <!--教师-->
                <el-form id="teacher" :model="ruleForm_Tea" :rules="rule_tea" ref="ruleForm" class="demo-ruleForm" style="display: none; margin-top: 40px;">
                    <el-form-item label="部门" prop="department" labelWidth="50px">
                        <el-select v-model="ruleForm_Tea.department" placeholder="请选择部门">
                            <el-option
                                    v-for="item in departmentList"
                                    :key="item.department_ID"
                                    :label="item.department_NAME"
                                    :value="item.department_ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name" labelWidth="50px">
                        <el-input v-model="ruleForm_Tea.name" style="width: 300px;">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="工号" prop="num" labelWidth="50px">
                        <el-input v-model="ruleForm_Tea.num" style="width: 300px;">
                        </el-input>
                    </el-form-item>

                    <div class="hint">默认用户名密码为教师工号。</div>
                    <el-form-item>
                        <el-button type="primary" @click="teacherR">添加教师</el-button>
                        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
                    </el-form-item>
                </el-form>

            </el-form>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

    export default {
        components: {ElFormItem}, name: 'login',
        data() {
            return {
                radioT: 3,
                visibleStu: true,
                visibleTea: false,
                departmentList:{},
                classList:{},
                ruleForm: {
                    username: '',
                    password: '',
                },
                ruleForm_Stu: {
                    class:'',
                    name:'',
                    num:''
                },
                ruleForm_Tea: {
                    department:'',
                    name:'',
                    num:'',
                },
                rule_stu:{
                    class: [
                     {required: true, message: '请选择学生班级', trigger: 'blur'}
                    ],
                    name: [
                     {required: true, message: '请输入学生姓名', trigger: 'blur'}
                    ],
                    num: [
                    {required: true, message: '请输入学生学号', trigger: 'blur'}
                    ],
                },
                rule_tea:{
                    department: [
                        {required: true, message: '请选择教师部门', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入教师姓名', trigger: 'blur'}
                    ],
                    num: [
                        {required: true, message: '请输入教师工号', trigger: 'blur'}
                    ],
                },
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
        // directives:{
        //     enterToNext:{
        //
        //     }
        // },
        mounted() {
            let api = this.$api.userApi.findClassBySchool;
            let id = localStorage.getItem('schoolid');
            console.log(id);
            api.data = {
                SCHOOL_ID: id
            }
            this.axios(api).then(response=>{
//                     console.log(response);
                this.classList = response.data.data;
            })

            let api2 = this.$api.userApi.findDepartmentBySchool;
            api2.data = {
                SCHOOL_ID: id
            }
            this.axios(api2).then(response=>{
//                    console.log(response);
                this.departmentList = response.data.data;
            })

        },
        watch:{
            radioT(val) {
                if(this.radioT === 3){
                    document.getElementById("student").style.display="";
                    document.getElementById("teacher").style.display="none";
                }
                else{
                    document.getElementById("student").style.display="none";
                    document.getElementById("teacher").style.display="";
                }
            }
        },
        methods: {
            studentR(){
//                console.log(this.ruleForm);
//                console.log(this.ruleForm_Stu);
                if(this.radioT !== 3 && this.radioT !== 6){
                    this.$notify.error({
                        title: '错误',
                        message: '请选择身份'
                    });
                    return;
                }
                else if(this.ruleForm_Stu.class ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请选择学生班级'
                    });
                    return;
                }
                else if(this.ruleForm_Stu.name ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请输入学生姓名'
                    });
                    return;
                }
                else if(this.ruleForm_Stu.num ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请输入学生学号'
                    });
                    return;
                }

                let apiR = this.$api.userApi.register;
                apiR.data = {
                    username: this.ruleForm_Stu.num,
                    password: md5(this.ruleForm_Stu.num)
                };
                this.axios(apiR).then(response => {
                    // console.log(response)
                    if (response.data.code === 0) {
//                        localStorage.setItem('username', this.ruleForm.username);
                        let userID = response.data.data;

                        let api = this.$api.userApi.addStudent;
                        api.data = {
                            CLASS_ID:this.ruleForm_Stu.class,
                            STUDENT_NAME:this.ruleForm_Stu.name,
                            STUDENT_NUM:this.ruleForm_Stu.num,
                            USER_ID: userID
                        };
                        this.axios(api).then(response=>{
//                            console.log(response);
                            if(response.data.code === 0){
                                this.$notify({
                                    title: '成功',
                                    message: '添加学生成功',
                                    type: 'success'
                                });
                                this.$router.push('/class-table');
                            } else{
                                this.$notify.error({
                                    title: '失败',
                                    message: '信息上传失败'
                                });
                            }
                        })
                    } else if (response.data.code === 1) {
                        this.$message.error('用户已存在');
                    }
                })
            },

            teacherR(){
//                console.log(this.ruleForm);
//                console.log(this.ruleForm_Stu);
                if(this.radioT !== 3 && this.radioT !== 6){
                    this.$notify.error({
                        title: '错误',
                        message: '请选择身份'
                    });
                    return;
                }
                else if(this.ruleForm_Tea.class ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请选择教师部门'
                    });
                    return;
                }
                else if(this.ruleForm_Tea.name ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请输入教师姓名'
                    });
                    return;
                }
                else if(this.ruleForm_Tea.num ===''){
                    this.$notify.error({
                        title: '错误',
                        message: '请输入教师工号'
                    });
                    return;
                }

                let apiR = this.$api.userApi.register;
                apiR.data = {
                    username: this.ruleForm_Tea.num,
                    password: md5(this.ruleForm_Tea.num)
                };
                this.axios(apiR).then(response => {
                    // console.log(response)
                    if (response.data.code === 0) {
                        let userID = response.data.data;

                        let api = this.$api.userApi.addTeacher;
                        api.data = {
                            DEPARTMENT_ID: this.ruleForm_Tea.department,
                            TEACHER_NAME: this.ruleForm_Tea.name,
                            TEACHER_NUM: this.ruleForm_Tea.num,
                            USER_ID: userID
                        };
                        this.axios(api).then(response=>{
//                            console.log(response);
                            if(response.data.code===0){
                                this.$notify({
                                    title: '成功',
                                    message: '添加教师成功',
                                    type: 'success'
                                });
                                this.$router.push('/department-table');
                            }else{
                                this.$notify.error({
                                    title: '失败',
                                    message: '信息上传失败'
                                });
                            }
                        })

                    } else if (response.data.code === 1) {
                        this.$message.error('用户已存在');
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }

    .hint{
        font-size: 13px;
        color: #666;
        margin: 20px;
    }
</style>
