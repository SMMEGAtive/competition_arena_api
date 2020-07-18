// Uncomment these imports to begin using these cool features!

import {get, param} from '@loopback/rest';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  WinnerRepository,
  UserRepository,
  ParticipationRepository,
  ParticipantRepository,
  ParticipantMemberRepository,
  CompetitionRepository,
} from '../repositories';
import {
  Winner,
  ParticipantMember,
  User,
  Participation,
  Competition,
  Participant,
} from '../models';
import {toJSON} from '@loopback/testlab';

type Statistic = {
  ID_User: number;
  Username: string;
  Affiliation: string;
  Win_Count: number;
  Win_Ratio: number;
  Competition_Won: {ID_Competition: number; Competition_Name: string}[];
  Participation_Count: number;
  Participation: {
    ID_Participation: number;
    ID_Participant: number;
    Team_Name: string;
  }[];
};

export class StatisticController {
  constructor(
    @repository(WinnerRepository)
    public winnerRepo: WinnerRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(ParticipationRepository)
    public participationRepo: ParticipationRepository,
    @repository(ParticipantRepository)
    public participantRepo: ParticipantRepository,
    @repository(ParticipantMemberRepository)
    public participantMemberRepo: ParticipantMemberRepository,
    @repository(CompetitionRepository)
    public competitionRepo: CompetitionRepository,
  ) {}

  statisticUserAdapter(statistic: Statistic, user: User): void {
    if (user.Affiliation == '' || user.Affiliation == null) {
      statistic.Affiliation = 'Tidak berafiliasi';
    } else {
      statistic.Affiliation = user.Affiliation;
    }

    statistic.Username = user.Username;
    statistic.ID_User = user.ID_User;
  }

  statisticWinnerAdapter(statistic: Statistic, competition: Competition): void {
    statistic.Competition_Won.push({
      ID_Competition: competition.ID_Competition,
      Competition_Name: competition.Title,
    });
  }

  statisticParticipationAdapter(
    statistic: Statistic,
    participation: Participation,
    participant: Participant,
  ): void {
    statistic.Participation.push({
      ID_Participation: participation.ID_Participation,
      ID_Participant: participation.ID_Participant,
      Team_Name: participant.Team_Name,
    });
  }

  statisticWinCountAdapter(statistic: Statistic) {
    statistic.Win_Count = statistic.Competition_Won.length;
  }

  statisticParticipationCountAdapter(statistic: Statistic) {
    statistic.Participation_Count = statistic.Participation.length;
  }

  statisticWinRatioAdapter(statistic: Statistic) {
    statistic.Win_Ratio =
      (statistic.Win_Count / statistic.Participation_Count) * 100;
  }

