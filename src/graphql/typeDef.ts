export default `#graphql
scalar DateTime

type User {
  id: ID
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime
}

type AuthUser {
  id: ID
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime
  meta: TokenInfo
}

type TokenInfo {
  token: String!
}

type SingleUser {
  id: ID
  name: String!
  email: String!
  is_admin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
  suspended_at: DateTime
  posts: [PublishedPost!]!
}

type Author {
  id: ID
  name: String!
  created_at: DateTime!
}

type Post {
  id: ID
  title: String!
  body: String
  status: String!
  submitted_at: DateTime
  published_at: DateTime
  meta: Meta!
  created_at: DateTime!
  updated_at: DateTime!
  user: Author!
}

type PublishedPost {
  id: ID
  title: String!
  body: String!
  published_at: DateTime!
  meta: Meta!
  user: Author!
}

type SinglePost {
  id: ID
  title: String!
  body: String
  status: String!
  submitted_at: DateTime
  published_at: DateTime
  meta: Meta!
  created_at: DateTime!
  updated_at: DateTime!
  user: Author!
  comments: [Comment!]!
}

type Comment {
  id: ID
  body: String!
  created_at: DateTime!
  updated_at: DateTime!
  user: Author!
}

type Meta {
  views: Int!
}

# input PostInput {
#   title: String
#   body: String
#   submit: Boolean
# }

# input CommentInput {
#   body: String
# }

input RegisterUserInput {
  name: String!
  email: String!
  password: String!
  confirm_password: String!
}

# input UpdateUserInput {
#   name: String
#   email: String
# }

type Query {
  getAuthenticatedUser: User!
  # TODO: getAuthenticatedUsersPosts: [Post!]!
  getPosts: [PublishedPost!]!
  getPost(id: ID!): SinglePost!
  getUsers: [User!]!
  getUser(id: ID!): SingleUser!
}

type Mutation {
  register(input: RegisterUserInput): AuthUser
  login: User
  forgotPassword: String
  resetPassword: String
  # createPost(content: PostInput): Post
  # updatePost(id: ID!, content: PostInput): Post
  # deletePost(id: ID!): Post
  # publishPost(id: ID!): Post
  # createComment(postId: ID!, content: CommentInput): Comment
  # updateComment(id: ID!, content: CommentInput): Comment
  # deleteComment(id: ID!): Comment
  # createUser(content: CreateUserInput): User
  # updateUser(content: UpdateUserInput): User
  # updateUserPassword(id: ID!, password: String!): User
  # toggleAdmin(id: ID!, is_admin: Boolean!): User
  # toggleUserSuspension(id: ID!): User
}
`;
