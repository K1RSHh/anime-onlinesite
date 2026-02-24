import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db, storage } from "../firebaseAppObject"; // Імпортуємо все необхідне
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Для запису в БД
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Для картинок
import { Link } from "react-router-dom";
import { User, Upload } from "lucide-react"; // Іконки

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // Новий стан
  const [file, setFile] = useState<File | null>(null); // Стан для файлу картинки
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // Для попереднього перегляду

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Щоб блокувати кнопку під час завантаження

  // Функція обробки вибору файлу
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile)); // Робимо прев'ю
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Створюємо користувача
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      let photoURL = "";

      // 2. Завантажуємо аватарку (якщо є)
      if (file) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      // 3. Оновлюємо профіль (Auth)
      await updateProfile(user, {
        displayName: nickname,
        photoURL: photoURL,
      });

      // 4. Записуємо в Базу Даних (Firestore)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: nickname,
        email: email,
        photoURL: photoURL,
        createdAt: new Date(),
      });

      // 5. Відправляємо лист
      await sendEmailVerification(user);

      // 6. 🛑 ВАЖЛИВО: Одразу виходимо з акаунту!
      // Це гарантує, що юзер не потрапить всередину без підтвердження
      await signOut(auth);

      // 7. Перемикаємо "тумблер", щоб замість форми показати текст про лист
      setIsEmailSent(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already taken.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center mt-10 px-4 pb-20 ">
        <div className="w-full max-w-md bg-stone-900 p-8 rounded-2xl border border-stone-800 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            📩 Verify your email
          </h2>
          <p className="text-stone-300 mb-6">
            We've sent a link to{" "}
            <span className="text-fuchsia-400">{email}</span>. Please check your
            inbox and confirm your account before logging in.
          </p>
          <Link
            to="/signin"
            className="inline-block px-6 py-3 bg-fuchsia-600 text-white rounded-lg font-bold hover:bg-fuchsia-500 transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20 pt-10">
      <div className="w-full max-w-md bg-stone-900 p-8 rounded-2xl border border-stone-800 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Profile
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-500/10 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* 📸 БЛОК АВАТАРКИ */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-2">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-fuchsia-600"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-stone-800 flex items-center justify-center border-2 border-stone-700 text-stone-500">
                  <User size={40} />
                </div>
              )}

              {/* Прихований input для файлу */}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* Кнопка-плюсик */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-fuchsia-600 p-2 rounded-full cursor-pointer hover:bg-fuchsia-500 transition-colors shadow-lg"
              >
                <Upload size={16} className="text-white" />
              </label>
            </div>
            <p className="text-stone-400 text-xs">Upload Avatar (Optional)</p>
          </div>

          {/* 📝 НІКНЕЙМ */}
          <div>
            <label className="block text-stone-400 text-sm mb-1">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-fuchsia-500 outline-none"
              placeholder="Nagato Uzumaki"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-stone-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-fuchsia-500 outline-none"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-stone-400 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-fuchsia-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-lg transition-all active:scale-95 disabled:bg-stone-700 disabled:cursor-not-allowed flex justify-center"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-stone-500 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-fuchsia-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
