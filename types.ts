
export interface Ruler {
  name: string;
  description: string;
}

export enum GameState {
  Splash,
  LoadingRulers,
  LoadingRound,
  Playing,
  RoundResult,
  Finished
}

export interface Portrait {
  imageUrl: string;
  isCorrect: boolean;
}
