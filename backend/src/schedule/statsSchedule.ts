import schedule from 'node-schedule';
import db from '../database/postgresql';
import StatModel from '../models/Stat';

class Schedule {
  init() {
    schedule.scheduleJob('*/1 * * * *', async function () {
      const usersCount = (await db('users').count('id').first()) as {
        count: string;
      };
      const categoriesCount = (await db('categories').count('id').first()) as {
        count: string;
      };
      const articlesCount = (await db('articles').count('id').first()) as {
        count: string;
      };

      const lastStat = await StatModel.findOne(
        {},
        {},
        { sort: { createdAt: -1 } },
      );

      const stat = new StatModel({
        users: Number(usersCount.count),
        categories: Number(categoriesCount.count),
        articles: Number(articlesCount.count),
        createdAt: new Date(),
      });

      const changeUsers = !lastStat || stat.users !== lastStat.users;
      const changeCategories =
        !lastStat || stat.categories !== lastStat.categories;
      const changeArticles = !lastStat || stat.articles !== lastStat.articles;

      if (changeUsers || changeCategories || changeArticles) {
        stat.save().then(() => console.log('[Stats] Updated !!'));
      }
    });
  }
}

export default new Schedule();
