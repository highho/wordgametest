<template>
  <div>
    <div class="small">战斗面板</div>
    <div v-if="combat">
      <div><strong>{{ combat.monster.name }}</strong> Lv{{ combat.monster.lvl }}</div>
      <div class="small">HP: {{ combat.monster.hp }} / {{ combat.monster.maxHp }}</div>
      <div class="controls">
        <button class="btn" @click="tick">攻击步</button>
        <button class="btn" @click="toggleAuto">{{ combat.auto ? '停止自动' : '自动' }}</button>
        <button class="btn secondary" @click="stop">退出</button>
      </div>
    </div>
    <div v-else class="small">当前无战斗</div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/gameStore'

export default {
  setup() {
    const store = useGameStore()
    const tick = () => store.gameTick()
    const toggleAuto = () => {
      if (store.currentCombat) store.currentCombat.auto = !store.currentCombat.auto
    }
    const stop = () => store.stopCombat()
    return { combat: store.currentCombat, tick, toggleAuto, stop }
  }
}
</script>
