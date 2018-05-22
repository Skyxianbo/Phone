<template>
  <div class="app-container">
    <user-detail :is-edit="true"></user-detail>
  </div>
</template>
<script>
import userDetail from './components/userDetail';
export default {
  name: 'userUpdate',
  components: {
  	userDetail
  }
}

</script>
