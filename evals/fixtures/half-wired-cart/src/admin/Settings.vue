<!--
  Admin settings form. NOTE (eval answer key): this surfaces
  `discountCapPercent` to an admin (the "collected" end of the half-wired
  path). The value round-trips through config.js but is never read by
  PriceCalculator.js — deep-plan should trace both ends and name this file as
  where the setting is collected.
-->
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
