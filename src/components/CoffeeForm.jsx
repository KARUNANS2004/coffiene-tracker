import { useState } from "react";
import { coffeeOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../Context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeForm(props){
    const [showModal, setShowModal]=useState(false)
    const {isAuthenticated}=props
    const [selectedCoffee, setSelectedCoffee]=useState(null)
    const [showCOffeeList, setShowCoffeeList]=useState(false)
    const [coffeeCost,setCoffeeCost]=useState(0)
    const [hour,setHour] = useState(0)
    const [min,setMin] = useState(0)

    const {globalData,setGlobalData,globalUser} =useAuth()

    async function handleSubmitForm(){
        if(!isAuthenticated){
            setShowModal(true);
            return
        }

        if(!selectedCoffee){
            return;
        }
        
        try {
            // then we're going to create a new data object
            const newGlobalData = {
                ...(globalData || {})
            }

            const nowTime = Date.now()
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)
            const timestamp = nowTime - timeToSubtract

            const newData = {
                name: selectedCoffee,
                cost: coffeeCost
            }
            newGlobalData[timestamp] = newData
            console.log(timestamp, selectedCoffee, coffeeCost)

            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            const userRef = doc(db, 'users', globalUser.uid)
            const res = await setDoc(userRef, {
                [timestamp]: newData
            }, { merge: true })

            setSelectedCoffee(null)
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <>
        {showModal && (<Modal handleCloseModal={()=>{setShowModal(false)}}>
                <Authentication handleCloseModal={()=>{setShowModal(false)}} />
            </Modal>)}
        <div className="section-header">
            <i className="fa-solid fa-pencil"/>
            <h2>Start Tracking Today</h2>
        </div>
        <h4>Select Coffee Types</h4>
        <div className="coffee-grid">
            {coffeeOptions.slice(0,5).map((option,optionIndex)=>{
                return(
                    <button onClick={()=>{
                        setSelectedCoffee(option.name)
                        setShowCoffeeList(false)
                    }} className={"button-card "+ (option.name===selectedCoffee? ' coffee-button-selected':' ')} key={optionIndex}>
                        <h4>{option.name}</h4>
                        <p>{option.caffeine}</p>
                    </button>
                )
            })}
            <button onClick={()=>{
                setShowCoffeeList(true)
                setSelectedCoffee(null)
            }} className={"button-card "+ (showCOffeeList? ' coffee-button-selected':' ')}>
                <h4>Show more</h4>
                <p>...</p>
            </button>
        </div>
        {showCOffeeList && (
            <select onChange={(e)=>{
                setSelectedCoffee(e.target.value)
            }} name="coffee-list" id="coffee-list">
                <option value="{null}">Select type</option>
                {coffeeOptions.slice(5).map((option,optionIndex)=>{
                    return(
                        <option value={option.name} key={optionIndex}>
                            {option.name} ({option.caffeine}mg)
                        </option>
                    )
                })}
            </select>
        )}
        {/* Cost */}
        <h4>Add the Cost ($)</h4>
        <input value={coffeeCost} onChange={(e)=>{
            setCoffeeCost(e.target.value)
        }} type="number" className="w-full" placeholder="4.50" />
        {/* Time */}
        <h4>Time since consumption</h4>
        <div className="time-entry">
            <div>
                <h6>Hours</h6>
                <select name="hours" id="hours-select" onChange={(e)=>{
                    setHour(e.target.value)
                }}>
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hour,hourIndex)=>{
                        return(
                            <option value={hour} key={hourIndex}>{hour}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <h6>Minutes</h6>
                <select name="mins" id="mins-select" onChange={(e)=>{
                    setMin(e.target.value)
                }}>
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59].map((minute,minuteIndex)=>{
                        return(
                            <option value={minute} key={minuteIndex}>{minute}</option>
                        )
                    })}
                </select>
            </div>
        </div>
        <button onClick={handleSubmitForm}>
            <p>Add Entry</p>
        </button>
        </>
    )
}