interface SignInBoxProps {
  authState: string;
  errorMessage: string;
  email: string;
  handlePasswordInput: React.ChangeEventHandler<HTMLInputElement>;
  handleEmailInput: React.ChangeEventHandler<HTMLInputElement>;
  signInWithEmail: React.FormEventHandler<HTMLFormElement> &
    React.MouseEventHandler<HTMLButtonElement>;
}

const SignInBox: React.FC<SignInBoxProps> = ({
  errorMessage,
  email,
  handlePasswordInput,
  handleEmailInput,
  signInWithEmail,
}) => {
  return (
    <div className="w-full max-w-sm">
      <form onSubmit={signInWithEmail}>
        <div className="mb-4">
          {errorMessage && (
            <div
              id="error-message"
              className="pb-3 text-center text-red-500 font-semibold"
            >
              {errorMessage}
            </div>
          )}
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={
              "shadow appearance-none border rounded w-full py-2 px-3 " +
              "text-gray-700 leading-tight focus:outline-none " +
              `focus:shadow-outline ${
                errorMessage && "border-red-600 border-solid"
              }`
            }
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailInput}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 "
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={
              "shadow appearance-none border rounded w-full py-2 px-3 " +
              "text-gray-700 leading-tight focus:outline-none " +
              `focus:shadow-outline ${
                errorMessage ? "border-red-600 border-solid" : ""
              }`
            }
            id="password"
            type="password"
            placeholder="••••••••"
            onChange={handlePasswordInput}
          />
        </div>
        <input type="submit" hidden />
      </form>
    </div>
  );
};

export default SignInBox;
