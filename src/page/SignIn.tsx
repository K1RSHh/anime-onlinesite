import { useState, FormEvent } from "react";
import { auth } from "../firebaseAppObject";
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // 👇 Додали signOut
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 👇 ПЕРЕВІРКА ПІДТВЕРДЖЕННЯ ПОШТИ
      if (!user.emailVerified) {
        await signOut(auth); // Одразу викидаємо його
        setError("Будь ласка, підтвердіть вашу пошту! 📩");
        return;
      }

      console.log("Успішний вхід:", user.displayName);
      navigate("/"); // Пускаємо тільки якщо підтвердив
    } catch (err) {
      console.error(err);
      setError("Неправильний email або пароль.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20 pt-10">
      <div className="w-full max-w-md bg-stone-900 p-8 rounded-2xl border border-stone-800 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back! 👋
        </h2>

        {/* Блок помилок став трохи розумнішим */}
        {error && (
          <div className="text-center mb-4 p-3 rounded bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-fuchsia-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-fuchsia-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-lg transition-all active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="text-stone-500 text-center mt-6 text-sm">
          No account?{" "}
          <Link to="/signup" className="text-fuchsia-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
