export class CreateMatchDto {
  teamA: string;
  teamB: string;
  matchDate: Date;
}

export class UpdateMatchDto {
  teamAScore: number;
  teamBScore: number;
  matchResult: 'TEAM_A' | 'TEAM_B' | 'Draw';
}
