<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ $t("Saved locations") }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <List_overload api-name="locations-get" >
    </List_overload>
  </ion-content>
</template>

<script>
import List_overload from "@/components/list_overload";
export default {
  name: "selectLocationFromSaved",
  components: {List_overload}
}
</script>

<style scoped>

</style>
