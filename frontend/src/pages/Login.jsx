import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Upload } from 'lucide-react';
import logo from '../img/logo.png';

function Login() {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Lista de sementes (seeds) para a API de avatares desenhados do Dicebear
  const avatarSeeds = ['Felix', 'Aneka', 'Daisy', 'George'];
  const [avatarOption, setAvatarOption] = useState(avatarSeeds[0]);
  const [customAvatar, setCustomAvatar] = useState(null);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCustomAvatar(event.target.result);
          setAvatarOption('custom');
        };
        reader.readAsDataURL(file);
      } else {
        alert('Apenas imagens PNG ou JPG são permitidas.');
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!name || !email || !password) return;
      try {
        const username = email.split('@')[0];
        await api.post('/auth/register/', {
          username: username,
          email: email,
          password: password,
          password_confirm: password,
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' '),
          avatar: avatarOption === 'custom' ? customAvatar : 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + avatarOption
          // O backend precisará ser atualizado futuramente para receber o campo de avatar caso use customAvatar
        });
        const url = await login(username, password);
        if (url) navigate(typeof url === 'string' ? url : '/');
      } catch (error) {
        console.warn('Backend offline. Simulando registro...');
        const username = email.split('@')[0];
        const url = await login(username, password);
        if (url) navigate(typeof url === 'string' ? url : '/');
      }
    } else {
      if (!email || !password) return;
      const username = email.includes('@') ? email.split('@')[0] : email;
      const url = await login(username, password);
      if (url) navigate(typeof url === 'string' ? url : '/');
      else alert('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="bg-darker/80 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <img src={logo} alt="UniStudy Hub" className="h-[100px] mx-auto mb-4 object-contain drop-shadow-[0_0_15px_rgba(109,40,217,0.5)]" />
          <p className="text-slate-400 font-medium">
            {isRegistering ? 'Crie sua conta e evolua seus estudos' : 'Acesse sua conta para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {isRegistering && (
            <Input 
              label="Nome Completo"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
            />
          )}

          <Input 
            label="E-mail Universitário ou Usuário"
            type="text" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aluno@universidade.edu.br"
          />

          <Input 
            label="Senha"
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {isRegistering && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-3">Escolha seu Avatar de Perfil</label>
              
              {/* Opções de Avatar Desenhados + Upload */}
              <div className="flex gap-3 justify-center items-center flex-wrap">
                
                {/* Avatares Pré-definidos */}
                {avatarSeeds.map((seed) => (
                  <div
                    key={seed}
                    onClick={() => setAvatarOption(seed)}
                    className={`relative w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 overflow-hidden bg-slate-700
                      ${avatarOption === seed ? 'border-2 border-primary shadow-[0_0_10px_rgba(109,40,217,0.8)]' : 'border border-slate-600 opacity-70 hover:opacity-100'}
                    `}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} 
                      alt={`Avatar ${seed}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Opção Customizada (Upload) */}
                <div
                  onClick={triggerFileUpload}
                  title="Enviar sua própria foto"
                  className={`relative w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 overflow-hidden bg-slate-800 flex items-center justify-center
                    ${avatarOption === 'custom' ? 'border-2 border-primary shadow-[0_0_10px_rgba(109,40,217,0.8)]' : 'border border-slate-600 border-dashed opacity-70 hover:opacity-100'}
                  `}
                >
                  {customAvatar ? (
                    <img src={customAvatar} alt="Seu Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={18} className="text-slate-400" />
                  )}
                </div>

                {/* Input Hidden para Arquivo */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept=".png, .jpg, .jpeg" 
                  className="hidden" 
                />

              </div>
              {avatarOption === 'custom' && (
                <p className="text-center text-xs text-primary mt-2">Imagem personalizada selecionada!</p>
              )}
            </div>
          )}

          <Button type="submit">
            {isRegistering ? 'Criar Conta' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-6">
          {isRegistering ? 'Já tem uma conta?' : 'Ainda não faz parte?'}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 font-bold text-primary hover:text-white transition-colors"
          >
            {isRegistering ? 'Faça login aqui' : 'Crie sua conta'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;


