import React, {useState} from "react";

function Login() { 
    const [email, setEmail] = useState("");
    // we set this to blank because we want users to see a blank field when inputting their email 
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error with Login:", data.error)
            } else {
                console.log("Successfully logged in!");
            }

        } catch (error) {
            setError("Network Error, Please Try Again");
        }
    }

    return (
        <form onSubmit = {handleLogin}>
            <div>
                <label>
                    Enter Email: 
                    <input
                    type = "email"
                    value = {email}
                    onChange={e => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Enter Password:
                    <input 
                    type = "password"
                    value = {password}
                    onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <button type ="submit">Login</button>
            </div>
            
        </form>

    )
}
export default Login;