export default `#graphql
scalar DateTime

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
  status: String!
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

type SinglePost {
  id: ID!
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
  id: ID!
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

input ResetPasswordInput {
  token: String!
  email: String!
  password: String!
  confirm_password: String!
}

# input UpdateUserInput {
#   name: String
#   email: String
# }

type Query {
  getAuthenticatedUser: User! @auth(allowSuspendedUser: true)
  # TODO: getAuthenticatedUsersPosts: [Post!]!
  getPosts: [PublishedPost!]!
  getPost(id: ID!): SinglePost!
  getUsers: [User!]! @auth(isAdmin: true)
  getUser(id: ID!): SingleUser!
}

type Mutation {
  register(input: RegisterUserInput!): AuthUser!
  login(email: String!, password: String!): AuthUser!
  forgotPassword(email: String!): String!
  resetPassword(input: ResetPasswordInput!): String!
  # createPost(content: PostInput): Post @auth
  # updatePost(id: ID!, content: PostInput): Post @auth
  # deletePost(id: ID!): Post @auth
  # publishPost(id: ID!): Post @auth(isAdmin: true)
  # createComment(postId: ID!, content: CommentInput): Comment @auth
  # updateComment(id: ID!, content: CommentInput): Comment @auth
  # deleteComment(id: ID!): Comment @auth
  # updateUser(content: UpdateUserInput): User @auth
  # updateUserPassword(id: ID!, password: String!): User @auth
  # toggleAdmin(id: ID!, is_admin: Boolean!): User @auth(isAdmin: true)
  # toggleUserSuspension(id: ID!): User @auth(isAdmin: true)
}
`;
