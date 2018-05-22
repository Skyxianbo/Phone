<template>
  <div class="app-container">
    <supplier-detail :is-edit="true"></supplier-detail>
  </div>
</template>
<script>
import supplierDetail from './components/supplierDetail';
export default {
  name: 'supplierUpdate',
  components: {
  	supplierDetail
  }
}

</script>
