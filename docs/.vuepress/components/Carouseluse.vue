<template>
 <div id="home">
  <v-carousel :slideData="slideData" :height="450" :begin="0" :interval="3000" :dot="true" :arrow="true"></v-carousel>
 </div>
</template>
<script>
 import carousel from "../components/carousel";
 export default {
  name: 'home',
  data() {
   return {
    slideData:[
     {
      title:'küche',
      src:require('../public/assets/img/kueche.jpg'),
      url:'#kueche'
     },
     {
      title:'VR',
      src:require('../public/assets/img/quanjing.jpg'),
      url:'#sll'
     },
     {
      title:'WC/Bad',
      src:require('../public/assets/img/wcbad.jpg'),
      url:'#wc-bad'
     },
     {
      title:'Wohnzimmer',
      src:require('../public/assets/img/wohnraum.jpg'),
      url:'#wohnraum'
     },
     {
      title:'krankenbett',
      src:require('../public/assets/img/krankenbett.jpg'),
      url:'#krankenbett'
     },
    ]
   }
  },
  components:{
   'v-carousel': carousel,
  },
  methods: {
  },
  mounted() {
  }
 }
</script>
<style scoped>
</style>