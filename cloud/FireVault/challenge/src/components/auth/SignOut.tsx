import firebase from "firebase/app";

export const SignOut: React.FC = () => {
  const auth = firebase.auth();

  const signOut = () => {
    auth.signOut();
  };

  return (
    auth.currentUser && (
      <button onClick={signOut} className="btn btn-blue">
        Sign out
      </button>
    )
  );
};
