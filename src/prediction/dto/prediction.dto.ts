// export class CreateMatchDto {
//   teamA: string;
//   teamB: string;
//   matchDate: Date;
// }

export class CreatePrediction {
  winnerScore: number;
  loserScore: number;
  predictedWinner: 'TEAM_A' | 'TEAM_B' | 'DRAW';
  userId: string;
  groupId: string;
  matchId: string;
}
