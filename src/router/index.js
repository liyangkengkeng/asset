import Vue from 'vue';
import router from 'vue-router';

Vue.use(router);

export default new router({
    // mode:'history',
    routes: [
        {
            path: '',
            redirect: '/login'
        },
        {
        	path: '/index',
            name:'index',
            component: resolve => require(['@/page/index.vue'], resolve),
            meta: { title: '资产管理后台系统' },
            redirect: '/entering/hellow',
            children:[
            	{
		            path: '/asset/index',
		            component: resolve => require(['@/page/asset/index.vue'], resolve),
		            meta: { title: '资产管理' ,icon: require('@/assets/entering.png'),index:1},
                    name:'asset',
                    show:true,
                    children:[
                        {
                            path: '/entering/hellow',
                            name:'hellow',
                            component: resolve => require(['@/page/asset/entering/hellow.vue'], resolve),
                            meta: { title: '欢迎',boo:true,index:1}
                        },{
                            path: '/entering',
                            name:'entering',
                            component: resolve => require(['@/page/asset/entering/index.vue'], resolve),
                            meta: { title: '资产列表',index:1},
                            redirect: '/entering/list',
                            children:[{
                                path: '/entering/add',
                                name:'add',
                                component: resolve => require(['@/page/asset/entering/add.vue'], resolve),
                                meta: { title: '录入资产',index:1},
                            },{
                                path: '/entering/list',
                                name:'entering_list',
                                component: resolve => require(['@/page/asset/entering/list.vue'], resolve),
                                meta: { title: '资产列表',index:1},
                            }]
                        },{
                            path: '/property/index',
                            name:'property',
                            component: resolve => require(['@/page/asset/property/index.vue'], resolve),
                            meta: { title: '资产属性管理',index:1}
                        }
                    ]
		        },
                {
                    path: '/order/index',
                    name:'order',
                    component: resolve => require(['@/page/order/index.vue'], resolve),
                    meta: { title: '订单管理' ,icon: require('@/assets/order.png'),index:2},
                    show:true,
                    children:[{
                        path: '/borrow/index',
                        name:'borrow',
                        component: resolve => require(['@/page/order/borrow/index.vue'], resolve),
                        meta: { title: '借用订单管理',index:2}
                    },{
                        path: '/repair/index',
                        name:'repair',
                        component: resolve => require(['@/page/order/repair/index.vue'], resolve),
                        meta: { title: '维修管理',index:2}
                    },{
                        path: '/scrap/index',
                        name:'scrap',
                        component: resolve => require(['@/page/order/scrap/index.vue'], resolve),
                        meta: { title: '报废管理',index:2}
                    },{
                        path: '/Yearly/index',
                        name:'Yearly-inspection',
                        component: resolve => require(['@/page/order/Yearly-inspection/index.vue'], resolve),
                        meta: { title: '年检管理',index:2}
                    },{
                        path: '/lose/index',
                        name:'lose',
                        component: resolve => require(['@/page/order/lose/index.vue'], resolve),
                        meta: { title: '丢失管理',index:2}
                    }]
                },
                {
                    path: '/alarm/index',
                    name:'alarm',
                    component: resolve => require(['@/page/alarm/index.vue'], resolve),
                    meta: { title: '告警管理' ,icon: require('@/assets/alarm.png'),index:3},
                    show:true,
                    children:[{
                        path: '/alarm/alarm',
                        name:'alarms',
                        component: resolve => require(['@/page/alarm/alarm.vue'], resolve),
                        meta: { title: '告警记录',index:3}
                    }]
                },
                {
                    path: '/warehouse/index',
                    name:'warehouse',
                    component: resolve => require(['@/page/warehouse/index.vue'], resolve),
                    meta: { title: '仓库管理' ,icon:  require('@/assets/warehouse.png'),index:4},
                    show:true,
                    children:[{
                        path: '/warehouse',
                        name:'warehouseIndex',
                        component: resolve => require(['@/page/warehouse/index.vue'], resolve),
                        meta: { title: '仓库管理',index:4},
                        redirect: '/warehouse/list',
                        children:[{
                            path: '/warehouse/add',
                            name:'addWarehouse',
                            component: resolve => require(['@/page/warehouse/add.vue'], resolve),
                            meta: { title: '创建仓库',index:4},
                        },{
                            path: '/warehouse/list',
                            name:'warehouse_list',
                            component: resolve => require(['@/page/warehouse/list.vue'], resolve),
                            meta: { title: '仓库列表',index:4},
                        }]
                    }]
                },
                {
                    path: '/system/index',
                    name:'system',
                    component: resolve => require(['@/page/system/index.vue'], resolve),
                    meta: { title: '系统管理' ,icon: require('@/assets/system.png'),index:5},
                    show:false,
                    children:[
                    {
                        path: '/staff',
                        name:'staff',
                        component: resolve => require(['@/page/system/staff/index.vue'], resolve),
                        meta: { title: '人员管理',index:5},
                        redirect: '/staff/list',
                        children:[{
                            path: '/staff/add',
                            name:'addStaff',
                            component: resolve => require(['@/page/system/staff/add.vue'], resolve),
                            meta: { title: '创建人员',index:5},
                        },{
                            path: '/staff/list',
                            name:'staffList',
                            component: resolve => require(['@/page/system/staff/list.vue'], resolve),
                            meta: { title: '用户列表',index:5},
                        }]
                    },{
                        path: '/organize',
                        name:'organize',
                        component: resolve => require(['@/page/system/organize/index.vue'], resolve),
                        meta: { title: '组织管理',index:5},
                        redirect: '/organize/list',
                        children:[{
                            path: '/organize/add',
                            name:'addOrganize',
                            component: resolve => require(['@/page/system/organize/add.vue'], resolve),
                            meta: { title: '创建组织',index:5},
                        },{
                            path: '/organize/list',
                            name:'organizeList',
                            component: resolve => require(['@/page/system/organize/list.vue'], resolve),
                            meta: { title: '组织列表',index:5},
                        }]
                    },{
                        path: '/role',
                        name:'role',
                        component: resolve => require(['@/page/system/role/index.vue'], resolve),
                        meta: { title: '角色管理',index:5},
                        redirect: '/role/list',
                        children:[{
                            path: '/role/add',
                            name:'addRole',
                            component: resolve => require(['@/page/system/role/add.vue'], resolve),
                            meta: { title: '创建角色',index:5},
                        },{
                            path: '/role/list',
                            name:'roleList',
                            component: resolve => require(['@/page/system/role/list.vue'], resolve),
                            meta: { title: '角色列表',index:5},
                        }]
                    }]
                },  
                {
                  path: '/update',
                  name:'update',
                  component: resolve => require(['@/page/update/index.vue'], resolve),
                  meta: { title: '升级系统'  ,icon: require('@/assets/entering.png'),index:6,hide:true},
                  redirect:'/android',
                  children:[
                    {
                      path: '/android',
                      name:'android',
                      component: resolve => require(['@/page/update/android/index.vue'], resolve),
                      show:true,
                      meta: { title: 'APP升级配置' },
                    },
                    {
                      path: '/androidAdd',
                      name:'android_add',
                      component: resolve => require(['@/page/update/android/add.vue'], resolve),
                      show:false,
                      meta: { title: 'APP升级配置' },
                    }
                  ]
                },
            ]
        },
        
        
        {
            path: '/login',
            component: resolve => require(['../page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})