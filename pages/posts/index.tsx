import type { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import * as api from "../../components/api";
import { useRouter } from "next/router";
import { ToastContext } from "../../components/hooks/toast";

const PostList: NextPage = () => {
  const limit = 4;
  const [posts, setPosts] = useState<api.PostListResponseData>({
    total: 0,
    posts: [],
  });
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  const { addToast } = useContext(ToastContext);

  const {
    push,
    query: { skip, sort },
  } = useRouter();

  const parsedSkip = typeof skip === "string" ? parseInt(skip, 10) : 0;
  const parsedSort = typeof sort === "string" ? sort : "-created_at";

  async function getPosts() {
    setLoading(true);
    try {
      setPosts(await api.getPosts(parsedSkip, limit, parsedSort));
    } catch (e: any) {
      addToast({ message: e.message, error: true });
    }
    setLoading(false);
  }

  async function deleteItem(id: string) {
    setLoading(true);
    try {
      await api.deletePost(id);
      addToast({ message: "Post apagado com sucesso" });
    } catch (e: any) {
      addToast({ message: e.message, error: true });
    }
    setLoading(false);
    getPosts();
  }

  function selectChange(event: ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();

    push(`/posts?sort=${event.target.value}`);
  }

  function checkChange(id: string, check: boolean) {
    if (check) {
      setChecked((checked) => [...checked, id]);
    } else {
      setChecked((checked) => checked.filter((a) => a !== id));
    }
  }
  function selectAll() {
    setChecked(posts.posts.map((post) => post.id));
  }
  function unselectAll() {
    setChecked([]);
  }
  async function deleteAll(checkeds: string[]) {
    setLoading(true);
    try {
      await Promise.all(checkeds.map((id) => api.deletePost(id)));

      addToast({ message: "Posts apagados com sucesso" });
    } catch {
      addToast({ message: "Não foi possivel apagar os posts", error: true });
    }
    setLoading(false);
    getPosts();
    setChecked([]);
  }

  useEffect(() => {
    getPosts();
  }, [parsedSkip, parsedSort]);

  return (
    <>
      {loading && <Loading />}
      {posts.total === 0 ? (
        <div className="mt-5">
          <h2 className="text-center">
            Lista vazia. Crie um post para vê-lo aqui.
          </h2>
          <div className="d-grid col-1 mx-auto">
            <Link href="/posts/new">
              <a className="btn btn-dark mx-2">Criar</a>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <label className="m-2" htmlFor="inputGroupSelect01">
            Ordernar por:
          </label>
          <select
            id="inputGroupSelect01"
            className=" m-1 btn btn-dark p-2"
            onChange={(event) => selectChange(event)}
            value={parsedSort}
          >
            <option value="title">Título</option>
            <option value="-created_at">Data de criação</option>
            <option value="-updated_at">Data de atualização</option>
          </select>
          {checked.length !== 0 && (
            <button className="btn btn-dark mx-1" onClick={() => unselectAll()}>
              Desmarcar todos
            </button>
          )}
          {checked.length !== posts.posts.length && (
            <button className="btn btn-dark mx-1" onClick={() => selectAll()}>
              Marcar todos
            </button>
          )}

          {checked.length !== 0 && (
            <button
              className="btn btn-dark  mx-1"
              onClick={() => deleteAll(checked)}
            >
              Apagar todos marcados
            </button>
          )}
          <div className="d-flex flex-wrap">
            {posts.posts.map((post: any) => (
              <div className="p-2" key={post.id}>
                <div
                  className="card"
                  style={{
                    width: "18rem",
                    color: "black",
                  }}
                >
                  <input
                    onChange={(event) =>
                      checkChange(post.id, event.target.checked)
                    }
                    className="p-2 form-check-input m-2"
                    type="checkbox"
                    id="check1"
                    name="option1"
                    value="something"
                    checked={checked.includes(post.id)}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p
                      className="text-secondary card-text "
                      style={{
                        overflow: "hidden",
                        height: 200,
                      }}
                      dangerouslySetInnerHTML={{ __html: post.text }}
                    ></p>
                    <Link href={`posts/${post.id}`}>
                      <a className="bi bi-arrows-fullscreen btn btn-dark mx-2"></a>
                    </Link>
                    <Link href={`posts/${post.id}/edit`}>
                      <a className="bi bi-pencil btn btn-dark mx-2"></a>
                    </Link>

                    <button
                      onClick={() => deleteItem(post.id)}
                      className="bi bi-trash3 btn btn-dark  mx-2"
                    ></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-dark mx-2"
            onClick={() => {
              let s = parsedSkip;
              s -= limit;
              if (s < 0) {
                s = 0;
              }
              push(`/posts?skip=${s}&sort=${parsedSort}`);
            }}
            disabled={parsedSkip === 0}
          >
            Página anterior
          </button>
          <button
            className="btn btn-dark "
            onClick={() => {
              push(`/posts?skip=${parsedSkip + limit}&sort=${parsedSort}`);
            }}
            disabled={parsedSkip + limit >= posts.total}
          >
            Próxima página
          </button>
        </>
      )}
    </>
  );
};

export default PostList;
