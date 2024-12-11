import CoffeeForm from "./components/CoffeeForm"
import Hero from "./components/Hero"
import History from "./components/History"
import Layout from "./components/Layout"
import Stats from "./components/Stats"
import { useAuth } from "./Context/AuthContext"

function App() {

  const {globalUser,globalData,isLoading}=useAuth()

  const isAuthenticated=globalUser
  const isData=globalData && Object.keys(globalData || {}).length

  const authenticatedContent=(
    <>
      <Stats />
      <History />
    </>
  )

  return (
    <Layout>
      <Hero /> 
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {/* Conditional rendering */}
      {(isAuthenticated && isLoading) && (
        <p>Loading data...</p>
      )}
      {(isAuthenticated && isData) &&(authenticatedContent)} 
      {/* this line shows that if isAuthenticated is true the authenticated content will be shown*/} 
    </Layout>
  )
}

export default App
