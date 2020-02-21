<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 编辑器</el-breadcrumb-item>
                <!--<el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title" style="margin-bottom: 40px;">
                标题：
                <el-input v-model="title" style="width: 40%;" :clearable= true></el-input>
            </div>
            <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" style="min-height: 600px"/>
            <el-button class="editor-btn" type="primary" @click="submit" v-show="submitFlag">发布文章</el-button>
            <el-button class="editor-btn" type="danger" @click="modify" v-show="modifyFlag">修改</el-button>
            <el-button class="editor-btn" type="primary" @click="goBack">返回</el-button>
        </div>
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
                title:'',
                articleid:-1,
                submitFlag: true,
                modifyFlag: false,
                delVisible: false
            }
        },
        components: {
            mavonEditor
        },
        mounted(){
            let url = window.location.href;
            let arr = url.split('=');
            this.examId = arr[1];
            let api = this.$api.userApi.getArticle;
            api.data = {
                ARTICLE_ID:arr[1]
            };
            this.axios(api).then(response=>{
                console.log(response);
                this.content = response.data.data.article_TEXT;
                this.title = response.data.data.article_TITLE;
                this.articleid = response.data.data.article_ID;
                this.modifyFlag = true;
                this.submitFlag = false;
            });
        },
        methods: {
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
            goBack(){
                this.$router.push('/article-list');
            },
            submit(){
//                console.log(this.content);
//                console.log(this.html);
                let api = this.$api.userApi.addArticle;
                api.data = {
                    ARTICLE_TITLE: this.title,
                    ARTICLE_TEXT: this.content,
                    ARTICLE_AUTHOR: localStorage.getItem('id')
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '文章发布成功',
                            type: 'success'
                        });
//                        location.reload();
                        this.$router.push('/article-list');
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '文章发布失败'
                        });
                    }
                });

//                this.$message.success('提交成功！');
            },
            modify(){
                let api = this.$api.userApi.updateArticle;
                api.data = {
                    ARTICLE_TITLE: this.title,
                    ARTICLE_TEXT: this.content,
                    ARTICLE_ID: this.articleid
                };
                this.axios(api).then(response=>{
                    // console.log(response);
                    if(response.data.code === 0){
                        this.$notify({
                            title: '成功',
                            message: '文章修改成功',
                            type: 'success'
                        });
//                        location.reload();
                        this.$router.push('/article-page?article_id='+ this.articleid);
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '文章修改失败'
                        });
                    }
                    this.delVisible = false;
                });
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>