  @get('/statistic', {
    responses: {
      '200': {
        description: 'Competition model instance',
        content: {'application/json': {schema: {}}},
      },
    },
  })
  async findById(): Promise<Statistic[]> {
    let data: Statistic[] = [];

    const winners: Winner[] = await this.winnerRepo.find();
    for (let i: number = 0; i < winners.length; i++) {
      let membersFirst: ParticipantMember[] = await this.participantMemberRepo.find(
        {
          where: {ID_Participant: winners[i].First},
        },
      );
      let membersSecond: ParticipantMember[] = await this.participantMemberRepo.find(
        {
          where: {ID_Participant: winners[i].Second},
        },
      );
      let membersThird: ParticipantMember[] = await this.participantMemberRepo.find(
        {
          where: {ID_Participant: winners[i].Third},
        },
      );

      for (let j: number = 0; j < membersFirst.length; j++) {
        if (i == 0) {
          let user: User = await this.userRepo.findById(
            membersFirst[j].ID_User,
          );
          let stat: Statistic = {
            ID_User: membersFirst[j].ID_User,
            Username: '',
            Affiliation: '',
            Win_Count: 0,
            Win_Ratio: 0,
            Competition_Won: [],
            Participation_Count: 0,
            Participation: [],
          };
          this.statisticUserAdapter(stat, user);

          let comp: Competition[] = await this.competitionRepo.find({
            where: {ID_Winner: winners[i].ID_Winner},
          });
          this.statisticWinnerAdapter(stat, comp[0]);
          data.push(stat);
        } else {
          let exist: boolean = false;
          for (let k: number = 0; k < data.length; k++) {
            if (data[k].ID_User == membersFirst[j].ID_User) {
              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(data[k], comp[0]);
              exist = true;
            }
            if (k == data.length - 1 && !exist) {
              let user: User = await this.userRepo.findById(
                membersFirst[j].ID_User,
              );
              let stat: Statistic = {
                ID_User: membersFirst[j].ID_User,
                Username: '',
                Affiliation: '',
                Win_Count: 0,
                Win_Ratio: 0,
                Competition_Won: [],
                Participation_Count: 0,
                Participation: [],
              };
              this.statisticUserAdapter(stat, user);

              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(stat, comp[0]);
              data.push(stat);
            }
          }
        }
      }

      for (let j: number = 0; j < membersSecond.length; j++) {
        if (i == 0) {
          let user: User = await this.userRepo.findById(
            membersSecond[j].ID_User,
          );
          let stat: Statistic = {
            ID_User: membersSecond[j].ID_User,
            Username: '',
            Affiliation: '',
            Win_Count: 0,
            Win_Ratio: 0,
            Competition_Won: [],
            Participation_Count: 0,
            Participation: [],
          };
          this.statisticUserAdapter(stat, user);

          let comp: Competition[] = await this.competitionRepo.find({
            where: {ID_Winner: winners[i].ID_Winner},
          });
          this.statisticWinnerAdapter(stat, comp[0]);
          data.push(stat);
        } else {
          let exist: boolean = false;
          for (let k: number = 0; k < data.length; k++) {
            if (data[k].ID_User == membersSecond[j].ID_User) {
              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(data[k], comp[0]);
              exist = true;
            }
            if (k == data.length - 1 && !exist) {
              let user: User = await this.userRepo.findById(
                membersSecond[j].ID_User,
              );
              let stat: Statistic = {
                ID_User: membersSecond[j].ID_User,
                Username: '',
                Affiliation: '',
                Win_Count: 0,
                Win_Ratio: 0,
                Competition_Won: [],
                Participation_Count: 0,
                Participation: [],
              };
              this.statisticUserAdapter(stat, user);

              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(stat, comp[0]);
              data.push(stat);
            }
          }
        }
      }

      for (let j: number = 0; j < membersThird.length; j++) {
        if (i == 0) {
          let user: User = await this.userRepo.findById(
            membersThird[j].ID_User,
          );
          let stat: Statistic = {
            ID_User: membersThird[j].ID_User,
            Username: '',
            Affiliation: '',
            Win_Count: 0,
            Win_Ratio: 0,
            Competition_Won: [],
            Participation_Count: 0,
            Participation: [],
          };
          this.statisticUserAdapter(stat, user);

          let comp: Competition[] = await this.competitionRepo.find({
            where: {ID_Winner: winners[i].ID_Winner},
          });
          this.statisticWinnerAdapter(stat, comp[0]);
          data.push(stat);
        } else {
          let exist: boolean = false;
          for (let k: number = 0; k < data.length; k++) {
            if (data[k].ID_User == membersThird[j].ID_User) {
              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(data[k], comp[0]);
              exist = true;
            }
            if (k == data.length - 1 && !exist) {
              let user: User = await this.userRepo.findById(
                membersThird[j].ID_User,
              );
              let stat: Statistic = {
                ID_User: membersThird[j].ID_User,
                Username: '',
                Affiliation: '',
                Win_Count: 0,
                Win_Ratio: 0,
                Competition_Won: [],
                Participation_Count: 0,
                Participation: [],
              };
              this.statisticUserAdapter(stat, user);

              let comp: Competition[] = await this.competitionRepo.find({
                where: {ID_Winner: winners[i].ID_Winner},
              });
              this.statisticWinnerAdapter(stat, comp[0]);
              data.push(stat);
            }
          }
        }
      }
    }

    const participations: Participation[] = await this.participationRepo.find();
    for (let i: number = 0; i < participations.length; i++) {
      let members: ParticipantMember[] = await this.participantMemberRepo.find({
        where: {ID_Participant: participations[i].ID_Participant},
      });

      console.log(`i: ${i}`);

      for (let j: number = 0; j < members.length; j++) {
        console.log(`j: ${j}`);
        console.log(`Checked Member: ${members[j].ID_User}`);
        let exist: boolean = false;
        for (let k: number = 0; k < data.length; k++) {
          console.log(`k: ${k}`);
          if (data[k].ID_User == members[j].ID_User) {
            let participant: Participant[] = await this.participantRepo.find({
              where: {ID_Participant: participations[i].ID_Participant},
            });
            this.statisticParticipationAdapter(
              data[k],
              participations[i],
              participant[0],
            );
            exist = true;
          }
          if (k == data.length - 1 && !exist) {
            console.log('yes');
            let user: User = await this.userRepo.findById(members[j].ID_User);
            let stat: Statistic = {
              ID_User: members[j].ID_User,
              Username: '',
              Affiliation: '',
              Win_Count: 0,
              Win_Ratio: 0,
              Competition_Won: [],
              Participation_Count: 0,
              Participation: [],
            };
            this.statisticUserAdapter(stat, user);

            let participant: Participant[] = await this.participantRepo.find({
              where: {ID_Participant: participations[i].ID_Participant},
            });
            this.statisticParticipationAdapter(
              stat,
              participations[i],
              participant[0],
            );
            data.push(stat);
          }
        }
      }
    }

    for (let i: number = 0; i < data.length; i++) {
      this.statisticWinCountAdapter(data[i]);
      this.statisticParticipationCountAdapter(data[i]);
      this.statisticWinRatioAdapter(data[i]);
    }

    console.log(toJSON(data));

    return data;
  }
}
