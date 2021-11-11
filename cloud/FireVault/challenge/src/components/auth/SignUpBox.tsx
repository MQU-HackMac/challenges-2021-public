interface SignUpBoxProps {
  errorMessage: string;
  email: string;
  handlePasswordInput: React.ChangeEventHandler<HTMLInputElement>;
  handleEmailInput: React.ChangeEventHandler<HTMLInputElement>;
  signUpWithEmail: React.FormEventHandler<HTMLFormElement> &
    React.MouseEventHandler<HTMLButtonElement>;
}

const SignUpBox: React.FC<SignUpBoxProps> = ({
  errorMessage,
  email,
  handlePasswordInput,
  handleEmailInput,
  signUpWithEmail,
}) => {
  return (
    <div className="w-full max-w-sm">
      <form onSubmit={signUpWithEmail}>
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
            className="block text-gray-700 text-sm font-bold mb-2 "
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={
              "shadow appearance-none border rounded w-full py-2 " +
              "px-3 text-gray-700 leading-tight focus:outline-none " +
              `focus:shadow-outline ${
                errorMessage.toLowerCase().includes("email") &&
                "border-red-600 border-solid"
              }`
            }
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailInput}
          />
        </div>
        <div>
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={
                "shadow appearance-none border rounded w-full py-2 " +
                "px-3 text-gray-700 mb-3 leading-tight focus:outline-none " +
                `focus:shadow-outline ${
                  errorMessage.toLowerCase().includes("password") &&
                  "border-red-600 border-solid"
                }`
              }
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={handlePasswordInput}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className={
                "shadow appearance-none border rounded w-full py-2 " +
                "px-3 text-gray-700 mb-3 leading-tight focus:outline-none " +
                `focus:shadow-outline ${
                  errorMessage.toLowerCase().includes("password") &&
                  "border-red-600 border-solid"
                }`
              }
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              onChange={handlePasswordInput}
            />
          </div>
        </div>
        <input type="submit" hidden />
      </form>
    </div>
  );
};

export default SignUpBox;
