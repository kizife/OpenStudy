<script setup>
import axios from "@/util/http-common";
import { ref } from "vue";
import moment from "moment";

const { VITE_MENU_IMG_URL } = import.meta.env;

const props = defineProps({

  order: Object, 
});

// console.log('전달받은 주문 데이터:', props.order);


const selected = ref(false);
const stamp = ref(0);
const details = ref([]);
const totalPrice = ref(0);


// TODO : 출력형식을 만들어 보자. [추가기능 : UTC타임 적용도 고려해보자.]
const displayTime = function (time) {
  console.log(time);

  return moment(time).format('YYYY.MM.DD HH:mm:ss');
};

function getDetail() {
  // TODO : F08 :주문 상세 데이터를 조회합니다.
  axios
    .get(`http://mobile-pjt.sample.ssafy.io/rest/order/${props.order.id}`)
    .then((response) => {
      const data = response.data;
      details.value = data.details || []; // 상세 정보

      console.log('상세 정보:', details.value); //데이터 확인용


      totalPrice.value = details.value.reduce(
        (sum, detail) => sum + parseInt(detail.unitPrice, 10) * detail.quantity,
        0
      );
      stamp.value = details.value.reduce(
        (sum, detail) => sum + parseInt(detail.quantity, 10),
        0
      ); // 스탬프 적립
    })
    .catch((error) => {
      console.error("주문 상세 정보 조회 중 오류 발생", error);
    });
}

// watch(() => props.order.id, (newId) => {
//   if (newId) {
//     getDetail();
//   }
// });


</script>

<template>
  <div>
    <a
      class="list-group-item list-group-item-action"
      :href="'#collapse-2' + order.id"
      data-bs-toggle="collapse"
      @click="getDetail"
    >
      언제? {{ displayTime(order.orderTime) }}, 어디서?{{ order.orderTable }}</a
    >

    <div class="collapse" :id="'collapse-2' + order.id">
      <div class="card px-3 pt-3">
        <div class="alert alert-success" show>
          <h4 class="alert-heading">주문 상세</h4>
          <div>
            <div class="row">
              <div class="col-6" v-for="(detail, idx) of details" :key="idx">
                <li class="list-group-item d-flex align-items-center">
                  <img
                    class="me-3 avatar"
                    :src="VITE_MENU_IMG_URL + detail.img"
                  />
                  <span class="me-auto"
                    >품명: {{ detail.name }}, 단가: {{ detail.unitPrice }}원,
                    {{ detail.quantity + "잔" }}</span
                  >
                  <span class="badge bg-secondary"
                    >{{ detail.unitPrice * detail.quantity }}원</span
                  >
                </li>
              </div>
            </div>
          </div>
          <hr />
          <p class="mb-0">총 비용:{{ totalPrice }}, 스탬프 적립: {{ stamp }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
