import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import logo from '../img/logo.png';

function Login() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do formulário
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lista de seeds para a API de avatares do Dicebear
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

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        if (!name.trim() || !email.trim() || !password) {
          setErrorMsg('Preencha todos os campos obrigatórios.');
          setIsSubmitting(false);
          return;
        }

        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const chosenAvatar = avatarOption === 'custom' && customAvatar 
          ? customAvatar 
          : `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarOption}`;

        const regResult = await register({
          username: username.trim(),
          email: email.trim(),
          password: password,
          password_confirm: password,
          first_name: firstName,
          last_name: lastName,
          avatar: chosenAvatar
        });

        if (!regResult.success) {
          setErrorMsg(regResult.error || 'Erro ao criar conta.');
          setIsSubmitting(false);
          return;
        }

        // Login automático após registro bem-sucedido
        const loginIdentifier = username.trim() || email.trim();
        const loginResult = await login(loginIdentifier, password);
        if (loginResult.success) {
          navigate(loginResult.redirectTo || '/');
        } else {
          setErrorMsg('Conta criada com sucesso! Faça login com suas credenciais.');
          setIsRegistering(false);
        }
      } else {
        if (!email.trim() || !password) {
          setErrorMsg('Informe seu e-mail/usuário e senha.');
          setIsSubmitting(false);
          return;
        }

        const loginResult = await login(email.trim(), password);
        if (loginResult.success) {
          navigate(loginResult.redirectTo || '/');
        } else {
          setErrorMsg(loginResult.error || 'Credenciais inválidas. Verifique seu login e senha.');
        }
      }
    } catch (err) {
      setErrorMsg('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="bg-darker/80 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
        
        <div className="text-center mb-6">
          <img src={logo} alt="UniStudy Hub" className="h-[90px] mx-auto mb-3 object-contain drop-shadow-[0_0_15px_rgba(109,40,217,0.5)]" />
          <h1 className="text-xl font-bold text-white mb-1">
            {isRegistering ? 'Criar Nova Conta' : 'Acessar o UniStudy'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isRegistering ? 'Cadastre-se para turbinar seus estudos acadêmicos' : 'Entre com seu e-mail ou nome de usuário'}
          </p>
        </div>

        {/* Mensagem de Erro / Alerta */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <>
              <Input 
                label="Nome Completo *"
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
              />

              <Input 
                label="Nome de Usuário (Apelido)"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: joaosilva (opcional)"
              />
            </>
          )}

          <Input 
            label={isRegistering ? "E-mail *" : "E-mail ou Nome de Usuário"}
            type={isRegistering ? "email" : "text"} 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isRegistering ? "aluno@universidade.edu.br" : "aluno@universidade.edu.br ou seu_usuario"}
          />

          <Input 
            label="Senha *"
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                Escolha seu Avatar de Perfil
              </label>
              
              {/* Opções de Avatar Desenhados + Upload */}
              <div className="flex gap-3 justify-center items-center flex-wrap">
                
                {avatarSeeds.map((seed) => (
                  <div
                    key={seed}
                    onClick={() => { setAvatarOption(seed); setCustomAvatar(null); }}
                    className={`relative w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 overflow-hidden bg-slate-700
                      ${avatarOption === seed ? 'border-2 border-primary shadow-[0_0_10px_rgba(109,40,217,0.8)] scale-105' : 'border border-slate-600 opacity-70 hover:opacity-100'}
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
                    ${avatarOption === 'custom' ? 'border-2 border-primary shadow-[0_0_10px_rgba(109,40,217,0.8)] scale-105' : 'border border-slate-600 border-dashed opacity-70 hover:opacity-100'}
                  `}
                >
                  {customAvatar ? (
                    <img src={customAvatar} alt="Seu Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={18} className="text-slate-400" />
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept=".png, .jpg, .jpeg" 
                  className="hidden" 
                />
              </div>
              {avatarOption === 'custom' && (
                <p className="text-center text-xs text-primary mt-2 font-medium">Foto personalizada selecionada!</p>
              )}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full py-3">
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {isRegistering ? 'Criando Conta...' : 'Entrando...'}
              </span>
            ) : (
              isRegistering ? 'Criar Conta' : 'Entrar na Plataforma'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-5">
          {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
          <button 
            type="button"
            onClick={handleToggleMode}
            className="ml-2 font-bold text-primary hover:text-white transition-colors"
          >
            {isRegistering ? 'Faça login aqui' : 'Crie sua conta gratuitamente'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
