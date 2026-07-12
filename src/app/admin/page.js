"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../utils/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Inventory");
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [essentials, setEssentials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Puppy modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "", breed: "English Bulldog", gender: "Male", age: "8 weeks", price: "", lineage: "", status: "AVAILABLE", image: "", document_name: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  
  // Essentials modal state
  const [isEssentialModalOpen, setIsEssentialModalOpen] = useState(false);
  const [editingEssentialId, setEditingEssentialId] = useState(null);
  const [newEssential, setNewEssential] = useState({ name: "", price: "", image: "" });
  const [essentialImageFile, setEssentialImageFile] = useState(null);
  const [isUploadingEssential, setIsUploadingEssential] = useState(false);

  // Inline price editor states
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");
  const [editingEssentialPriceId, setEditingEssentialPriceId] = useState(null);
  const [editingEssentialPriceValue, setEditingEssentialPriceValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Pets
    const { data: petsData, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (petsError) {
      console.error("Error fetching pets:", petsError);
    } else {
      setPets(petsData || []);
    }

    // Fetch Orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*, pets(name, breed)')
      .order('created_at', { ascending: false });
      
    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    } else {
      setOrders(ordersData || []);
    }

    // Fetch Essentials
    const { data: essentialsData, error: essentialsError } = await supabase
      .from('essentials')
      .select('*')
      .order('created_at', { ascending: false });

    if (essentialsError) {
      console.error("Error fetching essentials:", essentialsError);
    } else {
      setEssentials(essentialsData || []);
    }
    
    setLoading(false);
  };

  const handleDeletePet = async (id) => {
    if (confirm("Are you sure you want to delete this puppy?")) {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) {
        alert("Error deleting: " + error.message);
      } else {
        fetchData();
      }
    }
  };

  // Inline price save handler
  const handleInlinePriceSave = async (petId) => {
    if (!editingPriceValue || isNaN(parseFloat(editingPriceValue))) {
      setEditingPriceId(null);
      return;
    }
    const { error } = await supabase.from('pets').update({ price: parseFloat(editingPriceValue) }).eq('id', petId);
    if (error) {
      alert("Error updating price: " + error.message);
    } else {
      fetchData();
    }
    setEditingPriceId(null);
    setEditingPriceValue("");
  };

  // Essentials management handlers
  const handleInlineEssentialPriceSave = async (essentialId) => {
    if (!editingEssentialPriceValue || isNaN(parseFloat(editingEssentialPriceValue))) {
      setEditingEssentialPriceId(null);
      return;
    }
    const { error } = await supabase.from('essentials').update({ price: parseFloat(editingEssentialPriceValue) }).eq('id', essentialId);
    if (error) {
      alert("Error updating price: " + error.message);
    } else {
      fetchData();
    }
    setEditingEssentialPriceId(null);
    setEditingEssentialPriceValue("");
  };

  const handleDeleteEssential = async (id) => {
    if (confirm("Are you sure you want to delete this essential item?")) {
      const { error } = await supabase.from('essentials').delete().eq('id', id);
      if (error) {
        alert("Error deleting essential: " + error.message);
      } else {
        fetchData();
      }
    }
  };

  const openEditEssentialModal = (essential) => {
    setEditingEssentialId(essential.id);
    setNewEssential({
      name: essential.name,
      price: essential.price,
      image: essential.image || ""
    });
    setEssentialImageFile(null);
    setIsEssentialModalOpen(true);
  };

  const openAddEssentialModal = () => {
    setEditingEssentialId(null);
    setNewEssential({ name: "", price: "", image: "" });
    setEssentialImageFile(null);
    setIsEssentialModalOpen(true);
  };

  const handleSaveEssential = async (e) => {
    e.preventDefault();
    setIsUploadingEssential(true);
    let imageUrl = newEssential.image;

    try {
      if (essentialImageFile) {
        const fileExt = essentialImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('pet-images').upload(`essentials/${fileName}`, essentialImageFile);
        if (uploadError) throw new Error("Image Upload Error: " + uploadError.message);
        const { data } = supabase.storage.from('pet-images').getPublicUrl(`essentials/${fileName}`);
        imageUrl = data.publicUrl;
      }

      const essentialData = { ...newEssential, image: imageUrl };

      if (editingEssentialId) {
        const { error } = await supabase.from('essentials').update(essentialData).eq('id', editingEssentialId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('essentials').insert([essentialData]);
        if (error) throw error;
      }

      setIsEssentialModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Error saving essential item: " + error.message);
    } finally {
      setIsUploadingEssential(false);
    }
  };

  const openEditModal = (pet) => {
    setEditingId(pet.id);
    setNewPet({
      name: pet.name, breed: pet.breed, gender: pet.gender, age: pet.age, price: pet.price, lineage: pet.lineage || "", status: pet.status, image: pet.image || "", document_name: pet.document_name || ""
    });
    setImageFile(null);
    setDocFile(null);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewPet({ name: "", breed: "", gender: "Male", age: "8 weeks", price: "", lineage: "", status: "AVAILABLE", image: "", document_name: "" });
    setImageFile(null);
    setDocFile(null);
    setIsModalOpen(true);
  };

  const handleSavePet = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = newPet.image;
    let docUrl = newPet.document_name;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('pet-images').upload(`images/${fileName}`, imageFile);
        if (uploadError) throw new Error("Image Upload Error: " + uploadError.message);
        const { data } = supabase.storage.from('pet-images').getPublicUrl(`images/${fileName}`);
        imageUrl = data.publicUrl;
      }

      if (docFile) {
        const fileExt = docFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('pet-images').upload(`docs/${fileName}`, docFile);
        if (uploadError) throw new Error("Document Upload Error: " + uploadError.message);
        docUrl = docFile.name;
      }

      const petData = { ...newPet, image: imageUrl, document_name: docUrl };

      if (editingId) {
        const { error } = await supabase.from('pets').update(petData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pets').insert([petData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Error saving pet: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername === "admin" && loginPassword === "MarkNelson2578#") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center font-sans px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold text-[#1f2937] mb-2">Heirloom Admin</h1>
            <p className="text-gray-500 font-light text-sm">Please log in to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                value={loginUsername} 
                onChange={(e) => setLoginUsername(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4a6659] focus:border-transparent outline-none transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4a6659] focus:border-transparent outline-none transition-all" 
                required 
              />
            </div>
            <button type="submit" className="w-full py-4 bg-[#4a6659] hover:bg-[#3d4b43] text-white rounded-lg font-medium tracking-wide transition-colors shadow-md">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-12">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-medium text-gray-800 tracking-wide uppercase">Heirloom Pets</h1>
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Admin</span>
          </div>
          
          <nav className="flex space-x-8 text-sm font-medium">
            {["Dashboard", "Inventory", "Essentials", "Orders", "Analytics"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 transition-colors ${
                  activeTab === tab 
                    ? "border-[#4a6659] text-[#4a6659]" 
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#4a6659] text-white flex items-center justify-center font-bold text-sm">
              MB
            </div>
            <span className="text-sm font-semibold text-gray-800">Master Breeder</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-[1400px] mx-auto w-full">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a6659]"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "Dashboard" && (
              <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-playfair font-semibold mb-4">Welcome to Heirloom Pets Admin</h2>
                <p className="text-gray-500">Here is a quick overview of your platform.</p>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">Available Pets</p>
                    <p className="text-4xl font-semibold text-gray-900">{pets.filter(p => p.status === 'AVAILABLE').length}</p>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-2">Reserved Pets</p>
                    <p className="text-4xl font-semibold text-gray-900">{pets.filter(p => p.status === 'RESERVED').length}</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">Active Orders</p>
                    <p className="text-4xl font-semibold text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Section */}
            {activeTab === "Inventory" && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
                <button 
                  onClick={openAddModal}
                  className="bg-[#4a6659] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3d4b43] transition-colors"
                >
                  + Add New Puppy
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {pets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No puppies found. Add one to get started.</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {pets.map((pet) => (
                      <li key={pet.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-6 w-1/3">
                          {/* COMMAND 3: Bigger thumbnail showing real uploaded image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {pet.image ? (
                              <img src={pet.image} alt={pet.name} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{pet.name}</h3>
                            <p className="text-xs text-[#4a6659] font-medium">{pet.age || "8 weeks"}</p>
                            <p className="text-[10px] text-gray-400 font-mono">ID: {pet.id.substring(0,8).toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="w-1/4">
                          <p className="text-sm font-medium text-gray-800">{pet.breed || "English Bulldog"}</p>
                          <p className="text-xs text-gray-500">{pet.lineage || "Standard Lineage"}</p>
                        </div>

                        <div className="w-32">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            pet.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {pet.status}
                          </span>
                        </div>

                        {/* COMMAND 1: Inline price editor — click price to edit it directly */}
                        <div className="w-32">
                          {editingPriceId === pet.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                autoFocus
                                value={editingPriceValue}
                                onChange={e => setEditingPriceValue(e.target.value)}
                                onBlur={() => handleInlinePriceSave(pet.id)}
                                onKeyDown={e => e.key === 'Enter' && handleInlinePriceSave(pet.id)}
                                className="w-20 border border-[#4a6659] rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingPriceId(pet.id); setEditingPriceValue(pet.price); }}
                              title="Click to edit price"
                              className="flex items-center gap-1 group"
                            >
                              <span className="font-semibold text-gray-800">${parseFloat(pet.price).toLocaleString()}</span>
                              <svg className="w-3 h-3 text-gray-400 group-hover:text-[#4a6659] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                          )}
                        </div>

                        <div className="w-48 flex items-center text-sm text-gray-500 space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          <span>{pet.document_name || "No Document"}</span>
                        </div>

                        <div className="flex space-x-4">
                          <button onClick={() => openEditModal(pet)} className="text-gray-400 hover:text-gray-800 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => handleDeletePet(pet.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              </section>
            )}

            {/* Essentials Section */}
            {activeTab === "Essentials" && (
              <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Essentials Management</h2>
                  <button 
                    onClick={openAddEssentialModal}
                    className="bg-[#4a6659] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3d4b43] transition-colors"
                  >
                    + Add New Essential
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {essentials.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No essentials found. Add one to get started.</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {essentials.map((item) => (
                        <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-6 w-1/3">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {item.id.substring(0,8).toUpperCase()}</p>
                            </div>
                          </div>

                          <div className="w-32">
                            {editingEssentialPriceId === item.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 text-sm">$</span>
                                <input
                                  type="number"
                                  autoFocus
                                  value={editingEssentialPriceValue}
                                  onChange={e => setEditingEssentialPriceValue(e.target.value)}
                                  onBlur={() => handleInlineEssentialPriceSave(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleInlineEssentialPriceSave(item.id)}
                                  className="w-20 border border-[#4a6659] rounded px-2 py-1 text-sm font-semibold text-gray-800 focus:outline-none"
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingEssentialPriceId(item.id); setEditingEssentialPriceValue(item.price); }}
                                title="Click to edit price"
                                className="flex items-center gap-1 group"
                              >
                                <span className="font-semibold text-gray-800">${parseFloat(item.price).toLocaleString()}</span>
                                <svg className="w-3 h-3 text-gray-400 group-hover:text-[#4a6659] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                            )}
                          </div>

                          <div className="flex space-x-4">
                            <button onClick={() => openEditEssentialModal(item)} className="text-gray-400 hover:text-gray-800 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onClick={() => handleDeleteEssential(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {/* Orders Section */}
            {activeTab === "Orders" && (
              <section>
                <div className="flex items-center space-x-3 mb-6 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                <h2 className="text-xl font-semibold">Order & Logistics Tracker</h2>
                
                <div className="ml-auto flex space-x-2">
                  {['All Orders', 'Pending Balance', 'In Transit'].map(filter => (
                    <button 
                      key={filter} 
                      onClick={() => setOrderFilter(filter)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${orderFilter === filter ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fa] border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Buyer Identity</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Asset</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Balance Due</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Logistics Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.filter(o => {
                      if (orderFilter === 'Pending Balance') return o.balance > 0;
                      if (orderFilter === 'In Transit') return o.logistics_status.includes('Transit');
                      return true;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No orders currently active.</td>
                      </tr>
                    ) : (
                      orders.filter(o => {
                        if (orderFilter === 'Pending Balance') return o.balance > 0;
                        if (orderFilter === 'In Transit') return o.logistics_status.includes('Transit');
                        return true;
                      }).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{order.buyer_name}</p>
                            <p className="text-xs text-gray-500">{order.buyer_location}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">{order.pets?.name || "Unknown"} ({order.pets?.breed?.substring(0,3).toUpperCase()}-2024)</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-700">
                              <span className={`w-2 h-2 rounded-full mr-2 ${order.payment_type.includes('Deposit') ? 'bg-orange-400' : 'bg-green-500'}`}></span>
                              {order.payment_type}
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-sm font-semibold ${order.balance > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            ${parseFloat(order.balance).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 flex items-center space-x-2">
                            {order.logistics_status.includes('Transit') ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            <span>{order.logistics_status}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            )}

            {/* Analytics Tab Placeholder */}
            {activeTab === "Analytics" && (
              <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-playfair font-semibold mb-4">Analytics & Reports</h2>
                <p className="text-gray-500">Detailed insights into your sales and inventory will appear here.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f0f4f8] border-t border-gray-200 mt-auto py-12 px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Heirloom Pets</h4>
            <p className="text-sm text-gray-500 leading-relaxed">© 2024 Heirloom Pets.<br/>Uncompromising quality in every companion.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Policy & Trust</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Privacy Policy</li>
              <li>Health Guarantee</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Shipping Info</li>
              <li>Breeder Standards</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">System Status</h4>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Registry Node: Online</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-playfair font-semibold mb-6">{editingId ? "Edit Puppy" : "Add New Puppy"}</h3>
            <form onSubmit={handleSavePet} className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input required className="w-full border rounded p-2 mt-1" value={newPet.name} onChange={e=>setNewPet({...newPet, name: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Breed</label><input required className="w-full border rounded p-2 mt-1" value={newPet.breed} onChange={e=>setNewPet({...newPet, breed: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Price ($)</label><input required type="number" className="w-full border rounded p-2 mt-1" value={newPet.price} onChange={e=>setNewPet({...newPet, price: e.target.value})} /></div>
                <div><label className="text-sm font-medium">Lineage</label><input className="w-full border rounded p-2 mt-1" value={newPet.lineage} onChange={e=>setNewPet({...newPet, lineage: e.target.value})} /></div>
              </div>
              {/* Gender Selection */}
              <div>
                <label className="text-sm font-medium block mb-2">Gender *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPet({...newPet, gender: "Male"})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      newPet.gender === "Male"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-blue-300"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 9a3 3 0 1 0 6 0A3 3 0 0 0 9 9zm9-8h-4a1 1 0 0 0 0 2h1.586l-2.293 2.293A6.952 6.952 0 0 0 9 4C5.14 4 2 7.14 2 11s3.14 7 7 7 7-3.14 7-7a6.952 6.952 0 0 0-1.293-4.707L17 4h1a1 1 0 0 0 0-2z"/></svg>
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPet({...newPet, gender: "Female"})}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      newPet.gender === "Female"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-500 hover:border-pink-300"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2a7 7 0 0 0-7 7 7 7 0 0 0 5 6.71V17H8a1 1 0 0 0 0 2h1v2a1 1 0 0 0 2 0v-2h1a1 1 0 0 0 0-2h-1v-1.29A7 7 0 0 0 16 9a7 7 0 0 0-5-6.71V2a1 1 0 0 0-2 0zm5 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/></svg>
                    Female
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Age (e.g., 8 weeks)</label>
                  <input required type="text" className="w-full border rounded p-2 mt-1" value={newPet.age} onChange={e=>setNewPet({...newPet, age: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full border rounded p-2 mt-1" value={newPet.status} onChange={e=>setNewPet({...newPet, status: e.target.value})}>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <input type="file" accept="image/*" className="w-full border rounded p-2 mt-1 text-sm" onChange={e => setImageFile(e.target.files[0])} />
                {newPet.image && !imageFile && <p className="text-xs text-green-600 mt-1">Image currently uploaded.</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Upload Document (e.g. Health Cert)</label>
                <input type="file" accept=".pdf,.doc,.docx" className="w-full border rounded p-2 mt-1 text-sm" onChange={e => setDocFile(e.target.files[0])} />
                {newPet.document_name && !docFile && <p className="text-xs text-green-600 mt-1">Document currently uploaded: {newPet.document_name}</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" disabled={isUploading}>Cancel</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2 bg-[#4a6659] text-white rounded hover:bg-[#3d4b43] transition-colors disabled:opacity-50">
                  {isUploading ? "Saving..." : "Save Puppy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Essential Modal */}
      {isEssentialModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-playfair font-semibold mb-6">{editingEssentialId ? "Edit Essential Item" : "Add New Essential"}</h3>
            <form onSubmit={handleSaveEssential} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input required className="w-full border rounded p-2 mt-1" value={newEssential.name} onChange={e=>setNewEssential({...newEssential, name: e.target.value})} placeholder="e.g. Premium Puppy Food" />
              </div>
              <div>
                <label className="text-sm font-medium">Price ($)</label>
                <input required type="number" className="w-full border rounded p-2 mt-1" value={newEssential.price} onChange={e=>setNewEssential({...newEssential, price: e.target.value})} placeholder="e.g. 85" />
              </div>
              <div>
                <label className="text-sm font-medium">Upload Image</label>
                <input type="file" accept="image/*" className="w-full border rounded p-2 mt-1 text-sm" onChange={e => setEssentialImageFile(e.target.files[0])} />
                {newEssential.image && !essentialImageFile && <p className="text-xs text-green-600 mt-1">Image currently uploaded.</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsEssentialModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" disabled={isUploadingEssential}>Cancel</button>
                <button type="submit" disabled={isUploadingEssential} className="px-6 py-2 bg-[#4a6659] text-white rounded hover:bg-[#3d4b43] transition-colors disabled:opacity-50">
                  {isUploadingEssential ? "Saving..." : "Save Essential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
