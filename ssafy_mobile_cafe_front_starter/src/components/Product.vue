<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const { VITE_MENU_IMG_URL } = import.meta.env;

const emitter = inject("emitter"); // Inject `emitter`
const router = useRouter();

const cnt = ref(0)
const loginId = ref('')

const props = defineProps({
    item: Object,
  })

function plus() {
  cnt.value++;
  update();
}

function minus() {
  if (cnt.value < 1) {
    return;
  }
  cnt.value--;
  update();
}

function comment() {
  router.push({
    path: '/comment/' + props.item.id,
  });
}

function update() {
  console.log("item::",props.item)
  emitter.emit('setMenu', {
    id: props.item.id,
    name: props.item.name,
    img: VITE_MENU_IMG_URL + props.item.img,
    cnt: cnt.value,
    price: props.item.price * cnt.value,
  });
}

function clearOrder() {
  cnt.value = 0;
}

onMounted(() => {
  //TODO : clearOrder 이벤트를 on한다. 
  //     주문이 완료된 이벤트이므로, clearOrder()를 호출해서 cnt를 0으로 초기화 한다. 

  emitter.on('clearOrder',()=>{
    clearOrder();
  })

  emitter.on('login', (id) => {
    loginId.value = id;
  });
  emitter.on('logout', () => {
    loginId.value = '';
  });

  let id = sessionStorage.getItem('loginId');
  if (id != null && id != '') {
    loginId.value = id;
  }
})

onUnmounted(()=>{
  emitter.off('clearOrder');
  emitter.off('login');
  emitter.off('logout');
})

</script>

<template>
  <div class="card mb-2"
    style="max-width: 320px;">
    <img class="card-img-top" :src="VITE_MENU_IMG_URL + item.img" alt="Card image">
    <div class="card-body">
      <h4 class="card-title">{{item.name}}</h4>
      <p class="card-text"> {{ item.price }} 원 </p>
      <div v-if="loginId != '' && loginId != null">
        <button class="btn btn-primary mbtn">
          <span class="badge light"> {{ cnt }}</span>
        </button>
        <button @click="plus" class="btn btn-success mbtn">+</button>
        <button @click="minus" class="btn btn-secondary mbtn">-</button>
        <button @click="comment(item.id)" class="btn btn-warning mbtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
          <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
        </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mbtn {
  margin: 0 3px;
}
</style>

