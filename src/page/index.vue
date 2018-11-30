<template>
  <div>
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box ">
      <v-tags></v-tags>
      <div class="paddingTB20 content ">
        <router-view></router-view>
      </div>
    </div>
    
  </div>
</template>

<script>
import vSidebar from '@/components/common/Sidebar.vue';
import vHead from '@/components/common/Header.vue';
import vTags from '@/components/common/Tags.vue';
import bus from '@/components/common/bus';
export default {
  data () {
    return {
      
    }
  },
  created(){
    
  },
  methods:{
    
  },
  watch:{
    
  },
  components:{
      vHead, vSidebar,vTags
  },
}
</script>

<style scoped>
	
</style>
