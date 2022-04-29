<template>
  <ion-page id="tabs-page-handler">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="home" href="/driver/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>{{$t('Home')}}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="drivers" href="/driver/drivers">
          <ion-icon :icon="driverIcon" />
          <ion-label>{{$t('Drivers')}}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="channels" href="/driver/history">
          <ion-icon :icon="timeOutline" />
          <ion-label>{{$t('History')}}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/driver/dashboard">
          <ion-icon :icon="pieChartOutline" />
          <ion-label>{{$t('Dashboard')}}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script >
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { pieChartOutline,timeOutline,homeOutline } from 'ionicons/icons';
import driverIcon from "@/assets/icons/driver.svg"
export default defineComponent({
  name: 'TabsPage',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    return {
      pieChartOutline,
      timeOutline,
      homeOutline,
      driverIcon,
    }
  }
});
</script>
<style lang="scss" scoped>
ion-tab-button{
  position: relative;
  background: none;
  &:before{
    content: "";
    background: var(--ion-color-primary);
    transition: .2s;
    transition-delay: 50ms;
    transition-timing-function: ease-in-out;
    width: 80px;
    height: 40px;
    display: block;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    z-index: -1;
    transform: translateX(-50%);
    top: 36px;
  }
  ion-icon{
    position: absolute;
    top: 5px;
    transition: .5s;
  }
  ion-label{
    transition: .3s;
    opacity: 0;
    position: absolute;
    margin: 0;
    font-weight: 600;
    white-space: break-spaces;
    bottom: 0px;
    font-size: 10px;
  }
  &.tab-selected{
    ion-icon{
      color: var(--ion-color-primary-contrast);
    }
    ion-label{
      opacity: 1;
      color:var(--ion-color-dark);
    }
    &:before{
      top: 2.5px;
      width: 40px;

    }
  }
}
</style>
