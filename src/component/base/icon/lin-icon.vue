<template>
  <svg :style="{ width, height }" class="l-icon" @click="$emit('click', $event)">
    <use :fill="color" :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>
<script>
export default {
  name: 'LIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '1.2em',
    },
    height: {
      type: String,
      default: '1.2em',
    },
  },
}
</script>
<style lang="scss" scoped>
.l-icon {
  &:hover,
  &:focus {
    color: #fff;
  }
}
</style>
