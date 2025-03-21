import { proxy } from "valtio";
import { PrizeSquare } from "../components/game/PrizeSquares";
import { JoystickDirectionType } from "../types/joystick";

export interface GameState {
  initialized: boolean;
  joystickDirection: JoystickDirectionType;
  prizeLocations: PrizeSquare[];
  playerPosition: [number, number, number];
  showMiningSuccess: boolean;
  minedPrizesCount: number;
  balance: number;
}

export const store = proxy<GameState>({
  initialized: false,
  joystickDirection: null,
  prizeLocations: [],
  playerPosition: [0, 0, 0],
  showMiningSuccess: false,
  minedPrizesCount: 0,
  balance: 0,
});

export const updatePlayerPosition = (position: [number, number, number]) => {
  store.playerPosition = position;
};

export const initializeGame = () => {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  store.initialized = true;

  return () => {
    document.body.style.margin = "";
    document.body.style.padding = "";
    document.body.style.overflow = "";
  };
};

export const updatePrizeLocations = (prizes: PrizeSquare[]) => {
  store.prizeLocations = prizes;
};
