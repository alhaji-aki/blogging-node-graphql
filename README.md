# Blogging Backend
Blogging application using node and graphql

## Features
1. Authentication 
   - [ ] Sign Up
   - [ ] Sign In
   - [ ] Forgot Password
   - [ ] Reset Password
2. Posts
   - [ ] Create Posts (authenticated users only)
   - [ ] Read Posts (public routes)
   - [ ] Update Posts (authenticated users and only user who created the post)
   - [ ] Delete Posts (authenticated user who created the post and admin)
   - [ ] Authenticated users can get all their posts and filter by draft, submitted or published
   - [ ] Authenticated users can report posts
   - [ ] Admin can publish posts
   - [ ] Posts have a status: draft, submitted and published
   - [ ] Posts submitted by admins are published automatically
   - [ ] Keep views count on posts
3. CRUD for Comments
   - [ ] Create Comment On Post (authenticated users only)
   - [ ] Read Post Comments (public routes)
   - [ ] Update Comment (authenticated users and only user who created the comment)
   - [ ] Delete Comment (authenticed user who created the comment and admin)
   - [ ] Authenticated users can report comments
4. Users
   - [ ] Admins can view all users
   - [ ] Admins can make other users admin
   - [ ] Admin can suspend other users
5. Notifications
   - [ ] Notify users when their posts have been commented on.
   - [ ] Notify other users when posts they commented on receive new comments
   - [ ] Users can mute notifications from their posts or posts they commented on
## [License](LICENSE.md)
