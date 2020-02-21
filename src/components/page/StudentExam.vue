<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 考试列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="examList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="class_NAME" label="班级名" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_NAME" label="考试名" sortable width="200">
                </el-table-column>
                <el-table-column prop="exam_DATE" label="考试日期" sortable width="200">
                </el-table-column>
                <el-table-column prop="days_LEFT" label="剩余天数" width="200">
                </el-table-column>
                <!--<el-table-column prop="grade" label="分数" width="100">-->
                <!--</el-table-column>-->
                <el-table-column prop="seat" label="考试座位号" width="200">
                </el-table-column>
                <el-table-column prop="target" label="目标分数" width="150">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">设置目标分</el-button>
                        <!--<el-button type="text" icon="el-icon-tickets" @click="studentEdit(scope.row)">学生自评</el-button>-->
                        <!--<el-button type="text" icon="el-icon-tickets" @click="teacherComment(scope.row)">教师评价</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :current-page="currentPage">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="tit" :visible.sync="dialogFormVisible2" width="30%">
            <el-form>
                <el-form-item label="目标分" label-width="100px">
                    <el-input v-model="target" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑弹出框 -->

        <!-- 学生自评 -->
        <el-dialog :title="tit" :visible.sync="dialogFormVisibleS" width="30%">
            <div class="block" style="text-align: center; margin-bottom: 30px;">
                <span class="demonstration" style="font-size: 15px;">给本次考试的表现评分</span>
                <el-rate
                        v-model= "stu_value"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                </el-rate>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 15px; margin-bottom: 10px;">个人总结</div>
            </div>
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="stu_text" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 70%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="studentComment">确 定</el-button>
                <el-button @click="dialogFormVisibleS = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 教师评价 -->
        <el-dialog :title="tit" :visible.sync="dialogFormVisibleT" width="30%">
            <div class="block" style="text-align: center; margin-bottom: 30px;">
                <span class="demonstration" style="font-size: 15px;">本次考试中教师对你的评分</span>
                <el-rate
                        v-model= "tea_value"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                </el-rate>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 15px; margin-bottom: 10px;">教师评语</div>
            </div>
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="tea_text" :disabled="true" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 70%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!--<el-button type="primary" @click="studentComment">确 定</el-button>-->
                <el-button @click="dialogFormVisibleT = false">关 闭</el-button>
            </div>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: 'StudentExam',
        data() {
            return {
                tit:'',
                targetRow:{},
                detail:{},
                dialogFormVisible2:false,
                dialogFormVisibleS:false,
                dialogFormVisibleT:false,
                target:'',
                postForm:{
                    grade:''
                },
                stu_value:0,
                tea_value:0,
                stu_text:'',
                tea_text:'',
                students:[],
                postVisible:false,
                courseTable:[],
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
            // let api=this.$api.userApi.getCourse;
            let id=localStorage.getItem('id');
            // // console.log(id);
            // api.data={
            //     TEACHER_ID:id
            // };
            // this.axios(api).then(response=>{
            //     // console.log(response);
            //     this.courseTable=response.data.data;
            // });
            let api2=this.$api.userApi.findExamByStudent;
            api2.data={
                STUDENT_ID:id
            };
            this.axios(api2).then(response=>{
//                console.log(response);
                this.examList=response.data.data;
                this.total=response.data.data.length;
                for(let i=0;i<this.examList.length;i++){
                    if(this.examList[i].days_LEFT<0)
                        this.examList[i].days_LEFT='已考试';
                    else
                        this.examList[i].days_LEFT += ' 天';
                    if(this.examList[i].target === 0)
                        this.examList[i].target = '未设置';
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
            confirm(){
                let api=this.$api.userApi.setTarget;
                api.data={
                    GRADE_ID:this.targetRow.grade_ID,
                    TARGET:this.target
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code===0) {
                        this.$notify({
                            title: '成功',
                            message: '目标分设置成功',
                            type: 'success'
                        });
                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '目标分设置失败'
                        });
                    }
                })
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
//                if(row.days_LEFT>=0){
                    this.dialogFormVisible2=true;
                    this.tit='设置 '+row.exam_NAME+' 的目标分';
                    this.targetRow=row;
//                }else{
//                    this.$notify.error({
//                        title: '失败',
//                        message: '考试已结束'
//                    });
//                }
            },
            studentEdit(row){
                if(row.days_LEFT >= 0){
                    this.$notify.error({
                        title: '失败',
                        message: '考试还未进行'
                    });
                }
                else{
                    this.targetRow = row;
                    let api = this.$api.userApi.getGradeDetail;
                    api.data = {
                        GRADE_ID: this.targetRow.grade_ID
                    }
                    this.axios(api).then(response=>{
//                        console.log(response.data);
//                        console.log(this.stu_value);
//                        console.log(this.stu_text);
//                        console.log(response.data.data.s_COMMENT);
//                        console.log(response.data.data.s_SCORE);
                        this.stu_text = response.data.data.s_COMMENT;
                        this.stu_value = response.data.data.s_SCORE;
                    })
                    this.dialogFormVisibleS = true;
                    this.tit = row.exam_NAME + ' 的 学生自评';

                }
            },
            studentComment(){
                let api = this.$api.userApi.stuComment;
//                console.log(this.targetRow);
                api.data = {
                    GRADE_ID: this.targetRow.grade_ID,
                    S_COMMENT: this.stu_text,
                    S_SCORE: this.stu_value
                };
                this.axios(api).then(response=>{
                    if(response.data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '学生自评成功',
                            type: 'success'
                        });
//                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '上传失败'
                        });
                    }
                })
            },
            teacherComment(row){
                if(row.days_LEFT >= 0){
                    this.$notify.error({
                        title: '失败',
                        message: '考试还未进行'
                    });
                }
                else{
                    this.targetRow = row;
                    let api = this.$api.userApi.getGradeDetail;
                    api.data = {
                        GRADE_ID: this.targetRow.grade_ID
                    }
                    this.axios(api).then(response=>{
                        this.tea_text = response.data.data.t_COMMENT;
                        this.tea_value = response.data.data.t_SCORE;
                        console.log(response.data);
                    })
                    console.log(this.tea_value);
//                    if(this.tea_value === 0){
//                        this.$notify.error({
//                            title: '失败',
//                            message: '教师尚未评价'
//                        });
//                    }
//                    else{
                        this.dialogFormVisibleT = true;
                        this.tit = row.exam_NAME + ' 的 教师评价';
//                    }
                }
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
