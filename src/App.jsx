import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { store } from "@/store";
import { router } from "@/router";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  );
}
export default App;