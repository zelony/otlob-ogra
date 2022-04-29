<template>
  <transition-group name="fade" tag="div" duration="150" type="transition">
    <div class="transition bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" v-for="(error,i) in errors" :key="i">
      <strong class="font-bold ion-text-capitalize">{{ error.$property }}: </strong>
      <span class="block sm:inline">{{ error.$message }}</span>
    </div>
  </transition-group>

</template>

<script>
export default {
  name: "errors_alerts",
  props:{
    errors:[Array]
  },
}
</script>

<style scoped>

</style>
