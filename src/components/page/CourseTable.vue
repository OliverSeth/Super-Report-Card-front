<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 课程管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_subject" :disabled="dis" placeholder="选择学科" class="handle-select mr10">
                    <el-option v-for="item in subjectTable" :key="item.subject_ID" :label="item.subject_NAME" :value="item.subject_ID">
                    </el-option>
                </el-select>
                <!--<el-select v-model="select_cate" placeholder="选择课程" class="handle-select mr10">-->
                <!--<el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME" :value="item.COURSE_ID">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <!--<el-button type="primary" icon="search" @click="searchClass">查询</el-button>-->
            </div>



            <el-table :data="courseTable" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="CLASS_NAME" label="班级" sortable width="150">
                </el-table-column>
                <el-table-column prop="TEACHER_NAME" label="教师姓名" sortable width="150">
                </el-table-column>
                <el-table-column prop="SUBJECT_NAME" label="学科名称" width="150">
                </el-table-column>
                <el-table-column prop="SEMESTER" label="学期" sortable width="150">
                </el-table-column>

                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="startEdit(scope.row)">修改任课老师</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="startDel(scope.row)">删除课程</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" style="margin-top: 20px" @click="startAdd">添加课程</el-button>
            <el-button type="primary" style="margin-top: 20px" @click="searchCourse" v-show = "searchFlag">查询</el-button>
            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>
        </div>


        <!-- 添加弹出框 -->
        <el-dialog title="添加课程" :visible.sync="addVisible" width="30%">
            <el-form label-width="80px">
                <el-form-item label= "学科">
                    <el-select v-model="select_subject" placeholder="选择学科" class="handle-select mr10">
                        <el-option v-for="item in subjectTable" :key="item.subject_ID" :label="item.subject_NAME" :value="item.subject_ID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label= "班级">
                    <el-select v-model="select_class" placeholder="选择班级" class="handle-select mr10">
                        <el-option v-for="item in classTable" :key="item.class_ID" :label="item.class_NAME" :value="item.class_ID">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label= "学期">
                    <el-select v-model="select_semester" placeholder="选择学期" class="handle-select mr10">
                        <el-option v-for="item in semesterTable" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label= "任课老师">
                    <el-select v-model="select_department" placeholder="选择部门" class="handle-select mr10">
                        <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                        </el-option>
                    </el-select>

                    <el-select v-model="select_teacher" placeholder="选择教师" class="handle-select mr10">
                        <el-option v-for="item in teacherTable" :key="item.user_ID" :label="item.teacher_NAME" :value="item.user_ID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCourse">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog :title="tit" :visible.sync="editVisible" width="30%">

            <el-form label-width="80px">
                <el-form-item label= "任课老师">
                    <el-select v-model="select_department" placeholder="选择部门" class="handle-select mr10">
                        <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                        </el-option>
                    </el-select>

                    <el-select v-model="select_teacher" placeholder="选择教师" class="handle-select mr10">
                        <el-option v-for="item in teacherTable" :key="item.user_ID" :label="item.teacher_NAME" :value="item.user_ID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="editTeacher">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="删除课程" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCourse">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'TeacherTable',
        data() {
            return {
                // students:[],
                dis:false,
//                 classid:-1,
// //                classname:'',
                select_subject:'',
                select_department:'',
                select_teacher:'',
                select_class:'',
                select_semester:'',
                subjectTable:[],
                courseTable:[],
                departmentTable:[],
                teacherTable:[],
                classTable:[],
                semesterTable:[{
                    value: '20182019S',
                    label: '20182019S'
                }],
                addVisible: false,
                delVisible: false,
                editVisible: false,
                tableData: [],
                courseID:'',
//                teacherName:'',
                tit:'',
                searchFlag: true
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
            let url=window.location.href;
            let arr=url.split('=');
            // this.department_ID=arr[1];

            let api = this.$api.userApi.getCourseBySubject;
            api.data={
                SUBJECT_ID: parseInt(arr[1])
            };
            this.axios(api).then(response=>{
//                console.log(response);
                this.courseTable = response.data.data;
                this.searchFlag = false;
            });


// 下拉菜单
            let api2 = this.$api.userApi.listSubject;
            api2.data = {
            }
            this.axios(api2).then(response=>{
//                console.log(response);
//                console.log(arr[1]);
                this.subjectTable = response.data.data;
            }).then(()=>{
                if(arr[1] != -1){
                    for(let i=0;i<this.subjectTable.length;i++){
                        if(this.subjectTable[i].subject_ID === parseInt(arr[1])){
                            this.dis=true;
                            this.select_subject = this.subjectTable[i].subject_NAME;
                            break;
                        }
                    }
                }
            })
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                            d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        watch: {
            select_department(val){
                this.select_teacher = '';
                let api = this.$api.userApi.teacherDepartment;
                api.data={
                    DEPARTMENT_ID: this.select_department
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    this.teacherTable = response.data.data;
                });
            }
        },
        methods: {
            goBack(){
                this.$router.push('subject-table');
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                }
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            startEdit(row) {
                let api = this.$api.userApi.findDepartmentBySchool;
                let id = localStorage.getItem('schoolid');
                api.data = {
                    SCHOOL_ID: id
                }
                this.axios(api).then(response=>{
                    this.departmentTable = response.data.data;
                });

                this.editVisible = true;
                this.courseID = row.COURSE_ID;
                this.tit = "修改 " + row.CLASS_NAME + " - " + row.SUBJECT_NAME + " 的任课老师";
            },
            startAdd(){
                let api = this.$api.userApi.findDepartmentBySchool;
                let id = localStorage.getItem('schoolid');
                api.data = {
                    SCHOOL_ID: id
                }
                this.axios(api).then(response=>{
                    this.departmentTable = response.data.data;
                });

                let api2 = this.$api.userApi.findClassBySchool;
                api2.data = {
                    SCHOOL_ID: id
                };
                this.axios(api2).then(response=>{
                    this.classTable = response.data.data;
                });

                this.select_department = '';
                this.select_class = '';
                this.select_teacher = '';
                this.addVisible = true;
            },
            startDel(row) {
                this.delVisible = true;
                this.courseID = row.COURSE_ID;
            },
            addCourse(){
                let api = this.$api.userApi.addCourse;
                api.data = {
                    CLASS_ID: this.select_class,
                    TEACHER_ID: this.select_teacher,
                    SUBJECT_ID: this.select_subject,
                    SEMESTER: this.select_semester
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '添加课程成功',
                            type: 'success'
                        });
                        this.addVisible = false;
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '添加课程失败'
                        });
                    }
                });
            },
            editTeacher(){
                let api = this.$api.userApi.editCourse;
                api.data={
                    COURSE_ID: this.courseID,
                    TEACHER_ID: this.select_teacher
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '修改信息成功',
                            type: 'success'
                        });

                        let api = this.$api.userApi.getCourseBySubject;
                        api.data={
                            SUBJECT_ID: this.select_subject
                        };
                        this.axios(api).then(response=>{
//                            console.log(response);
                            this.courseTable = response.data.data;
//                            this.searchFlag = false;
                        });

                        this.editVisible = false;

//                        setTimeout(function () {
//                            window.location.reload();
//                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改信息失败'
                        });
                    }
                });
            },
            searchCourse(){
                let api = this.$api.userApi.getCourseBySubject;
                api.data={
                    SUBJECT_ID: this.select_subject
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    this.courseTable = response.data.data;
                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
            },

            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            // deleteTea(row) {
            //     // this.idx = index;
            //     this.delVisible = true;
            // },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
//            // 保存编辑
//            saveEdit() {
//                this.$set(this.tableData, this.idx, this.form);
//                this.editVisible = false;
//                this.$message.success(`修改第 ${this.idx+1} 行成功`);
//            },
            // 确定删除
            deleteCourse(){
                let api = this.$api.userApi.deleteCourse;
                api.data={
                    COURSE_ID: this.courseID
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '课程删除成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }
                    else if(response.data.code === 2){
                        this.$notify.error({
                            title: '失败',
                            message: '课程有考试安排，不能删除',
                        });
                    }
                    else{
                        this.$notify.error({
                            title: '失败',
                            message: '教师删除失败'
                        });
                    }
                })
            }
        }
    }

</script>

<style scoped>
    .classname {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 180px;
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
</style>
