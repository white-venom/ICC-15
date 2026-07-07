'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Truck, Tag, Loader2, Lock, ShieldCheck, Mail, MapPin, Check, Package, RefreshCw } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, clearCart, formatPrice, country } = useAppContext();

  // Enforce sign-in before checkout
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: country === 'DUBAI' ? 'UAE' : country === 'UK' ? 'United Kingdom' : country === 'INDIA' ? 'India' : 'United States',
    paymentMethod: 'card', // card, upi, cod
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutStepMessage, setCheckoutStepMessage] = useState('Securing order details...');
  const [orderResult, setOrderResult] = useState<any>(null);

  // Profile details
  const [profile, setProfile] = useState<any>(null);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  
  // Status refreshing state
  const [refreshing, setRefreshing] = useState(false);

  // Fetch profile if user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchProfile = async () => {
        setFetchingProfile(true);
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const profileData = await res.json();
            setProfile(profileData);
            
            // Prefill basic user details if they have no saved address
            if (!profileData.address) {
              setFormData(prev => ({
                ...prev,
                email: profileData.email || prev.email,
                firstName: profileData.name?.split(' ')[0] || prev.firstName,
                lastName: profileData.name?.split(' ').slice(1).join(' ') || prev.lastName,
                phone: profileData.phone || prev.phone,
              }));
            } else {
              // Prefill saved address directly
              setFormData(prev => ({
                ...prev,
                email: profileData.email || prev.email,
                phone: profileData.phone || prev.phone,
                firstName: profileData.name?.split(' ')[0] || prev.firstName,
                lastName: profileData.name?.split(' ').slice(1).join(' ') || prev.lastName,
                address: profileData.address || '',
                apartment: profileData.apartment || '',
                city: profileData.city || '',
                state: profileData.state || '',
                pincode: profileData.pincode || '',
                country: profileData.country || prev.country,
              }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch user profile address:', err);
        } finally {
          setFetchingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [status]);

  // Dynamic status check polling
  const handleRefreshStatus = async () => {
    if (!orderResult?.id) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/orders?id=${orderResult.id}`);
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrderResult(updatedOrder);
      }
    } catch (err) {
      console.error("Failed to refresh order status:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Poll status updates every 4 seconds when success screen is loaded
  useEffect(() => {
    if (!orderResult?.id) return;
    const interval = setInterval(() => {
      handleRefreshStatus();
    }, 4000);
    return () => clearInterval(interval);
  }, [orderResult?.id]);

  // Handle toggling between saved address and entering new address
  const handleToggleSavedAddress = (useSaved: boolean) => {
    setUseSavedAddress(useSaved);
    setFormErrors({});

    if (useSaved && profile && profile.address) {
      setFormData(prev => ({
        ...prev,
        email: profile.email || '',
        phone: profile.phone || '',
        firstName: profile.name?.split(' ')[0] || '',
        lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        address: profile.address || '',
        apartment: profile.apartment || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        country: profile.country || prev.country,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        upiId: ''
      }));
    }
  };

  // Apply visual formatting for Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = rawVal.match(/.{1,4}/g)?.join(' ') || rawVal;
    setFormData({ ...formData, cardNumber: formatted.substring(0, 19) });
  };

  // Apply visual formatting for Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
    if (rawVal.length > 2) {
      rawVal = `${rawVal.substring(0, 2)}/${rawVal.substring(2, 4)}`;
    }
    setFormData({ ...formData, cardExpiry: rawVal.substring(0, 5) });
  };

  // Handle coupon discount code check
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code: 'WELCOME10', type: 'percent', value: 10 });
    } else if (code === 'ROYALTY') {
      setAppliedDiscount({ code: 'ROYALTY', type: 'flat', value: 50 });
    } else if (code === '') {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or ROYALTY.');
    }
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percent') {
      discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
    } else if (appliedDiscount.type === 'flat') {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    }
  }

  // 5% tax computation
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = subtotal - discountAmount + estimatedTax;

  // Validate Pincode with public postal APIs (comparable to Google geocoding checks)
  const validatePincodeWithAPI = async (pincode: string, countrySelected: string): Promise<boolean> => {
    try {
      const cleaned = pincode.trim().replace(/\s/g, '');
      if (countrySelected === 'India') {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`);
        if (!res.ok) return false;
        const data = await res.json();
        return !!(data && data[0] && data[0].Status === 'Success');
      } else {
        // Map country selected to zippopotam codes
        let cc = 'us';
        if (countrySelected === 'United Kingdom') cc = 'gb';
        else if (countrySelected === 'France') cc = 'fr';
        else if (countrySelected === 'Japan') cc = 'jp';
        else if (countrySelected === 'UAE') {
          return /^[a-zA-Z0-9\s-]{3,10}$/.test(cleaned);
        }
        const res = await fetch(`https://api.zippopotam.us/${cc}/${cleaned}`);
        return res.ok;
      }
    } catch (err) {
      console.warn('Pincode validation API check offline, falling back to pattern verification:', err);
      return /^[a-zA-Z0-9\s-]{3,10}$/.test(pincode);
    }
  };

  // Helper to dynamically load the Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Enter a valid phone number (8-15 digits)';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State / Region is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }

      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = 'Expiry is required';
      } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.cardExpiry)) {
        errors.cardExpiry = 'Format must be MM/YY';
      }

      if (!formData.cardCvv.trim()) {
        errors.cardCvv = 'CVV is required';
      } else if (formData.cardCvv.length < 3) {
        errors.cardCvv = 'CVV must be 3 or 4 digits';
      }
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(formData.upiId.trim())) {
        errors.upiId = 'Enter a valid UPI ID (e.g. user@okhdfcbank)';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Triggers order persistence inside DB
  const createOrderInDB = async (paymentLabel: string) => {
    const fullAddress = `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state}, ${formData.country}`;
    
    const orderPayload = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        colorName: item.colorName
      })),
      totalPrice: grandTotal,
      shippingAddress: fullAddress,
      pincode: formData.pincode,
      paymentMethod: paymentLabel,
      contactEmail: formData.email,
      contactPhone: formData.phone,
      customerName: `${formData.firstName} ${formData.lastName}`,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      country: formData.country
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrderResult(orderData);
        clearCart();
      } else {
        const errorText = await response.text();
        alert(`Order placement failed: ${errorText}`);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('A network error occurred. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPlacingOrder(true);
    setCheckoutStepMessage("Validating delivery address and postal pincode...");

    // 1. Validate Pincode from Google API lookup
    const isPincodeValid = await validatePincodeWithAPI(formData.pincode, formData.country);
    if (!isPincodeValid) {
      setFormErrors(prev => ({ 
        ...prev, 
        pincode: `Invalid pincode/ZIP code for ${formData.country}. Please enter a valid code.` 
      }));
      setPlacingOrder(false);
      return;
    }

    const paymentMethodLabel = 
      formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 
      formData.paymentMethod === 'upi' ? 'UPI / NetBanking' : 
      'Cash on Delivery (COD)';

    // 2. Route by payment method selected
    if (formData.paymentMethod === 'cod') {
      // Cash on Delivery
      setCheckoutStepMessage("Securing your Cash on Delivery booking...");
      await createOrderInDB('Cash on Delivery (COD)');
    } else {
      // Card / UPI - Integrates Razorpay Gateway
      setCheckoutStepMessage("Connecting to secure payment gateway...");
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay payment client. Please check your internet connection.");
        setPlacingOrder(false);
        return;
      }

      // Convert pricing base on checkout country currency
      let currency = 'USD';
      let amountMultiplier = 1;
      if (formData.country === 'India') {
        currency = 'INR';
        amountMultiplier = 83;
      } else if (formData.country === 'United Kingdom') {
        currency = 'GBP';
        amountMultiplier = 0.79;
      } else if (formData.country === 'UAE') {
        currency = 'AED';
        amountMultiplier = 3.67;
      }

      const totalInCurrency = Math.round(grandTotal * amountMultiplier);

      // Create Razorpay Order on the backend
      let rzpOrderData: any = null;
      try {
        const orderRes = await fetch('/api/payment/razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalInCurrency, currency })
        });
        if (!orderRes.ok) {
          throw new Error(await orderRes.text());
        }
        rzpOrderData = await orderRes.json();
      } catch (err) {
        console.error("Failed to generate Razorpay order ID from server:", err);
        alert("Failed to initialize payment transaction. Please try again.");
        setPlacingOrder(false);
        return;
      }

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key_not_configured';

      const options = {
        key: rzpKey,
        amount: rzpOrderData.amount ? rzpOrderData.amount : totalInCurrency * 100,
        currency: rzpOrderData.currency || currency,
        order_id: rzpOrderData.id, // Feed backend-generated order ID
        name: "Ink & Cotton Club",
        description: "Bespoke Order Payment",
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        handler: async function (response: any) {
          setPlacingOrder(true);
          setCheckoutStepMessage("Verifying secure transaction signature...");
          
          try {
            // Verify payment signature on the backend
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              throw new Error("Signature verification failed");
            }

            setCheckoutStepMessage("Payment authorized! Finalizing order transaction...");
            await createOrderInDB(`${paymentMethodLabel} (Verified Razorpay Ref: ${response.razorpay_payment_id})`);
          } catch (verifyErr) {
            console.error("Payment verification failure:", verifyErr);
            alert("Payment verification failed! If you were charged, please contact customer support.");
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function() {
            setPlacingOrder(false);
          }
        },
        theme: {
          color: "#c5a880"
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setPlacingOrder(false);
      } catch (err) {
        console.error("Razorpay instance initialization failed:", err);
        // Fallback for simulated testing
        if (rzpOrderData.simulated || confirm("Razorpay Gateway failed to open (keys might not be configured). Simulate success for testing?")) {
          setPlacingOrder(true);
          setCheckoutStepMessage("Simulating payment callback...");
          setTimeout(async () => {
            await createOrderInDB(`${paymentMethodLabel} (Simulated Razorpay Ref: pay_sim_` + Math.floor(Math.random()*1000000) + `)`);
          }, 1500);
        } else {
          setPlacingOrder(false);
        }
      }
    }
  };

  // Maps order database status string to timeline step number (0 to 4)
  const getStepFromStatus = (statusStr: string) => {
    switch (statusStr) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  // Generates timeline status logs dynamically based on active order status
  const getLogsForStatus = (statusStr: string) => {
    const logs = [];
    if (statusStr === 'Processing') {
      logs.push("Order details received. Premium Courier Agent assigned.");
    } else if (statusStr === 'Shipped') {
      logs.push("Shipment dispatched. In transit from ICC Atelier to hub.");
      logs.push("Order details received. Premium Courier Agent assigned.");
    } else if (statusStr === 'Out for Delivery') {
      logs.push("Shipment out for delivery. Courier Agent Kartik is navigating to coordinates.");
      logs.push("Shipment dispatched. In transit from ICC Atelier to hub.");
      logs.push("Order details received. Premium Courier Agent assigned.");
    } else if (statusStr === 'Delivered') {
      logs.push("Order successfully delivered! Handover verified.");
      logs.push("Shipment out for delivery. Courier Agent Kartik is navigating to coordinates.");
      logs.push("Shipment dispatched. In transit from ICC Atelier to hub.");
      logs.push("Order details received. Premium Courier Agent assigned.");
    } else if (statusStr === 'Out of Stock (Cancelled)') {
      logs.push("Order has been cancelled due to inventory shortage.");
    } else {
      logs.push(`Order status updated to: ${statusStr}`);
    }
    return logs;
  };

  if (orderResult) {
    const currentStep = getStepFromStatus(orderResult.status);
    const timelineLogs = getLogsForStatus(orderResult.status);
    
    return (
      <div className="min-h-screen bg-[#050505] text-ivory pt-28 pb-20 px-6 md:px-16 flex flex-col justify-center items-center">
        <div className="max-w-3xl w-full bg-[#0e0e0e] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 animate-fadeIn">
          
          {/* Header check icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
              <CheckCircle2 size={36} className="animate-scaleUp" />
            </div>
            <h1 className="font-serif text-3xl uppercase tracking-widest text-white mt-4">Order Confirmed</h1>
            <p className="text-xs text-gold uppercase tracking-[0.2em] font-sans">Thank you for your patronage</p>
          </div>

          {/* Receipt details */}
          <div className="border-t border-b border-white/5 py-6 space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center">
              <span className="text-ivory/40 uppercase tracking-widest">Tracking Reference</span>
              <span className="font-mono text-white text-sm font-semibold tracking-widest">{orderResult.trackingNumber}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-ivory/40 uppercase tracking-widest shrink-0">Deliver To</span>
              <span className="text-white text-right leading-relaxed max-w-[280px]">
                <strong>{formData.firstName} {formData.lastName}</strong><br />
                {formData.address}{formData.apartment ? `, ${formData.apartment}` : ''}<br />
                {formData.city}, {formData.state} - {formData.pincode}<br />
                {formData.country}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ivory/40 uppercase tracking-widest">Payment Method</span>
              <span className="text-white font-medium">
                {orderResult.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ivory/40 uppercase tracking-widest">Estimated Delivery</span>
              <span className="text-gold font-medium">5 - 7 Business Days</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <span className="text-ivory/40 uppercase tracking-widest font-semibold">Total Amount</span>
              <span className="text-gold font-serif text-lg font-light">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Customer Shipment Status Tracker (Timeline) */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-gold" />
                <h3 className="font-serif text-sm uppercase tracking-wider text-white">Shipment Transit Tracker</h3>
              </div>
              
              <button
                type="button"
                onClick={handleRefreshStatus}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-xl text-[9px] uppercase tracking-wider font-semibold text-ivory hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={10} className={refreshing ? "animate-spin text-gold" : "text-gold"} />
                Refresh Status
              </button>
            </div>

            {/* Shipment progress timeline */}
            <div className="relative pt-4 pb-2">
              {/* Connector line */}
              <div className="absolute top-9 left-6 right-6 h-0.5 bg-white/5 -z-1" />
              <div 
                className="absolute top-9 left-6 h-0.5 bg-gold transition-all duration-500 -z-1" 
                style={{ width: `${(currentStep / 4) * 88}%` }}
              />

              <div className="grid grid-cols-5 text-center">
                {[
                  { label: 'Placed', desc: 'Received' },
                  { label: 'Processing', desc: 'Appointed Agent' },
                  { label: 'Transit', desc: 'In Route' },
                  { label: 'Out', desc: 'Out for Delivery' },
                  { label: 'Delivered', desc: 'Success' }
                ].map((step, idx) => {
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isCurrent 
                            ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20' 
                            : isDone 
                            ? 'bg-[#1b1b1b] border-gold text-gold' 
                            : 'bg-black border-white/10 text-white/30'
                        }`}
                      >
                        {isDone && idx < currentStep ? <Check size={10} strokeWidth={3} /> : <span className="text-[9px] font-bold font-sans">{idx + 1}</span>}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-[9px] font-semibold uppercase tracking-wider ${isCurrent ? 'text-gold' : isDone ? 'text-white' : 'text-ivory/30'}`}>{step.label}</p>
                        <p className="text-[7px] text-ivory/25 font-sans leading-none">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log notifications */}
            <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-ivory/60 space-y-1.5 max-h-[105px] overflow-y-auto">
              {timelineLogs.map((log, idx) => (
                <p key={idx} className={idx === 0 ? 'text-gold' : 'text-ivory/45'}>{log}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-[11px] text-ivory/40 leading-relaxed max-w-sm mx-auto">
              A confirmation email has been sent to <strong>{formData.email}</strong>. Our logistics partners will send tracking links shortly.
            </p>
            <button
              onClick={() => router.push('/collection')}
              className="px-8 py-3.5 w-full bg-gold text-[#050505] font-semibold text-xs tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-colors duration-300 shadow-lg shadow-gold/5 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-ivory pt-24 pb-20 px-6 md:px-12 lg:px-20 flex flex-col items-center">
      <div className="max-w-7xl w-full flex flex-col gap-6">
        
        {/* Navigation back and header logo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
          <button
            onClick={() => router.push('/collection')}
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 font-sans"
          >
            <ArrowLeft size={11} /> Return to Gallery
          </button>
          
          <div className="text-left sm:text-right">
            <h1 className="font-serif text-lg tracking-[0.3em] uppercase text-white">Ink & Cotton Club</h1>
            <p className="text-[8px] uppercase tracking-[0.2em] text-gold mt-1">Bespoke Checkout Service</p>
          </div>
        </div>

        {/* Steps breadcrumbs */}
        <div className="flex gap-2 text-[8px] uppercase tracking-widest text-ivory/30 font-sans border-b border-white/5 pb-4">
          <span className="text-gold">Cart</span>
          <span>/</span>
          <span className="text-white font-medium">Information</span>
          <span>/</span>
          <span>Shipping</span>
          <span>/</span>
          <span>Payment</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center space-y-6 shadow-2xl mt-8">
            <h2 className="font-serif text-2xl uppercase tracking-wider text-white">Your Cart is Empty</h2>
            <p className="text-xs text-ivory/60 font-sans max-w-sm">
              Please choose item selections from our collection before proceeding to the checkout portal.
            </p>
            <button
              onClick={() => router.push('/collection')}
              className="px-8 py-3 bg-gold text-[#050505] font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          /* Main checkout page grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4 items-start">
            
            {/* Left side: Information, Shipping & Payment forms */}
            <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-10">
              
              {/* Contact section */}
              <div className="space-y-4">
                <h3 className="font-serif text-base uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <Mail size={14} className="text-gold" /> Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patron@domain.com"
                      className={`w-full bg-[#121212]/80 border ${formErrors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans`}
                    />
                    {formErrors.email && <p className="text-[10px] text-red-400 font-sans">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full bg-[#121212]/80 border ${formErrors.phone ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans`}
                    />
                    {formErrors.phone && <p className="text-[10px] text-red-400 font-sans">{formErrors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address section */}
              <div className="space-y-4">
                <h3 className="font-serif text-base uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <MapPin size={14} className="text-gold" /> Shipping Address
                </h3>

                {/* Logged-in profile address selector */}
                {profile && profile.address && (
                  <div className="bg-[#121212]/80 border border-white/5 rounded-2xl p-5 mb-6 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold">Choose Delivery Coordinate</h4>
                      {fetchingProfile && <Loader2 size={12} className="animate-spin text-gold" />}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <button
                        type="button"
                        onClick={() => handleToggleSavedAddress(true)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          useSavedAddress
                            ? 'bg-gold/5 border-gold text-white shadow-lg shadow-gold/5'
                            : 'bg-black/40 border-white/5 text-ivory/50 hover:text-white hover:border-white/15'
                        }`}
                      >
                        <div>
                          <p className="font-sans font-bold text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-2 text-gold">
                            <span className={`w-2 h-2 rounded-full flex shrink-0 ${useSavedAddress ? 'bg-gold' : 'border border-white/40'}`} />
                            Saved Address
                          </p>
                          <p className="text-[10px] text-ivory/60 leading-normal">
                            <strong>{profile.name}</strong><br />
                            {profile.address}{profile.apartment ? `, ${profile.apartment}` : ''}<br />
                            {profile.city}, {profile.state} - {profile.pincode}
                          </p>
                        </div>
                        {useSavedAddress && (
                          <span className="text-[8px] uppercase tracking-widest text-gold mt-3 font-semibold flex items-center gap-1"><Check size={10} /> Active Selection</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSavedAddress(false)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          !useSavedAddress
                            ? 'bg-gold/5 border-gold text-white shadow-lg shadow-gold/5'
                            : 'bg-black/40 border-white/5 text-ivory/50 hover:text-white hover:border-white/15'
                        }`}
                      >
                        <div>
                          <p className="font-sans font-bold text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex shrink-0 ${!useSavedAddress ? 'bg-gold' : 'border border-white/40'}`} />
                            New Address
                          </p>
                          <p className="text-[10px] text-ivory/50 leading-relaxed">
                            Enter different dispatch coordinates for this order. This will update your profile.
                          </p>
                        </div>
                        {!useSavedAddress && (
                          <span className="text-[8px] uppercase tracking-widest text-gold mt-3 font-semibold flex items-center gap-1"><Check size={10} /> Active Selection</span>
                        )}
                      </button>

                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Arthur"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.firstName ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.firstName && <p className="text-[10px] text-red-400 font-sans">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Pendleton"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.lastName ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.lastName && <p className="text-[10px] text-red-400 font-sans">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="109 Rue Saint-Honoré"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.address ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.address && <p className="text-[10px] text-red-400 font-sans">{formErrors.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Apartment, Suite, Unit (Optional)</label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="Atelier B"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className="w-full bg-[#121212]/80 border border-white/10 focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Paris"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.city ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.city && <p className="text-[10px] text-red-400 font-sans">{formErrors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">State / Region</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Île-de-France"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.state ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.state && <p className="text-[10px] text-red-400 font-sans">{formErrors.state}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Pincode / ZIP Code</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="75001"
                      disabled={useSavedAddress && profile && !!profile.address}
                      className={`w-full bg-[#121212]/80 border ${formErrors.pincode ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {formErrors.pincode && <p className="text-[10px] text-red-400 font-sans">{formErrors.pincode}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={useSavedAddress && profile && !!profile.address}
                      className="w-full bg-[#121212]/80 border border-white/10 focus:border-gold rounded-xl px-4 py-[13px] text-xs text-white focus:outline-none transition-colors font-sans appearance-none select-custom disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="UAE">United Arab Emirates</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4">
                <h3 className="font-serif text-base uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <CreditCard size={14} className="text-gold" /> Secure Payment
                </h3>
                
                {/* Method selector boxes */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'card' 
                        ? 'bg-gold/5 border-gold text-white shadow-lg shadow-gold/5' 
                        : 'bg-[#121212]/60 border-white/5 text-ivory/60 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <CreditCard size={18} className="mb-2 text-gold" />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-widest">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'upi' 
                        ? 'bg-gold/5 border-gold text-white shadow-lg shadow-gold/5' 
                        : 'bg-[#121212]/60 border-white/5 text-ivory/60 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <Landmark size={18} className="mb-2 text-gold" />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-widest">UPI ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.paymentMethod === 'cod' 
                        ? 'bg-gold/5 border-gold text-white shadow-lg shadow-gold/5' 
                        : 'bg-[#121212]/60 border-white/5 text-ivory/60 hover:text-white hover:border-white/15'
                    }`}
                  >
                    <Truck size={18} className="mb-2 text-gold" />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-widest">COD</span>
                  </button>
                </div>

                {/* Conditional detail fields */}
                <div className="bg-[#0b0b0b]/60 border border-white/5 rounded-2xl p-6 min-h-[120px] flex items-center justify-center">
                  
                  {formData.paymentMethod === 'card' && (
                    <div className="w-full space-y-4 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Cardholder Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="0000 0000 0000 0000"
                            className={`w-full bg-[#121212] border ${formErrors.cardNumber ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-mono tracking-widest`}
                          />
                          <CreditCard className="absolute right-3.5 top-3.5 text-ivory/30" size={14} />
                        </div>
                        {formErrors.cardNumber && <p className="text-[10px] text-red-400 font-sans">{formErrors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Expiry Date</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className={`w-full bg-[#121212] border ${formErrors.cardExpiry ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-mono`}
                          />
                          {formErrors.cardExpiry && <p className="text-[10px] text-red-400 font-sans">{formErrors.cardExpiry}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">Security Code (CVV)</label>
                          <input
                            type="password"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4) })}
                            placeholder="•••"
                            className={`w-full bg-[#121212] border ${formErrors.cardCvv ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-mono`}
                          />
                          {formErrors.cardCvv && <p className="text-[10px] text-red-400 font-sans">{formErrors.cardCvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="w-full space-y-3 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/50 font-sans">UPI Address</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                          placeholder="username@bankbranch"
                          className={`w-full bg-[#121212] border ${formErrors.upiId ? 'border-red-500/50' : 'border-white/10'} focus:border-gold rounded-xl px-4 py-3 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans`}
                        />
                        {formErrors.upiId && <p className="text-[10px] text-red-400 font-sans">{formErrors.upiId}</p>}
                      </div>
                      <p className="text-[10px] text-ivory/30 leading-relaxed">
                        We will load the secure payment gateway to verify and authorization test.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <div className="text-center p-4 space-y-2 animate-fadeIn">
                      <Truck size={20} className="mx-auto text-gold/60" />
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Cash on Delivery Eligible</h4>
                      <p className="text-[10px] text-ivory/40 leading-relaxed max-w-sm">
                        Pay with cash or digital scanner directly to shipping agent Kartik on delivery.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={placingOrder}
                  className="w-full py-4 bg-gold text-[#050505] font-semibold text-xs uppercase tracking-[0.25em] rounded-full flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors duration-350 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {placingOrder ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={14} />
                      {checkoutStepMessage}
                    </span>
                  ) : (
                    <>
                      <Lock size={12} />
                      Complete Order • {formatPrice(grandTotal)}
                    </>
                  )}
                </button>
              </div>

              {/* Security Badges */}
              <div className="flex justify-center items-center gap-6 pt-4 border-t border-white/5 text-[9px] uppercase tracking-widest text-ivory/35">
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-gold" /> SSL Encrypted</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Lock size={12} className="text-gold" /> PCI compliant</span>
              </div>

            </form>

            {/* Right side: Sticky Order Summary & Swatches */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="glass border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                <h3 className="font-serif text-sm uppercase tracking-wider text-white border-b border-white/5 pb-3">Order Summary</h3>
                
                {/* Scrollable Items list */}
                <div className="max-h-[300px] overflow-y-auto pr-2 divide-y divide-white/5 space-y-4">
                  {cartItems.map((item) => {
                    const sizeParts = item.id.split('-');
                    const sizeLabel = sizeParts.length > 1 ? sizeParts[1] : item.size;
                    
                    return (
                      <div key={item.id} className="flex gap-4 pt-4 first:pt-0 items-center justify-between">
                        <div className="flex gap-4 items-center">
                          {/* Color Swatch thumbnail */}
                          <div
                            className={`w-12 h-16 rounded-lg flex items-center justify-center border border-white/10 shrink-0 ${
                              item.colorName === 'Jet Black'
                                ? 'bg-[#080808]'
                                : item.colorName === 'Royal Blue'
                                ? 'bg-[#0f1a30]'
                                : 'bg-[#faf8f5]'
                            }`}
                          >
                            <span
                              className={`text-[7px] uppercase tracking-[0.1em] font-semibold ${
                                item.colorName === 'Ivory White' ? 'text-matte-black' : 'text-ivory'
                              }`}
                            >
                              {item.colorName.split(' ')[0]}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="font-serif text-xs text-white font-medium">{item.name}</h4>
                            <p className="text-[9px] uppercase tracking-widest text-ivory/40">
                              Qty: {item.quantity} • Size {sizeLabel}
                            </p>
                          </div>
                        </div>

                        <span className="font-serif text-xs text-gold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon discount input */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Discount Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-ivory/20 focus:outline-none transition-colors font-sans"
                      />
                      <Tag className="absolute left-3 top-3 text-ivory/30" size={13} />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-[#222] hover:bg-gold hover:text-black rounded-xl text-[10px] font-sans font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-400 font-sans pl-1">{couponError}</p>}
                  {appliedDiscount && (
                    <div className="flex items-center justify-between text-[10px] text-gold uppercase tracking-wider bg-gold/5 border border-gold/10 rounded-lg p-2 font-sans">
                      <span className="flex items-center gap-1.5"><Tag size={10} /> Coupon `{appliedDiscount.code}` Applied</span>
                      <span>-{appliedDiscount.type === 'percent' ? `${appliedDiscount.value}%` : formatPrice(appliedDiscount.value)}</span>
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-sans">
                  
                  <div className="flex justify-between items-center text-ivory/55">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-gold">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-ivory/55">
                    <span>Shipping</span>
                    <span className="text-gold uppercase tracking-widest text-[9px] font-semibold">Complimentary Standard</span>
                  </div>

                  <div className="flex justify-between items-center text-ivory/55">
                    <span>Estimated Taxes (5%)</span>
                    <span>{formatPrice(estimatedTax)}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4 text-sm font-serif">
                    <span className="text-white uppercase tracking-wider">Grand Total</span>
                    <span className="text-gold font-light tracking-widest text-base">{formatPrice(grandTotal)}</span>
                  </div>

                </div>

              </div>

              {/* Trust statement */}
              <div className="bg-[#121212]/20 border border-white/5 rounded-3xl p-5 text-center text-[10px] text-ivory/45 font-sans leading-relaxed">
                As a member of the **Ink & Cotton Club**, you enjoy worldwide premium delivery, insured transit, and hassle-free returns.
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
