<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>教师信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="select_department" :disabled="dis" placeholder="选择部门" class="handle-select mr10">
                    <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                    </el-option>
                </el-select>
                <!--<el-select v-model="select_cate" placeholder="选择课程" class="handle-select mr10">-->
                <!--<el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME" :value="item.COURSE_ID">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <!--<el-button type="primary" icon="search" @click="searchClass">查询</el-button>-->
            </div>



            <el-table :data="teacherTable" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="teacher_NUM" label="教工号" sortable width="200">
                </el-table-column>
                <el-table-column prop="teacher_NAME" label="教师姓名" sortable width="250">
                </el-table-column>

                <el-table-column label="操作" width="500" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="changeTea(scope.row)">修改部门</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteTea(scope.row)">删除教师</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" style="margin-top: 20px" @click="searchTeacher" v-show = "searchFlag">查询</el-button>
            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog :title="tit" :visible.sync="editVisible" width="30%">
            <el-form ref="form" label-width="50px">
                <el-select v-model="select_change" placeholder="选择部门" class="handle-select mr10">
                    <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                    </el-option>
                </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
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
                select_department:'',
                select_change:'',
                departmentTable:[],
                teacherTable:[],
                delVisible: false,
                editVisible: false,
                tableData: [],
                teacherid:'',
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
            let api=this.$api.userApi.teacherDepartment;
            api.data={
                DEPARTMENT_ID:parseInt(arr[1])
            };
            this.axios(api).then(response=>{
//                console.log(response);
                this.teacherTable=response.data.data;
                this.searchFlag = false;
            });


// 下拉菜单
            let api3 = this.$api.userApi.findDepartmentBySchool;
            let id = localStorage.getItem('schoolid');
            api3.data = {
                SCHOOL_ID: id
            }
            this.axios(api3).then(response=>{
//                console.log(response);
//                console.log(arr[1]);
                this.departmentTable=response.data.data;
            }).then(()=>{
                if(arr[1] != -1){
                    for(let i=0;i<this.departmentTable.length;i++){
                        if(this.departmentTable[i].department_ID===parseInt(arr[1])){
                            this.dis=true;
                            this.select_department=this.departmentTable[i].department_NAME;
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
        methods: {
            goBack(){
                this.$router.push('department-table');
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
            changeTea(row) {
                this.editVisible = true;
                this.teacherid = row.user_ID;
                this.tit = "修改 " + row.teacher_NAME + " 的部门";
            },
            deleteTea(row) {
                this.delVisible = true;
                this.teacherid = row.user_ID;
            },
            saveEdit(){
                let api = this.$api.userApi.updateTeacherByDepartment;
                api.data={
                    DEPARTMENT_ID: this.select_change,
                    TEACHER_ID: this.teacherid
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '修改部门成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改部门失败'
                        });
                    }
                });
            },
            searchTeacher(){
                 let api = this.$api.userApi.teacherDepartment;
                 api.data={
                     DEPARTMENT_ID: this.select_department
                 };
                 this.axios(api).then(response=>{
//                     console.log(response);
                     this.teacherTable=response.data.data;
//                     this.searchFlag = false;
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
            deleteRow(){
                // this.tableData.splice(this.idx, 1);
                // this.$message.success('删除成功');
                // this.delVisible = false;
                let api=this.$api.userApi.deleteTeacher;
                api.data={
                    TEACHER_ID:this.teacherid
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '教师删除成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }
                    else if(response.data.code === 3){
                        this.$notify.error({
                            title: '失败',
                            message: '教师有进行中的课程，不能删除',
                        });
                    }
                    else if(response.data.code === 4){
                        this.$notify.error({
                            title: '失败',
                            message: '教师为班主任，不能删除',
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
