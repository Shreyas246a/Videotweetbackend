import { useState } from "react"
import  useAuth  from "../contexts/Authcontext"
import { useNavigate } from "react-router-dom";

export const Loginpage=()=>{
  
const [formdata,setformdata]=useState({
    username:'',
    email:'',
    password:''
})
const {login}=useAuth()
const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });

  };

const navigate=useNavigate()
const handlelogin=async(e)=>{
    e.preventDefault()
    const form=new FormData();
    form.append("email",formdata.email)
    form.append('password',formdata.password)
    form.append('username',formdata.username)
    console.log(form)
    
    try {
        const response = await login(form);
        navigate('/dashboard');
        console.log(response);
      } catch (err) {
        navigate('/login');
        console.log(err);
      }
}  
return (
    <form onSubmit={handlelogin}>
      <input
        type="email"
        name="email"
        value={formdata.email}
        onChange={handleChange}
        placeholder="Email"
      />
       <input
        type="text"
        name="username"
        value={formdata.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={formdata.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );


};


export default Loginpage;