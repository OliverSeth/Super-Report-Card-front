<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>班级信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="select_class" :disabled="dis" placeholder="选择班级" class="handle-select mr10">
                    <el-option v-for="item in classTable" :key="item.class_ID" :label="item.class_NAME" :value="item.class_ID">
                    </el-option>
                </el-select>
                <!--<el-select v-model="select_cate" placeholder="选择课程" class="handle-select mr10">-->
                <!--<el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME" :value="item.COURSE_ID">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="searchClass">查询</el-button>
            </div>

            <div id="count" style="display: none; font-size: 13px; margin: 16px; color: gray;">
                班级人数为：{{studentCount}}人
            </div>


            <el-table :data="studentTable" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="student_NUM" label="学号" sortable width="200">
                </el-table-column>
                <el-table-column prop="student_NAME" label="学生姓名" sortable width="250">
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="deleteRow(scope.row)">删除学生</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>
        </div>




        <!-- 编辑弹出框 -->
        <!--<el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
        <!--<el-form ref="form" :model="form" label-width="50px">-->
        <!--<el-form-item label="日期">-->
        <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="姓名">-->
        <!--<el-input v-model="form.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="地址">-->
        <!--<el-input v-model="form.address"></el-input>-->
        <!--</el-form-item>-->

        <!--</el-form>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="editVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="saveEdit">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->

        <!--删除提示框-->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteStu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'ClassTable',
        data() {
            return {

                postForm:{
                    grade:''
                },
                students:[],
                dis:false,
                delVisible: false,
                classid:-1,
//                classname:'',
                select_class:'',
                classTable:[],
                studentTable:[],
                studentCount:0,
                idx: -1
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
            let url=window.location.href;
            let arr=url.split('=');
            this.classid=arr[1];
            let api=this.$api.userApi.getStulist;
            api.data={
                CLASS_ID:arr[1]
            };
            this.axios(api).then(response=>{
//                console.log(response);
                this.studentTable=response.data.data;
                this.studentCount = response.data.data.length;
                document.getElementById("count").style.display="";
            });


//            let api2 = this.$api.userApi.classinfo;
//            api2.data={
//                CLASS_ID:arr[1]
//            };
//            this.axios(api2).then(response=>{
////                console.log(response);
//                this.classname=response.data.data.class_NAME;
//            });

            let api3 = this.$api.userApi.findClassBySchool;
            api3.data={
                SCHOOL_ID: localStorage.getItem('schoolid')
            };
            this.axios(api3).then(response=>{
//                console.log(response);
//                console.log(arr[0]);
                this.classTable = response.data.data;
            }).then(()=>{
                console.log(arr[1]);
                if(arr[1] != -1){
                    for(let i=0;i<this.classTable.length;i++){
                        if(this.classTable[i].class_ID === parseInt(arr[1])){
                            this.dis = true;
                            this.select_class = this.classTable[i].class_NAME;
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
                this.$router.push('class-table');
            },
            post(){
                let gradeArr=[];
                let gradeIdArr=[];
                for(let i=0;i<this.students.length;i++){
                    gradeArr.push(this.students[i].grade);
                    gradeIdArr.push(this.students[i].grade_ID);
                }
                let grade=gradeArr.join(',');
                let gradeId=gradeIdArr.join(',');
                // console.log(grade);
                // console.log(gradeId);
                let api=this.$api.userApi.postGrade;
                api.data={
                    GRADE:grade,
                    GRADE_ID:gradeId
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '成绩发布成功',
                            type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '成绩发布失败'
                        });
                    }
                });
                this.postVisible=false;
            },
            searchClass(){
                let api=this.$api.userApi.getStulist;
                api.data={
                    CLASS_ID:this.select_class
                };
                this.axios(api).then(response=>{
                    this.studentTable=response.data.data;
                    this.studentCount = response.data.data.length;
//                    console.log(this.studentCount);
//                    console.log(this.studentTable);
                    document.getElementById("count").style.display="";
                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                // this.getData();
            },
            // 获取 easy-mock 的模拟数据
            // getData() {
            //     // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
            //     if (process.env.NODE_ENV === 'development') {
            //         this.url = '/ms/table/list';
            //     };
            //     this.$axios.post(this.url, {
            //         page: this.cur_page
            //     }).then((res) => {
            //         this.tableData = res.data.list;
            //     })
            // },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            deleteRow(row) {
                this.idx = row.user_ID;
                this.delVisible = true;
            },
            deleteStu(){
                console.log(this.idx);
                let api = this.$api.userApi.deleteStudent;
                api.data={
                    STUDENT_ID: this.idx
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0){
                        this.editVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '删除学生成功',
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
                            message: '删除学生失败'
                        });
                    }
                })
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
