<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 部门列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <el-table :data="departmentTable.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">

                <el-table-column prop="department_ID" label="部门号" sortable width="150">
                </el-table-column>
                <el-table-column prop="department_NAME" label="部门" width="200">
                </el-table-column>

                <el-table-column label="操作" width="450" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-tickets" @click="teacherinfo(scope.row)">查看教师</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteDep(scope.row)">删除部门</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" style="margin-top: 20px" @click="startAdd">添加部门</el-button>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" page-size="5"  layout="prev, pager, next" :total="total" :current-page="currentPage">
                </el-pagination>
            </div>

        </div>

        <!-- 添加弹出框 -->
        <el-dialog title="添加部门" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">

                <el-form-item label="部门名称">
                    <el-input v-model="form.departmentname"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDepartment">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDepartment">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: 'departmenttable',
        data() {
            return {
                departmentTable:[],
                url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    departmentname: '',
                    // date: '',
                    // schoolid: ''
                },
                idx: -1,
                currentPage:1,
                pagesize:10,
                total:''
            }
        },
        created() {
            this.getData();
        },
        mounted(){
            let api = this.$api.userApi.findDepartmentBySchool;
            let id = localStorage.getItem('schoolid');
            api.data = {
                SCHOOL_ID: id
            };
//            console.log(id);

            this.axios(api).then(response=>{
                // console.log(response);
                this.departmentTable=response.data.data;
                this.total=response.data.data.length;
//                console.log(this.departmentTable);
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
            //添加部门
            addDepartment(){
                let api=this.$api.userApi.addDepartment;
                let id=localStorage.getItem('schoolid');
                console.log(this.form.departmentname);
                api.data={
                    DEPARTMENT_NAME:this.form.departmentname,
                    SCHOOL_ID:id
                };
                console.log(id);
                this.axios(api).then(response=>{
                    console.log(response);
                    if(response.data.code===0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '增加部门成功',
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
                            message: '增加部门失败'
                        });
                    }
                })
            },
            deleteDep(row){
                this.idx = row.department_ID;
                this.delVisible = true;
            },
            deleteDepartment(){
                let api=this.$api.userApi.deleteDepartment;
                api.data={
                    DEPARTMENT_ID: this.idx
                };
                this.axios(api).then(response=>{
                    if(response.data.code===0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '删除部门成功',
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
                            message: '部门还有成员，不能删除'
                        });
                    }
                    else{
                        this.$notify.error({
                            title: '失败',
                            message: '删除部门失败'
                        });
                    }
                })
            },
            //弹出添加提示框
            startAdd(){
              this.editVisible=true;
            },
            teacherinfo(row){
                this.$router.push('/teacher-info?department_id='+row.department_ID);
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
