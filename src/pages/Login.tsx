import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulando chamada na API / Auth do Supabase
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="login-page-container">
      {/* Atmospheric Background Elements */}
      <div className="bg-effects">
        <div className="primary-glow glow-1"></div>
        <div className="primary-glow glow-2"></div>
      </div>

      {/* Login Container */}
      <main className="login-main">
        {/* Header / Logo */}
        <div className="login-header animate-float">
          <div className="logo-box">
            <span className="material-symbols-outlined logo-icon">clinical_notes</span>
          </div>
          <h1 className="app-title">SASYRA</h1>
          <p className="app-subtitle">Assistente Clínico</p>
        </div>

        {/* Glassmorphism Card */}
        <section className="glass-panel">
          <div className="welcome-section">
            <h2 className="welcome-title">Bem-vindo</h2>
            <p className="welcome-subtitle">Identifique-se para acessar o sistema.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="input-container">
              <label className="input-label" htmlFor="email">E-MAIL</label>
              <div className="input-glass">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  className="input-field"
                  id="email"
                  type="email"
                  placeholder="nome@clinica.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-container">
              <label className="input-label" htmlFor="password">SENHA</label>
              <div className="input-glass">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  className="input-field"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Action Button */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Restricted Access Notice */}
          <div className="restricted-notice">
            <span className="material-symbols-outlined notice-icon">info</span>
            <p className="notice-text">
              O acesso ao SASYRA é restrito a profissionais cadastrados pela administração. Não há opção de criar conta.
            </p>
          </div>
        </section>

        {/* Footer Visual Hint */}
        <footer className="login-footer">
          <div className="footer-badge">
            <span className="pulse-dot"></span>
            <span className="footer-text">SISTEMA SEGURO &amp; MONITORADO</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
