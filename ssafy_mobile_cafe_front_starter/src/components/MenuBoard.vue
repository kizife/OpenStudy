<script setup>
import axios from "@/util/http-common";
import { inject, onMounted, onUnmounted, ref } from "vue";

const emitter = inject("emitter"); // Inject `emitter`

// 주문한 상품은 {2:{}, 3:{}} 형태로 '상품번호:객체' 모양으로 들어감.
const order_menu = ref({})
const order_completed = ref(false)
const loginId = ref('') 

function order() {
  let details = [];

// 빈 상품번호을 빼고 details 배열에 담음.
// 서버 전송하기 위해서 상품번호를 key로 만들기
for (let key in order_menu.value) {
    let item = order_menu.value[key];
    details.push({ productId: key, quantity: item.cnt });
  }

  console.log("details", details)

  let myOrder = {
    userId: loginId.value,
    orderTable: '웹주문',
    orderTime: new Date(),
    completed: 'N',
    details,
  };
  
  console.log(myOrder)
      //TODO : F06 : 서버로 주문(myOrder)전송한다. 성공하면 clearAll() method를 호출한다.

  axios.post('http://mobile-pjt.sample.ssafy.io/rest/order',{
    completed:myOrder.completed,
    details:myOrder.details,
    orderTable:myOrder.orderTable,
    userId:myOrder.userId
  })
  .then((res)=>{
    clearAll();
  })





}

function setMenu(payload) {
  order_completed.value = false;
  if (payload.cnt == 0) {
    // order_menu 배열의 id값 삭제
    delete order_menu.value[payload.id]
  } else {
    // 없으면 입력, 있으면 수정.
    let obj = {};
    obj[payload.id] = { cnt: payload.cnt, img: payload.img, name: payload.name }
    Object.assign(order_menu.value, obj);

  }
}

function clearAll() {
  //TODO : 주문이 성공하면 호출된다. 현재 data값들을 초기화 하고, order_completed 완료(true)로 변경한다.  
  //       주문에 성공하면 product에 있는 주문건수도 초기화 시켜 주기 위해서,  
  //       'clearOrder' Event를 발생(emit)시킨다. 
  //       clearOrder는 Product.vue에서 on 한다. 
  order_completed.value=true;
  order_menu.value={};

  emitter.emit('clearOrder');




}

onMounted(() => {
  //TODO : setMenu Event $on한다.(+, - 버튼 클릭에 대한 event처리.)
  // payload를 this.setMenu를 호출하여 처리한다. 
  
  // emitter.on('setMenu', (payload) => {
  //   setMenu(payload);
  // }),

  emitter.on('logout', () => {
    clearAll();
  });

  emitter.on('login', (id) => {
    loginId.value = id;
  });

  emitter.on('setMenu', (data)=>{
    setMenu(data);
  })
  let id = sessionStorage.getItem('loginId');
  if (id != null && id != '') {
    loginId.value = id;
  }
})

onUnmounted(() => {
  //TODO : 수신한 event들의 off 처리, login, logout, setMenu..
  emitter.off('logout');
  emitter.off('login');
  emitter.off('setMenu');


})

</script>


<template>
  <div id="floatdiv" v-if="Object.keys(order_menu).length">
    <p>주문서 작성중</p>
    <ul class="list-group" style="max-width: 300px;">
      <li class="list-group-item d-flex align-items-center"
        v-for="(item, key, idx) in order_menu"
        :key="idx"
      >
        <template v-if="item">
          <img :src="item.img" class="me-3 avatar"/>
          <span class="me-auto">{{ item.name }}</span
          >&nbsp;
          <span class="badge bg-secondary">{{ item.cnt }}</span>
        </template>
      </li>
      <button class="btn btn-primary" @click="order">주문</button>
    </ul>
  </div>
</template>

<style scoped>
#floatdiv {
  position: fixed;
  _position: absolute;
  overflow: hidden;
  right: 0px;
  top: 60px;
  background-color: transparent;
  margin: 0;
  padding: 0;
}
.hidden {
  display: none;
}
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
