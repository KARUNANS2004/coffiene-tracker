import { useState } from "react"
import Authentication from "./Authentication"
import Modal from "./Modal"
import { useAuth } from "../Context/AuthContext"

export default function Layout(props){
    const {children}=props
    const [showModal,setShowModal]=useState(false)

    const {globalUser, logOut}=useAuth()


    const handleCloseModal=()=>{
        setShowModal(false);
    }

    const header=(
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Coffee Insatiates</p>
            </div>
            {globalUser ? 
                (<button onClick={logOut}>
                    <p>Logout</p>
                </button> )
                :(
                <button onClick={()=>{setShowModal(true)}}>
                    <p>Sign up free</p>
                    <i className="fa-solid fa-mug-saucer"></i>
                </button>
            )}
        </header>
    )

    const footer=(
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a target="_blank" href="https://github.com/KARUNANS2004">Karuna Nidhan Singh</a> using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library</p>
        </footer>
    )
    return(
        <>
            {showModal && (<Modal handleCloseModal={handleCloseModal}>
                <Authentication handleCloseModal={()=>{setShowModal(false)}}/>
            </Modal>)}
            {header}
            <main>
                {children}
            </main>
            {footer}
        </>
    )
}