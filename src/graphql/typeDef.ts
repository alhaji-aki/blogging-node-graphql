export default `#graphql
scalar DateTime

type User {
  id: ID
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime!
}

type PrivatePost {
  id: ID
  title: String!
  body: String
  status: String!
  submitted_at: DateTime
  published_at: DateTime
  meta: Meta!
  created_at: DateTime!
  updated_at: DateTime!
  user: User!
}

type PublicPost {
  id: ID
  title: String!
  body: String!
  published_at: DateTime!
  meta: Meta!
  user: User!
}

type Comment {
  id: ID
  body: String!
  created_at: DateTime!
  updated_at: DateTime!
  user: User!
  post: PublicPost!
}

type Meta {
  views: Int!
}

input PostInput {
  title: String
  body: String
  submit: Boolean
}

input CommentInput {
  body: String
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}

type Query {
  getAuthenticatedUsersPosts: [PrivatePost!]!
  getAuthenticatedUsersPost(id: ID!): PrivatePost!
  getPosts: [PublicPost!]!
  getPost(id: ID!): PublicPost!
  getPostComments(id: ID!): [Comment!]!
  getUsers: [User!]!
  getUser(id: ID!): User!
  getUserPosts(id: ID!): [PublicPost!]!
}

type Mutation {
  createPost(content: PostInput): PrivatePost
  updatePost(id: ID!, content: PostInput): PrivatePost
  deletePost(id: ID!): PrivatePost
  publishPost(id: ID!): PrivatePost
  createComment(postId: ID!, content: CommentInput): Comment
  updateComment(id: ID!, content: CommentInput): Comment
  deleteComment(id: ID!): Comment
  createUser(content: CreateUserInput): User
  updateUser(content: UpdateUserInput): User
  updateUserPassword(id: ID!, password: String!): User
  toggleAdmin(id: ID!, is_admin: Boolean!): User
  toggleUserSuspension(id: ID!): User
}
`;
