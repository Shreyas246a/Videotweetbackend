import { useNavigate } from "react-router-dom"
import useAuth from "../contexts/Authcontext"

const Dashboard = () => {
    const navigate=useNavigate()
    const logout =useAuth()

return(<div>
    <form onSubmit={async()=>{
       try{
       const res= await logout;
       console.log(res)
        navigate('/login')
        }catch(err){
            console.count(err)
        navigate('/dashboard')
        }
    }}>

<button>Logout</button>
    </form>
</div>)



}

export default Dashboard