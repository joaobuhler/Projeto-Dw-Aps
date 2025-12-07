import './entrarSala.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function EntrarSala() {
    return (
        <div className='container'>
            <div className='bodyEntrarSala'>
                <div className='entrarSalaContainer'>
                    <input 
                        className="inputContainer" 
                        type="text" 
                        placeholder='Apelido'
                    />
                    <input 
                        className="inputContainer" 
                        type="number" 
                        placeholder='Código da Sala'
                    />
                    <div className="BotaoEntrarSalaContainer">
                        <button className='botaoEntrarSala'>
                            <span>Cadastrar-se</span>
                        </button>
                        <button className='botaoEntrarSala'>
                            <span>Criar sua Sala</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntrarSala;