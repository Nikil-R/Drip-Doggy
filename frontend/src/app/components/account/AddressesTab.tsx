import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, BadgeCheck } from "lucide-react";
import type { AddressItem } from "../../types/account";
import { addressApi } from "../../lib/address-api";

interface AddressesTabProps {
  addresses: AddressItem[];
  setAddresses: React.Dispatch<React.SetStateAction<AddressItem[]>>;
  profile: { firstName: string; lastName: string; phone: string };
}

export function AddressesTab({ addresses, setAddresses, profile }: AddressesTabProps) {
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "HOME", otherName: "", firstName: "", lastName: "",
    buildingNo: "", buildingName: "", street: "", area: "",
    city: "", state: "", postalCode: "", phone: "", isDefault: false,
  });

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: "HOME", otherName: "", firstName: profile.firstName, lastName: profile.lastName,
      buildingNo: "", buildingName: "", street: "", area: "", city: "", state: "",
      postalCode: "", phone: profile.phone, isDefault: addresses.length === 0,
    });
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    const isStandardType = addr.type === "HOME" || addr.type === "OFFICE";
    setAddressForm({
      type: isStandardType ? addr.type : "OTHER",
      otherName: isStandardType ? "" : addr.type,
      firstName: addr.firstName, lastName: addr.lastName,
      buildingNo: addr.buildingNo, buildingName: addr.buildingName,
      street: addr.street, area: addr.area, city: addr.city,
      state: addr.state, postalCode: addr.postalCode,
      phone: addr.phone, isDefault: addr.isDefault,
    });
    setIsAddressFormOpen(true);
  };

  const handleSetDefault = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addressApi.setDefaultAddress(id);
      const list = await addressApi.getAddresses();
      setAddresses(list);
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const confirmDeleteAddress = async () => {
    if (addressToDelete !== null) {
      try {
        await addressApi.deleteAddress(addressToDelete);
        const list = await addressApi.getAddresses();
        setAddresses(list);
      } catch (err) {
        console.error("Error deleting address:", err);
      } finally {
        setAddressToDelete(null);
      }
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = addressForm.type === "OTHER"
      ? (addressForm.otherName.trim() || "OTHER").toUpperCase()
      : addressForm.type;

    const requestPayload = {
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
      isDefault: addressForm.isDefault,
    };

    try {
      if (editingAddressId !== null) {
        await addressApi.updateAddress(editingAddressId, requestPayload);
      } else {
        await addressApi.createAddress(requestPayload);
      }
      const list = await addressApi.getAddresses();
      setAddresses(list);
    } catch (err) {
      console.error("Error saving address:", err);
    }

    setIsAddressFormOpen(false);
    setEditingAddressId(null);
  };

  return (
    <div className="bg-white border-none p-0">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
          <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Addresses</h1>
        </div>
        {!isAddressFormOpen && (
          <button onClick={handleOpenAddAddress}
            className="flex items-center gap-1.5 bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-widest uppercase transition-all border-none cursor-pointer">
            <Plus className="h-3 w-3 stroke-[1.5]" /> Add New
          </button>
        )}
      </div>

      {isAddressFormOpen ? (
        <form onSubmit={handleSaveAddress} className="bg-white border border-neutral-200 p-6 space-y-5 mb-8">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-[#030213] uppercase">
              {editingAddressId ? "Edit Address" : "New Address"}
            </h4>
            <span className="text-[8px] text-neutral-400 font-medium">Fulfilment details</span>
          </div>

          <div>
            <label className="block text-[7px] font-black tracking-[0.2em] mb-2 text-neutral-400 uppercase">Location Type</label>
            <div className="flex gap-2">
              {["HOME", "OFFICE", "OTHER"].map((t) => (
                <button key={t} type="button" onClick={() => setAddressForm({ ...addressForm, type: t })}
                  className={`flex-1 py-2.5 text-[9px] font-extrabold tracking-[0.2em] uppercase border transition-colors ${
                    addressForm.type === t
                      ? "bg-[#030213] text-white border-[#030213]"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          {addressForm.type === "OTHER" && (
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Location Name</label>
              <input type="text" required placeholder="e.g. Studio, Warehouse" value={addressForm.otherName}
                onChange={(e) => setAddressForm({ ...addressForm, otherName: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">First Name</label>
              <input type="text" required placeholder="First Name" value={addressForm.firstName}
                onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Last Name</label>
              <input type="text" required placeholder="Last Name" value={addressForm.lastName}
                onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building No.</label>
              <input type="text" required placeholder="Building No." value={addressForm.buildingNo}
                onChange={(e) => setAddressForm({ ...addressForm, buildingNo: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building Name</label>
              <input type="text" required placeholder="Building Name" value={addressForm.buildingName}
                onChange={(e) => setAddressForm({ ...addressForm, buildingName: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
          </div>

          <div>
            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Street / Locality</label>
            <input type="text" required placeholder="Street name & locality" value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
          </div>

          <div>
            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Area / Locality</label>
            <input type="text" required placeholder="Area" value={addressForm.area}
              onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">City</label>
              <input type="text" required placeholder="City" value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">State</label>
              <input type="text" required placeholder="State" value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
            <div>
              <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Pincode</label>
              <input type="text" required placeholder="Pincode" value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
            </div>
          </div>

          <div>
            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Phone Number</label>
            <input type="tel" required placeholder="Phone number" value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="makeDefaultProfile" checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="accent-[#030213]" />
            <label htmlFor="makeDefaultProfile" className="text-[8px] font-extrabold text-neutral-500 uppercase cursor-pointer tracking-wider">
              Make this my default shipping address
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors">
              {editingAddressId ? "Save Changes" : "Add Address"}
            </button>
            <button type="button" onClick={() => { setIsAddressFormOpen(false); setEditingAddressId(null); }}
              className="bg-transparent text-neutral-500 hover:text-[#030213] text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => {
            const typeIcon = addr.type === "HOME"
              ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              : addr.type === "OFFICE"
              ? "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              : "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z";
            return (
              <div key={addr.id} className="border border-neutral-200 p-6 hover:border-[#030213]/40 transition-all duration-200 group relative">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-3.5 w-3.5 text-[#b2533e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={typeIcon} />
                  </svg>
                  <span className="text-[8px] font-black tracking-[0.2em] text-[#b2533e] uppercase">{addr.type}</span>
                  {addr.isDefault && (
                    <span className="flex items-center gap-0.5 text-[7px] font-black tracking-widest uppercase text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 ml-1">
                      <BadgeCheck className="h-2.5 w-2.5 stroke-[1.5]" /> Default
                    </span>
                  )}
                </div>
                <div className="text-[11px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                  <p className="font-extrabold text-[#030213] text-[13px] mb-1.5">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.buildingNo && `${addr.buildingNo}, `}{addr.buildingName && `${addr.buildingName}, `}{addr.street}</p>
                  <p>{addr.area && `${addr.area}, `}{addr.city}, {addr.state} — {addr.postalCode}</p>
                  <p className="text-[8px] font-extrabold text-[#b2533e] mt-2 tracking-widest">PH: {addr.phone}</p>
                </div>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-neutral-100">
                  <button onClick={(e) => handleOpenEditAddress(addr, e)}
                    className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest uppercase text-neutral-500 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
                    <Edit2 className="h-3 w-3 stroke-[1.5]" /> Edit
                  </button>
                  <span className="text-neutral-200">|</span>
                  <button onClick={(e) => { e.stopPropagation(); setAddressToDelete(addr.id); }}
                    className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer">
                    <Trash2 className="h-3 w-3 stroke-[1.5]" /> Remove
                  </button>
                  {!addr.isDefault && (
                    <>
                      <span className="text-neutral-200">|</span>
                      <button onClick={(e) => handleSetDefault(addr.id, e)}
                        className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest uppercase text-green-600 hover:text-green-800 transition-colors bg-transparent border-none cursor-pointer">
                        Set as Default
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {addressToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-xs font-black tracking-[0.2em] text-[#030213] uppercase mb-2">Delete Address?</h3>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider leading-relaxed mb-6">
              Are you sure you want to delete this address permanently? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmDeleteAddress}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-extrabold tracking-widest py-2.5 uppercase border-none cursor-pointer transition-colors">
                Delete
              </button>
              <button onClick={() => setAddressToDelete(null)}
                className="flex-1 bg-transparent text-neutral-500 hover:text-[#030213] text-[9px] font-extrabold tracking-widest py-2.5 uppercase border border-neutral-200 cursor-pointer transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
