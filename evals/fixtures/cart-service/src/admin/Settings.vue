<!-- Admin settings form. -->
<template>
  <label>
    Max discount (%)
    <input v-model.number="discountCapPercent" type="number" />
  </label>
</template>

<script>
import config from '../cart/config';

export default {
  data() {
    return { discountCapPercent: config.discountCapPercent };
  },
};
</script>
