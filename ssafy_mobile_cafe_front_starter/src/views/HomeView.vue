<script setup>
import axios from "@/util/http-common";
import MenuByType from "../components/MenuByType.vue";
import MenuBoard from "../components/MenuBoard.vue";
import { onMounted, ref } from 'vue';

const products = ref([])
const coffees = ref([])
const teas = ref([])
const cookies = ref([])

onMounted(() => {
  //TODO : F01:상품정보 api를 호출하여 production type(coffee, tea, cookie)에 따라 props로 전달하기 위하여 data에 저장한다.  
  axios.get('http://mobile-pjt.sample.ssafy.io/rest/product')
  .then((res)=>{
    var products =  res.data
    products.forEach(e => {
      if(e.type=='coffee'){
        coffees.value.push(e);
      }
      if(e.type=='tea'){
        teas.value.push(e);
      }
      if(e.type=='cookie'){
        cookies.value.push(e);
      }
    });
  })
  .catch()
})

</script>

<template>
  <div>
    <div class="bv-example-row">
      <MenuByType
        variant="alert-primary"
        title="커피"
        desc1="뛰면서 즐기는 커피 한잔의 여유"
        desc2="갓 볶은 아라비카산 원두만 고집합니다."
        :prods="coffees"
      />
      <MenuByType
        variant="alert-success"
        title="차"
        desc1="차분히 앉아서 차향을 느껴보세요."
        desc2="어린 잎만 정성들여 우려냅니다."
        :prods="teas"
      />
      <MenuByType
        variant="alert-danger"
        title="쿠키"
        desc1="달달한 쿠키도 있어요."
        desc2="맛있게 먹으면 0칼로리"
        :prods="cookies"
      />
    </div>
    <MenuBoard></MenuBoard>
  </div>
</template>
<style scoped></style>
