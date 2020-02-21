<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 班级管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <el-table :data="classTable.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">

                <el-table-column prop="SCHOOL_NAME" label="学校名称" sortable width="150">
                </el-table-column>
                <el-table-column prop="CLASS_NAME" label="班级名称" width="200">
                </el-table-column>
                <el-table-column prop="TEACHER_NAME" label="班主任" width="200">
                </el-table-column>

                <el-table-column label="操作" width="450" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editCs(scope.row)">修改班主任</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="studentInfo(scope.row)">查看学生</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteCs(scope.row)">删除班级</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" style="margin-top: 20px" @click="startAdd">添加班级</el-button>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" page-size="5"  layout="prev, pager, next" :total="total" :current-page="currentPage">
                </el-pagination>
            </div>

        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加班级" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">

                <el-form-item label="班级名称">
                    <el-input v-model="form.className"></el-input>
                </el-form-item>

                <el-form-item label= "班主任">
                    <el-select v-model="select_department" placeholder="选择部门" class="handle-select mr10">
                        <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.teacher" placeholder="选择教师" class="handle-select mr10">
                        <el-option v-for="item in teacherTable" :key="item.user_ID" :label="item.teacher_NAME" :value="item.user_ID">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCs">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改班主任 -->
        <el-dialog :title="tit" :visible.sync="editVisibleC" width="30%">
            <el-form ref="form" :model="form" label-width="80px">

                <!--<el-form-item label="班级名称">-->
                    <!--<el-input v-model="form.className"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item label= "班主任">
                    <el-select v-model="select_department" placeholder="选择部门" class="handle-select mr10">
                        <el-option v-for="item in departmentTable" :key="item.department_ID" :label="item.department_NAME" :value="item.department_ID">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.teacher" placeholder="选择教师" class="handle-select mr10">
                        <el-option v-for="item in teacherTable" :key="item.user_ID" :label="item.teacher_NAME" :value="item.user_ID">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisibleC = false">取 消</el-button>
                <el-button type="primary" @click="editClas">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteClas">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    export default {
        components: {ElFormItem}, name: 'departmenttable',
        data() {
            return {
                classTable:[],
                departmentTable:[],
                teacherTable:[],
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_department: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                editVisibleC: false,
                form: {
                    className: '',
                    teacher:''
                },
                idx: -1,
                tit:'',
                currentPage:1,
                pagesize:10,
                total:''
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            let api = this.$api.userApi.getClassBySchool;
            let id = localStorage.getItem('schoolid');
            api.data = {
                SCHOOL_ID: id
            }
//            console.log(id);

            this.axios(api).then(response=>{
//                 console.log(response);
                this.classTable = response.data.data;
                this.total=response.data.data.length;
                console.log(this.classTable);
            })

            let api2 = this.$api.userApi.findDepartmentBySchool;
            api2.data = {
                SCHOOL_ID: id
            }
            this.axios(api2).then(response=>{
                this.departmentTable=response.data.data;
            });
        },
        watch: {
            select_department(val){
                this.form.teacher = '';
                let api = this.$api.userApi.teacherDepartment;
                api.data={
                    DEPARTMENT_ID: this.select_department
                };
                this.axios(api).then(response=>{
//                     console.log(response);
                    this.teacherTable=response.data.data;
//                     this.searchFlag = false;
                });
            }
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
            addCs(){
                let api = this.$api.userApi.addClass;
                let id=localStorage.getItem('schoolid');
                api.data = {
                    CLASS_NAME:this.form.className,
                    TEACHER_ID: this.form.teacher,
                    SCHOOL_ID:id
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code===0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '增加班级成功',
                            type: 'success'
                        });

                        // this.$router.push('/department-table');
                        // location.reload();
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '增加班级失败'
                        });
                    }
                })
            },
            editCs(row){
                this.idx = row.CLASS_ID;
                this.tit = "修改 " + row.CLASS_NAME + " 的班主任";
                this.editVisibleC = true;
            },
            deleteCs(row){
                this.idx = row.CLASS_ID;
                this.delVisible = true;
            },
            deleteClas(){
                let api = this.$api.userApi.deleteClass;
                api.data={
                    CLASS_ID: this.idx
                };
                this.axios(api).then(response=>{
                    if(response.data.code===0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '删除班级成功',
                            type: 'success'
                        });

                        // this.$router.push('/department-table');
                        // location.reload();
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else if(response.data.code === 2){
                        this.$notify.error({
                            title: '失败',
                            message: '班级还有成员，不能删除'
                        });
                    }
                    else{
                        this.$notify.error({
                            title: '失败',
                            message: '删除班级失败'
                        });
                    }
                })
            },
            editClas(){
                let api = this.$api.userApi.updateClass;
                api.data={
                    CLASS_ID: this.idx,
                    TEACHER_ID: this.form.teacher
                };
                this.axios(api).then(response=>{
                    console.log(response);
                    if(response.data.code===0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '修改班主任成功',
                            type: 'success'
                        });

                        // this.$router.push('/department-table');
                        // location.reload();
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);

                    }
                    else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改班主任失败'
                        });
                    }
                })
            },
            //弹出添加提示框
            startAdd(){
                this.editVisible = true;
            },
            studentInfo(row){
                this.$router.push('/student-table?class_id='+row.CLASS_ID);
            },
            // 分页导航
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData();
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
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            edit(row) {
                // this.idx = index;
                // const item = this.tableData[index];
                // this.form = {
                //     name: item.name,
                //     date: item.date,
                //     address: item.address
                // };
                // this.editVisible = true;
                this.$router.push('/form?exam_id='+row.exam_ID);
            },
            delete(row) {
                // this.idx = index;
                this.delVisible = true;
            },
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
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
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
</style>
