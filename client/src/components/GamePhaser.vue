<script setup>

import PhaserContainer from './PhaserContainer.vue'

</script>

<template>
  <Suspense>
    <PhaserContainer />

    <template #fallback>
      <div class="placeholder">
        Downloading ...
      </div>
    </template>
  </Suspense>
</template>

