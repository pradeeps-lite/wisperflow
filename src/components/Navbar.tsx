import React from 'react';
import { SupportedLanguage, AppTab } from '../types';
import { translations } from '../i18n/translations';
import { HeartPulse, Globe, PhoneCall, Home, Mic, FileText, MapPin, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  isLargeText,
  onToggleLargeText,
  cartCount,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home' as AppTab, label: t.navHome, icon: Home },
    { id: 'assistant' as AppTab, label: t.navAssistant, icon: Mic },
    { id: 'prescription' as AppTab, label: t.navPrescription, icon: FileText },
    { id: 'facilities' as AppTab, label: t.navFacilities, icon: MapPin },
    { id: 'order' as AppTab, label: t.navOrder, icon: ShoppingBag, badge: cartCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-teal-100 shadow-xs">
      {/* Top micro bar: Language switcher, text sizing, and prototype badge */}
      <div className="bg-teal-900 text-teal-100 px-3 py-1.5 text-xs sm:text-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Badge */}
          <div className="flex items-center gap-1.5 font-medium text-teal-200 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Right controls: Language */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language dropdown / selector */}
            <div className="flex items-center bg-teal-800 rounded p-0.5">
              <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-teal-300 hidden xs:inline" />
              {(['te', 'hi', 'en'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-2 py-0.5 rounded text-xs font-semibold transition cursor-pointer ${
                    language === lang
                      ? 'bg-white text-teal-950 shadow-xs'
                      : 'text-teal-200 hover:text-white'
                  }`}
                >
                  {lang === 'te' ? 'తెలుగు' : lang === 'hi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
            <HeartPulse className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-teal-950 tracking-tight">
                {t.appName}
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Nav items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-teal-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Prominent Emergency SOS button */}
        <button
          onClick={() => onSelectTab('emergency')}
          className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-md shadow-red-600/25 active:scale-95 transition cursor-pointer ring-2 ring-red-400/30"
          aria-label="Emergency SOS 108"
        >
          <PhoneCall className="w-4 h-4 animate-bounce text-amber-200" />
          <span className="text-sm font-extrabold tracking-wide">SOS 108</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar for easy one-thumb reach */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition cursor-pointer relative min-w-[56px] ${
                isActive ? 'text-teal-800 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700 stroke-[2.5]' : 'text-slate-500'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-[10px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 leading-none truncate max-w-[64px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
