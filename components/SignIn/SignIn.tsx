import { useState } from "react";
import { auth } from "~firebaseConfig"; // Firebase auth import
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth methods
import "./SignIn.scss"; // Import the CSS styles

const SignIn = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setError(null); // Clear previous errors

    if (email === "" || password === "") {
      setError("Email e senha são necessários.");
      return;
    }

    try {
      if (isSignUp) {
        // Sign-up with Firebase
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign-in with Firebase
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess(); // Trigger the success callback
    } catch (error: any) {
      setError(error.message); // Display the error from Firebase
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Criar uma Conta" : "Faça Login"}</h2>

      {error && <div className="auth-error">{error}</div>}

      <input
        type="email"
        className="auth-input"
        placeholder="Insira seu Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="auth-input"
        placeholder="Insira sua Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="auth-button" onClick={handleAuth}>
        {isSignUp ? "Cadastrar" : "Login"}
      </button>

      <p className="auth-toggle" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Já tem uma conta? Faça Login" : "Não tem uma conta? Faça o Cadastro."}
      </p>
    </div>
  );
};

export default SignIn;
