import React, { useState } from 'react';
import {
  SupportedLanguage,
  MedicineProduct,
  CartItem,
  OrderDetails,
  ExtractedMedicine,
} from '../types';
import { translations } from '../i18n/translations';
import { sampleProducts } from '../data/mockData';
import {
  Search,
  Mic,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  FileCheck,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Store,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
} from '../utils/speech';

interface PharmacyOrderingProps {
  language: SupportedLanguage;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onAddToCart: (product: MedicineProduct) => void;
  attachedPrescriptionText?: string | null;
  isLargeText: boolean;
}

export const PharmacyOrdering: React.FC<PharmacyOrderingProps> = ({
  language,
  cart,
  onUpdateQuantity,
  onAddToCart,
  attachedPrescriptionText,
  isLargeText,
}) => {
  const t = translations[language];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Checkout form
  const [patientName, setPatientName] = useState('Ramesh Reddy');
  const [villageTown, setVillageTown] = useState('Tadikonda / Guntur Rural');
  const [landmark, setLandmark] = useState('Near Anjaneya Swamy Temple');
  const [phoneNumber, setPhoneNumber] = useState('98480 22338');
  const [paymentMode, setPaymentMode] = useState<'cod' | 'upi'>('cod');
  const [hasPrescriptionAttached, setHasPrescriptionAttached] = useState(
    Boolean(attachedPrescriptionText)
  );

  // Placed order tracking
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);

  // Total amount calculation
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalMrp = cart.reduce(
    (sum, item) => sum + item.product.mrp * item.quantity,
    0
  );
  const savings = Math.max(0, totalMrp - totalAmount);

  // Voice Search handler
  const handleVoiceSearch = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsVoiceSearching(true);
    const recognizer = createSpeechRecognizer(
      language,
      (text, isFinal) => {
        setSearchQuery(text);
        if (isFinal) {
          setIsVoiceSearching(false);
        }
      },
      () => setIsVoiceSearching(false),
      () => setIsVoiceSearching(false)
    );

    if (recognizer) {
      recognizer.start();
    }
  };

  // Filter products by category and query
  const filteredProducts = sampleProducts.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      (selectedCategory === 'generic' && p.category === 'generic') ||
      p.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.genericName.toLowerCase().includes(q) ||
      p.descriptionTe.toLowerCase().includes(q) ||
      p.descriptionHi.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  // Handle Checkout
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const newOrder: OrderDetails = {
      orderId: `SNJ-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      totalAmount,
      patientName,
      phoneNumber,
      villageTown,
      landmark,
      paymentMethod: paymentMode,
      prescriptionAttached: hasPrescriptionAttached,
      status: 'confirmed',
      estimatedDelivery: '35 - 45 mins (Local Rider)',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentOrder(newOrder);
    setIsCartDrawerOpen(false);

    // Simulate real-time delivery steps
    setTimeout(() => {
      setCurrentOrder((prev) => (prev ? { ...prev, status: 'pharmacist_review' } : null));
    }, 4000);
    setTimeout(() => {
      setCurrentOrder((prev) => (prev ? { ...prev, status: 'out_for_delivery' } : null));
    }, 12000);
  };

  const categories = [
    { id: 'all', label: t.categoryAll },
    { id: 'fever', label: t.categoryFever },
    { id: 'chronic', label: t.categoryChronic },
    { id: 'generic', label: t.categoryGeneric },
    { id: 'firstaid', label: t.categoryFirstAid },
  ];

  return (
    <div className={`max-w-4xl mx-auto px-4 py-4 ${isLargeText ? 'text-lg' : 'text-base'}`}>
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            <ShoppingBag className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {t.orderTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.orderSubtitle}
            </p>
          </div>
        </div>

        {/* View Cart Pill Button */}
        {cart.length > 0 && (
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md cursor-pointer transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              {cart.reduce((s, i) => s + i.quantity, 0)} items • ₹{totalAmount}
            </span>
          </button>
        )}
      </div>

      {/* Jan Aushadhi Savings Promo Ribbon */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-2xl p-3.5 mb-4 shadow-xs flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            {language === 'te'
              ? 'ప్రధాన మంత్రి జన్ ఔషధి మందులు: 50% నుండి 80% తక్కువ ధరకే లభిస్తాయి!'
              : language === 'hi'
              ? 'जन औषधि केंद्र: 50% से 80% तक कम कीमत पर उपलब्ध ब्रांडेड जेनरिक दवाएं।'
              : 'Jan Aushadhi Generic Store: Save up to 70% on chronic & essential medications.'}
          </span>
        </div>
        <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-xs shrink-0 hidden sm:inline">
          Save 70%
        </span>
      </div>

      {/* Voice & Text Search Bar (Blinkit style) */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchMedicinePlaceholder}
          className="flex-1 bg-transparent py-2 text-sm sm:text-base focus:outline-none text-slate-900 font-medium"
        />

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            isVoiceSearching
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
          }`}
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isVoiceSearching ? 'వింటున్నాము...' : t.searchMedicineVoice}
          </span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Active Order Live Tracker (if an order was placed) */}
      {currentOrder && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-400 shadow-md mb-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Live Order #{currentOrder.orderId}
              </span>
              <h4 className="font-extrabold text-slate-900 text-base mt-1">
                {t.orderSuccessTitle}
              </h4>
              <p className="text-xs text-slate-500">
                Estimated Delivery: {currentOrder.estimatedDelivery} • {currentOrder.villageTown}
              </p>
            </div>
            <span className="text-sm font-black text-slate-900">
              ₹{currentOrder.totalAmount} (COD)
            </span>
          </div>

          {/* 4 Step Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            {t.trackOrderSteps.map((step, idx) => {
              const statusIndex =
                currentOrder.status === 'confirmed'
                  ? 0
                  : currentOrder.status === 'pharmacist_review'
                  ? 1
                  : currentOrder.status === 'out_for_delivery'
                  ? 2
                  : 3;
              const isPassed = idx <= statusIndex;
              const isCurrent = idx === statusIndex;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-500'
                    } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] leading-tight ${
                      isCurrent
                        ? 'font-extrabold text-emerald-900'
                        : isPassed
                        ? 'font-semibold text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {filteredProducts.map((prod) => {
          const cartItem = cart.find((i) => i.product.id === prod.id);
          const quantity = cartItem?.quantity || 0;
          const desc =
            language === 'te'
              ? prod.descriptionTe
              : language === 'hi'
              ? prod.descriptionHi
              : prod.descriptionEn;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {prod.pharmacyName}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {prod.genericName}
                    </p>
                  </div>

                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2 py-0.5 rounded-full shrink-0">
                      -{prod.discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1 mb-2">
                  {desc}
                </p>

                {prod.requiresPrescription && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-2">
                    <FileCheck className="w-3 h-3 text-amber-700" />
                    <span>Rx Required (డాక్టర్ చీటీ అవసరం)</span>
                  </span>
                )}
              </div>

              {/* Price & Add to Cart Controller */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ₹{prod.price}
                    </span>
                    {prod.mrp > prod.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{prod.mrp}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">{prod.unit}</span>
                </div>

                {/* Add / Quantity Button */}
                {quantity === 0 ? (
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.addToCart}</span>
                  </button>
                ) : (
                  <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(prod.id, -1)}
                      className="p-2 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-black text-emerald-950">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(prod.id, 1)}
                      className="p-2 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar when items are present */}
      {cart.length > 0 && !isCartDrawerOpen && (
        <div className="fixed bottom-14 md:bottom-6 left-4 right-4 max-w-xl mx-auto z-40 animate-slideUp">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-slate-900 hover:bg-black text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-300">మందుల బ్యాగ్ (Medicine Bag)</p>
                <p className="text-sm font-extrabold text-white">₹{totalAmount}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>{t.viewCart}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>{t.checkoutTitle}</span>
              </h3>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2 py-1 rounded-lg bg-slate-100 cursor-pointer"
              >
                మూసివేయండి (Close)
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.product.name}</p>
                    <p className="text-slate-500">{item.product.unit} • ₹{item.product.price} each</p>
                  </div>

                  <div className="flex items-center bg-white border border-slate-300 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="p-1.5 text-slate-700 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="p-1.5 text-slate-700 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Prescription Attachment Check */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-950">
                    {t.prescriptionStatusLabel}
                  </span>
                </div>
                <label className="flex items-center gap-1.5 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasPrescriptionAttached}
                    onChange={(e) => setHasPrescriptionAttached(e.target.checked)}
                    className="accent-emerald-700 w-4 h-4"
                  />
                  <span>ప్రిస్క్రిప్షన్ జతచేయండి (Attach Rx)</span>
                </label>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                {hasPrescriptionAttached
                  ? t.prescriptionAttachedNote
                  : 'ప్రిస్క్రిప్షన్ అవసరమైన మందులకు ఫార్మసిస్ట్ ఫోన్ చేసి నిర్ధారిస్తారు.'}
              </p>
            </div>

            {/* Village / Town Delivery Address Form */}
            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.patientNameLabel}
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.villageTownLabel}
                  </label>
                  <input
                    type="text"
                    value={villageTown}
                    onChange={(e) => setVillageTown(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t.phoneNumberLabel}
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.landmarkLabel}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Payment Option */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t.paymentMethodLabel}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('cod')}
                    className={`flex-1 p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMode === 'cod'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    💵 {t.cashOnDelivery}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('upi')}
                    className={`flex-1 p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMode === 'upi'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    📱 UPI / QR Code (డెమో)
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Total MRP:</span>
                <span className="line-through">₹{totalMrp}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Your Savings (జన ఔషధి ఆదా):</span>
                  <span>- ₹{savings}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                <span>Final Payable:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>{t.placeOrderButton} (₹{totalAmount})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
