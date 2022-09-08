import type { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <div
      style={{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999999,
        position: "fixed",
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="spinner-border text-dark" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
