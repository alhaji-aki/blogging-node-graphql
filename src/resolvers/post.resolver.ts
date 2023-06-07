import Post from '../models/Post';

const getPosts = async (): Promise<Array<typeof Post>> => {
  return await Post.find();
};

export { getPosts };
