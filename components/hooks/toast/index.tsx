import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

interface Message {
  message: string;
  error?: boolean;
}

export const ToastContext = React.createContext({
  addToast(message: Message) {},
});

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const addToast = (message: Message) => {
    setMessages((messages) => [message, ...messages]);
  };
  const removeToast = (i: number) => {
    setMessages((messages) => messages.filter((_, index) => index !== i));
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer role="button" className="p-3" position="bottom-end">
        {messages.map(({ message, error }, index) => (
          <Toast
            onClick={() => removeToast(index)}
            key={index}
            className={error ? "bg-danger" : "bg-dark"}
          >
            <Toast.Body className="bottom-end">{message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
