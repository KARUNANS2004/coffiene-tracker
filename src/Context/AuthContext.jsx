import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect,useContext,createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

// we have used useContext here because we could maintain the state of something on a global level regardless of the hierarchy acroos various pages by using it

const AuthContext=createContext()

export function useAuth(){
    return useContext(AuthContext)
}// custon hook

export function AuthProvider(props){
    const {children}=props
    const [globalUser,setGlobalUser]=useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading]=useState(false)
    
    

    // Now lets add the Authentication Handlers

    function signup(email,password){
        return createUserWithEmailAndPassword(auth,email,password)
    }

    function login(email,password){
        return signInWithEmailAndPassword(auth,email,password)
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth,email)
    }

    function logOut(){
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    const value={globalUser,globalData,setGlobalData, isLoading, signup,login,logOut,resetPassword}

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,async (user)=>{
            console.log('CURRENT USER :', user)
            setGlobalUser(user)
            // if there is no user , empty the user state and return from this listener
            if(!user){
                console.log('No active user')
                return
            }

            // if there is a user, check if the user has data in the database and if they do then fetch said data and update the global state

            try {
                setIsLoading(true)

                const docRef=doc(db,'users',user.uid)// something like API keys
                const docSnap=await getDoc(docRef)
                // first we create a reference for the document(labelled JSON object). and then we get the doc, and then we snapshot it to see if there's anything there

                let firebaseData={}
                if(docSnap.exists()){
                    console.log('Found user data')
                    firebaseData=docSnap.data()
                }
                setGlobalData(firebaseData)

            } catch (error) {
                console.log(error)
            }finally{
                setIsLoading(false)
            }
        })
        return unsubscribe
    },[])

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider> 
    )
}