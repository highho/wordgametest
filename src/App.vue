<template>
  <div class="app">
    <div class="topbar">
      <div class="resource">
        <div><strong>{{ player.name }}</strong> Lv{{ player.lvl }}</div>
        <div class="small">HP: {{ player.hp }}/{{ player.maxHp }}  EXP: {{ player.exp }}/{{ player.expToNext }}</div>
      </div>
      <div>
        <button class="btn" @click="save">保存</button>
        <button class="btn secondary" @click="load">读取</button>
      </div>
    </div>

    <div class="main">
      <div class="panel">
        <MapGrid />
      </div>

      <div class="panel" style="margin-top:8px;">
        <CombatPanel />
      </div>

      <div class="panel" style="margin-top:8px;">
        <InventoryPanel />
      </div>
    </div>

    <div class="footer">
      <div class="small">时间: {{ formattedTime }}</div>
      <div>
        <button class="btn" @click="tickOnce">Tick</button>
        <label class="toggle small"><input type="checkbox" v-model="autoTick" /> 自动 (1s)</label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import MapGrid from './components/MapGrid.vue'
import CombatPanel from './components/CombatPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import { useGameStore } from './stores/gameStore'

export default {
  components: { MapGrid, CombatPanel, InventoryPanel },
  setup() {
    const store = useGameStore()
    const autoTick = ref(false)
    let timer = null

    const tickOnce = () => store.gameTick()

    onMounted(() => {
      store.init()
    })

    const save = () => store.saveGame()
    const load = () => store.loadGame()

    const formattedTime = computed(() => new Date(store.time * 1000).toLocaleString())

    onMounted(() => {
      timer = setInterval(() => {
        if (autoTick.value) store.gameTick()
      }, 1000)
    })

    return { player: store.player, save, load, tickOnce, autoTick, formattedTime }
  }
}
</script>
