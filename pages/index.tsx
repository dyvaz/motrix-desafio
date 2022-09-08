import { useRouter } from "next/router";
import { useEffect } from "react";

function Home() {
  const { push } = useRouter();
  useEffect(() => {
    push("/posts");
  }, []);
}
export default Home;
