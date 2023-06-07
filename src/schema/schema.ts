export default `#graphql
scalar Date

type User {
  id: ID
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: Date!
  updated_at: Date!
  suspended_at: Date!
  posts: [Post!]!
}

type Post {
  id: ID
  title: String!
  body: String
  status: String!
  submitted_at: Date
  published_at: Date
  meta: Meta!
  created_at: Date!
  updated_at: Date!
  user: User!
  comments: [Comment!]!
}

type Comment {
  id: ID
  body: String!
  created_at: Date!
  updated_at: Date!
  user: User!
  post: Post!
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
  getPosts: [Post!]!
  getPost: Post!
  getPostComments: [Comment!]!
  getUserPosts: [Post!]!
  getUsers: [User!]!
  getUser: User!
}

type Mutation {
  createPost(content: PostInput): Post
  updatePost(id: ID!, content: PostInput): Post
  deletePost(id: ID!): Post
  publishPost(id: ID!): Post
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
