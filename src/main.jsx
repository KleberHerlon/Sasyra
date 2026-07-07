import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// PWA — registra service worker e gerencia install prompt
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// PWA — detecta prompt de instalação
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.__sasyraDeferredPrompt = deferredPrompt;
});

window.__sasyraInstallPWA = async () => {
  const prompt = window.__sasyraDeferredPrompt;
  if (!prompt) return false;
  prompt.prompt();
  const result = await prompt.userChoice;
  window.__sasyraDeferredPrompt = null;
  return result.outcome === 'accepted';
};

// ── Root Error Boundary ────────────────────────────────────────────────
class RootBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false,error:null}}
  static getDerivedStateFromError(e){return{hasError:true,error:e}}
  componentDidCatch(e,info){console.error("[SASYRA] Root error:",e,info)}
  render(){return this.state.hasError?<div style={{padding:40,textAlign:"center",fontFamily:"system-ui",color:"#4ADE80",background:"#0E141B",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><span style={{fontSize:48}}>🔧</span><h1 style={{fontSize:18,fontWeight:800,margin:0}}>Algo deu errado</h1><p style={{fontSize:13,color:"#5E7A96",margin:0}}>O SASYRA encontrou um erro inesperado. Os dados estão salvos no seu navegador.</p><button onClick={()=>{this.setState({hasError:false});window.location.reload()}} style={{background:"#4ADE80",color:"#0E141B",border:"none",borderRadius:8,padding:"10px 24px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"system-ui"}}>↻ Recarregar</button></div>:this.props.children}
}

createRoot(document.getElementById('root')).render(
  <RootBoundary><App /></RootBoundary>
)
