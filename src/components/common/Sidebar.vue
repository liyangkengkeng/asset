<template>
    <div class="sidebar">
        <template v-if='show'>
            <div v-for="(item,index) in items" class="" v-if='!item.meta.hide'>
                <div class="flex al-ce jc-sb marginB20 cp paddingTB10" @click='nav(item,index)'>
                    <div class="flex al-ce">
                        <p class='sidebar-i'><img :src="item.meta.icon" alt=""></p>
                        {{item.meta.title}}
                    </div>
                    <div><i class="el-icon-arrow-up arrow-down1" :class="item.show ? '' : 'arrow-down'"></i></div>
                </div>
                <div class="senior" :style='{maxHeight: (item.show ? item.children.length*70+"px" : "0px")}'>
                    <template v-for='val in item.children'  v-if='!val.meta.boo'>
                        <router-link :to='val.path' class='sidebar-a'>
                            <span :class="url.indexOf(val.path)>-1 && url.indexOf('hellow')<0 ? 'color' : ''">{{ val.meta.title }}</span>
                        </router-link>
                    </template>
                </div>
            </div>
        </template>
        <template v-else>
            <div v-for="(item,index) in items" class="" v-if='item.res && !item.meta.hide'>
                <div class="flex al-ce jc-sb marginB20 cp paddingTB10" @click='nav(item,index)'>
                    <div class="flex al-ce"><p class='sidebar-i'><img :src="item.meta.icon" alt=""></p>{{item.meta.title}}</div>
                    <div><i class="el-icon-arrow-up arrow-down1" :class="item.show ? '' : 'arrow-down'"></i></div>
                </div>
                <div class="senior" :style='{maxHeight: (item.show ? item.children.length*70+"px" : "0px")}'>
                    <template v-for='val in item.children'  v-if='!val.meta.boo && item.res'>
                        <router-link :to='val.path' class='sidebar-a'>
                            <span :class="url.indexOf(val.path)>-1 && url.indexOf('hellow')<0 ? 'color' : ''">{{ val.meta.title }}</span>
                        </router-link>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [],
                activeNames:[],
                url:'',
                show:false,
            }
        },
        computed:{
        },
        created(){
            var self=this
            self.items=[]
            self.ajax({
                mode: 'get',
                url: '/ems/api/user/getResource/'+0,
                data: {},
                success(res){
                    for(let i=0;i<self.$router.options.routes.length;i++){
                        if(self.$router.options.routes[i].name=='index'){
                            for(let j=0;j<self.$router.options.routes[i].children.length;j++){
                                // 当前路由页面高亮
                                if(self.$router.options.routes[i].children[j].meta.index==self.$route.meta.index){
                                    self.$router.options.routes[i].children[j].show=true
                                }

                                if(!res.data.body.resCodes){  //权限为空，全部显示
                                    self.show=true
                                    return false
                                }
                                if(res.data.body.resCodes.indexOf(self.$router.options.routes[i].children[j].name)>-1){
                                    self.$router.options.routes[i].children[j].res=true//获取权限，显示对应导航列表
                                }else{
                                    self.$router.options.routes[i].children[j].res=false
                                }
                                for(let x=0;x<self.$router.options.routes[i].children[j].children.length;x++){
                                    if(res.data.body.resCodes.indexOf(self.$router.options.routes[i].children[j].children[x].name)>-1){
                                        self.$router.options.routes[i].children[j].children[x].res=true //获取权限，显示对应导航列表
                                    }else{
                                        self.$router.options.routes[i].children[j].children[x].res=false
                                    }
                                }
                            }
                            // 获取左侧导航列表
                            self.items=self.$router.options.routes[i].children
                        }
                    }
                }
            })
            this.url=this.$route.path
        },

        methods:{
            nav(item,index){
                this.$set(this.items[index], 'show', !item.show)
            }
        },
        watch:{
            $route(val){
                this.url=val.path
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        width: 250px;
        padding:20px;
        box-sizing: border-box;
        background: rgb(50, 65, 87);
        color:#fff
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-i{
        width: 20px;font-size: 18px;margin-right: 10px;overflow: hidden;
    }
    .sidebar-i img{
        display: block;width: 100%;
        /*border-right: 20px solid transparent;border-left: 20px solid transparent;
        -webkit-filter:drop-shadow(-20px 0 rgb(255, 255, 255));
        filter:drop-shadow(-20px 0 rgb(255, 255, 255));
        margin-left: 0px;*/
    }
    .sidebar-a{
        display: block;
        padding:10px 24px;
        margin-bottom: 20px;
        color:#fff;
    }
    .sidebar-box a:last-child{
        margin-bottom: 0px;
    }
    .senior{
        max-height: 0px;
        will-change:height;
        overflow-y: hidden;
        transition: max-height 0.5s;
        -moz-transition: max-height 0.5s;   /* Firefox 4 */
        -webkit-transition: max-height 0.5s;    /* Safari 和 Chrome */
        -o-transition: max-height 0.5s; /* Opera */
    }

    .arrow-down1{
        transition: 0.5s;
    }
    .arrow-down{
        transform: rotate(180deg);
    }
</style>
