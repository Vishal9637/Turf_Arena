import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      // 1️⃣ Sign in
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = res.user;

      // 2️⃣ Check email verification
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(auth);

        setError(
          "Your email is not verified. We have sent you a verification link again. Please verify before logging in."
        );
        return;
      }

      // 3️⃣ Fetch user role
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        await signOut(auth);
        setError("User profile not found. Please register again.");
        return;
      }

      const role = snap.data().role;

      // 4️⃣ Redirect based on role
      role === "owner"
        ? navigate("/owner/dashboard")
        : navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">
            TurfArena
          </h1>
          <p className="text-gray-500 mt-1">
            Login to book or manage turfs
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Info */}
        {info && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
            {info}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl text-black focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl text-black focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/register")}
            className="w-full border border-green-500 text-green-600 py-2 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            Create Player Account
          </button>

          <button
            onClick={() => navigate("/register?role=owner")}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Register as Turf Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
