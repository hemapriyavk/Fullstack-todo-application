/* eslint-disable react-refresh/only-export-components */
import React, {useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { ApolloClient, InMemoryCache, gql, useMutation } from "@apollo/client";
import { createHttpLink } from "@apollo/client/link/http";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


//Apollo client setup
export const client = new ApolloClient({
  link: createHttpLink({
    uri: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

// Async thunks to fetch tasks
const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, thunkAPI) => {
  try {
    const response = await client.query({
      query: gql`
        query GetTasks {
          getTasks {
            id
            text
            completed
            completedAt
          }
        }
      `,
      fetchPolicy: "network-only",
    });
    return response.data.getTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

//Query to get current user
const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      id
      name
      email
    }
  }
`;

// Redux slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: { ongoing: [], completed: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      const ongoing = [],
        completed = [];
      action.payload.forEach((task) => {
        task.completed ? completed.push(task) : ongoing.push(task);
      });
      state.ongoing = ongoing;
      state.completed = completed;
    });
  },
});

export const store = configureStore({ reducer: { tasks: tasksSlice.reducer } });


//Main component
const TodoApp = () => {
  const dispatch = useDispatch();
  const { ongoing, completed } = useSelector((state) => state.tasks);
  const [task, setTask] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  //Mutations
  const [addTask] = useMutation(gql`
    mutation AddTask($text: String!) {
      addTask(text: $text) {
        id
        text
        completed
        completedAt
      }
    }
  `);

  const [toggleTask] = useMutation(gql`
    mutation ToggleTask($id: ID!) {
      toggleTask(id: $id) {
        id
        text
        completed
        completedAt
      }
    }
  `);

  const [logout] = useMutation(gql`
    mutation {
      logout
    }
  `);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: "network-only",
      });
      setCurrentUser(data.getCurrentUser);
    } catch (err) {
      console.error("Could not get user:", err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    dispatch(fetchTasks())
      .unwrap()
      .then((data) => {
        console.log("Fetched tasks:", data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
    fetchCurrentUser();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  const handleAddTask = async () => {
    if (!currentUser) {
      alert("Please login to add tasks.");
      return;
    }
    if (task) {
      await addTask({ variables: { text: task } });
      dispatch(fetchTasks());
      setTask("");
    }
  };

  const handleToggleTask = async (id) => {
    await toggleTask({ variables: { id } });
    dispatch(fetchTasks());
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      navigate("/register"); 
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 mt-20 relative">
        {/* User Icon and Dropdown */}
      <div className="absolute top-4 right-4 text-4xl text-gray-700 cursor-pointer" ref={dropdownRef}>
        <div className="relative">
          <FaUserCircle
            className="cursor-pointer"
            onClick={() => {
              if (!currentUser) {
                navigate("/register");
              } else {
                setShowDropdown(prev => !prev);
              }
            }}
          />
          {showDropdown && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow z-50">
            {currentUser === undefined ? (
              <p className="text-sm text-gray-400 px-2 py-2">Loading...</p>
            ) : currentUser ? (
              <button
                onClick={()=> {
                    handleLogout();
                setShowDropdown(false);
                }}
                className="w-full text-left px-1 py-1 text-sm hover:bg-red-500 bg-blue-500 text-white border-none focus:outline-none"
              >
                Logout
              </button>
            ) : (
              <p className="text-sm text-gray-500 px-2 py-2">
                Not Logged in...
              </p>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Header */}
      <h1 className="font-bold text-3xl text-center mb-10">ToDo Application</h1>

      {/* Task Input */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="w-full p-2 border rounded-md mb-5"
        />
        <button
          onClick={handleAddTask}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="font-bold mb-2">Ongoing Tasks</h2>
        {ongoing.length === 0 ? (
          <p className="text-gray-500">No ongoing tasks</p>
        ) : (
          ongoing.map((task) => (
            <div key={task.id} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                onChange={() => handleToggleTask(task.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span>{task.text}</span>
            </div>
          ))
        )}
      </div>

      {completed.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-10">
          <h2 className="font-bold mb-2">Completed Tasks</h2>
          {completed.map((task) => (
            <div key={task.id} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="line-through text-gray-500">{task.text}</span>
                <p className="text-xs text-gray-400">
                  Completed at: {new Date(Number(task.completedAt)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoApp;
