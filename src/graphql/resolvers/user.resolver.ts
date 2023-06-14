import { GraphQLError } from 'graphql';
import User, { User as UserInterface } from '../../models/User';

function canViewUser(authenticatedUser, user) {
  if (user.suspended() && (!authenticatedUser || !authenticatedUser.is_admin)) {
    return false;
  }

  return true;
}

export default {
  Query: {
    async getUsers(): Promise<Array<UserInterface>> {
      // TODO: admins can filter {get only admins, search, suspended}
      return await User.find();
    },
    async getUser(_, { id }, { authenticatedUser }): Promise<UserInterface> {
      const user = await User.findById(id)
        .populate({
          path: 'posts',
          match: { published_at: { $ne: null } },
          populate: { path: 'user' },
        })
        .exec();

      if (!user || !canViewUser(authenticatedUser, user)) {
        throw new GraphQLError('User not found.', {
          extensions: {
            code: 'ITEM_NOT_FOUND',
            http: { status: 404 },
          },
        });
      }

      return user;
    },
  },
  Mutation: {
    async updateUser() {
      //TODO:
    },
    async updateUserPassword() {
      //TODO:
    },
    async toggleAdmin() {
      //TODO:
    },
    async toggleUserSuspension() {
      //TODO:
    },
  },
};
