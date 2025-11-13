import './login.css'

function Login(){
    return(
        <div>
            <div className="bodyLogin">
                <div>

                </div>
                <div className='loginContainer'>
                    <h1>Login</h1>
                    <div className="loginInputContainer">
                        <input type="text" placeholder='Email'/>
                        <input type="text" placeholder='Senha'/>
                    </div>
                    <div className="loginButtonContainer">
                        <button></button>
                        <button></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login