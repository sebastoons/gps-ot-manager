import { useState, useEffect } from 'react';
import '../styles/pwaInstall.css';

function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detectar si es iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Verificar si ya está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;

    if (isInstalled) {
      return; // Ya está instalado, no mostrar nada
    }

    // Para iOS, mostrar instrucciones después de un tiempo
    if (isIOSDevice) {
      const hasSeenInstructions = localStorage.getItem('ios-install-seen');
      if (!hasSeenInstructions) {
        setTimeout(() => {
          setShowInstallButton(true);
        }, 2000);
      }
    }

    // Para Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      localStorage.setItem('ios-install-seen', 'true');
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la app');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    if (isIOS) {
      localStorage.setItem('ios-install-seen', 'true');
    }
  };

  const handleCloseIOSInstructions = () => {
    setShowIOSInstructions(false);
    setShowInstallButton(false);
  };

  if (!showInstallButton) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className="pwa-install-overlay">
        <div className="pwa-install-modal ios-instructions">
          <button className="pwa-close-btn" onClick={handleCloseIOSInstructions}>✕</button>
          <div className="pwa-icon">📱</div>
          <h2 className="pwa-title">Instalar GPS OT Manager</h2>
          <div className="ios-steps">
            <div className="ios-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <p>Toca el botón <strong>Compartir</strong> 
                  <span className="share-icon">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
                      <path d="M10 0L10 14M10 0L6 4M10 0L14 4M2 8v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8"/>
                    </svg>
                  </span>
                </p>
              </div>
            </div>
            <div className="ios-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <p>Selecciona <strong>"Agregar a pantalla de inicio"</strong></p>
              </div>
            </div>
            <div className="ios-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <p>Toca <strong>"Agregar"</strong> para confirmar</p>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-full" onClick={handleCloseIOSInstructions}>
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pwa-install-banner">
      <div className="pwa-banner-content">
        <div className="pwa-banner-icon">📱</div>
        <div className="pwa-banner-text">
          <strong>Instala GPS OT Manager</strong>
          <span>Accede más rápido desde tu pantalla de inicio</span>
        </div>
      </div>
      <div className="pwa-banner-actions">
        <button className="btn-install" onClick={handleInstallClick}>
          Instalar
        </button>
        <button className="btn-dismiss" onClick={handleDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
}

export default PWAInstall;