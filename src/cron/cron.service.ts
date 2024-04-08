import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PredictionService } from 'src/prediction/prediction.service';
import { MatchService } from 'src/match/match.service';
import puppeteer from 'puppeteer';
import { UpdateMatchDto } from 'src/match/dto';

@Injectable()
export class CronService {

    constructor(
        private readonly matchService: MatchService,
        private readonly predictionService: PredictionService,
    ) { }

    @Cron('0 */5 * * * *', {
        name: 'match-updates',
    })
    async getMatchUpdates() {
        console.log('Getting match updates', new Date());
        const matches = await this.matchService.getMatchesWithinTwoHours();
        if (!matches.length) return;

        const browser = await puppeteer.launch();
        for (const match of matches) {
            try {
                const page = await browser.newPage();
                await page.goto(`https://www.google.com/search?q=${match.teamA}+vs+${match.teamB}`);
        
                // NOTE: THE SELECTORS CAN CHANGE, PLEASE CHECK THE SELECTORS ON THE PAGE UPON ERROR
                await page.waitForSelector('.imso_mh__r-tm-sc.imso_mh__scr-it.imso-light-font', { timeout: 5_000 });
                const score_detail = await page.evaluate(() => {
                    const teamAScore = document.querySelector('.imso_mh__l-tm-sc.imso_mh__scr-it.imso-light-font')?.textContent;
                    const teamBScore = document.querySelector('.imso_mh__r-tm-sc.imso_mh__scr-it.imso-light-font')?.textContent;
                    const time_detail = document.querySelector(".imso_mh__ft-mtch.imso-medium-font.imso_mh__ft-mtchc")?.textContent
                     || document.querySelector(".liveresults-sports-immersive__game-minute").childNodes[0].textContent;
                    console.log({ teamAScore, teamBScore, time_detail })
                    return {
                        teamAScore: parseInt(teamAScore),
                        teamBScore: parseInt(teamBScore),
                        time_detail
                    };
                });

                // Update match outcome
                const updateMatchDto : UpdateMatchDto = {
                    teamAScore: score_detail.teamAScore,
                    teamBScore: score_detail.teamBScore,
                    matchResult: score_detail.teamAScore > score_detail.teamBScore ? 'TEAM_A' : score_detail.teamAScore < score_detail.teamBScore ? 'TEAM_B' : 'Draw',
                    status: score_detail.time_detail
                };

                this.matchService.updateMatch(match._id, updateMatchDto);

                if (score_detail.time_detail === 'Full-time') {
                    // Update predictions
                    this.predictionService.updatePredictions(match._id, updateMatchDto);
                }

            } catch (error) {
                console.error('Error getting match updates', error);
            }
        }
        await browser.close();
    }
}
