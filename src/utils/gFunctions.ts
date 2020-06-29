import {TagsRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {Tags, TagsRelations} from '../models';

export function getDateNow(): string {
  const currentDateInstance = new Date();
  const day = currentDateInstance.getDate();
  const month = currentDateInstance.getMonth();
  const year = currentDateInstance.getFullYear();
  const hour = currentDateInstance.getHours();
  const minute = currentDateInstance.getMinutes();
  const second = currentDateInstance.getSeconds();

  const currentDate = `${month}-${day}-${year} ${hour}:${minute}:${second}`;

  return currentDate;
}

export class TagsResolver {
  constructor(
    @repository(TagsRepository)
    public tagsRepo: TagsRepository,
  ) {}

  async getTagID(tag: string): Promise<number> {
    const tagData: (Tags & TagsRelations)[] = await this.tagsRepo.find({
      where: {Tag_Name: tag},
    });

    let getID: number = 0;
    if (tagData) {
      getID = tagData[0].ID_Tags;
    } else {
      const getLastID = await this.tagsRepo.find({
        order: ['ID_Tags DESC'],
        limit: 1,
      });

      if (getLastID) {
        getID = getLastID[0].ID_Tags + 1;
      }
    }

    return getID;
  }
}
