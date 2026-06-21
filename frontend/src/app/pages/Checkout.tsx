import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, ShieldCheck, Share2, HelpCircle, ArrowLeft, CheckCircle2, Home, Briefcase, MapPin, Trash2, Edit2, Plus, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  id: number;
  type: string; // HOME, OFFICE, or custom location name
  isDefault: boolean;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export function Checkout() {
  const [cartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Contact Info
  const [email, setEmail] = useState(() => {
    try {
      const profile = localStorage.getItem("profile");
      if (profile) return JSON.parse(profile).email || "";
    } catch {}
    return "";
  });

  const [phone, setPhone] = useState(() => {
    try {
      const profile = localStorage.getItem("profile");
      if (profile) return JSON.parse(profile).phone || "";
    } catch {}
    return "";
  });

  // Addresses List
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem("addresses");
      if (stored) {
        const list = JSON.parse(stored);
        const cleaned = list.filter((a: any) => a.name !== "Jeshwanth" && a.firstName !== "Jeshwanth");
        return cleaned;
      }
    } catch {}
    return [];
  });

  // Active Selected Address
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(() => {
    const defaultAddr = addresses.find(a => a.isDefault);
    return defaultAddr ? defaultAddr.id : (addresses[0]?.id || null);
  });

  // Automatically update selectedAddressId when addresses length changes
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find(a => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    } else if (addresses.length === 0) {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  // Form State for Adding / Editing Address
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "HOME", // HOME | OFFICE | OTHER
    otherName: "",
    firstName: "",
    lastName: "",
    buildingNo: "",
    buildingName: "",
    street: "",
    area: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    isDefault: false
  });

  const [saveNextTime, setSaveNextTime] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 1999 || subtotal === 0 ? 0 : 90;
  const shippingCost = shippingMethod === "express" ? 150.00 : deliveryFee;
  const total = subtotal + shippingCost;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Sync addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || null;

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: "HOME",
      otherName: "",
      firstName: "",
      lastName: "",
      buildingNo: "",
      buildingName: "",
      street: "",
      area: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      isDefault: addresses.length === 0
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    const isStandardType = addr.type === "HOME" || addr.type === "OFFICE";
    setAddressForm({
      type: isStandardType ? addr.type : "OTHER",
      otherName: isStandardType ? "" : addr.type,
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      buildingNo: addr.buildingNo || "",
      buildingName: addr.buildingName || "",
      street: addr.street,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone,
      isDefault: addr.isDefault
    });
    setIsFormOpen(true);
  };

  const handleDeleteAddress = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = addressForm.type === "OTHER" 
      ? (addressForm.otherName.trim() || "OTHER").toUpperCase() 
      : addressForm.type;

    if (editingAddressId !== null) {
      // Editing
      const updated = addresses.map(addr => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            type: finalType,
            firstName: addressForm.firstName,
            lastName: addressForm.lastName,
            buildingNo: addressForm.buildingNo,
            buildingName: addressForm.buildingName,
            street: addressForm.street,
            area: addressForm.area,
            city: addressForm.city,
            state: addressForm.state,
            postalCode: addressForm.postalCode,
            phone: addressForm.phone,
            isDefault: addressForm.isDefault ? true : addr.isDefault
          };
        }
        return addressForm.isDefault ? { ...addr, isDefault: false } : addr;
      });
      setAddresses(updated);
      setIsFormOpen(false);
      setEditingAddressId(null);
    } else {
      // Adding new
      const newId = Date.now();
      const newAddress: Address = {
        id: newId,
        type: finalType,
        isDefault: addressForm.isDefault || addresses.length === 0,
        firstName: addressForm.firstName,
        lastName: addressForm.lastName,
        buildingNo: addressForm.buildingNo,
        buildingName: addressForm.buildingName,
        street: addressForm.street,
        area: addressForm.area,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        phone: addressForm.phone
      };

      const updated = addressForm.isDefault 
        ? addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
        : [...addresses, newAddress];

      setAddresses(updated);
      setSelectedAddressId(newId);
      setIsFormOpen(false);
    }
  };

  const handleContinueToDelivery = () => {
    if (!activeAddress) {
      alert("Please add and select a shipping address.");
      return;
    }
    if (!email.trim() || !phone.trim()) {
      alert("Please fill in contact details (email and phone number).");
      return;
    }
    setStep(2);
  };

  const handleContinueToPayment = () => {
    setStep(3);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    // Confetti animation
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    // Empty the cart
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-20">
        <div className="max-w-md mx-auto px-6 text-center flex flex-col justify-center items-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mb-6 stroke-[1.2]" />
          <h1 className="text-2xl font-extrabold tracking-[0.05em] mb-4 uppercase rounded-none">
            ORDER PLACED SUCCESSFULLY
          </h1>
          <p className="text-neutral-500 text-xs leading-relaxed mb-8 uppercase tracking-wider font-bold">
            Your Cash on Delivery order is confirmed! A notification will be sent to <span className="font-semibold text-neutral-900">{phone}</span> shortly.
          </p>
          <div className="w-full">
            <Link
              to="/"
              className="block w-full bg-black text-white py-4 rounded-none text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Sleek Step Progress Indicator */}
        <div className="flex items-center justify-center gap-6 md:gap-12 mb-12">
          <button onClick={() => setStep(1)} className="flex items-center gap-2 group cursor-pointer bg-transparent border-none">
            <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-extrabold transition-all border ${step === 1 ? "bg-black text-white border-black" : "bg-white text-neutral-400 border-neutral-350"}`}>
              1
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step === 1 ? "text-black" : "text-neutral-400 group-hover:text-neutral-700"}`}>
              Information
            </span>
          </button>
          
          <div className="h-[1px] w-8 md:w-16 bg-neutral-300"></div>
          
          <button 
            disabled={!activeAddress} 
            onClick={() => setStep(2)} 
            className="flex items-center gap-2 group cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
          >
            <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-extrabold transition-all border ${step === 2 ? "bg-black text-white border-black" : "bg-white text-neutral-400 border-neutral-350"}`}>
              2
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step === 2 ? "text-black" : "text-neutral-400 group-hover:text-neutral-700"}`}>
              Delivery
            </span>
          </button>
          
          <div className="h-[1px] w-8 md:w-16 bg-neutral-300"></div>
          
          <button 
            disabled={step < 2} 
            onClick={() => setStep(3)} 
            className="flex items-center gap-2 group cursor-pointer disabled:cursor-not-allowed bg-transparent border-none"
          >
            <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-extrabold transition-all border ${step === 3 ? "bg-black text-white border-black" : "bg-white text-neutral-400 border-neutral-350"}`}>
              3
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider ${step === 3 ? "text-black" : "text-neutral-400 group-hover:text-neutral-700"}`}>
              Payment
            </span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Wizard Steps */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: INFORMATION */}
            {step === 1 && (
              <div className="bg-white border border-neutral-200/80 p-8 rounded-none space-y-8">
                
                {/* Contact Details */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-neutral-400 uppercase">
                    01. CONTACT DETAILS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-extrabold tracking-widest mb-1.5 text-neutral-500 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER EMAIL ADDRESS"
                        className="w-full bg-white border border-neutral-250 px-3 py-2.5 rounded-none text-xs font-bold tracking-wide focus:outline-none focus:border-black uppercase placeholder-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold tracking-widest mb-1.5 text-neutral-500 uppercase">
                        Phone Number (For Tracking Updates)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="ENTER PHONE NUMBER"
                        className="w-full bg-white border border-neutral-250 px-3 py-2.5 rounded-none text-xs font-bold tracking-wide focus:outline-none focus:border-black placeholder-neutral-300"
                      />
                    </div>
                  </div>
                </section>

                <div className="border-t border-neutral-100 my-6"></div>

                {/* Shipping Addresses selector */}
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black tracking-widest text-neutral-400 uppercase">
                      02. SHIPPING ADDRESS
                    </h3>
                  </div>

                  {isFormOpen ? (
                    /* Add/Edit Address Form matching user's field checklist */
                    <form onSubmit={handleSaveAddress} className="bg-[#FAF8F5]/30 p-6 border border-neutral-250 space-y-5 rounded-none">
                      <h4 className="text-[10px] font-black tracking-widest text-black uppercase">
                        {editingAddressId ? "EDIT ADDRESS DETAILS" : "ADD NEW ADDRESS"}
                      </h4>
                      
                      {/* Location Type Selector Buttons */}
                      <div>
                        <label className="block text-[8px] font-black tracking-widest mb-2 text-neutral-500 uppercase">Location Type</label>
                        <div className="flex gap-2">
                          {["HOME", "OFFICE", "OTHER"].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setAddressForm({ ...addressForm, type: t })}
                              className={`flex-1 py-2 text-[10px] font-extrabold tracking-widest uppercase border transition-colors rounded-none cursor-pointer ${
                                addressForm.type === t
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Other Location Name - Conditional rendering */}
                      {addressForm.type === "OTHER" && (
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Other Location Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. WORK, FRIEND'S HOUSE"
                            value={addressForm.otherName}
                            onChange={(e) => setAddressForm({ ...addressForm, otherName: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                      )}

                      {/* Recipient First & Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">First Name</label>
                          <input
                            type="text"
                            required
                            placeholder="FIRST NAME"
                            value={addressForm.firstName}
                            onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Last Name</label>
                          <input
                            type="text"
                            required
                            placeholder="LAST NAME"
                            value={addressForm.lastName}
                            onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Building No.</label>
                          <input
                            type="text"
                            required
                            placeholder="BUILDING NO."
                            value={addressForm.buildingNo}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingNo: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Building Name</label>
                          <input
                            type="text"
                            required
                            placeholder="BUILDING NAME"
                            value={addressForm.buildingName}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingName: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Street No. / Name</label>
                          <input
                            type="text"
                            required
                            placeholder="STREET NO. / NAME"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Area / Locality</label>
                          <input
                            type="text"
                            required
                            placeholder="AREA / LOCALITY"
                            value={addressForm.area}
                            onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">City</label>
                          <input
                            type="text"
                            required
                            placeholder="CITY"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">State</label>
                          <input
                            type="text"
                            required
                            placeholder="STATE"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Pincode</label>
                          <input
                            type="text"
                            required
                            placeholder="PINCODE"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black tracking-widest mb-1 text-neutral-500 uppercase">Delivery Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="PHONE NUMBER"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full bg-white border border-neutral-250 px-3 py-2 text-xs font-bold focus:outline-none focus:border-black uppercase rounded-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id="makeDefault"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="accent-[#030213]"
                        />
                        <label htmlFor="makeDefault" className="text-[9px] font-extrabold text-neutral-600 uppercase cursor-pointer tracking-wider">
                          Make this my default shipping address
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-black hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-black rounded-none transition-colors"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="bg-transparent text-neutral-500 hover:text-black text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-300 rounded-none transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Address Grid Selector with updated fields rendering */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map(addr => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-6 border flex flex-col justify-between cursor-pointer transition-all relative select-none min-h-[220px] rounded-none ${
                              isSelected 
                                ? "border-black bg-[#FAF8F5]/30 ring-1 ring-black/10 shadow-sm"
                                : "border-neutral-200 bg-white hover:border-black/50"
                            }`}
                          >
                            <div>
                              {/* Header: Label, badges and actions */}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  {addr.type === "HOME" ? (
                                    <Home className="h-3.5 w-3.5 text-neutral-850" />
                                  ) : addr.type === "OFFICE" ? (
                                    <Briefcase className="h-3.5 w-3.5 text-neutral-850" />
                                  ) : (
                                    <MapPin className="h-3.5 w-3.5 text-neutral-850" />
                                  )}
                                  <span className="text-[9px] font-black tracking-widest text-[#b2533e] uppercase">
                                    {addr.type}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="bg-black text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-none flex items-center gap-0.5 uppercase scale-90">
                                      DEFAULT <Check className="h-2 w-2" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => handleOpenEditForm(addr, e)}
                                    className="p-1 hover:text-black text-neutral-450 transition-colors bg-transparent border-none cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 stroke-[1.8]" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                                    className="p-1 hover:text-[#b2533e] text-neutral-450 transition-colors bg-transparent border-none cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 stroke-[1.8]" />
                                  </button>
                                </div>
                              </div>

                              {/* Details rendered using user's building / street / pincode model */}
                              <div className="text-[10px] leading-relaxed text-neutral-700 font-bold uppercase tracking-wider">
                                <p className="font-extrabold text-neutral-900 text-xs mb-1.5">{addr.firstName} {addr.lastName}</p>
                                <p className="truncate-2-lines">
                                  {addr.buildingNo && `${addr.buildingNo}, `}
                                  {addr.buildingName && `${addr.buildingName}, `}
                                  {addr.street}
                                </p>
                                <p>{addr.area}</p>
                                <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                                <p className="text-[8px] font-extrabold text-[#b2533e] mt-2.5 tracking-widest uppercase">PH: {addr.phone}</p>
                              </div>
                            </div>

                            {/* DELIVER HERE Action button inside active card */}
                            <div className="mt-4">
                              {isSelected ? (
                                <div className="w-full bg-black text-white text-center py-2 text-[9px] font-extrabold tracking-widest uppercase rounded-none">
                                  DELIVER HERE
                                </div>
                              ) : (
                                <div className="w-full border border-neutral-300 text-neutral-650 text-center py-2 text-[9px] font-extrabold tracking-widest uppercase hover:bg-neutral-50 rounded-none">
                                  SELECT ADDRESS
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Add New Address dashed placeholder card */}
                      <div
                        onClick={handleOpenAddForm}
                        className="border border-dashed border-neutral-300 hover:border-black bg-white/40 hover:bg-white/90 p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px] rounded-none"
                      >
                        <Plus className="h-6 w-6 text-neutral-400 mb-2 stroke-[1.5]" />
                        <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">
                          + ADD NEW ADDRESS
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Bottom checklist and big CTA */}
                <div className="border-t border-neutral-100 pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveNextTime"
                      checked={saveNextTime}
                      onChange={(e) => setSaveNextTime(e.target.checked)}
                      className="accent-[#030213]"
                    />
                    <label htmlFor="saveNextTime" className="text-[10px] font-bold text-neutral-600 uppercase cursor-pointer">
                      Save this information for next time
                    </label>
                  </div>

                  <button
                    onClick={handleContinueToDelivery}
                    className="w-full bg-black hover:bg-neutral-900 text-white py-4 rounded-none text-xs font-bold tracking-[0.2em] transition-colors flex items-center justify-center gap-2 uppercase border border-black"
                  >
                    Continue to Delivery →
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 2 && activeAddress && (
              <div className="bg-white border border-neutral-200/80 p-8 rounded-none space-y-8">
                
                {/* Summary of Step 1 Info */}
                <section className="border border-neutral-250 p-4 divide-y divide-neutral-200 text-[10px] font-bold tracking-wider text-neutral-600 uppercase rounded-none">
                  <div className="pb-3 flex justify-between items-start gap-4">
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-neutral-455 font-extrabold uppercase">Contact</span>
                      <span className="text-neutral-855 font-bold truncate">{email} | {phone}</span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-neutral-400 hover:text-black font-extrabold underline bg-transparent border-none cursor-pointer uppercase text-[8px] tracking-widest">
                      Change
                    </button>
                  </div>
                  <div className="pt-3 flex justify-between items-start gap-4">
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-neutral-455 font-extrabold uppercase">Ship to</span>
                      <span className="text-neutral-855 truncate leading-tight font-bold">
                        {activeAddress.firstName} {activeAddress.lastName}, 
                        {activeAddress.buildingNo && ` ${activeAddress.buildingNo},`}
                        {activeAddress.buildingName && ` ${activeAddress.buildingName},`}
                        {` ${activeAddress.street}, ${activeAddress.area}, ${activeAddress.city}, ${activeAddress.state} - ${activeAddress.postalCode}`}
                      </span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-neutral-455 hover:text-black font-extrabold underline bg-transparent border-none cursor-pointer uppercase text-[8px] tracking-widest">
                      Change
                    </button>
                  </div>
                </section>

                {/* Shipping Method selections */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black tracking-widest text-neutral-400 uppercase pb-2 border-b border-neutral-200">
                    03. DELIVERY METHOD
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`border p-5 flex justify-between items-center cursor-pointer transition-all rounded-none ${
                        shippingMethod === "standard"
                          ? "border-black bg-[#FAF8F5]/30 ring-1 ring-black/10"
                          : "border-neutral-200 bg-white hover:border-black/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="accent-black h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-black tracking-wide uppercase">Standard Delivery</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">3-5 Working Days</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-black">
                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </label>

                    <label
                      className={`border p-5 flex justify-between items-center cursor-pointer transition-all rounded-none ${
                        shippingMethod === "express"
                          ? "border-black bg-[#FAF8F5]/30 ring-1 ring-black/10"
                          : "border-neutral-200 bg-white hover:border-black/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="accent-black h-4 w-4"
                        />
                        <div>
                          <p className="text-xs font-black tracking-wide uppercase">Express Shipping</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">Next Working Day</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-black">₹150.00</span>
                    </label>
                  </div>
                </section>

                <div className="flex flex-col md:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full md:w-1/3 border border-neutral-300 hover:bg-neutral-50 text-neutral-600 py-3.5 text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 rounded-none"
                  >
                    ← Back to Info
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="w-full md:w-2/3 bg-black hover:bg-neutral-800 text-white py-3.5 text-xs font-bold tracking-[0.2em] transition-colors uppercase border border-black rounded-none"
                  >
                    Continue to Payment →
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: PAYMENT / REVIEW */}
            {step === 3 && activeAddress && (
              <div className="bg-white border border-neutral-200/80 p-8 rounded-none space-y-8">
                
                {/* Summary details */}
                <section className="border border-neutral-250 p-4 divide-y divide-neutral-200 text-[10px] font-bold tracking-wider text-neutral-600 uppercase rounded-none">
                  <div className="pb-3 flex justify-between items-start gap-4">
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-neutral-455 font-extrabold uppercase">Contact</span>
                      <span className="text-neutral-855 font-bold truncate">{email} | {phone}</span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-neutral-400 hover:text-black font-extrabold underline bg-transparent border-none cursor-pointer uppercase text-[8px] tracking-widest">
                      Change
                    </button>
                  </div>
                  <div className="py-3 flex justify-between items-start gap-4">
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-neutral-455 font-extrabold uppercase">Ship to</span>
                      <span className="text-neutral-855 truncate leading-tight font-bold">
                        {activeAddress.firstName} {activeAddress.lastName}, 
                        {activeAddress.buildingNo && ` ${activeAddress.buildingNo},`}
                        {activeAddress.buildingName && ` ${activeAddress.buildingName},`}
                        {` ${activeAddress.street}, ${activeAddress.area}, ${activeAddress.city}, ${activeAddress.state} - ${activeAddress.postalCode}`}
                      </span>
                    </div>
                    <button onClick={() => setStep(1)} className="text-neutral-400 hover:text-black font-extrabold underline bg-transparent border-none cursor-pointer uppercase text-[8px] tracking-widest">
                      Change
                    </button>
                  </div>
                  <div className="pt-3 flex justify-between items-start gap-4">
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <span className="text-neutral-455 font-extrabold uppercase">Method</span>
                      <span className="text-neutral-855 font-bold uppercase">
                        {shippingMethod === "express" ? "Express Shipping (₹150.00)" : "Standard Delivery (FREE)"}
                      </span>
                    </div>
                    <button onClick={() => setStep(2)} className="text-neutral-455 hover:text-black font-extrabold underline bg-transparent border-none cursor-pointer uppercase text-[8px] tracking-widest">
                      Change
                    </button>
                  </div>
                </section>

                {/* Cash on Delivery Details */}
                <section className="space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-neutral-400 uppercase pb-2 border-b border-neutral-200">
                    04. PAYMENT METHOD
                  </h3>
                  <div className="p-6 bg-[#FAF8F5]/30 border border-neutral-250 flex items-start gap-3 rounded-none">
                    <div className="h-4 w-4 rounded-none border border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 bg-black rounded-none" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-wider uppercase text-neutral-900">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1.5 leading-relaxed font-bold">
                        Pay with cash upon delivery. Please ensure you have the exact change of <span className="font-extrabold text-neutral-850">₹{total.toFixed(2)}</span> ready when your courier arrives.
                      </p>
                    </div>
                  </div>
                </section>

                <form onSubmit={handleSubmitOrder} className="flex flex-col md:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full md:w-1/3 border border-neutral-300 hover:bg-neutral-50 text-neutral-605 py-3.5 text-xs font-extrabold tracking-wider uppercase rounded-none"
                  >
                    ← Back to Delivery
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-2/3 bg-black hover:bg-neutral-800 text-white py-3.5 text-xs font-bold tracking-[0.2em] transition-colors uppercase border border-black rounded-none"
                  >
                    Confirm & Place Order (₹{total.toFixed(2)})
                  </button>
                </form>

              </div>
            )}

          </div>

          {/* Right Column - Order Items summary */}
          <div className="lg:col-span-4 bg-white border border-neutral-200/80 p-6 rounded-none space-y-6 sticky top-24">
            <h2 className="text-xs font-extrabold tracking-[0.2em] pb-3 border-b border-neutral-200/60 uppercase">
              YOUR ORDER
            </h2>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-neutral-100">
              {cartItems.map((item, idx) => (
                <div key={item.id + "-" + idx} className="flex gap-4 items-center pt-3 first:pt-0">
                  <div className="w-14 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-extrabold tracking-wider text-[#b2533e] uppercase">{item.brand}</span>
                    <h4 className="text-[11px] font-extrabold text-neutral-900 truncate uppercase mt-0.5 leading-tight">{item.name}</h4>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                      Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-950">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 pt-5 border-t border-neutral-200/80 text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-neutral-950">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : "FREE"}</span>
              </div>
              <div className="border-t border-neutral-150 pt-3 flex justify-between text-xs font-extrabold text-neutral-950">
                <span>Total</span>
                <span className="text-sm font-extrabold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-neutral-50/50 p-4 border border-neutral-200/50 flex gap-3 text-[9px] font-bold text-neutral-500 uppercase tracking-wide leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-neutral-600 flex-shrink-0 stroke-[1.5]" />
              <div>
                <h5 className="font-black text-neutral-800 text-[10px] tracking-widest mb-0.5">SECURE CHECKOUT</h5>
                <p>Your credentials and private data are encrypted under TLS standards during processing.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
