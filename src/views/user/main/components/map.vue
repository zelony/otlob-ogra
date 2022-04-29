<template>
  <div id="map" class="w-full h-full" ref="map"/>
</template>

<script>
export default {
  name: "fully_map",
  mounted() {
    this.$nextTick(()=>{
      this.$store.dispatch("map/create");
    });
  },
}
</script>

<style scoped>

</style>
