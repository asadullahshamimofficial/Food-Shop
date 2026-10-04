import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
  };

  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
  };

  const signOutUser =() => {
    setLoading(true);
    return signOut(auth);
  };

  const upadteUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData)
  };

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  {
    loading && <span className="loading loading-ring loading-lg"></span>
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      console.log('steate', currentUser);
      setLoading(false)

      if(currentUser?.email){
        const user = { email: currentUser.email }
        
        axios.post(`${import.meta.env.VITE_Server_Host_Link}/jwt`, user, {withCredentials: true})
        .then(res => {
          console.log('login', res.data);
          setLoading(false);
        });
      } else {
        axios.post(`${import.meta.env.VITE_Server_Host_Link}/jwt`, {}, {withCredentials: true})
        .then(res => {
          console.log('logout', res.data);
          setLoading(false)
        });
      }
    })
    return () => {
      unsubscribe();
    }
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    logInUser,
    signOutUser,
    upadteUser,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={authInfo}>
      { children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;