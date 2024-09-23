import { useState } from "react";
import { auth } from "~firebaseConfig"; // Firebase auth import
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth/web-extension"; // Refactored import
import "./SignIn.scss"; // Import the CSS styles

const SignIn = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false); // For toggling password reset mode
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setError(null); // Clear previous errors

    if (email === "" || (password === "" && !isResettingPassword)) {
      setError("Email e senha são necessários.");
      return;
    }

    try {
      if (isResettingPassword) {
        // Handle password reset request
        await sendPasswordResetEmail(auth, email);
        setError("Um link para redefinir sua senha foi enviado ao seu email.");
        setIsResettingPassword(false); // Switch back to login after request
        return;
      }

      if (isSignUp) {
        // Sign-up with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        setError("Verifique seu email para confirmar sua conta e fazer Login."); // Inform user to check email
        setIsSignUp(false);
      } else {
        // Sign-in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Reload the user to get updated information
        await user.reload();

        // console.log({ verified: user.emailVerified });

        // Check if the user's email is verified
        if (!user.emailVerified) {
          setError("Por favor, verifique seu email antes de fazer login.");
          return;
        } else {
          onSuccess(); // Trigger the success callback
        }
      }
    } catch (error: any) {
      const defaultMessage = "Ocorreu um erro: ";
      if (error.message.includes("auth/invalid-credential")) {
        setError("Credenciais Inválidas.");
        return;
      }

      if (error.message.includes("auth/email-already-in-use")) {
        setError("Email já está em uso.");
        return;
      }

      if (error.message.includes("weak-password")) {
        setError("Senha fraca! a sua senha deve conter pelo menos 6 caracteres.");
        return;
      }

      setError(defaultMessage + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isResettingPassword ? "Redefinir Senha" : isSignUp ? "Criar uma Conta" : "Faça Login"}</h2>

      {error && <div className="auth-error">{error}</div>}

      <input
        type="email"
        className="auth-input"
        placeholder="Insira seu Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {!isResettingPassword && (
        <input
          type="password"
          className="auth-input"
          placeholder="Insira sua Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}

      <button className="auth-button" onClick={handleAuth}>
        {isResettingPassword ? "Enviar Link de Redefinição" : isSignUp ? "Cadastrar" : "Login"}
      </button>

      {!isResettingPassword && (
        <p className="auth-toggle" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Já tem uma conta? Faça Login" : "Não tem uma conta? Faça o Cadastro."}
        </p>
      )}

      {!isSignUp && !isResettingPassword && (
        <p className="auth-toggle" onClick={() => setIsResettingPassword(true)}>
          Esqueceu sua senha? Redefina aqui.
        </p>
      )}

      {isResettingPassword && (
        <p className="auth-toggle" onClick={() => setIsResettingPassword(false)}>
          Voltar ao login.
        </p>
      )}
    </div>
  );
};

export default SignIn;
