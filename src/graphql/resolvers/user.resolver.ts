import { GraphQLError } from 'graphql';
import User, { User as UserInterface } from '../../models/User';
import UserPolicy from '../../policies/user.policy';

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

      UserPolicy.view(authenticatedUser, user);

      return user;
    },
  },
  Mutation: {
    async updateProfile(
      _,
      { input: { name, email } },
      { authenticatedUser },
    ): Promise<UserInterface> {
      // TODO: validate

      if (!name && !email) {
        throw new GraphQLError('No data to update.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
          },
        });
      }

      if (
        email &&
        !!(await User.findOne({ email })
          .where('_id')
          .ne(authenticatedUser.id)
          .exec())
      ) {
        throw new GraphQLError('Email is already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            argumentName: 'email',
            http: { status: 422 },
          },
        });
      }

      authenticatedUser.name = name || authenticatedUser.name;
      authenticatedUser.email = email || authenticatedUser.email;

      await authenticatedUser.save();

      return authenticatedUser;
    },
    async updatePassword(
      _,
      { input: { password } },
      { authenticatedUser },
    ): Promise<UserInterface> {
      // TODO: validate

      authenticatedUser.password = password;

      await authenticatedUser.save();

      return authenticatedUser;
    },
    async toggleAdmin(
      _,
      { id },
      { authenticatedUser },
    ): Promise<UserInterface> {
      const user = await User.findById(id);

      UserPolicy.toggleAdmin(authenticatedUser, user);

      user.is_admin = !user.is_admin;

      await user.save();

      // TODO: send notification if user is now an admin

      return user;
    },
    async toggleUserSuspension(
      _,
      { id },
      { authenticatedUser },
    ): Promise<UserInterface> {
      const user = await User.findById(id);

      UserPolicy.toggleSuspension(authenticatedUser, user);

      user.suspended_at = user.suspended() ? null : new Date();

      await user.save();

      // TODO: send notification to show suspension status change

      return user;
    },
  },
};
