import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import connectDB from '../config/database';
import logger from '../config/logger';

const users: Array<typeof User> = [];
const posts: Array<typeof Post> = [];

async function seed() {
  try {
    const connection = await connectDB();

    logger.debug('Successfully connected to database...');

    // 1. Create users
    await createAllUserTypes();

    // 2. Create Posts
    await createPosts();

    // 3. create comments
    await createComments();

    await connection.disconnect();
    logger.debug('Successfully disconnected to database...');

    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

async function createAllUserTypes() {
  await User.deleteMany({});

  await createAdmins();

  await createUsers();
}

async function createAdmins() {
  const admins = [
    'admin@example.com',
    'johndoe@example.com',
    'second@admin.com',
  ];
  await Promise.all(
    admins.map((item) => createUser(generateUserItem(true, item))),
  );
  logger.info(`Seeded admins`);
}

async function createUsers() {
  const users = Array.from({ length: 100 }, () => generateUserItem());
  await Promise.all(users.map((item) => createUser(item)));
  logger.info(`Seeded users`);
}

function generateUserItem(isAdmin = false, email?: string) {
  return {
    name: faker.person.fullName(),
    email: email ?? faker.internet.email(),
    password: 'password',
    is_admin: isAdmin,
  };
}

async function createUser(userDetails) {
  const user = new User(userDetails);
  await user.save();
  users.push(user);
}

async function createPosts() {
  await Post.deleteMany({});

  const posts = Array.from({ length: 10000 }, () =>
    generatePostItem(users[faker.number.int({ max: users.length - 1 })]),
  );

  await Promise.all(posts.map((item) => createPost(item)));

  logger.info(`Seeded posts`);
}

function generatePostItem(user) {
  const submitted_at = faker.helpers.arrayElement([faker.date.past(), null]);

  let published_at = user.is_admin && submitted_at ? submitted_at : null;

  if (submitted_at && !published_at) {
    published_at = faker.helpers.arrayElement([faker.date.past(), null]);
  }

  const views = !published_at ? 0 : faker.number.int({ max: 50000000 });

  return {
    user_id: user._id,
    title: faker.lorem.text(),
    body: faker.lorem.paragraph(),
    submitted_at,
    published_at,
    meta: { views: views },
  };
}

async function createPost(postDetails) {
  const post = new Post(postDetails);
  await post.save();
  posts.push(post);
}

async function createComments() {
  await Comment.deleteMany({});

  const comments = [];

  posts
    .filter((post) => post.published_at !== null)
    .forEach(async (post) => {
      const noOfComments = faker.number.int({ min: 0, max: 100 });

      const postComments = Array.from({ length: noOfComments }, () =>
        generateCommentItem(
          users[faker.number.int({ max: users.length - 1 })],
          post,
        ),
      );

      comments.push(...postComments);
    });

  await Promise.all(comments.map((item) => createComment(item)));

  logger.info(`Seeded comments`);
}

function generateCommentItem(user, post) {
  return {
    user_id: user._id,
    post_id: post._id,
    body: faker.lorem.paragraph(),
  };
}

async function createComment(commentDetails) {
  const comment = new Comment(commentDetails);
  await comment.save();
}

seed();
