import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function Login() {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados do form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarOption, setAvatarOption] = useState(1);

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
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ')
        });
        const success = await login(username, password);
        if (!success) alert("Erro ao fazer login após registro.");
      } catch (error) {
        console.warn("Backend offline. Simulando registro...");
        // Fallback: Tenta logar de qualquer forma para o usuário não ficar travado
        const username = email.split('@')[0];
        const success = await login(username, password);
        if (!success) alert("Erro ao cadastrar. Verifique se o email já existe.");
      }
    } else {
      if (!email || !password) return;
      // Para login, tentamos usar o email como username
      const username = email.includes('@') ? email.split('@')[0] : email;
      const success = await login(username, password);
      if (!success) {
        alert("Credenciais inválidas. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="bg-darker/80 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
            🚀 UniStudy Hub
          </h1>
          <p className="text-slate-400 font-medium">
            {isRegistering ? 'Crie sua conta e evolua seus estudos' : 'Acesse sua conta para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {isRegistering && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-1">Nome Completo</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Ex: João da Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">E-mail Universitário ou Usuário</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="aluno@universidade.edu.br"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Escolha seu Avatar</label>
              <div className="flex gap-3 justify-between">
                {[12, 33, 44, 47, 68].map((imgNum) => (
                  <img 
                    key={imgNum}
                    src={`https://i.pravatar.cc/150?img=${imgNum}`} 
                    alt={`Avatar ${imgNum}`}
                    className={`w-12 h-12 rounded-full cursor-pointer transition-all transform hover:scale-110 ${avatarOption === imgNum ? 'border-2 border-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border border-slate-600 opacity-60 hover:opacity-100'}`}
                    onClick={() => setAvatarOption(imgNum)}
                  />
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 mt-2"
          >
            {isRegistering ? 'Criar Conta' : 'Entrar na Plataforma'}
          </button>
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
