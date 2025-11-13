import './login.css'

function Login(){
    return(
        <div>
            <div className="bodyLogin">
                <div className='selectLoginCadastro'>
                    <label class="toogle">
                        <input type="checkbox" />
                        <span class="sliderBar"></span>
                    </label>
                </div>
                <div className='loginContainer'>
                    <h1>Login</h1>
                    <div className="loginInputContainer">
                        <input type="text" placeholder='Email'/>
                        <input type="text" placeholder='Senha'/>
                    </div>
                    <div className="loginButtonContainer">
                        <button className='buttonRocket'>
                            <i class="material-icons">rocket_launch</i>
                            <span>Entrar</span>
                        </button>
                        <button>
                            <span>Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login