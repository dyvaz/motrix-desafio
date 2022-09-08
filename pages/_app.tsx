import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastProvider } from "../components/hooks/toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <div>
        <nav className=" p-2 bg-dark">
          <Link href="/posts">
            <a className="btn btn-outline-light mx-2 ">Lista</a>
          </Link>
          <Link href="/posts/new">
            <a className="btn btn-outline-light mx-2">Criar</a>
          </Link>
        </nav>

        <div className="container py-5">
          <Component {...pageProps} />
        </div>
      </div>
    </ToastProvider>
  );
}

export default MyApp;
