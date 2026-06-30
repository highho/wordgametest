export function calcDamage(attacker, defender) {
  const base = Math.max(1, (attacker.atk || attacker.stats?.atk || 1) - Math.floor((defender.def || defender.stats?.def || 0) * 0.5))
  const crit = Math.random() < (attacker.crit || attacker.stats?.crit || 0) ? (attacker.critMult || attacker.stats?.critMult || 1.5) : 1
  return Math.max(1, Math.floor(base * crit))
}

// mutate player and monster objects
export function battleTickSimple(player, monster) {
  const pd = calcDamage(player, monster)
  monster.hp -= pd
  if (monster.hp <= 0) {
    return { result: 'monster_dead' }
  }
  // monster attacks
  const md = calcDamage(monster, player)
  player.hp -= md
  if (player.hp <= 0) {
    return { result: 'player_dead' }
  }
  return { result: 'ongoing' }
}
