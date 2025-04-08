
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default function LoginRegister() {
  const [mode, setMode] = useState("login"); // or 'register'
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [register] = useMutation(REGISTER_MUTATION);
  const [login] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "register") {
        const { data } = await register({ variables: { name, email, password } });
        alert(data.register); // e.g., "User registered successfully"
        setMode("login");
      } else {
        const { data } = await login({ variables: { email, password } });
        alert(data.login); // e.g., "Login successful"
        navigate("/"); // 🔁 redirect to home
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
        <p className="text-sm text-center mt-2">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blue-600 ml-2"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
