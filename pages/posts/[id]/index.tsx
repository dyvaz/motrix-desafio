import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Post } from "../../../components/models/post";
import * as api from "../../../components/api";
import { ToastContext } from "../../../components/hooks/toast";

const PostView: NextPage = () => {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const [mostraVersao, setMostraVersao] = useState(false);
  const {
    push,
    query: { id },
  } = useRouter();
  const { addToast } = useContext(ToastContext);

  async function getPost() {
    if (typeof id !== "string") {
      return;
    }
    setLoading(true);
    setPost(await api.getPost(id));
    setLoading(false);
  }
  async function deleteItem() {
    if (typeof id !== "string") {
      return;
    }
    setLoading(true);
    try {
      await api.deletePost(id);

      addToast({ message: "Post apagado com sucesso" });
    } catch (e: any) {
      addToast({ message: e.message, error: true });
    }
    setLoading(false);
    push("/posts");
  }

  useEffect(() => {
    getPost();
  }, [id]);

  return (
    <>
      {loading && <Loading />}

      <div className="bg-white text-black p-2 rounded">
        <div className=" float-end">{post?.created_at.toLocaleString()}</div>
        <div className="mb-3 mt-3">
          <h3>{post?.title}</h3>
        </div>
        <div className=" px-2 mb-3">
          <div dangerouslySetInnerHTML={{ __html: post?.text || "" }}></div>
        </div>
        <Link href={`/posts/${id}/edit`}>
          <a className="bi bi-pencil btn btn-dark mx-2"></a>
        </Link>
        <button
          onClick={() => deleteItem()}
          className="bi bi-trash3 btn btn-dark  mx-2"
        ></button>
      </div>
      <button
        onClick={() => setMostraVersao(!mostraVersao)}
        className="btn btn-dark mt-3"
        disabled={post?.version === 1}
      >
        {post?.version === 1
          ? "Sem versões anteriores"
          : "Mostrar versões anteriores"}
      </button>
      {mostraVersao &&
        post?.versions?.map((post) => (
          <div
            key={post.version}
            className="my-3 bg-white text-black p-2 rounded"
          >
            <div className=" float-end">
              {post?.created_at.toLocaleString()}
            </div>
            <div className="mb-3 mt-3">
              <h3>{post?.title}</h3>
            </div>
            <div className="mb-3">
              <div dangerouslySetInnerHTML={{ __html: post?.text }}></div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostView;
