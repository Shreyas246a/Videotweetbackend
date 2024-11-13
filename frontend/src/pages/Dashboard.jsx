import { useNavigate } from "react-router-dom"
import useAuth from "../contexts/Authcontext"

const Dashboard = () => {
    const navigate=useNavigate()
    const logout =useAuth()

return(<div>
    <input type="button" value="Logout"onClick={async()=>{
        try{
       const res= await logout;
       console.log(res)
        navigate('/login')
        }catch(err){
            console.count(err)
        navigate('/dashboard')
        }

    }}></input>
</div>)



}

export default Dashboard