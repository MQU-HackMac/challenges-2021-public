import {AUTH_STATES} from "./AuthController";

interface AuthBoxButtonsProps {
  authState: string;
  errorMessage: string;
  handlePasswordReset: React.MouseEventHandler<HTMLButtonElement>;
  signInWithEmail: React.FormEventHandler<HTMLFormElement> &
    React.MouseEventHandler<HTMLButtonElement>;
  signUpWithEmail: React.FormEventHandler<HTMLFormElement> &
    React.MouseEventHandler<HTMLButtonElement>;
  setAuthState: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setPassword2: React.Dispatch<React.SetStateAction<string>>;
}

const AuthBoxButtons: React.FC<AuthBoxButtonsProps> = ({
  authState,
  signInWithEmail,
  handlePasswordReset,
  signUpWithEmail,
  setAuthState,
  setPassword,
  setPassword2,
}) => {
  return (
    <div className="flex items-center justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold
        py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
        onClick={
          authState === AUTH_STATES.FORGOT_PASSWORD ?
            handlePasswordReset :
            authState === AUTH_STATES.SIGN_UP ?
              signUpWithEmail :
              signInWithEmail
        }
      >
        {authState === AUTH_STATES.FORGOT_PASSWORD ?
          "Send Password Reset Email" :
          authState === AUTH_STATES.SIGN_UP ?
            "Sign Up" :
            "Sign In"}
      </button>
      <div className="flex flex-col gap-2">
        <button
          className="focus:outline-none active:outline-none border-none
          inline-block align-baseline font-bold text-sm text-blue-500
          hover:text-blue-800"
          onClick={(e) => {
            e.preventDefault();
            setPassword("");
            setPassword2("");

            if (authState === AUTH_STATES.SIGN_UP) {
              setAuthState(AUTH_STATES.SIGN_IN);
            } else if (authState === AUTH_STATES.FORGOT_PASSWORD) {
              setAuthState(AUTH_STATES.SIGN_IN);
            } else {
              setAuthState(AUTH_STATES.SIGN_UP);
            }
          }}
        >
          {authState === AUTH_STATES.SIGN_UP ?
            "Already have an account?" :
            authState === AUTH_STATES.FORGOT_PASSWORD ?
              "Sign In" :
              "Sign Up"}
        </button>
        <button
          className="focus:outline-none active:outline-none border-none
          inline-block align-baseline font-bold text-sm text-blue-500
          hover:text-blue-800"
          onClick={(e) => {
            e.preventDefault();
            setAuthState(AUTH_STATES.FORGOT_PASSWORD);
          }}
        >
          {authState === AUTH_STATES.SIGN_IN && "Forgot Password?"}
        </button>
      </div>
    </div>
  );
};

export default AuthBoxButtons;
