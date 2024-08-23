<script setup>
import axios from "@/util/http-common";
import OrderInfo from "../components/OrderInfo.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { VITE_GRADE_IMG_URL } = import.meta.env;

const router = useRouter();

const user = ref({ id: "", name: "" });
const orders = ref([]);
const grade = ref({ title: "", step: 1, to: 0, img: "" });

const props = defineProps({
  loginId: String,
});

onMounted(() => {
  let pass = prompt("정보확인을 위해 비밀번호를 입력해주세요.");
  if (!pass) {
    router.push({
      path: "/",
    });

  } else {
    // TODO : F07 로그인한 사용자의 회원정보를 조회한다.
    //       /user/info 에 id와 비번을 입력하여 주문내역과 등급등을 리턴받는다.

    axios
      .post("http://mobile-pjt.sample.ssafy.io/rest/user/info", {
        id: props.loginId,
        pass: pass,
      })
      .then((res) => {
        console.log("서버 응답 데이터:", res.data);

        if (res.data) {
          console.log(res);
          user.value.id = res.data.user.id;
          user.value.name = res.data.user.name;
          user.value.stamps = res.data.user.stamps;


          grade.value.title = res.data.grade.title;
          grade.value.step = res.data.grade.step;
          grade.value.to = res.data.grade.to;
          grade.value.img = res.data.grade.img;

          orders.value = res.data.order;

          
        } else {
          alert("로그인 실패입니다. 아이디와 비밀번호를 확인하세요.");
          router.push({ path: "/" });
        }

        console.log("주문 내역:", orders.value); // 데이터 확인

      })

      .catch((error) => {
        console.error("회원정보 조회 중 오류 발생", error);
        alert(
          "서버와의 통신 중 오류가 발생했습니다. 나중에 다시 시도해 주세요."
        );
        router.push({ path: "/" });
      });
  }
});


</script>

<template>
  <div class="start">
    <div class="alert alert-success" show>
      <!-- TODO : F14: 심화기능
          아래와 같은 메시지를 뿌려준다. 

          우리 name 01회원님은요~~ 
          로그인 할 때 아이디는 id 01을 사용합니다.
          현재 모은 스탬프는 총 80개로 Fluid-grow image 꽃-2 단계입니다.
          앞으로 15만 더 모으면 다음 단계입니다!!
        -->
      <h4>우리 {{ user.name }} 회원님은요~</h4>
      <hr />
      <p>
        로그인 할 때 아이디는 {{ loginId }}을 사용합니다.<br />
        현재 모은 스탬프는 총
        <span class="badge bg-secondary">{{ user.stamps }}</span
        >개로
        <img
          class="grade"
          :src="`http://mobile-pjt.sample.ssafy.io/imgs/grade/${grade.img}`"
        />

        {{ grade.title }}-{{ grade.step }}단계입니다.<br />
        앞으로
        <span class="badge bg-secondary">{{ grade.to }}</span
        >만 더 모으면 다음 단계입니다!!
      </p>
    </div>
    <hr />
    <div class="card">

      <div class="card-header">이제까지 주문 내역은</div>
      <div class="card-text m-3">
        주문 정보를 클릭하면 주문 내역을 살펴볼 수 있습니다.

        <div class="list-group mt-3">
          <!-- TODO : F08 : 주문내역 확인을 위해서 order-info component를 선언하며, 
                order-info에서 사용하기 위하여, 조회한 order 를 props로 전달합니다. -->
          <div v-for="(order, idx) in orders" :key="idx">

            <OrderInfo :order="order" /> 

          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style scoped>
.start {
  text-align: start;
}
.grade {
  width: 1em;
  height: 1em;
}
</style>
