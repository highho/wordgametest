import { defineStore } from 'pinia'
import { sampleTiles } from '../data/tiles'
import { MONSTERS } from '../data/monsters'
import { loadGameData, saveGameData } from '../utils/save'
import { battleTickSimple } from '../utils/battle'

export const useGameStore = defineStore('game', {
  state: () => ({
    time: Math.floor(Date.now() / 1000),
    player: {
      id: 'p1',
      name: '冒险者',
      lvl: 1,
      exp: 0,
      expToNext: 100,
      hp: 200,
      maxHp: 200,
      hunger: 100,
      water: 100,
      stats: { atk: 6, def: 1, crit: 0.05, critMult: 1.5 }
    },
    tiles: [],
    monsters: MONSTERS,
    inventory: [],
    currentCombat: null
  }),
  actions: {
    init() {
      // load sample tiles
      this.tiles = sampleTiles()
      // try load saved
      const s = loadGameData()
      if (s) {
        Object.assign(this, s)
      }
    },
    gameTick() {
      this.time = Math.floor(Date.now() / 1000)
      // passive regen
      if (this.player.hp < this.player.maxHp) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.ceil(this.player.maxHp * 0.02))
      }
      // if auto combat active and in combat, advance battle
      if (this.currentCombat && this.currentCombat.auto) {
        const res = battleTickSimple(this.player, this.currentCombat.monster)
        if (res.result === 'monster_dead') {
          // give loot / exp
          this.player.exp += this.currentCombat.monster.exp || 10
          this.addItem({ id: 'wood', name: '木材', qty: 1 })
          this.currentCombat = null
        } else if (res.result === 'player_dead') {
          // simple death handling
          this.player.hp = Math.floor(this.player.maxHp / 2)
          this.currentCombat = null
        } else {
          // ongoing, states updated inside battleTickSimple
        }
      }
    },
    harvest(tileId) {
      const t = this.tiles.find(x => x.id === tileId)
      if (!t) return
      if (t.mobId) {
        const mob = this.monsters.find(m => m.id === t.mobId)
        this.startCombat(mob, { auto: true })
        return
      }
      // simple resource gather
      if (t.resource && t.resourceQty > 0) {
        this.addItem({ id: t.resource, name: t.resource, qty: 1 })
        t.resourceQty = Math.max(0, t.resourceQty - 1)
      }
    },
    startCombat(monsterData, opts = { auto: false }) {
      // shallow clone monster state
      const mob = JSON.parse(JSON.stringify(monsterData))
      mob.hp = mob.maxHp
      this.currentCombat = { monster: mob, auto: !!opts.auto }
    },
    stopCombat() {
      this.currentCombat = null
    },
    addItem(item) {
      const exist = this.inventory.find(i => i.id === item.id)
      if (exist) exist.qty += item.qty || 1
      else this.inventory.push({ ...item, qty: item.qty || 1 })
    },
    saveGame() {
      saveGameData(this.$state)
      alert('已保存')
    },
    loadGame() {
      const s = loadGameData()
      if (s) {
        Object.assign(this.$state, s)
        alert('已载入存档')
      } else {
        alert('未发现存档')
      }
    }
  }
})
