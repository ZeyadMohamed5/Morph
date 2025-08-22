import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginAdmin } from "../Api/user";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 new state
  const { setIsAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 start loading

    try {
      await loginAdmin({ username, password });
      setIsAuthenticated(true);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); // 🔹 stop loading
    }
  };

  return (
    <div className="bg-gray-400 min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <label className="block mb-2">
          Username:
          <input
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          Password:
          <input
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
