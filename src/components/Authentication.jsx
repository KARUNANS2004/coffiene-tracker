import { useState } from "react"
import { useAuth } from "../Context/AuthContext"

export default function Authentication(props){
    const {handleCloseModal}=props
    const [isRegistration, setIsRegistration] = useState(false)
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [isAunthenticating, setIsAuthenticating]=useState(false)

     const {signup,login}=useAuth()// our custom hook in AuthContext.jsx

    async function handleAuthenticate() {
        if(!email || !email.includes('@') || !password || password.length<6 ||isAunthenticating){
            return
        }

        try {
            setIsAuthenticating(true)
            if(isRegistration){
                // register a user
                await signup(email,password)
            }else{
                // login a user
                await login(email,password)
            }
            handleCloseModal()
        } catch (error) {
            console.log(error)
        }finally{
            setIsAuthenticating(false)
        }

    }

    return(
        <>
            <h2 className="sign-up-text">{isRegistration?'Sign Up':'Login'}</h2>
            <p>{isRegistration?'Create an account':'Sign in to your account!'}</p>
            <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="email" />
            <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" name="" id="" placeholder="********" />
            <button onClick={handleAuthenticate}><p>{isAunthenticating?'Authenticating...' : 'Submit'}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegistration?'Already have an account':'Don\'t have an account'}</p>
                <button onClick={()=>{
                    setIsRegistration(!isRegistration )
                }}><p>{isRegistration?'Sign In':'Sign Up'}</p></button>
            </div>
        </>
    )
}