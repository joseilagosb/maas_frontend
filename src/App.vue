<script setup lang="ts">
import { RouterView } from 'vue-router'

import { applyDatePlugins } from './services/date'
applyDatePlugins()
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
