# 🥷 Ninja Super Saiyan

A small browser-based action game where a ninja fights monsters, collects coins and power-ups, defeats a boss, and rescues the princess.

Built with **HTML, CSS, and Vanilla JavaScript** using the HTML5 Canvas API.

## 🎮 Game

**Ninja Super Saiyan** is a lightweight side-scrolling action game inspired by classic platform games.

Your mission is simple:

> **Fight your way through the level → collect power-ups → defeat the boss → rescue the princess.**

## ✨ Features

- 🥷 Playable Ninja character
- ⚔️ Sword combat
- 👹 Multiple enemies
- 💥 One-hit kill for normal monsters
- 👑 Boss battle
- ⚔️ Boss defeated in exactly **3 sword strikes**
- 🪙 Collectible coins
- ❤️ Health power-ups
- ⚡ Energy power-ups
- 🔥 Super Power-Up mode
- 🦘 Jump mechanics
- 💨 Dash ability
- 🏞️ Side-scrolling camera
- 👸 Princess rescue objective
- 🏆 Win screen
- 💀 Game-over system
- 📊 Score system

## 🕹️ Controls

| Key | Action |
|---|---|
| `←` | Move Left |
| `→` | Move Right |
| `↑` | Jump |
| `Space` | Sword Attack |
| `Shift` | Dash |
| `R` | Restart after Game Over / Win |

## 🎯 Objective

Progress through the level while fighting monsters and collecting rewards.

### Stage Flow

```text
🥷 Ninja
   ↓
🪙 Collect Coins
   ↓
👹 Defeat Monsters
   ↓
⚡ Collect Power-Ups
   ↓
👹 Boss Fight
   ↓
⚔️ 3 Sword Strikes
   ↓
💥 Boss Defeated
   ↓
👸 Rescue Princess
   ↓
🏆 You Win!
```

## ⚔️ Combat System

### Normal Monsters

Normal monsters have **1 HP**.

```text
Sword Strike → 💥 Monster Defeated
```

### Boss

The boss has **3 HP**.

```text
Strike 1 → ❤️❤️
Strike 2 → ❤️
Strike 3 → 💥 Boss Defeated
```

The boss always takes **exactly 3 sword strikes**, even when the Super Power-Up is active.

## ⚡ Power-Ups

The game contains different power-ups that provide temporary or permanent advantages.

| Power-Up | Effect |
|---|---|
| ❤️ Health | Restores health |
| 🔵 Energy | Fills energy |
| ⚡ Super | Activates temporary Super Power |

## 🪙 Scoring

Players earn points by progressing through the game:

- 🪙 Collect coin → **+25**
- 👹 Defeat monster → **+100**
- ⚡ Collect power-up → **+100
