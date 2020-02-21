<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="articleList.slice((currentPage-1)*pagesize,currentPage*pagesize)" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="article_TIME" label="文章日期" sortable width="150">
                </el-table-column>
                <el-table-column prop="article_TITLE" label="文章名称" sortable width="300">
                </el-table-column>
                <el-table-column prop="teacher_NAME" label="发布者" align="center" sortable width="250">
                </el-table-column>
                <el-table-column label="操作" width="450" align="center">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>-->
                        <!--<el-button type="text" icon="el-icon-lx-edit" @click="check(scope.row)">校准人数</el-button>-->
                        <!--<el-button type="text" icon="el-icon-lx-edit" @click="postGrade(scope.row)">发布成绩</el-button>-->
                        <!--<el-button type="text" icon="el-icon-tickets" @click="watchGrade(scope.row)">查看成绩</el-button>-->
                        <!--<el-button type="text" icon="el-icon-delete" class="red" @click="delete(scope.row)">删除</el-button>-->
                        <el-button type="text" icon="el-icon-tickets" @click="article(scope.row)">查看文章</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :current-page="currentPage">
                </el-pagination>
            </div>
        </div>

        <!--<el-dialog title="发布成绩" :visible.sync="postVisible" width="20%">-->
            <!--<el-form :model="postForm" label-width="100px">-->
                <!--<el-form-item label="姓名">-->
                    <!--<span style="text-align: center;margin-left: 30px">成绩</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item v-for="item in students"  :label="item.student_NAME">-->
                    <!--<el-input v-model="item.grade" style="width: 100px"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item>-->
                    <!--<el-button type="primary" @click="post">发布</el-button>-->
                    <!--<el-button type="info" @click="postVisible=false">取消</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</el-dialog>-->
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

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
        name: 'examinfo',
        data() {
            return {
                postForm:{
                    grade:''
                },
                students:[],
                articleList:[],
                // options:[],
                url: './vuetable.json',
                cur_page: 1,
                multipleSelection: [],
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
            let api = this.$api.userApi.listArticle;
            api.data={

            };
            this.axios(api).then(response=>{
//                 console.log(response);
                this.articleList = response.data.data;
                this.total=response.data.data.length;
                for(let i = 0; i < this.articleList.length; ++i){
                    this.articleList[i].teacher_NAME += ' 老师';
                }
            });

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
            article(row){
                this.$router.push('/article-page?article_id='+row.article_ID);
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
