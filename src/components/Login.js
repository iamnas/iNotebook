import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"", password:""})
    let navigate =useNavigate()
    
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
        // setEmail({email: e.target.value})
        // setPassword({password: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        // console.log("...credentials",{...credentials});
        const email = credentials.email
        const password = credentials.password
        const response = await fetch(`http://localhost:5000/api/auth/login`, {

            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password})

            // body: JSON.stringify({...credentials})
            // body: JSON.stringify({ email:e.target.email.value, password:e.target.password.value})

          });
          const json = await response.json();
        //   console.log(json);
          if(json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate('/')
            props.showAlert("Logged In Successfully","success");

          }else{
            // alert(json.error)
            props.showAlert(json.error,"danger");
          }
    }
    
    return (
        <div className="mt-3">
            <h2>Login to continue iNotebook</h2>
            <form onSubmit={handleSubmit} className="my-5">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} value={credentials.email} name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} value={credentials.password} name="password" autoComplete="on"/>
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login