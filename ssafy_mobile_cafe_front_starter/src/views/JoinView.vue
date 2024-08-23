<script setup>
import axios from "@/util/http-common";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const dupmsg = ref(""); //중복 메시지
const idDup = ref(false); //중복여부
const form = ref({
  id: "",
  name: "",
  pass: "",
});
const variant = ref("");
const show = ref(true);

const checkId = async function () {
  //TODO : F03: 회원가입시 중복 ID check 합니다.

  const id = form.value.id;
  if (id) {
    try {
      const response = await axios.get(
        `http://mobile-pjt.sample.ssafy.io/rest/user/isUsed?id=${id}`
      );


      console.log("ID중복확인", response.data); //확인용 로그

      if (response.data === true) {
        dupmsg.value = "이미 사용 중인 ID입니다.";
        idDup.value = true;
      } else {
        dupmsg.value = "사용 가능한 ID입니다.";
        idDup.value = false;
      }
    } catch (error) {
      console.error("ID 확인 중 오류가 발생했습니다.", error);
      dupmsg.value = "서버 오류가 발생했습니다. 다시 시도해 주세요.";
      idDup.value = true;
    }
  } else {
    dupmsg.value = "ID를 입력해주세요.";
    idDup.value = true;
  }

};

const join = async function () {
  if (!form.value.id) {
    alert("아이디를 입력하세요.");
    return;
  }
  if (!form.value.name) {
    alert("이름을 입력하세요.");
    return;
  }
  if (!form.value.pass) {
    alert("비밀번호를 입력하세요.");
    return;
  }


  try {
    const response = await axios.post('http://mobile-pjt.sample.ssafy.io/rest/user', {
      id: form.value.id,
      name: form.value.name,
      pass: form.value.pass,
      stamps: 0,
      stampList: []
    });

    console.log("회원가입 응답:", response.data);
    console.log(form.value.id);

    if (response.data === true) {
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      router.push({path: '/'});
    } else {
      alert("회원가입에 실패했습니다.");
    }

  } catch (error) {
    console.error("회원가입 중 오류 발생", error);
    alert("서버 오류가 발생했습니다.");
  }

  //TODO : F02:모든값이 입력되었으면 서버의 회원가입(사용자 정보 추가) api를 post로 호출합니다.
  //       성공하면 다시 로그인 하도록 한다. alert으로 가이드 한 후 / 로 이동한다.


};

const isFormValid = function () {
  return form.value.id && form.value.name && form.value.pass && !idDup.value;
};
</script>



<template>
  <div>
    <h1>회원 가입</h1>
    <form v-if="show">
      <!-- TODO : 회원가입 폼을 구성합니다.  -->

      <div id="idid">
        <label>아이디:</label>
        <input type="text" class="form-control" name="id" id="id" v-model="form.id" @blur="checkId" />
        <div v-if="idDup" class="error">{{dupmsg}}</div> 
        <div v-if="!idDup" class="success">{{dupmsg}}</div> 
      </div>

      <div>
        <label>이름</label>
        <input
          type="text"
          class="form-control"
          name="name"
          id="name"
          v-model="form.name"
        />
      </div>

      <div>
        <label>비밀번호:</label>
        <input
          type="password"
          class="form-control"
          name="pass"
          id="pass"
          v-model="form.pass"
        />
      </div>
    </form>

    <div class="d-flex">
      <div class="ms-auto button-group">
        <button class="btn btn-success" :disabled="!isFormValid()" @click="join">
          가입
        </button>
        <button class="btn btn-secondary">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  text-align: start;
}

.error {
  color: red;
}
.success {
  color: green;
}

#idid {
  margin-bottom: 10px;
}
</style>
