import { GraphQLError } from 'graphql';
import Validator from 'validatorjs';
import User, { User as UserInterface } from '../../models/User';
import UserPolicy from '../../policies/user.policy';

function getQueryFilter(filter) {
  const query: { name?: any; suspended_at?: any; is_admin?: any } = {};

  if (filter && filter.query) {
    query.name = { $regex: filter.query, $options: 'i' };
  }

  if (filter && typeof filter.suspended == 'boolean') {
    query.suspended_at = filter.suspended
      ? { $not: { $eq: null } }
      : { $eq: null };
  }

  if (filter && typeof filter.is_admin == 'boolean') {
    query.is_admin = filter.is_admin;
  }

  return query;
}

export default {
  Query: {
    async getUsers(_, { filter }): Promise<Array<UserInterface>> {
      const query = getQueryFilter(filter);

      return await User.find(query).exec();
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
      { input },
      { authenticatedUser },
    ): Promise<UserInterface> {
      const validation = new Validator(input, {
        name: ['nullable', 'string', 'max:255'],
        email: ['nullable', 'string', 'email', 'max:255'],
      });

      if (validation.fails()) {
        throw new GraphQLError(
          'Invalid data submitted. See extentions.errors for more details',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: validation.errors.all(),
            },
          },
        );
      }

      if (!input.name && !input.email) {
        throw new GraphQLError('No data to update.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
          },
        });
      }

      if (
        input.email &&
        !!(await User.findOne({ email: input.email })
          .where('_id')
          .ne(authenticatedUser.id)
          .exec())
      ) {
        throw new GraphQLError('Email is already taken', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 422 },
            errors: {
              email: ['Email is already taken'],
            },
          },
        });
      }

      authenticatedUser.name = input.name || authenticatedUser.name;
      authenticatedUser.email = input.email || authenticatedUser.email;

      await authenticatedUser.save();

      return authenticatedUser;
    },
    async updatePassword(
      _,
      { input },
      { authenticatedUser },
    ): Promise<UserInterface> {
      const validation = new Validator(input, {
        password: ['required', 'string', 'confirmed', 'max:255'],
      });

      if (validation.fails()) {
        throw new GraphQLError(
          'Invalid data submitted. See extentions.errors for more details',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              http: { status: 422 },
              errors: validation.errors.all(),
            },
          },
        );
      }

      authenticatedUser.password = input.password;

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
