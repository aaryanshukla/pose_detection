import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';


// essentially we wanna create a function that handles the signup page
// there needs to be three parameters: username, email, and password
// once we set we send to the backend to configure 

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        
        if (!username || !email || !password) {
            setError("All fields are required.");
            return; 
        }

        try {
            await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username, email, password}),
            });
            // next we need to set if the sign up is suyccesful else error

            const data = await response.json();

            navigate('/login')
            

            if (!response.ok) {
                console.log("Error with Signup: ", data.error)
            } else {
                console.log("Successfully Signed Up")
            }
        } catch(error) {
            setError("There has been an issue, Please Try Again")
        }
    }
    return (
        <form onSubmit = {handleSignup}>
            <div>
                <label>

                    Enter Username:

                    <input 
                    type = "username"
                    value = {username}
                    onChange={e => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Enter Email: 
                    <input 
                    type = "email"
                    value = {email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Enter password:
                    <input
                    type = "password"
                    value = {password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </label>

                
                <button type="submit">Signup</button>
                {error && <p style={{ color: "red" }}>{error}</p>}


            </div>

        </form>
    )
}

export default Signup;