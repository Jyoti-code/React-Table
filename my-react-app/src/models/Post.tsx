// src/models/Post.ts
interface Post {
    id: number;
    title: string;
    body: string;
    additionalDetails?: string; // New property for additional details
  }
  
  export default Post;
  