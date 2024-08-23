<script setup>
import axios from "@/util/http-common";
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Modal } from 'bootstrap';

const { VITE_IMG_URL } = import.meta.env;

const emitter = inject("emitter"); // Inject `emitter`
const route = useRoute();
const router = useRouter();

const user = ref({
  id: "",
  pass: "",
});

const show = ref(true);
const loginId = ref("");
const userNick = ref("");

onMounted(() => {
  let id = sessionStorage.getItem("loginId");
  let nick = sessionStorage.getItem("userNick");
  if (id != null && id != "") {
    loginId.value = id; //새로고침대응
    userNick.value = nick; //새로고침대응
  }
});

function login() {
  //TODO : F04 : 로그인 처리, 
  // 로그인 성공하면, loginId, userNick을 assign하고,
  // 어플리케이션 전체 사용용도로.. sessionStorage저장
  //       "login" event를 loginId와 함께 emit한다.  - MenuBoard등에서 on.

  axios.post('http://mobile-pjt.sample.ssafy.io/rest/user/login',{
    id:user.value.id,
    pass:user.value.pass
  })
  .then((res)=>{
    if(res.data!=""){
      loginId.value=res.data.id;
      userNick.value=res.data.name;
      sessionStorage.setItem("loginId", res.data.id);
      sessionStorage.setItem("userNick", res.data.name);
      emitter.emit('login',loginId.value);
    }
    else{
      alert("로그인 실패입니다. 아이디와 비밀번호를 확인하세요.")
    }
  })








  
  //close modal dialog 
  let myModalEl = document.getElementById('login-modal');
  let modal = Modal.getInstance(myModalEl)
  modal.hide();

  reset();
  router
    .replace({path: ""})
    .catch(() => {});

}

function reset() {
  user.value.id = "";
  user.value.pass = "";
}

function logout() {
  //TODO : F05 : 로그아웃.  loginId, userNick을 ""으로 초기화한다.  
  //       "logout" event를 emit한다.  - MenuBoard등에서 on. 
  //       sessionStorage에서 loginId를 삭제한다.
  //       로그아웃 이후는 경로를 path가 "/"이 아니면 "/" 로 이동한다. 

  sessionStorage.removeItem("loginId");
  loginId.value="";
  userNick.value="";
  router.push('/');
  emitter.emit('logout');



}
</script>

<template>
  <div class='container'>
    <div class='navbar navbar-expand-lg alert alert-info navbar-light'>
      <div class="container">
        <a class='navbar-brand'>
          <router-link to="/">
            <img :src="VITE_IMG_URL + '/logo.png'" alt="Responsive image" class="logo"/>
            SSAFY Cafe
          </router-link>
        </a>

        <button class="navbar-toggler success" type="button" data-bs-toggle="collapse" data-bs-target="#nav-collapse">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="nav-collapse">
          <!-- Right aligned nav items -->
          <ul class="navbar-nav ms-auto" v-if="loginId == '' || loginId == null">
            <li class="nav-item me-3">
              <a data-bs-toggle="modal" data-bs-target="#login-modal" style="cursor:pointer;">로그인</a>
            </li>
            <li class="nav-item me-3">
              <router-link to="/join">회원가입</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto" v-if="loginId != '' && loginId != null">
            <li class="nav-item me-3">
              <router-link :to="{name:'UserInfo', params:{loginId:loginId}}">{{ userNick }}</router-link>
            </li>
            <li class="nav-item me-3">
              <a href="#" @click="logout">로그아웃</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <hr />
    
    <router-view />

    <hr />

    <div id="footer" class="row">
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <a href="#" target="_self" class="nav-link">카페소개</a>
        </li>
        <li class="nav-item">
          <a href="#" target="_self" class="nav-link">개인정보처리방침</a>
        </li>
        <li class="nav-item">
          <a href="#" target="_self" class="nav-link">이용약관</a>
        </li>
        <li class="nav-item">
          <a href="#" target="_self" class="nav-link">오시는길</a>
        </li>
      </ul>
    </div>

    <div class="modal" id="login-modal" title="로그인">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">로그인</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body -->
          <div class="modal-body" align="start">
            <form>
              <label for="username" class="form-label">사용자 ID :</label>
              <input type="text" class="form-control" id="username" v-model="user.id" placeholder="아이디를 입력하세요." required>

              <label for="userpass" class="form-label mt-3">비밀번호 :</label>
              <input type="password" class="form-control" id="userpass" v-model="user.pass" 
              placeholder="비밀번호를 입력하세요." required
              @keyup.enter="login">
            </form>

            <!-- Modal footer -->
            <div class="modal-footer">
              <div class="btn-group">
                <button class="btn btn-success" @click="login" data-bs-dismiss="modal">로그인</button>
                <button class="btn btn-info" @click="reset" data-bs-dismiss="modal">리셋</button>
              </div>
            </div>

          </div>
        </div>
    </div>


    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.logo {
  width: 3em;
  height: 3em;
}
</style>


