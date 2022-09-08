import { Post } from "../models/post";

export interface PostCreateRequest {
  title: string;
  text?: string;
}

export interface PostUpdateRequest {
  title?: string;
  text?: string;
}

export interface PostListResponseData {
  total: number;
  posts: Post[];
}

function hydrate(post: Post<string>): Post {
  return {
    ...post,
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
    versions: post.versions?.map(hydrate),
  };
}

const baseURL = "http://127.0.0.1:8080";
const headers = { "Content-Type": "application/json" };

export async function createPost(data: PostCreateRequest): Promise<Post> {
  const res = await fetch(`${baseURL}/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (res.status < 200 || res.status > 299) {
    throw new Error(`Não foi possível criar o post.`);
  }
  const post = await res.json();
  return hydrate(post);
}

export async function getPosts(
  skip: number,
  limit: number,
  sort: string
): Promise<PostListResponseData> {
  const res = await fetch(
    `${baseURL}/posts?limit=${limit}&skip=${skip}&sort=${sort}`
  );
  if (res.status < 200 || res.status > 299) {
    throw new Error(`Não foi possível carregar a lista de posts.`);
  }
  const posts = await res.json();
  return { total: posts.total, posts: posts.posts.map(hydrate) };
}

export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${baseURL}/posts/${id}`);
  if (res.status < 200 || res.status > 299) {
    throw new Error(`Não foi possível carregar o post.`);
  }
  const post = await res.json();
  return hydrate(post);
}

export async function updatePost(
  id: string,
  data: PostUpdateRequest
): Promise<Post> {
  const res = await fetch(`${baseURL}/posts/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (res.status < 200 || res.status > 299) {
    throw new Error(`Não foi possível atualizar o post.`);
  }
  const post = await res.json();
  return hydrate(post);
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${baseURL}/posts/${id}`, {
    method: "DELETE",
  });

  if (res.status < 200 || res.status > 299) {
    throw new Error(`Não foi possível apagar o post.`);
  }
}
