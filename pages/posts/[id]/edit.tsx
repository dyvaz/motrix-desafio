import type {NextPage} from "next";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {Post} from "../../../components/models/post";
import Loading from "../../../components/Loading";
import * as api from "../../../components/api";

const Form = dynamic(() => import("../../../components/posts/form"), {ssr: false});

const PostEdit: NextPage = (props) => {
  const {
    query: {id},
  } = useRouter();

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPost();
  }, [id]);

  async function getPost() {
    if (typeof id !== "string") {
      return;
    }
    setLoading(true);
    setPost(await api.getPost(id));
    setLoading(false);
  }

  return (
    <>
      {loading && <Loading />}
      {post && (
        <div className="bg-white text-black p-2 rounded">
          <Form doc={post} />
        </div>
      )}
    </>
  );
};

export default PostEdit;
