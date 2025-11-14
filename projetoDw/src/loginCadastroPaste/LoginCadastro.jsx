import './loginCadastro.css'
import { useState } from 'react'

function Login(){

    const [isCadastro, setIsCadastro] = useState(false)

    return(
        <div>
            <div className="bodyLogin">
                <div className='selectLoginCadastro'>
                    <label class="toogle">
                        <input
                        type="checkbox"
                        checked={isCadastro}
                        onChange={() => setIsCadastro(!isCadastro)}
                        />
                        <span class="sliderBar"></span>
                    </label>
                </div>

                {isCadastro ? (
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

                ) : (

                <div className='cadastroContainer'>
                    <h1>Cadastro</h1>
                    <div className="loginInputContainer">
                        <input type="text" placeholder='Nome'/>
                        <input type="text" placeholder='Email'/>
                        <input type="text" placeholder='Senha'/>
                    </div>
                    <div className="loginButtonContainer">
                        <button className='buttonRocket'>
                            <i class="material-icons">rocket_launch</i>
                            <span>Cadastrar-se</span>
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default Login