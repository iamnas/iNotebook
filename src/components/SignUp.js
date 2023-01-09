import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = (props) => {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate()

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
    // setEmail({email: e.target.value})
    // setPassword({password: e.target.value})
  }
  // {
  //   "name":"Ram 5",
  //   "email":"Ram5@gmail.com",
  //   "password":"rajaTheK"
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("...credentials",{...credentials});
    const { name, email, password } = credentials
    // const name = credentials.name
    // const email = credentials.email
    // const password = credentials.password
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {

      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })

      // body: JSON.stringify({...credentials})
      // body: JSON.stringify({ email:e.target.email.value, password:e.target.password.value})

    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem('token', json.authtoken)
      navigate('/')
      props.showAlert("Account Created  Successfully", "success");
    } else {
      props.showAlert(json.error, "danger");
      // alert(json.error)
    }
  }

  return (
    <div className="container mt-2" >
      <h2>Create an Accoun to use iNotebook</h2>
      <form onSubmit={handleSubmit} >
        <div className="my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" onChange={onChange} value={credentials.name} name="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" onChange={onChange} value={credentials.email} name="email" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" onChange={onChange} value={credentials.password} name="password" autoComplete="on" minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" onChange={onChange} value={credentials.cpassword} name="cpassword" autoComplete="on" minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default SignUp