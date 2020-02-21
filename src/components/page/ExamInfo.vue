<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 考试列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-select v-model="select_subject" placeholder="选择课程" class="handle-select mr10">
                    <el-option v-for="item0 in courseTable" :key="item0.COURSE_ID" :label="item0.CLASS_NAME+' - '+item0.SUBJECT_NAME" :value="item0.COURSE_ID">
                    </el-option>

                </el-select>
                <!--<el-select v-model="select_cate" placeholder="选择课程" class="handle-select mr10">-->
                    <!--<el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME" :value="item.COURSE_ID">-->
                    <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="searchCourse">查询</el-button>
            </div>
            <el-table :data="examList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="class_NAME" label="班级名" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_NAME" label="考试名" sortable width="200">
                </el-table-column>
                <el-table-column prop="exam_DATE" label="考试日期" sortable width="200">
                </el-table-column>
                <el-table-column prop="days_LEFT" label="剩余天数" sortable>
                </el-table-column>
                <el-table-column label="操作" width="700" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-lx-edit" @click="check(scope.row)">校准人数</el-button>
                        <el-button type="text" icon="el-icon-lx-edit" @click="seatStart(scope.row)">座位安排</el-button>
                        <el-button type="text" icon="el-icon-lx-edit" @click="postGrade(scope.row)">发布成绩</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="watchGrade(scope.row)">查看成绩</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="delGrade(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="10" :current-page="currentPage">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="发布成绩" :visible.sync="postVisible" width="20%">
            <el-form :model="postForm" label-width="100px">
                <el-form-item label="姓名">
                    <span style="text-align: center;margin-left: 30px">成绩</span>
                </el-form-item>
                <el-form-item v-for="item in students"  :label="item.student_NAME">
                    <el-input v-model="item.grade" style="width: 100px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="post">发布</el-button>
                    <el-button type="info" @click="postVisible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--&lt;!&ndash; 编辑弹出框 &ndash;&gt;-->
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

        <!-- 座位安排 -->
        <el-dialog :title="tit" :visible.sync="seatVisible" width="40%">

            <el-table :data="seatTable" border ref="multipleTable" style="font-size: 14px; width: 500px; margin:0 auto;" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="STUDENT_NUM" label="学生学号" sortable width="150">
                </el-table-column>
                <el-table-column prop="STUDENT_NAME" label="学生姓名" >
                </el-table-column>
                <el-table-column prop="SEAT" label="座位号" sortable width="180">
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="inOrder">按学号顺序排序</el-button>
                <el-button type="primary" @click="reverseOrder">按学号逆序排序</el-button>
                <el-button type="primary" @click="randomOrder">随机排序</el-button>
                <el-button @click="seatVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="30%">
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
        name: 'examinfo',
        data() {
            return {
                postForm:{
                    grade:''
                },
                students:[],
                postVisible:false,
                courseTable:[],
                seatTable:[],
                // options:[],
                url: './vuetable.json',
                examList:[],
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_subject:'',
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                seatVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: '',
                },
                idx: -1,
                currentPage:1,
                pagesize:10,
                total:''
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
            let api=this.$api.userApi.getCourse;
            let id=localStorage.getItem('id');
            // console.log(id);
            api.data={
                TEACHER_ID:id
            };
            this.axios(api).then(response=>{
                // console.log(response);
                this.courseTable=response.data.data;
            });
            let api2=this.$api.userApi.findExam;
            api2.data={
                TEACHER_ID:id
            };
            this.axios(api2).then(response=>{
                // console.log(response);
                this.examList=response.data.data;
                this.total=response.data.data.length;
                for(let i=0;i<this.examList.length;i++){
                    if(this.examList[i].days_LEFT<0)
                        this.examList[i].days_LEFT='已考试';
                }
                // console.log(this.examList);
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
            watchGrade(row){
                if(row.days_LEFT>=0){
                    this.$notify.error({
                        title: '失败',
                        message: '考试未进行'
                    });
                }else{
                    this.$router.push('/grade-table?exam_id='+row.exam_ID);
                }
            },
            check(row){
                let api = this.$api.userApi.examCount;
                api.data={
                    EXAM_ID: row.exam_ID
                };
                this.axios(api).then(response=>{
                    if(response.data.code===0){
                        this.$notify({
                            title: '成功',
                            message: '信息更新成功，请重新安排座位',
                            type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '信息更新失败'
                        });
                    }
                })
            },
            post(){
                let gradeArr=[];
                let gradeIdArr=[];
                for(let i=0;i<this.students.length;i++){
                    if(this.students[i].grade>150||this.students[i].grade<0){
                        this.$notify.error({
                            title: '失败',
                            message: '分数应在0-150之间'
                        });
                        return ;
                    }else{
                        gradeArr.push(this.students[i].grade);
                        gradeIdArr.push(this.students[i].grade_ID);
                    }
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
            searchCourse(){
                // for(let i=0;i<this.courseTable.length;i++){
                //     console.log(i);
                //     console.log(this.select_subject);
                //     if(this.select_subject===this.courseTable[i].CLASS_NAME.toString()+this.courseTable[i].SUBJECT_NAME.toString()){
                //         console.log(i);
                //         courseId=parseInt(this.courseTable[i].COURSE_ID);
                //         break;
                //     }
                // }
                let api2=this.$api.userApi.getExams;
                api2.data={
                    COURSE_ID:this.select_subject
                };
                this.axios(api2).then(response=>{
                    // console.log(response);
                    this.examList=response.data.data;
                    this.total=response.data.data.length;
                    for(let i=0;i<this.examList.length;i++){
                        if(this.examList[i].days_LEFT<0)
                            this.examList[i].days_LEFT='已考试';
                    }
                    // console.log(this.examList);
                });
                // location.reload();
            },
            postGrade(row){
                if(row.days_LEFT!=='已考试'){
                    this.$notify.error({
                        title: '失败',
                        message: '考试未进行'
                    });
                    return;
                }
                let api=this.$api.userApi.getGradeTable;
                api.data={
                    EXAM_ID:row.exam_ID
                };
                this.axios(api).then(response=>{
                    console.log(response);
                    this.students=response.data.data;
                });
                this.postVisible=true;
            },
            addExam(row){
                localStorage.setItem('id',row.COURSE_ID);
                this.$router.push('/form');
            },
            // 分页导航
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
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
            edit(row) {
                // this.idx = index;
                // const item = this.tableData[index];
                // this.form = {
                //     name: item.name,
                //     date: item.date,
                //     address: item.address
                // };
                // this.editVisible = true;
                for(let i=0;i<this.examList.length;i++){
                    if(this.examList[i].exam_ID===row.exam_ID){
                        if(this.examList[i].days_LEFT==='已考试'){
                            this.$notify.error({
                                title: '失败',
                                message: '考试时间已过，无法修改'
                            });
                        }else{
                            this.$router.push('/form?exam_id='+row.exam_ID);
                        }
                    }
                }
            },
            delGrade(row) {
                this.idx = row.exam_ID;
//                console.log(123);
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
                let api = this.$api.userApi.delExam;
                api.data = {
                    EXAM_ID: this.idx
                };
                this.axios(api).then(response=>{
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '考试删除成功',
                            type: 'success'
                        });
                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '考试删除失败'
                        });
                    }
                })

//                this.tableData.splice(this.idx, 1);
//                this.$message.success('删除成功');
                this.delVisible = false;
            },
            seatStart(row){
                this.idx = row.exam_ID;
                let api = this.$api.userApi.getSeat;
                api.data = {
                    EXAM_ID: this.idx
                };
                this.axios(api).then(response=>{
                    console.log(response);
                    this.seatTable = response.data.data;
                })

                this.tit = row.exam_NAME + " 的座位安排";
                this.seatVisible = true;
            },
            inOrder(){
                let api = this.$api.userApi.inOrder;
                api.data = {
                    EXAM_ID: this.idx
                };
                this.axios(api).then(response=>{
//                    console.log(response);

                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '修改座位成功',
                            type: 'success'
                        });
//                        setTimeout(function () {
//                            window.location.reload();
//                        }, 750);
//                        this.idx = row.exam_ID;
//                        this.tit = row.exam_NAME + " 的座位安排";
//                        this.seatVisible = true;
                        let api2 = this.$api.userApi.getSeat;
                        api2.data = {
                            EXAM_ID: this.idx
                        };
                        this.axios(api2).then(response=>{
                            console.log(response);
                            this.seatTable = response.data.data;
                        })

                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改座位失败'
                        });
                    }
                })
            },
            reverseOrder(){
                let api = this.$api.userApi.reverseOrder;
                api.data = {
                    EXAM_ID: this.idx
                };
                this.axios(api).then(response=>{
//                    console.log(response);

                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '修改座位成功',
                            type: 'success'
                        });
//                        setTimeout(function () {
//                            window.location.reload();
//                        }, 750);
//                        this.idx = row.exam_ID;
//                        this.tit = row.exam_NAME + " 的座位安排";
//                        this.seatVisible = true;
                        let api2 = this.$api.userApi.getSeat;
                        api2.data = {
                            EXAM_ID: this.idx
                        };
                        this.axios(api2).then(response=>{
                            console.log(response);
                            this.seatTable = response.data.data;
                        })

                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改座位失败'
                        });
                    }
                })
            },
            randomOrder(){
                let api = this.$api.userApi.randomOrder;
                api.data = {
                    EXAM_ID: this.idx
                };
                this.axios(api).then(response=>{
//                    console.log(response);

                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '修改座位成功',
                            type: 'success'
                        });
//                        setTimeout(function () {
//                            window.location.reload();
//                        }, 750);
//                        this.idx = row.exam_ID;
//                        this.tit = row.exam_NAME + " 的座位安排";
//                        this.seatVisible = true;
                        let api2 = this.$api.userApi.getSeat;
                        api2.data = {
                            EXAM_ID: this.idx
                        };
                        this.axios(api2).then(response=>{
                            console.log(response);
                            this.seatTable = response.data.data;
                        })

                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改座位失败'
                        });
                    }
                })
            }
        }
    }

</script>

<style scoped>
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
