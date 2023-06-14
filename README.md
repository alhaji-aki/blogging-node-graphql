# Blogging Backend

Blogging application using node and graphql

## Features

1. Authentication
   - [x] Sign Up
   - [x] Sign In
   - [x] Forgot Password
   - [x] Reset Password
2. Posts
   - [x] Create Posts (authenticated users only)
   - [x] Read Posts (public routes)
   - [x] Update Posts (authenticated users and only user who created the post and users cannot update published posts)
   - [x] Delete Posts (authenticated user who created the post and admin)
   - [ ] user can submit their posts
   - [ ] Authenticated users can get all their posts and filter by draft, submitted or published
   - [ ] Admin can publish posts
   - [x] Posts have a status: draft, submitted and published
   - [ ] Posts submitted by admins are published automatically
   - [ ] Keep views count on posts
3. CRUD for Comments
   - [ ] Create Comment On Post (authenticated users only)
   - [ ] Read Post Comments (public routes)
   - [ ] Update Comment (authenticated users and only user who created the comment)
   - [ ] Delete Comment (authenticed user who created the comment and admin)
4. Users
   - [ ] Admins can view all users
   - [ ] Admins can make other users admin
   - [ ] Admin can suspend other users
5. Search
   - [ ] An endpoint that returns both users (who have ever published posts) and posts (published ones)
6. Notifications
   - [ ] Notify users when their posts have been commented on.
   - [ ] Notify other users when posts they commented on receive new comments
   - [ ] Users can mute notifications from their posts or posts they commented on

## Research on

- [ ] Add pagination

## [License](LICENSE.md)
