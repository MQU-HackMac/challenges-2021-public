import firebase from "firebase/app";
import {useEffect, useState} from "react";

import AuthBoxButtons from "./AuthBoxButtons";
import ForgotPasswordBox from "./ForgotPasswordBox";
import SignInBox from "./SignInBox";
import SignUpBox from "./SignUpBox";

export const AUTH_STATES = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

export const SignIn: React.FC = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [authState, setAuthState] = useState(AUTH_STATES.SIGN_IN);

  useEffect(() => {
    // Needed cos setState is async so we will miss the last character

    setErrorMessage("");
    if (password !== password2 && password !== "" && password2 !== "") {
      setErrorMessage("Passwords don't match");
    }
  }, [password, password2, email]);

  const signInWithEmail = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Email address is invalid");
          break;
        case "auth/user-not-found":
          setErrorMessage("Incorrect email or password");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect email or password");
          break;
        default:
          setErrorMessage("Something went wrong");
          break;
      }
    });
  };

  const signUpWithEmail = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const auth = firebase.auth();

    if (password === password2) {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              setErrorMessage("Email address is already in use");
              break;
            case "auth/invalid-email":
              setErrorMessage("Email address is invalid");
              break;
            case "auth/operation-not-allowed":
              setErrorMessage("Sign up is disabled. Contact Admin");
              break;
            case "auth/weak-password":
              setErrorMessage("Password must be at least 6 characters");
              break;
            default:
              setErrorMessage("Something went wrong");
              break;
          }
        });
    }
  };

  const handlePasswordReset = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(email);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "password") {
      setPassword(event.target.value);
    } else if (event.target.id === "confirm-password") {
      setPassword2(event.target.value);
    }
  };

  const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {authState === AUTH_STATES.SIGN_UP && (
          <SignUpBox
            errorMessage={errorMessage}
            email={email}
            handlePasswordInput={handlePasswordInput}
            handleEmailInput={handleEmailInput}
            signUpWithEmail={signUpWithEmail}
          />
        )}
        {authState === AUTH_STATES.SIGN_IN && (
          <SignInBox
            authState={authState}
            errorMessage={errorMessage}
            email={email}
            handlePasswordInput={handlePasswordInput}
            handleEmailInput={handleEmailInput}
            signInWithEmail={signInWithEmail}
          />
        )}
        {authState === AUTH_STATES.FORGOT_PASSWORD && (
          <ForgotPasswordBox
            errorMessage={errorMessage}
            email={email}
            handleEmailInput={handleEmailInput}
            handlePasswordReset={handlePasswordReset}
          />
        )}
        <AuthBoxButtons
          authState={authState}
          setAuthState={setAuthState}
          errorMessage={errorMessage}
          handlePasswordReset={handlePasswordReset}
          signInWithEmail={signInWithEmail}
          signUpWithEmail={signUpWithEmail}
          setPassword={setPassword}
          setPassword2={setPassword2}
        />
      </div>
    </div>
  );
};
