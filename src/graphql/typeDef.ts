export default `#graphql
scalar DateTime

enum Status {
  DRAFT
  SUBMITTED
  PUBLISHED
}

type User {
  id: ID!
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime
}

type AuthUser {
  id: ID!
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime
  meta: TokenInfo
  posts(filter: UserPostFilterInput): [Post!]!
}

type TokenInfo {
  token: String!
}

type SingleUser {
  id: ID!
  name: String!
  email: String! @auth(isAdmin: true)
  is_admin: Boolean! @auth(isAdmin: true)
  created_at: DateTime! 
  updated_at: DateTime!
  suspended_at: DateTime @auth(isAdmin: true)
  posts: [PublishedPost!]!
}

type Author {
  id: ID!
  name: String!
  created_at: DateTime!
}

type Post {
  id: ID!
  title: String!
  body: String
  status: Status!
  submitted_at: DateTime
  published_at: DateTime
  meta: Meta!
  created_at: DateTime!
  updated_at: DateTime!
  user: Author!
}

type PublishedPost {
  id: ID!
  title: String!
  body: String!
  published_at: DateTime!
  meta: Meta!
  user: Author!
}

type SinglePublishedPost {
  id: ID!
  title: String!
  body: String!
  published_at: DateTime!
  meta: Meta!
  user: Author!
  comments: [PostComment!]!
}

type SinglePost {
  id: ID!
  title: String!
  body: String
  status: Status!
  submitted_at: DateTime
  published_at: DateTime
  meta: Meta!
  created_at: DateTime!
  updated_at: DateTime!
  user: Author!
  comments: [PostComment!]!
}

type Comment {
  id: ID!
  body: String!
  created_at: DateTime!
  post: PublishedPost!
  user: Author!
}

type PostComment {
  id: ID!
  body: String!
  created_at: DateTime!
  user: Author!
}

type Meta {
  views: Int!
}

type Query {
  getAuthenticatedUser: AuthUser! @auth(allowSuspendedUser: true)
  getPosts(filter: GeneralPostFilterInput): [PublishedPost!]!
  getPost(id: ID!): SinglePost! @auth
  getPublishedPost(id: ID!): SinglePublishedPost!
  getUsers(filter: UserFilterInput): [User!]! @auth(isAdmin: true)
  getUser(id: ID!): SingleUser!
}

type Mutation {
  register(input: RegisterUserInput!): AuthUser!
  login(email: String!, password: String!): AuthUser!
  forgotPassword(email: String!): String!
  resetPassword(input: ResetPasswordInput!): String!
  createPost(input: CreatePostInput!): Post! @auth(isAdmin: false, allowSuspendedUser: false)
  updatePost(id: ID!, input: UpdatePostInput!): Post! @auth
  deletePost(id: ID!): Post! @auth
  submitPost(id: ID!): Post! @auth
  publishPost(id: ID!): Post! @auth(isAdmin: true)
  createComment(postId: ID!, input: CreateCommentInput!): Comment! @auth(allowSuspendedUser: false)
  deleteComment(id: ID!): Comment! @auth
  updateProfile(input: UpdateUserInput!): User! @auth
  updatePassword(input: UpdatePasswordInput!): User! @auth
  toggleAdmin(id: ID!): User! @auth(isAdmin: true)
  toggleUserSuspension(id: ID!): User! @auth(isAdmin: true)
}

input RegisterUserInput {
  name: String!
  email: String!
  password: String!
  confirm_password: String!
}

input ResetPasswordInput {
  token: String!
  email: String!
  password: String!
  confirm_password: String!
}

input UserPostFilterInput {
  query: String
  status: Status
}

input GeneralPostFilterInput {
  query: String
}

input CreatePostInput {
  title: String!
  body: String
  submit: Boolean
}

input UpdatePostInput {
  title: String
  body: String
}

input CreateCommentInput {
  body: String!
}

input UserFilterInput {
  is_admin: Boolean
  query: String
  suspended: Boolean
}

input UpdateUserInput {
  name: String
  email: String
}

input UpdatePasswordInput {
  password: String!
  confirm_password: String!
}
`;
