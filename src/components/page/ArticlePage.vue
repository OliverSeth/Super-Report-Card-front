<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>文章页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--<div class="title">-->
                <!--标题：{{detail.article_TITLE}}-->
            <!--</div>-->
            <!--<div class="time">-->
                <!--发布时间：{{detail.article_TIME}}-->
            <!--</div>-->
            <mavon-editor
                    class="md"
                    :value="articleDetail.context"
                    :subfield = "prop.subfield"
                    :defaultOpen = "prop.defaultOpen"
                    :toolbarsFlag = "prop.toolbarsFlag"
                    :editable="prop.editable"
                    :scrollStyle="prop.scrollStyle"
            ></mavon-editor>
            <!--<mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>-->
            <el-button class="editor-btn" type="primary" @click="addStart">发表评论</el-button>
            <el-button class="editor-btn" type="danger" @click="modify" v-show="flag">修改</el-button>
            <el-button class="editor-btn" type="danger" @click="deleteF" v-show="flag">删除</el-button>
            <el-button class="editor-btn" type="primary" @click="goBack">返回</el-button>

            <!--评论-->
            <div class="board">
                <div class="board-tit">评论</div>
                <div id="none" style="display: none;"> 该文章暂无评论 </div>
                <div class="comment" v-for="comment in commentTable">
                    <div class="author">
                        {{comment.user_NAME}}
                        <span class="time">{{comment.comment_TIME}}</span>
                    </div>
                    <div class="comment-text">
                        {{comment.comment_TEXT}}
                    </div>
                    <el-button v-if="comment.comment_USER == readerID" type="text" class="red" icon="el-icon-edit" @click="editStart(comment)">修改</el-button>
                    <el-button v-if="flag" type="text" icon="el-icon-delete" class="red" @click="deleteStart(comment)">删除</el-button>
                </div>
            </div>


        </div>

        <!--添加评论提示框-->
        <el-dialog title="发表评论" :visible.sync="addVisible" width="30%">
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="comment_text" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 80%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addComment">确 定</el-button>
                <el-button @click="addVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--编辑评论提示框-->
        <el-dialog title="编辑评论" :visible.sync="editVisible" width="30%">
            <div style="text-align: center;">
                <el-form>
                    <el-input type="textarea" v-model="comment_text" :autosize="{ minRows: 3, maxRows: 6}" autocomplete="off" style="width: 80%;"></el-input>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editComment">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 删除评论提示框 -->
        <el-dialog title="提示" :visible.sync="delVisibleC" width="30%">
            <div class="del-dialog-cnt">删除评论不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisibleC = false">取 消</el-button>
                <el-button type="primary" @click="deleteComment">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除文章提示框 -->
        <el-dialog title="提示" :visible.sync="delVisibleA" width="30%">
            <div class="del-dialog-cnt">删除文章不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisibleA = false">取 消</el-button>
                <el-button type="primary" @click="deleteArticle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'markdown',
        data: function(){
            return {
                content:'',
                html:'',
                configs: {
                },
                articleDetail:{
                    context:''
                },
                prop:{
                    subfield:false,
                    defaultOpen:'preview',
                    toolbarsFlag:false,
                    editable:false,
                    scrollStyle: true
                },
                comment_text:'',
                commentTable:[],
                articleid: -1,
                readerID:-1,
                flag: false,
                emptyFlag: false,
                detail:{},
                delVisibleC: false,
                delVisibleA: false,
                addVisible: false,
                editVisible: false,
                idx: -1
            }
        },
        components: {
            mavonEditor
        },
        mounted(){
            let url = window.location.href;
            let arr = url.split('=');
            this.articleid = arr[1];

            let api = this.$api.userApi.getArticle;
            api.data={
                ARTICLE_ID: arr[1]
            };
            this.axios(api).then(response=>{
//                console.log(response);
                this.articleDetail.context = response.data.data.article_TEXT;
                let id = localStorage.getItem('id');
                this.detail = response.data.data;
                this.readerID = id;
                if(id == response.data.data.article_AUTHOR)
                    this.flag = true;
            });

            let api2 = this.$api.userApi.getComment;
            api2.data={
                ARTICLE_ID: arr[1]
            };
            this.axios(api2).then(response=>{
                console.log(response);
                this.commentTable = response.data.data;
//                console.log(this.commentTable.length);
                if(this.commentTable.length === 0)
                    document.getElementById("none").style.display="";
            });

        },
        methods: {
            goBack(){
                this.$router.push('/article-list');
            },
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                var formdata = new FormData();
                formdata.append('file', $file);
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$axios({
                    url: '/common/upload',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((url) => {
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit(){
                console.log(this.content);
                console.log(this.html);
                this.$message.success('提交成功！');
            },
            modify(){
                this.$router.push('/markdown?article_id='+ this.articleid);
            },
            deleteF(){
                this.delVisibleA = true;
            },
            addStart(){
                this.addVisible = true;
            },
            editStart(comment){
                this.editVisible = true;
                this.idx = comment.comment_ID;
                this.comment_text = comment.comment_TEXT;
//                console.log(comment);
            },
            deleteStart(comment){
                this.delVisibleC = true;
                this.idx = comment.comment_ID;
            },
            addComment(){
                let api = this.$api.userApi.addComment;
                let id = localStorage.getItem('id');
                api.data={
                    ARTICLE_ID: this.articleid,
                    COMMENT_USER: id,
                    COMMENT_TEXT: this.comment_text
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '发表评论成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '发表评论失败'
                        });
                    }
                });
            },
            editComment(){
                let api = this.$api.userApi.editComment;
                let id = localStorage.getItem('id');
                api.data={
                    COMMENT_ID: this.idx,
                    COMMENT_TEXT: this.comment_text
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '修改评论成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '修改评论失败'
                        });
                    }
                });
            },
            deleteComment(){
                let api = this.$api.userApi.deleteComment;
                api.data={
                    COMMENT_ID: this.idx,
                };
                this.axios(api).then(response=>{
//                    console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '删除评论成功',
                            type: 'success'
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 750);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '删除评论失败'
                        });
                    }
                });
            },
            deleteArticle(){
                let api = this.$api.userApi.delArticle;
                api.data={
                    ARTICLE_ID: this.articleid
                };
                this.axios(api).then(response=>{
                    console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '文章删除成功',
                            type: 'success'
                        });
                        location.reload();
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '文章删除失败'
                        });
                    }
                });

                this.$router.push('/article-list');
            }
        }
    }
</script>
<style scoped>
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .editor-btn{
        margin-top: 20px;
    }

    .board{
        width: 50%;
    }

    .board-tit{
        font-size: 23px;
        margin-top: 50px;
        margin-bottom: 30px;
    }

    #none{
        margin: 30px;
        color: #666;
        font-size: 14px;
    }

    .comment{
        margin: 10px;
        margin-bottom: 30px;
        border-bottom: 1px solid #f0f0f0;
    }

    .time{
        margin-left: 30px;
        color: #666;
        font-size: 14px;
    }

    .comment-text{
        margin: 15px;
    }
</style>
