import { proxy } from "valtio";
import { PrizeSquare } from "../components/game/PrizeSquares";
import { JoystickDirectionType } from "../types/joystick";

interface OtherPlayer {
  x: number;
  y: number;
  direction?: "down" | "up" | "left" | "right";
  isMoving?: boolean;
  sessionId?: string;
}

export interface GameState {
  initialized: boolean;
  joystickDirection: JoystickDirectionType;
  prizeLocations: PrizeSquare[];
  playerPosition: [number, number, number];
  playerDirection: "down" | "up" | "left" | "right";
  playerIsMoving: boolean;
  showMiningSuccess: boolean;
  minedPrizesCount: number;
  balance: number;
  otherPlayers: Record<string, OtherPlayer>;
  isConnectingToServer: boolean;
  connectionError: string | null;
}

export const store = proxy<GameState>({
  initialized: false,
  joystickDirection: null,
  prizeLocations: [],
  playerPosition: [0, 0, 0],
  playerDirection: "down",
  playerIsMoving: false,
  showMiningSuccess: false,
  minedPrizesCount: 0,
  balance: 0,
  otherPlayers: {},
  isConnectingToServer: true,
  connectionError: null,
});

export const updatePlayerPosition = (position: [number, number, number]) => {
  store.playerPosition = position;
};

export const updatePlayerDirection = (direction: "down" | "up" | "left" | "right") => {
  store.playerDirection = direction;
};

export const updatePlayerMoving = (isMoving: boolean) => {
  store.playerIsMoving = isMoving;
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
