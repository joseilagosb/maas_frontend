<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const target = ref(null)

onClickOutside(target, () => emit('modal-close'))
</script>

<template>
  <div v-if="props.isOpen" class="absolute z-[9998] top-0 left-0 size-full overflow-hidden">
    <div class="absolute top-0 left-0 size-full bg-black bg-opacity-40" data-testid="modal-backdrop"></div>
    <div class="absolute top-0 left-0 size-full modal-wrapper z-[9999]" data-testid="modal">
      <div class="modal-container w-[400px] mx-auto my-36 px-4 py-6 bg-white shadow animate-slide-up" ref="target">
        <div class="modal-header" data-testid="modal-header">
          <slot name="header"></slot>
        </div>
        <div class="modal-body" data-testid="modal-body">
          <slot name="body"> default content </slot>
        </div>
        <div class="modal-footer" data-testid="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>