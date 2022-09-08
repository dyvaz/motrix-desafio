import type {NextPage} from "next";
import dynamic from "next/dynamic";

const Form = dynamic(() => import("../../components/posts/form"), {ssr: false});

const PostCreate: NextPage = () => {
  return (
    <>
      <div className="bg-white text-black p-2 rounded">
        <Form />
      </div>
    </>
  );
};

export default PostCreate;
