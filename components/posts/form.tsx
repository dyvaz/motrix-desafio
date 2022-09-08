import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState, useEffect, useContext } from "react";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Loading from "../Loading";
import * as api from "../api";
import { ToastContext } from "../hooks/toast";

const Form: NextPage<{ doc?: { id: string; title: string; text: string } }> = (
  props
) => {
  const [title, setTitle] = useState(props.doc?.title || "");
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [loagind, setLoading] = useState(false);
  const { push } = useRouter();

  const id = props.doc?.id;
  const isEdit = typeof id === "string";

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    if (props.doc?.text) {
      const { contentBlocks, entityMap } = htmlToDraft(props.doc.text);
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
      return;
    }
    setEditorState(EditorState.createEmpty());
  }, [props.doc?.text]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let text = "";
    if (editorState) {
      text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    if (isEdit) {
      try {
        await api.updatePost(id, { title, text });

        addToast({ message: "Post alterado com sucesso" });
      } catch (e: any) {
        addToast({ message: e.message, error: true });
      }
    } else {
      try {
        await api.createPost({ title, text });

        addToast({ message: "Post criado com sucesso" });
      } catch (e: any) {
        addToast({ message: e.message, error: true });
      }
    }

    setLoading(false);
    push("/posts");
  }

  return (
    <>
      {loagind && <Loading />}
      <form action="/" onSubmit={submit}>
        <div className="mb-3 mt-3">
          <label htmlFor="title" className="form-label">
            Título:
          </label>
          <input
            type="text"
            className={
              title === "" ? "is-invalid form-control" : "form-control"
            }
            id="title"
            placeholder="Título"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">
            Descrição:
          </label>
          <Editor
            editorState={editorState}
            editorClassName="px-2 border rounded"
            onEditorStateChange={setEditorState}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "history",
              ],
            }}
          />
        </div>

        <button type="submit" className="btn btn-dark">
          {isEdit ? "Salvar" : "Criar"}
        </button>
      </form>
    </>
  );
};

export default Form;
