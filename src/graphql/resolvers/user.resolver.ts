import User from '../../models/User';

export default {
  Query: {
    async getUsers(): Promise<Array<typeof User>> {
      // TODO: only authenticated users can access this endpoint
      // TODO: only admins can get this endpoint
      // TODO: admins can filter {get only admins, search, suspended}
      return await User.find();
    },
    async getUser(_, { id }): Promise<typeof User> {
      // TODO: only admins can view suspended users
      // TODO: only admins should be able to see certain properties of the user (email, is_admin, suspended_at)
      return await User.findById(id)
        .populate({
          path: 'posts',
          match: { published_at: { $ne: null } },
          populate: { path: 'user' },
        })
        .exec();
    },
  },
  Mutation: {
    async createUser() {
      //TODO:
    },
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
