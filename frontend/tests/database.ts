import { knexSetup } from '../../backend/database/knex';
import * as knexfile from '../../backend/database/knexfile';
import User from '../../backend/database/models/user';

knexSetup(knexfile.test);

export class Database {
  async deleteUser(username: string) {
    await User.query().delete().where('username', username);
  }
}
