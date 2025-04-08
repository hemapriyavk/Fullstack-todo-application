import bcrypt from 'bcrypt';
import db from '../config/db.js';


const resolvers = {
  Query: {
    getTasks: async (_, __, { req }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ?', [req.session.userId]);
      return tasks;
    },
    getCurrentUser: async (_, __, { req }) => {
        if (!req.session.userId) return null;
        const [[user]] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.session.userId]);
        return user || null;
      }      
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
      return "User registered successfully";
    },
    login: async (_, { email, password }, { req }) => {
      const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");
      req.session.userId = user.id;
      return "Login successful";
    },
    logout: async (_, __, { req, res }) => {
        return new Promise((resolve, reject) => {
          req.session.destroy(err => {
            if (err) {
              reject("Logout failed");
            } else {
              res.clearCookie('connect.sid'); // or your session cookie name
              resolve("Logout successful");
            }
          });
        });
      },
    addTask: async (_, { text }, { req }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      const [result] = await db.query('INSERT INTO tasks (text, completed, user_id) VALUES (?, false, ?)', [text, req.session.userId]);
      const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
      return task[0];
    },
    toggleTask: async (_, { id }, { req }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      const [[task]] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.session.userId]);
      const completed = !task.completed;
      // Convert current UTC time to IST
  const istOffsetMs = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(Date.now() + istOffsetMs);
  const completedAt = completed ? istDate.toISOString().replace('T', ' ').split('.')[0] : null;

      await db.query('UPDATE tasks SET completed = ?, completedAt = ? WHERE id = ?', [completed, completedAt, id]);
      const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
      return updated[0];
    }
  }
};

export default resolvers;