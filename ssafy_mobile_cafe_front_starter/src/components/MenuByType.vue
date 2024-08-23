<script setup> 
import Product from './Product.vue';

defineProps(
  {
    variant: String,
    title: String,
    desc1: String,
    desc2: String,
    prods: Array,
  }
)

</script>


<template>
  <div>
    <div class="alert menu-type" :class="variant" show>
      <h4 class="alert-heading">{{ title }}</h4>
      <p>
        {{ desc1 }}
      </p>
      <hr />
      <p class="mb-0">{{ desc2 }}</p>
    </div>
    <div class="row">
      <div class="col-6 col-sm-6 col-md-4 col-lg-3" v-for="(prod, idx) in prods" :key="idx">
        <Product :item="prod">
        </Product>
      </div>
    </div>
    <div show class="alert alert-secondary" v-if="prods.length == 0">
      주문 가능한 메뉴가 없습니다.
    </div>
  </div>
</template>

<style scoped>
.menu-type {
  text-align: start;
}
</style>

