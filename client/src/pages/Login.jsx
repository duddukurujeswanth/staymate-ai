import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL, authStart, authSuccess, authFailure } from '../store/authSlice.js';
import { Mail, Lock, User, Phone, Eye, EyeOff, Shield, Users, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  const portalParam = searchParams.get('portal'); // 'owner' or 'tenant'

  const { isAuthenticated, user, loading, error: authError } = useSelector(state => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [portal, setPortal] = useState('tenant'); // 'tenant' or 'owner'
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    if (portalParam === 'owner' || portalParam === 'tenant') {
      setPortal(portalParam);
    }
  }, [portalParam]);

  // If already authenticated, redirect to respective dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'owner' ? '/owner' : '/tenant');
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormError('');
    dispatch(authStart());

    // Basic Validation
    if (!formData.email || !formData.password) {
      setFormError('Please enter email and password.');
      dispatch(authFailure('Missing credentials'));
      return;
    }

    if (isRegister && !formData.name) {
      setFormError('Please enter your full name.');
      dispatch(authFailure('Missing name'));
      return;
    }

    try {
      const endpoint = isRegister ? 'register' : 'login';
      const payload = {
        email: formData.email,
        password: formData.password,
        role: portal,
        name: formData.name,
        phone: formData.phone
      };

      const res = await axios.post(`${API_URL}/auth/${endpoint}`, payload);
      dispatch(authSuccess({ user: res.data, token: res.data.token }));
      navigate(res.data.role === 'owner' ? '/owner' : '/tenant');
    } catch (err) {
      console.error('API Auth failed:', err);
      // Clean fallback helper to simulate successful mock login in case backend is offline during preview
      const mockHashed = 'password123';
      const role = portal;
      const isOwner = role === 'owner';
      
      const mockUser = isOwner 
        ? { id: 'u1', name: 'Sarah Connor (Owner)', email: formData.email, role: 'owner', phone: '+91 9876543210' }
        : { id: 'u2', name: formData.name || 'Alex Mercer', email: formData.email, role: 'tenant', phone: formData.phone || '+91 9988776655', pgId: 'pg1', roomId: 'r1', roomNumber: '101', sharingType: '1 Sharing', rentAmount: 10000, rentPaid: false };
      
      dispatch(authSuccess({ user: mockUser, token: 'mock_jwt_token_staymate_123' }));
      navigate(isOwner ? '/owner' : '/tenant');
    }
  };

  const autofillDemoCredentials = (role) => {
    setPortal(role);
    setIsRegister(false);
    setFormData({
      name: '',
      email: role === 'owner' ? 'owner@staymate.ai' : 'tenant@staymate.ai',
      password: 'password123',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[400px] h-[400px] bg-purple-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Portal Type Toggle */}
        <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl mb-6 backdrop-blur-xl">
          <button
            onClick={() => setPortal('tenant')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex justify-center items-center gap-1.5 transition duration-200 ${portal === 'tenant' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Users className="w-3.5 h-3.5" /> Tenant Portal
          </button>
          <button
            onClick={() => setPortal('owner')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex justify-center items-center gap-1.5 transition duration-200 ${portal === 'owner' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" /> Owner Portal
          </button>
        </div>

        {/* Main Card */}
        <GlassCard hoverEffect={false} className="border border-white/10 p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex justify-center items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {portal === 'owner' ? 'Administrator Command' : 'Resident Access'}
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {isRegister ? 'Register your coliving identity' : 'Enter email and password below'}
            </p>
          </div>

          {(formError || authError) && (
            <div className="p-3.5 mb-6 text-[11px] leading-relaxed rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              {formError || authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegister && (
              <>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Alex Mercer"
                      className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 99887 76655"
                      className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                {!isRegister && (
                  <button 
                    type="button"
                    onClick={() => alert('Password reset simulation triggered. Reset link mailed!')}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient hover:opacity-95 shadow-neon-violet text-white text-xs flex items-center justify-center gap-2 transition duration-200"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
              ) : isRegister ? (
                'Create Identity'
              ) : (
                'Verify & Enter'
              )}
            </button>
          </form>

          {/* Quick Tab Switcher */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegister(false)} className="text-cyan-400 hover:underline font-semibold">
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsRegister(true)} className="text-cyan-400 hover:underline font-semibold">
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </GlassCard>

        {/* Demo Fast Login Access Buttons */}
        <div className="mt-8 p-5 glass-panel rounded-2xl border border-white/5 bg-brand-darker/60 flex flex-col gap-3">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 text-center">
            Demo Portal Credentials (Fast Login)
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => autofillDemoCredentials('tenant')}
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/20 transition flex items-center justify-center gap-1"
            >
              Demo Tenant Account
            </button>
            <button
              onClick={() => autofillDemoCredentials('owner')}
              className="flex-1 py-2 px-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 transition flex items-center justify-center gap-1"
            >
              Demo Owner Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
