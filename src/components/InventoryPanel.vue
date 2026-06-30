<template>
  <div>
    <div class="small">背包</div>
    <div class="inventory-list">
      <div v-for="it in inventory" :key="it.id" class="item">
        {{ it.name }} x{{ it.qty }}
      </div>
      <div v-if="inventory.length===0" class="small">空</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

export default {
  setup() {
    const store = useGameStore()
    const inventory = computed(() => store.inventory)
    return { inventory }
  }
}
</script>
