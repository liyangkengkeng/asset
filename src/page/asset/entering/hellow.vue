<template>
  <div class="hellow flex al-ce jc-ce">
    <img :src="hellow" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      hellow:require('@/assets/hellow.png'),
    }
  },
  created(){
    
  },
  methods:{
    
  },
  watch:{
    
  }
}
</script>

<style scoped>
	.hellow{
    height: calc(100vh - 180px)
  }
</style>
