import Vuebar from 'vuebar';
import VueScrollTo from 'vue-scrollto';
import VTooltip from 'v-tooltip';

import Modal from '../components/Common/Modals/Layout';
import InfiniteScroll from '../components/Common/InfiniteScroll';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import RelativeTime from '../components/Common/RelativeTime';

const install = (Vue) => {
  Vue.use(VueScrollTo);
  Vue.use(VTooltip);
  Vue.use(Vuebar);

  Vue.component('modal', Modal);
  Vue.component('infinite-scroll', InfiniteScroll);
  Vue.component('loading-spinner', LoadingSpinner);
  Vue.component('relative-time', RelativeTime);
};

export default install;
