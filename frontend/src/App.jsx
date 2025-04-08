
import TodoApp from "./pages/TodoApp";
import React from "react";
import { Provider} from "react-redux";
import { ApolloProvider} from "@apollo/client";
import { Route, Routes } from "react-router-dom";
import { client, store } from "./pages/TodoApp";
import LoginRegister from "./pages/Register";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Routes>
          <Route path="/" element= {<TodoApp />} />
          <Route path="/register" element={<LoginRegister />} />
          
        
        </Routes>
      </Provider>
    </ApolloProvider>
  );
}
