// do global state here

import { proxy, useSnapshot } from 'valtio'
import { PrizeSquare } from '../components/game/PrizeSquares'
import { JoystickDirectionType } from '../types/joystick'
import { MAX_MINING_PROGRESS, MINING_INCREMENT } from '../constants/mapConstants'

export interface GameState {
  initialized: boolean
  joystickDirection: JoystickDirectionType
  prizeLocations: PrizeSquare[]
  playerPosition: [number, number, number]
  showMiningSuccess: boolean
  minedPrizesCount: number
  balance: number
}

export const store = proxy<GameState>({
  initialized: false,
  joystickDirection: null,
  prizeLocations: [],
  playerPosition: [0, 0, 0],
  showMiningSuccess: false,
  minedPrizesCount: 0,
  balance: 0,
})

// Helper function to update player position
export const updatePlayerPosition = (position: [number, number, number]) => {
  store.playerPosition = position
}

// Helper function to handle mining
export const handleMine = (isNearPrize: boolean, nearestPrizeIndex: number) => {
  if (!isNearPrize || nearestPrizeIndex === -1) return

  const updatedPrizes = [...store.prizeLocations]
  updatedPrizes[nearestPrizeIndex] = {
    ...updatedPrizes[nearestPrizeIndex],
    progress: Math.min(
      updatedPrizes[nearestPrizeIndex].progress + MINING_INCREMENT,
      MAX_MINING_PROGRESS
    ),
  }

  store.prizeLocations = updatedPrizes

  if (updatedPrizes[nearestPrizeIndex].progress >= MAX_MINING_PROGRESS) {
    store.showMiningSuccess = true
    store.minedPrizesCount += 1
    store.balance += updatedPrizes[nearestPrizeIndex].amount

    setTimeout(() => {
      store.showMiningSuccess = false
    }, 3000)
  }
}

// Helper function to initialize game
export const initializeGame = () => {
  document.body.style.margin = "0"
  document.body.style.padding = "0"
  document.body.style.overflow = "hidden"
  store.initialized = true

  return () => {
    document.body.style.margin = ""
    document.body.style.padding = ""
    document.body.style.overflow = ""
  }
}

// Helper function to update prize locations
export const updatePrizeLocations = (prizes: PrizeSquare[]) => {
  store.prizeLocations = prizes
}