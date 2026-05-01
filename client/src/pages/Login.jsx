import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

import authBg from '../assets/auth-bg.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f9f8f6] dark:bg-[#121212] grain-bg">
      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden p-3">
        <div className="absolute inset-0 m-3 rounded-[32px] overflow-hidden shadow-2xl">
          <img src={authBg} alt="Abstract organic background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white z-10">
            <h2 className="text-4xl font-light tracking-tight mb-4 leading-tight">Master your day,<br/><span className="font-semibold text-primary-100">beautifully.</span></h2>
            <p className="text-white/80 font-light max-w-sm text-lg">An artisanal approach to task management designed to bring clarity to your work.</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-12">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-8 shadow-[0_8px_16px_rgba(224,106,83,0.3)]">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-light">Enter your details to access your workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none dark:text-white placeholder-slate-400 shadow-sm"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none dark:text-white placeholder-slate-400 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-8 bg-slate-900 hover:bg-slate-800 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-2xl shadow-xl transition-all hover-scale flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
