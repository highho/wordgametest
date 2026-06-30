<template>
  <div>
    <div class="small">地图</div>
    <div class="grid">
      <div v-for="tile in tiles" :key="tile.id" class="tile">
        <div class="title">{{ tile.name }}</div>
        <div class="small">Lv {{ tile.level }} {{ tile.resource ? '(' + tile.resource + ')' : '' }}</div>
        <div class="controls">
          <button class="btn" @click="onHarvest(tile.id)">采集</button>
          <button class="btn secondary" @click="onInspect(tile.id)">探查</button>
        </div>
        <div v-if="tile.mobId" class="small" style="color:#d9534f">有怪: {{ tile.mobId }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

export default {
  setup() {
    const store = useGameStore()
    const tiles = computed(() => store.tiles)
    const onHarvest = (id) => store.harvest(id)
    const onInspect = (id) => {
      const t = store.tiles.find(x => x.id === id)
      alert(JSON.stringify(t, null, 2))
    }
    return { tiles, onHarvest, onInspect }
  }
}
</script>
