<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>成绩查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--<div class="classname">-->
            <!--<span>{{classname}}</span>-->
            <!--</div>-->
            <div class="handle-box">
                <el-select v-model="select_course" :disabled="dis" placeholder="选择课程" class="handle-select mr10">
                    <el-option v-for="item in courseTable" :key="item.COURSE_ID" :label="item.CLASS_NAME + ' - ' + item.SUBJECT_NAME" :value="item.COURSE_ID">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="searchGrade">查询</el-button>
            </div>
            <el-table :data="gradeTable" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
                <el-table-column prop="semester" label="学期" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_DATE" label="考试日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="exam_NAME" label="考试名称" width="300">
                </el-table-column>
                <el-table-column prop="grade" label="成绩" width="150">
                </el-table-column>
                <el-table-column prop="target" label="目标分" width="150">
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">设置目标分</el-button>-->
                        <el-button type="text" icon="el-icon-tickets" @click="studentEdit(scope.row)">学生自评</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="teacherComment(scope.row)">教师评价</el-button>
                    </template>
                </el-table-column>

                <!--<el-table-column label="操作" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button type="text" icon="el-icon-tickets" @click="exam(scope.row)">查看历史考试情况</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <!--<div class="pagination">-->
            <!--<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
            <!--</el-pagination>-->
            <!--</div>-->
            <!--<el-button type="primary" style="margin-top: 20px" @click="">添加考勤信息</el-button>-->

            <div id="hint" style="font-size: 13px; margin-top: 20px; margin-left: 20px; color: gray; display: none;">
                图表右上角有更多功能，可以转换为柱形图查看。
            </div>

            <div id="chart1" style="height: 400%; width: 50%; margin-top: 40px;"></div>

            <el-button type="primary" style="margin-top: 20px" @click="goBack">返回</el-button>
        </div>

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
        name: 'ClassTable',
        data() {
            return {
                dialogFormVisibleS:false,
                dialogFormVisibleT:false,
                postForm:{
                    grade:''
                },
                stu_value:0,
                tea_value:0,
                stu_text:'',
                tea_text:'',
                tit:'',
                students:[],
                dis:false,
                courseid:-1,
//                classname:'',
                select_course:'',
                courseTable:[],
                gradeTable:[],
            }
        },
        created() {
            // this.getData();
        },
        mounted(){
            let url=window.location.href;
            let arr=url.split('=');
            this.courseid=arr[1];


            let api=this.$api.userApi.getStuCourse;
            api.data={
                STUDENT_ID: localStorage.getItem('id'),
            };
            this.axios(api).then(response=>{
                this.courseTable = response.data.data;
            });
//            console.log(this.courseTable);


//            let api2 = this.$api.userApi.classinfo;
//            api2.data={
//                CLASS_ID:arr[1]
//            };
//            this.axios(api2).then(response=>{
////                console.log(response);
//                this.classname=response.data.data.class_NAME;
//            });

//            let api3 = this.$api.userApi.teacherclass;
//            api3.data={
//                USER_ID:localStorage.getItem('id')
//            };
//            this.axios(api3).then(response=>{
//                console.log(response);
////                console.log(arr[0]);
//                this.classTable=response.data.data;
//            }).then(()=>{
////                console.log(arr[0]==='class_id');
//                if(arr[1] != -1){
////                    console.log(12123123);
//                    for(let i=0;i<this.classTable.length;i++){
//                        if(this.classTable[i].CLASS_ID===parseInt(arr[1])){
//                            this.dis=true;
//                            this.select_class=this.classTable[i].CLASS_NAME;
//                            break;
//                        }
//                    }
//                }
//            })
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
                this.$router.push('table-s');
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
//                        console.log(response.data);
                    })
//                    console.log(this.tea_value);
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
            searchGrade(){
                let api = this.$api.userApi.getStuGrade;
                api.data = {
                    COURSE_ID: this.select_course,
                    USER_ID: localStorage.getItem('id')
                }
                this.axios(api).then(response=>{
                    this.gradeTable=response.data.data;

                    for(let i=0;i<this.gradeTable.length;i++){
                        if(this.gradeTable[i].grade === 0)
                            this.gradeTable[i].grade = '未发布';
                        if(this.gradeTable[i].target === 0)
                            this.gradeTable[i].target = '未设置';
                    }


                    document.getElementById("hint").style.display="";
                    let myCharts = this.$echarts.init(document.getElementById('chart1'));
                    let option = {
                        title : {
                            text: '考试情况分析',
                            subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['实际成绩','目标分数']
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {show: true, type: ['line', 'bar']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : []
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} 分'
                                }
                            }
                        ],
                        series : [
                            {
                                name:'实际成绩',
                                type:'line',
                                data:[],
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'目标分数',
                                type:'line',
                                data:[],
                                markPoint : {
                                    data : [
//                                    {name : '最低', value : -2, xAxis: 1, yAxis: -1.5}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name : '平均值'}
                                    ]
                                }
                            }
                        ]
                    };

                    console.log(this.gradeTable);

                    for(let i = 0; i < this.gradeTable.length; ++i){
                        option.xAxis[0].data.push(this.gradeTable[i].exam_DATE);
                        option.series[0].data.push(this.gradeTable[i].grade);
                        option.series[1].data.push(this.gradeTable[i].target);
                    }
                    myCharts.setOption(option);
                    window.addEventListener('resize',function() {myCharts.resize()});

                });
//                console.log(this.gradeTable);

            },
//            searchClass(){
//                let api=this.$api.userApi.getStulist;
//                api.data={
//                    CLASS_ID:this.select_class
//                };
//                this.axios(api).then(response=>{
//                    this.studentTable=response.data.data;
//                });
//            },
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
