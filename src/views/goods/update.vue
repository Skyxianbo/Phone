<template>
  <div class="app-container">
    <goods-detail :is-edit="true"></goods-detail>
  </div>
</template>
<script>
import goodsDetail from './components/goodsDetail';
export default {
  name: 'goodsUpdate',
  components: {
  	goodsDetail
  }
}

</script>
