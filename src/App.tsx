import React, { useState, useEffect } from 'react';
import { SupportedLanguage, AppTab, CartItem, MedicineProduct, ExtractedMedicine } from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { VoiceAssistant } from './components/VoiceAssistant';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { HealthcareDiscovery } from './components/HealthcareDiscovery';
import { EmergencySOS } from './components/EmergencySOS';
import { PharmacyOrdering } from './components/PharmacyOrdering';
import { sampleProducts } from './data/mockData';
import { stopSpeaking } from './utils/speech';
import { Mic } from 'lucide-react';

export default function App() {
  // Remember language preference across session
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('sanjivani_language');
    return (saved as SupportedLanguage) || 'te'; // Telugu default for the rural/AP/Telangana challenge brief
  });

  // Current tab
  const [currentTab, setCurrentTab] = useState<AppTab>('home');

  // Accessible font size
  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('sanjivani_large_text') === 'true';
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => [
    { product: sampleProducts[0], quantity: 1 }, // 1 default essential generic Paracetamol
  ]);

  // Extracted prescription context
  const [attachedPrescriptionText, setAttachedPrescriptionText] = useState<string | null>(null);

  // Save language to localStorage
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('sanjivani_language', lang);
  };

  // Toggle large text
  const handleToggleLargeText = () => {
    setIsLargeText((prev) => {
      const next = !prev;
      localStorage.setItem('sanjivani_large_text', String(next));
      return next;
    });
  };

  // Switch tabs and stop lingering audio
  const handleSelectTab = (tab: AppTab) => {
    stopSpeaking();
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: MedicineProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Adding medicines extracted from prescription to the cart
  const handleAddExtractedMedicinesToCart = (extracted: ExtractedMedicine[]) => {
    setAttachedPrescriptionText(
      extracted.map((m) => `${m.name} (${m.dosage})`).join(', ')
    );

    // Map extracted medicines to available generic/brand catalog
    extracted.forEach((m) => {
      const lower = m.name.toLowerCase();
      let matched = sampleProducts.find(
        (p) =>
          lower.includes(p.genericName.toLowerCase().split(' ')[0]) ||
          lower.includes(p.name.toLowerCase().split(' ')[0])
      );
      if (!matched) {
        matched = sampleProducts[0]; // Paracetamol fallback
      }
      handleAddToCart(matched);
    });

    handleSelectTab('order');
  };

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col ${
        isLargeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        isLargeText={isLargeText}
        onToggleLargeText={handleToggleLargeText}
        cartCount={totalCartCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto">
        {currentTab === 'home' && (
          <HomeScreen
            language={language}
            onSelectTab={handleSelectTab}
            isLargeText={isLargeText}
          />
        )}

        {currentTab === 'assistant' && (
          <VoiceAssistant
            language={language}
            onSelectLanguage={handleSelectLanguage}
            isLargeText={isLargeText}
          />
        )}

        {currentTab === 'prescription' && (
          <PrescriptionScanner
            language={language}
            onAddMedicinesToCart={handleAddExtractedMedicinesToCart}
            isLargeText={isLargeText}
          />
        )}

        {currentTab === 'facilities' && (
          <HealthcareDiscovery
            language={language}
            isLargeText={isLargeText}
          />
        )}

        {currentTab === 'emergency' && (
          <EmergencySOS
            language={language}
            isLargeText={isLargeText}
          />
        )}

        {currentTab === 'order' && (
          <PharmacyOrdering
            language={language}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            attachedPrescriptionText={attachedPrescriptionText}
            isLargeText={isLargeText}
          />
        )}
      </main>

      {/* Floating Global Voice Button when not in Assistant tab */}
      {currentTab !== 'assistant' && (
        <aside aria-label="Voice quick access" className="fixed bottom-16 md:bottom-6 right-4 z-40">
          <button
            onClick={() => handleSelectTab('assistant')}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-extrabold px-4 py-3 rounded-full shadow-xl shadow-teal-900/30 ring-4 ring-white/80 active:scale-95 transition cursor-pointer"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">
              {language === 'te' ? 'సంజీవనితో మాట్లాడండి' : language === 'hi' ? 'बोलकर पूछें' : 'Speak Now'}
            </span>
          </button>
        </aside>
      )}

    </div>
  );
}
