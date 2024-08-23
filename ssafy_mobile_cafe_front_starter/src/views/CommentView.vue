<script setup>
import axios from "@/util/http-common";
import {  onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'bootstrap';

const { VITE_MENU_IMG_URL } = import.meta.env;
const route = useRoute();
const productId= route.params.id;
var imgSrc=ref("http://mobile-pjt.sample.ssafy.io/imgs/menu/");
var name=ref('');
var price=ref('');
var totalSells=ref('');
var averageStars=ref('');
var commentCount=ref('');
var show=ref(false);
var comment=ref('');
var commentList=ref([]);
var loginIn = sessionStorage.getItem("loginId");
var first=ref(true);
var com=ref({
  comment:'',
  id:0,
  productId:productId,
  rating:0
})
function setId(data){
  com.value=data;
  console.log(data);
}
function insert() {
  //TODO : F10 상품평 등록 DB저장
  axios.post('http://mobile-pjt.sample.ssafy.io/rest/comment',{
    comment:comment.value,
    productId:productId,
    rating:document.getElementById('input-1').value,
    userId:sessionStorage.getItem("loginId")
  })
  .then((res)=>{
    comment.value='';
    reload();
  })
}

function update() {
  //TODO : F11, F13 자신이 작성한 상품평 수정
  axios.put('http://mobile-pjt.sample.ssafy.io/rest/comment',{
    comment:com.value.comment,
    productId:productId,
    rating:document.getElementById('input-3').value,
    userId:loginIn,
    id:com.value.id
  })
  .then((res)=>{
    comment.value='';
    reload();
  })
}

function deleteComment(id, comment) {
  console.log(id, comment)
  //TODO : F12 상품평 삭제
  var input = confirm(`${comment}.를 삭제하시겠습니까?`);
  if(input){
    axios.delete(`http://mobile-pjt.sample.ssafy.io/rest/comment/${id}`)
    .then((res)=>{
    reload();
    })
  }
}

onMounted(()=>{
  reload();
})
function reload() {
  // TODO 09:  : 상품별 정보조회. 상품 개별 정보를 조회한다.
  axios.get(`http://mobile-pjt.sample.ssafy.io/rest/product/${productId}`)
  .then((res)=>{
    if(first.value){
      imgSrc.value+=res.data.img;
      first.value=false;
    }
    name.value=res.data.name;
    price.value=res.data.price;
    totalSells.value=res.data.totalSells;
    averageStars.value=res.data.averageStars;
    commentCount.value=res.data.commentCount;
    commentList.value=res.data.comments;
    console.log(commentList.value);
  }
)}

</script>

<template>
  <div>
    <div class="alert alert-success">
      <h4 class="alert-heading">상품 평점</h4>
      <div>
        <div class="row">
          <div class="col-4">
            <img :src="imgSrc">
          </div>
          <div class="col-8">
            <ul class="list-group">
              <li class="list-group-item">상품명: {{ name }}</li>
              <li class="list-group-item">상품단가: {{ price }}</li>
              <li class="list-group-item">총주문수량: {{ totalSells }}</li>
              <li class="list-group-item">평가횟수: {{ commentCount }}</li>
              <li class="list-group-item">평균평점: {{ averageStars }}</li>
            </ul>
          </div>
        </div>
        <div align="end">
          <button type="button" class="btn btn-secondary"  data-bs-toggle="modal" data-bs-target="#insertModal">한줄평 남기기</button>
        </div>
      </div>
      <hr>
      <p class="mb-0">
        <table class="table table-hover table-success table-striped">
          <caption>자신이 남긴 평가만 수정, 삭제할 수 있습니다.</caption>
          <colgroup>
            <col>
            <col>
            <col>
            <col>
          </colgroup>
          <thead class="table-dark">
            <tr>
              <th>사용자</th>
              <th>평점</th>
              <th>한줄평</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="com in commentList" :key="com.id" >
              <td>{{ com.userId}}</td>
              <td>{{ com.rating}}</td>
              <td>{{ com.comment}}</td>
              <td>
                <div v-if="com.userId===loginIn">
                  <div>
                    <div class="btn-group">
                      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#updateModal" v-on:click="setId(com)">수정</button>
                      <button class="btn btn-info" v-on:click="deleteComment(com.id,com.comment)">삭제</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </p>
    </div>
    <div class="modal" id="insertModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">한줄평 남기기</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" align="start">
            <form>
              <label id = "input-group-1" for ="input-1" class="form-label">평점 : </label>
              <input id="input-1" class="form-control" type="number" value="5" required max="5" min="1" step="0.5">
              <label id = "input-group-2" for ="input-2" class="form-label">한줄평 : </label>
              <input id="input-2" v-model="comment" class="form-control" required>
            </form>
            <div class="modal-footer" align="end">
              <button class="btn btn-primary" data-bs-dismiss="modal" v-on:click="insert">등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="updateModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">한줄평 수정하기</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" v-on:click="reload"></button>
          </div>
          <div class="modal-body" align="start">
            <form>
              <label id = "input-group-3" for ="input-3" class="form-label">평점 : </label>
              <input id="input-3" class="form-control" type="number" v-model="com.rating" required max="5" min="1" step="0.5">
              <label id = "input-group-4" for ="input-4" class="form-label">한줄평 : </label>
              <input id="input-4" v-model="com.comment" class="form-control" required>
            </form> 
            <div class="modal-footer" align="end">
              <button class="btn btn-primary" data-bs-dismiss="modal" v-on:click="update">수정</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>


<style scoped>
col:nth-child(1) {
  width: 20%;
}
col:nth-child(2) {
  width: 10%;
}
col:nth-child(3) {
  width: 50%;
}
</style>
