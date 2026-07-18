'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Settings, AlertTriangle, ArrowLeft, Shirt, ShoppingBag, Users, Calendar, BookOpen, Clock, User, Tag, ShieldCheck, CreditCard, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CARDS from '@/utils/cards.json';

interface ProductDetail {
  id: string;
  name: string;
  price: number;
  colorName: string;
  tagline: string;
  badge?: string;
  section: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
  accent: string;
  gradient: string;
  sizes: string[];
  material: string;
  origin: string;
  washCare: string;
  testimonial: string;
  bgGradient: string;
  accentColor: string;
  story: string;
  atmosphere: string;
  fitInfo: string;
  careInfo: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  colorName: string;
}

interface Order {
  id: string;
  userId: string | null;
  items: string; // JSON string
  totalPrice: number;
  status: string;
  trackingNumber: string;
  createdAt: string;
  shippingAddress?: string | null;
  pincode?: string | null;
  paymentMethod?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  customerName?: string | null;
  user?: {
    name: string | null;
    email: string | null;
    tier: string;
  };
}

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  tier: string;
  cardNumber?: string | null;
  createdAt: string;
  _count: {
    orders: number;
    savedItems: number;
  };
}

interface JournalDetail {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  author: string;
  authorAr: string;
  date: string;
  dateAr: string;
  readTime: string;
  readTimeAr: string;
  image: string;
  category: string;
  categoryAr: string;
  tags: string[];
  tagsAr: string[];
  content: string[];
  contentAr: string[];
}

interface InventoryItem {
  id?: string;
  productId: string;
  size: string;
  colorName: string;
  stock: number;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'shirts' | 'orders' | 'members' | 'journals' | 'inventory' | 'cards'>('shirts');
  
  // Database states
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [journals, setJournals] = useState<JournalDetail[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [cardsList, setCardsList] = useState<any[]>([]);
  const [cardSummary, setCardSummary] = useState({ total: 0, assigned: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modals & UI states
  const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [editingJournal, setEditingJournal] = useState<JournalDetail | null>(null);
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Order | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  // Direct passcode auth states
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Form states (Shirts)
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formColorName, setFormColorName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formSection, setFormSection] = useState('newarrival');
  const [formDesc, setFormDesc] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formOrigin, setFormOrigin] = useState('');
  const [formWashCare, setFormWashCare] = useState('');
  const [formTestimonial, setFormTestimonial] = useState('');
  const [formStory, setFormStory] = useState('');
  const [formAtmosphere, setFormAtmosphere] = useState('');
  const [formFitInfo, setFormFitInfo] = useState('');
  const [formCareInfo, setFormCareInfo] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formImagesText, setFormImagesText] = useState('');
  const [formFeaturesText, setFormFeaturesText] = useState('');
  const [formAccent, setFormAccent] = useState('#d4af37');
  const [formGradient, setFormGradient] = useState('from-[#111111] via-[#090909] to-[#040404]');
  const [formBgGradient, setFormBgGradient] = useState('from-[#111111] to-[#080808]');
  const [formAccentColor, setFormAccentColor] = useState('rgba(180,180,180,0.5)');

  // Form states (Journals)
  const [jId, setJId] = useState('');
  const [jTitle, setJTitle] = useState('');
  const [jTitleAr, setJTitleAr] = useState('');
  const [jExcerpt, setJExcerpt] = useState('');
  const [jExcerptAr, setJExcerptAr] = useState('');
  const [jAuthor, setJAuthor] = useState('');
  const [jAuthorAr, setJAuthorAr] = useState('');
  const [jDate, setJDate] = useState('');
  const [jDateAr, setJDateAr] = useState('');
  const [jReadTime, setJReadTime] = useState('');
  const [jReadTimeAr, setJReadTimeAr] = useState('');
  const [jImage, setJImage] = useState('');
  const [jCategory, setJCategory] = useState('');
  const [jCategoryAr, setJCategoryAr] = useState('');
  const [jTagsText, setJTagsText] = useState('');
  const [jTagsArText, setJTagsArText] = useState('');
  const [jContentText, setJContentText] = useState('');
  const [jContentArText, setJContentArText] = useState('');

  // Form states (Inventory adjustments)
  const [tempStocks, setTempStocks] = useState<Record<string, number>>({});

  const isFirstLoad = React.useRef(true);

  useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "xcplllp@gmail.com";
    if (status === 'authenticated' && session?.user?.email === adminEmail) {
      fetchData();
    }
  }, [activeTab, status, session]);

  async function fetchData() {
    setLoading(true);
    setError('');
    try {
      if (isFirstLoad.current) {
        // Fetch all databases in parallel on first load to populate all tab counts immediately
        const [prodRes, ordRes, memRes, jrnRes, cardRes, invRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/admin/orders'),
          fetch('/api/admin/users'),
          fetch('/api/journals'),
          fetch('/api/admin/cards'),
          fetch('/api/inventory')
        ]);

        if (!prodRes.ok || !ordRes.ok || !memRes.ok || !jrnRes.ok || !cardRes.ok || !invRes.ok) {
          setError('Unauthorized or failed to fetch administrative data.');
          setLoading(false);
          return;
        }

        const [prodData, ordData, memData, jrnData, cardData, invData] = await Promise.all([
          prodRes.json(),
          ordRes.json(),
          memRes.json(),
          jrnRes.json(),
          cardRes.json(),
          invRes.json()
        ]);

        setProducts(prodData);
        setOrders(ordData);
        setMembers(memData);
        setJournals(jrnData);
        setCardsList(cardData.cards);
        setCardSummary(cardData.summary);
        setInventoryList(invData);

        // Map values into tempStocks for editing
        const stocksMap: Record<string, number> = {};
        prodData.forEach((p: ProductDetail) => {
          const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['38', '39', '40', '41', '42', '43', '44'];
          sizes.forEach((s) => {
            const key = `${p.id}-${s}-${p.colorName}`;
            const existing = invData.find((item: any) => item.productId === p.id && item.size === s && item.colorName === p.colorName);
            stocksMap[key] = existing ? existing.stock : 3; // default stock level is 3
          });
        });
        setTempStocks(stocksMap);

        isFirstLoad.current = false;
      } else {
        // Subsequent switch: only fetch active tab's data
        if (activeTab === 'shirts') {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = await res.json();
            setProducts(data);
          }
        } else if (activeTab === 'orders') {
          const res = await fetch('/api/admin/orders');
          if (res.ok) {
            const data = await res.json();
            setOrders(data);
          }
        } else if (activeTab === 'members') {
          const res = await fetch('/api/admin/users');
          if (res.ok) {
            const data = await res.json();
            setMembers(data);
          }
        } else if (activeTab === 'journals') {
          const res = await fetch('/api/journals');
          if (res.ok) {
            const data = await res.json();
            setJournals(data);
          }
        } else if (activeTab === 'inventory') {
          // Fetch products first so we know what should exist
          const prodRes = await fetch('/api/products');
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            setProducts(prodData);

            // Fetch inventory entries
            const invRes = await fetch('/api/inventory');
            if (invRes.ok) {
              const invData = await invRes.json();
              setInventoryList(invData);

              // Map values into tempStocks for editing
              const stocksMap: Record<string, number> = {};
              prodData.forEach((p: ProductDetail) => {
                const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['38', '39', '40', '41', '42', '43', '44'];
                sizes.forEach((s) => {
                  const key = `${p.id}-${s}-${p.colorName}`;
                  const existing = invData.find((item: any) => item.productId === p.id && item.size === s && item.colorName === p.colorName);
                  stocksMap[key] = existing ? existing.stock : 3; // default stock level is 3
                });
              });
              setTempStocks(stocksMap);
            }
          }
        } else if (activeTab === 'cards') {
          const res = await fetch('/api/admin/cards');
          if (res.ok) {
            const data = await res.json();
            setCardsList(data.cards);
            setCardSummary(data.summary);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch records from SQLite database.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (editingProduct || isAdding || editingJournal || isAddingJournal) {
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [editingProduct, isAdding, editingJournal, isAddingJournal]);

  // Image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'primary' | 'rack' | 'journal') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.path) {
        if (target === 'primary') {
          setFormImage(data.path);
        } else if (target === 'rack') {
          setFormImagesText((prev) => (prev ? `${prev}, ${data.path}` : data.path));
        } else if (target === 'journal') {
          setJImage(data.path);
        }
      } else {
        setError(`Upload failed: ${data.error || 'unknown'}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload image to public assets.');
    } finally {
      setUploading(false);
    }
  };

  // 1. Shirts Handlers
  const openEdit = (p: ProductDetail) => {
    setEditingProduct(p);
    setIsAdding(false);
    setError('');
    
    // Set form fields
    setFormId(p.id);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormColorName(p.colorName);
    setFormTagline(p.tagline);
    setFormBadge(p.badge || '');
    setFormSection(p.section || 'newarrival');
    setFormDesc(p.description);
    setFormMaterial(p.material);
    setFormOrigin(p.origin);
    setFormWashCare(p.washCare);
    setFormTestimonial(p.testimonial);
    setFormStory(p.story);
    setFormAtmosphere(p.atmosphere);
    setFormFitInfo(p.fitInfo);
    setFormCareInfo(p.careInfo);
    setFormImage(p.image);
    setFormImagesText(p.images.join(', '));
    setFormFeaturesText(p.features.join(', '));
    setFormAccent(p.accent);
    setFormGradient(p.gradient);
    setFormBgGradient(p.bgGradient);
    setFormAccentColor(p.accentColor);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setIsAdding(true);
    setError('');
    
    // Clear form
    setFormId('');
    setFormName('');
    setFormPrice(195);
    setFormColorName('');
    setFormTagline('');
    setFormBadge('New Arrival');
    setFormSection('newarrival');
    setFormDesc('');
    setFormMaterial('');
    setFormOrigin('');
    setFormWashCare('');
    setFormTestimonial('');
    setFormStory('');
    setFormAtmosphere('');
    setFormFitInfo('');
    setFormCareInfo('');
    setFormImage('/assets/shirt_white.png');
    setFormImagesText('/assets/shirt_white.png');
    setFormFeaturesText('Premium Cotton, Mitered Cuffs, French Seams');
    setFormAccent('#d4af37');
    setFormGradient('from-[#171310] via-[#0b0a08] to-[#040404]');
    setFormBgGradient('from-[#1a1a18] to-[#0d0d0d]');
    setFormAccentColor('rgba(255,255,240,0.6)');
  };

  const saveProducts = async (updatedList: ProductDetail[]) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
      if (res.ok) {
        setProducts(updatedList);
        setSuccess('Product database successfully updated on disk!');
        setEditingProduct(null);
        setIsAdding(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Server error writing database file.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to persist database to file system.');
    }
  };

  const handleShirtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName || !formPrice) {
      setError('Please fill in all core fields (ID, Name, Price).');
      return;
    }

    const parsedImages = formImagesText.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedFeatures = formFeaturesText.split(',').map((s) => s.trim()).filter(Boolean);

    const targetProduct: ProductDetail = {
      id: formId.toLowerCase().replace(/\s+/g, '-'),
      name: formName,
      price: Number(formPrice),
      colorName: formColorName || 'Custom Color',
      tagline: formTagline || 'Refined Tailoring.',
      badge: formBadge || undefined,
      section: formSection,
      rating: editingProduct?.rating || 5.0,
      reviews: editingProduct?.reviews || 1,
      description: formDesc || 'Bespoke custom formal shirt.',
      features: parsedFeatures.length ? parsedFeatures : ['Giza Cotton', 'Bespoke Cuffs'],
      image: formImage || '/assets/shirt_white.png',
      images: parsedImages.length ? parsedImages : [formImage || '/assets/shirt_white.png'],
      accent: formAccent,
      gradient: formGradient,
      sizes: ['38', '39', '40', '41', '42', '43', '44'],
      material: formMaterial || 'Premium Cotton',
      origin: formOrigin || 'Milan, Italy',
      washCare: formWashCare || 'Dry clean only.',
      testimonial: formTestimonial || '"Pure luxury."',
      bgGradient: formBgGradient,
      accentColor: formAccentColor,
      story: formStory || formDesc,
      atmosphere: formAtmosphere || 'Warm ambient light.',
      fitInfo: formFitInfo || 'Tailored custom fit.',
      careInfo: formCareInfo || formWashCare || 'Dry clean only.',
    };

    let updatedList: ProductDetail[] = [];
    if (isAdding) {
      if (products.some((p) => p.id === targetProduct.id)) {
        setError(`A product with ID "${targetProduct.id}" already exists.`);
        return;
      }
      updatedList = [...products, targetProduct];
    } else {
      updatedList = products.map((p) => (p.id === editingProduct?.id ? targetProduct : p));
    }

    saveProducts(updatedList);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm(`Are you sure you want to permanently delete shirt "${id}"?`)) {
      const updatedList = products.filter((p) => p.id !== id);
      saveProducts(updatedList);
    }
  };

  // 2. Orders Handlers
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setSuccess('Order status updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorText = await res.text();
        setError(errorText || 'Failed to update status.');
        setTimeout(() => setError(''), 5000);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to update order status.');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Delete this order request permanently from SQLite?')) {
      try {
        const res = await fetch(`/api/admin/orders?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setOrders(orders.filter(o => o.id !== id));
          setSuccess('Order deleted.');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to delete order.');
      }
    }
  };

  // 3. Members Handlers
  const handleUpdateMemberTier = async (id: string, newTier: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, tier: newTier })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setMembers(members.map(m => m.id === id ? { ...m, tier: updatedUser.tier, cardNumber: updatedUser.cardNumber } : m));
        setSuccess('Member tier updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to update member tier.');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Delete this member from database permanently? This deletes all their orders and wishlist items too.')) {
      try {
        const res = await fetch(`/api/admin/users?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setMembers(members.filter(m => m.id !== id));
          setSuccess('Member deleted.');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to delete user.');
      }
    }
  };

  // 4. Journals Handlers
  const openEditJournal = (j: JournalDetail) => {
    setEditingJournal(j);
    setIsAddingJournal(false);
    setError('');

    setJId(j.id);
    setJTitle(j.title);
    setJTitleAr(j.titleAr);
    setJExcerpt(j.excerpt);
    setJExcerptAr(j.excerptAr);
    setJAuthor(j.author);
    setJAuthorAr(j.authorAr);
    setJDate(j.date);
    setJDateAr(j.dateAr);
    setJReadTime(j.readTime);
    setJReadTimeAr(j.readTimeAr);
    setJImage(j.image);
    setJCategory(j.category);
    setJCategoryAr(j.categoryAr);
    setJTagsText(j.tags.join(', '));
    setJTagsArText(j.tagsAr.join(', '));
    setJContentText(j.content.join('\n\n'));
    setJContentArText(j.contentAr.join('\n\n'));
  };

  const openAddJournal = () => {
    setEditingJournal(null);
    setIsAddingJournal(true);
    setError('');

    setJId('');
    setJTitle('');
    setJTitleAr('');
    setJExcerpt('');
    setJExcerptAr('');
    setJAuthor('Atelier Editorial');
    setJAuthorAr('كتابة الأتيليه');
    setJDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setJDateAr('٢٠٢٦');
    setJReadTime('5 min read');
    setJReadTimeAr('قراءة ٥ دقائق');
    setJImage('/assets/blog_shirtmaking.png');
    setJCategory('Sartorial Art');
    setJCategoryAr('فن الخياطة');
    setJTagsText('Tailoring, Craftsmanship');
    setJTagsArText('خياطة, حرفية');
    setJContentText('');
    setJContentArText('');
  };

  const saveJournals = async (updatedList: JournalDetail[]) => {
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
      if (res.ok) {
        setJournals(updatedList);
        setSuccess('Journal database successfully updated on disk!');
        setEditingJournal(null);
        setIsAddingJournal(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Server error writing journals file.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to persist journals to file system.');
    }
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jId || !jTitle || !jExcerpt) {
      setError('ID, Title, and Excerpt are required.');
      return;
    }

    const parsedTags = jTagsText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTagsAr = jTagsArText.split(',').map(s => s.trim()).filter(Boolean);
    const parsedContent = jContentText.split('\n\n').map(s => s.trim()).filter(Boolean);
    const parsedContentAr = jContentArText.split('\n\n').map(s => s.trim()).filter(Boolean);

    const targetJournal: JournalDetail = {
      id: jId.toLowerCase().replace(/\s+/g, '-'),
      title: jTitle,
      titleAr: jTitleAr || jTitle,
      excerpt: jExcerpt,
      excerptAr: jExcerptAr || jExcerpt,
      author: jAuthor,
      authorAr: jAuthorAr || jAuthor,
      date: jDate,
      dateAr: jDateAr || jDate,
      readTime: jReadTime,
      readTimeAr: jReadTimeAr || jReadTime,
      image: jImage || '/assets/blog_shirtmaking.png',
      category: jCategory,
      categoryAr: jCategoryAr || jCategory,
      tags: parsedTags,
      tagsAr: parsedTagsAr,
      content: parsedContent,
      contentAr: parsedContentAr
    };

    let updatedList: JournalDetail[] = [];
    if (isAddingJournal) {
      if (journals.some(j => j.id === targetJournal.id)) {
        setError(`A journal with ID "${targetJournal.id}" already exists.`);
        return;
      }
      updatedList = [...journals, targetJournal];
    } else {
      updatedList = journals.map(j => j.id === editingJournal?.id ? targetJournal : j);
    }

    saveJournals(updatedList);
  };

  const deleteJournal = (id: string) => {
    if (window.confirm(`Are you sure you want to permanently delete journal entry "${id}"?`)) {
      const updatedList = journals.filter(j => j.id !== id);
      saveJournals(updatedList);
    }
  };

  // 5. Inventory Handlers
  const handleUpdateStock = async (productId: string, size: string, colorName: string) => {
    const key = `${productId}-${size}-${colorName}`;
    const targetStock = tempStocks[key] !== undefined ? tempStocks[key] : 3;

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          size,
          colorName,
          stock: targetStock
        })
      });

      if (res.ok) {
        setSuccess(`Stock updated for ${productId} (Size ${size}) to ${targetStock}!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update stock');
      }
    } catch (err) {
      console.error(err);
      setError('Could not update inventory level.');
    }
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "xcplllp@gmail.com";

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthenticating(true);
    try {
      const res = await signIn('credentials', {
        email: adminEmail,
        password: passcode,
        redirect: false
      });
      if (res?.error) {
        setAuthError('Invalid administrative passcode.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('An error occurred during authentication.');
    } finally {
      setAuthenticating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] text-ivory flex justify-center items-center font-sans">
        <div className="w-8 h-8 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || (session?.user && session.user.email !== adminEmail)) {
    return (
      <div className="min-h-screen bg-[#050505] text-ivory flex flex-col justify-center items-center font-sans px-6">
        <div className="max-w-md w-full space-y-8 bg-[#111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="space-y-2">
            <Settings className="text-gold animate-spin-slow mx-auto" size={36} />
            <h1 className="font-serif text-2xl uppercase tracking-widest text-white">Atelier Command Center</h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.25em]">Database Administration Access</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6 pt-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] uppercase tracking-widest text-ivory/50 block pl-1">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1b1b1b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 text-center font-mono placeholder:text-white/10 tracking-widest"
                required
              />
            </div>

            {authError && (
              <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold animate-pulse">{authError}</p>
            )}

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3.5 bg-gold text-[#050505] hover:bg-white hover:text-black disabled:bg-gold/50 transition-all duration-300 font-bold text-xs uppercase tracking-widest rounded-full cursor-pointer flex items-center justify-center gap-2"
            >
              {authenticating ? 'Unlocking...' : 'Unlock Atelier'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 mx-auto text-[9px] uppercase tracking-[0.3em] text-ivory/30 hover:text-gold transition-colors duration-300 cursor-pointer"
            >
              <ArrowLeft size={10} /> Cancel & Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-ivory pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-4">
          <div className="space-y-1">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-ivory/40 hover:text-gold transition-colors duration-300 font-sans mb-3"
            >
              <ArrowLeft size={11} /> Return to Store
            </button>
            <h1 className="font-serif text-3xl md:text-4xl uppercase tracking-wider text-white flex items-center gap-3">
              <Settings className="text-gold animate-spin-slow" size={28} /> Atelier Command Center
            </h1>
            <p className="text-xs text-gold uppercase tracking-[0.25em]">Atelier Database Administration Panel</p>
          </div>

          {activeTab === 'shirts' && (
            <button
              onClick={openAdd}
              className="px-6 py-3.5 bg-gold text-[#050505] hover:bg-white hover:text-black transition-all duration-300 font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2"
            >
              <Plus size={14} /> Add New Shirt
            </button>
          )}

          {activeTab === 'journals' && (
            <button
              onClick={openAddJournal}
              className="px-6 py-3.5 bg-gold text-[#050505] hover:bg-white hover:text-black transition-all duration-300 font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-2"
            >
              <Plus size={14} /> Write Journal
            </button>
          )}
        </div>

        {/* Dynamic Sidebar / Tabs */}
        <div className="flex border-b border-white/5 pb-4 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('shirts')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'shirts' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <Shirt size={12} /> Shirt Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'inventory' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <ShieldCheck size={12} /> Stock Levels ({products.reduce((acc, p) => acc + (p.sizes?.length || 7), 0)})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'orders' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <ShoppingBag size={12} /> Bespoke Orders ({orders.length})
          </button>
           <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'members' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <Users size={12} /> Club Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'cards' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <CreditCard size={12} /> Card Registry ({CARDS.length})
          </button>
          <button
            onClick={() => setActiveTab('journals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all ${activeTab === 'journals' ? 'bg-gold text-black' : 'bg-[#121212] border border-white/5 text-ivory/60 hover:text-white'}`}
          >
            <BookOpen size={12} /> Club Journal ({journals.length})
          </button>
        </div>

        {/* Messaging banners */}
        {error && (
          <div className="p-4 bg-red-950/20 border border-red-500/25 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-sans">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-950/20 border border-green-500/25 rounded-2xl flex items-center gap-3 text-green-400 text-xs font-sans animate-pulse">
            <Save size={16} /> {success}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div>
            {/* TAB 1: SHIRTS */}
            {activeTab === 'shirts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-gold/25 transition-all duration-300 shadow-xl group">
                    <div className="space-y-4">
                      {/* Visual Thumbnail */}
                      <div className="aspect-[4/3] rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center p-6 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-b ${p.gradient} opacity-10`} />
                        <img src={p.image} alt={p.name} className="h-full object-contain mix-blend-luminosity opacity-80" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 border border-white/10 rounded-full text-[7px] uppercase tracking-widest bg-black/50 text-white/50">{p.id}</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-300">{p.name}</h3>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gold font-serif text-base font-light">${p.price}</span>
                          <span className="text-ivory/40 uppercase tracking-widest text-[9px]">{p.colorName}</span>
                        </div>
                      </div>

                      <p className="text-xs text-ivory/50 font-sans leading-relaxed line-clamp-2">{p.description}</p>
                      
                      <div className="pt-2 border-t border-white/5 flex justify-between text-[9px] uppercase tracking-widest text-ivory/30">
                        <span>Section: {p.section}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 py-3 bg-[#1e1e1e] hover:bg-gold hover:text-black rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={12} /> Edit Details
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="px-3 py-3 border border-white/5 hover:border-red-500/35 text-ivory/50 hover:text-red-400 rounded-xl transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: STOCK LEVELS (INVENTORY) */}
            {activeTab === 'inventory' && (
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 overflow-x-auto animate-fadeIn text-left">
                {products.length === 0 ? (
                  <div className="text-center py-20 text-ivory/40 text-xs uppercase tracking-widest">
                    No products exist in your catalog.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-ivory/40 uppercase tracking-widest text-[9px]">
                        <th className="pb-4">Product Info</th>
                        <th className="pb-4">Color Specifics</th>
                        <th className="pb-4">Collar Size</th>
                        <th className="pb-4">Stock Level</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((p) => {
                        const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['38', '39', '40', '41', '42', '43', '44'];
                        return sizes.map((s) => {
                          const key = `${p.id}-${s}-${p.colorName}`;
                          const currentVal = tempStocks[key] !== undefined ? tempStocks[key] : 3;

                          return (
                            <tr key={key} className="hover:bg-white/[0.01]">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 p-1 flex items-center justify-center">
                                    <img src={p.image} alt={p.name} className="h-full object-contain mix-blend-luminosity" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{p.name}</p>
                                    <p className="text-[9px] text-ivory/30 uppercase tracking-widest">ID: {p.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-ivory/60">{p.colorName}</td>
                              <td className="py-4 font-mono font-bold text-gold">{s}</td>
                              <td className="py-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={currentVal}
                                  onChange={(e) => setTempStocks({ ...tempStocks, [key]: Math.max(0, Number(e.target.value)) })}
                                  className="w-20 bg-[#1b1b1b] border border-white/5 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-gold/50 text-center font-mono"
                                />
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => handleUpdateStock(p.id, s, p.colorName)}
                                  className="px-4 py-2 bg-[#222] hover:bg-gold hover:text-black rounded-lg text-[9px] uppercase tracking-widest font-semibold transition-all duration-300"
                                >
                                  Update Stock
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 2: BESPOKE ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 overflow-x-auto animate-fadeIn">
                {orders.length === 0 ? (
                  <div className="text-center py-20 text-ivory/40 text-xs uppercase tracking-widest">
                    No orders have been submitted to SQLite yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-ivory/40 uppercase tracking-widest text-[9px]">
                        <th className="pb-4">Tracking ID</th>
                        <th className="pb-4">User Details</th>
                        <th className="pb-4">Shipping & Payment</th>
                        <th className="pb-4">Items Requested</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4">Order Status</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => {
                        const items: OrderItem[] = JSON.parse(o.items || '[]');
                        return (
                          <tr key={o.id} className="hover:bg-white/[0.01]">
                            <td className="py-5 font-mono text-gold tracking-widest">{o.trackingNumber}</td>
                            <td className="py-5 text-left">
                              {o.user ? (
                                <div>
                                  <p className="font-semibold text-white">{o.user.name}</p>
                                  <p className="text-[10px] text-ivory/40">{o.user.email}</p>
                                  <span className="text-[8px] bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5 text-white/50">{o.user.tier}</span>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-semibold text-white">{o.customerName || 'Guest'}</p>
                                  <p className="text-[10px] text-ivory/40">{o.contactEmail || 'No Email'}</p>
                                  <span className="text-[8px] bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5 text-white/50">Guest</span>
                                </div>
                              )}
                              {o.contactPhone && (
                                <p className="text-[9px] text-ivory/40 mt-1 font-sans">Tel: {o.contactPhone}</p>
                              )}
                            </td>
                            <td className="py-5 text-left max-w-xs pr-4">
                              <p className="text-white text-xs leading-relaxed">{o.shippingAddress || 'N/A'}</p>
                              {o.pincode && <p className="text-[10px] text-ivory/45 mt-0.5 font-mono">PIN: {o.pincode}</p>}
                              {o.paymentMethod && (
                                <span className="inline-block text-[8px] uppercase tracking-widest bg-gold/10 text-gold border border-gold/20 rounded px-1.5 py-0.5 mt-1 font-semibold">
                                  {o.paymentMethod}
                                </span>
                              )}
                            </td>
                            <td className="py-5 text-left">
                              <div className="space-y-1">
                                {items.map((it, idx) => (
                                  <p key={idx} className="text-ivory/80">
                                    {it.quantity}x {it.name} ({it.colorName})
                                  </p>
                                ))}
                              </div>
                            </td>
                            <td className="py-5 font-serif text-sm text-gold">${o.totalPrice}</td>
                            <td className="py-5">
                              <div className="space-y-2">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  disabled={o.status === 'Delivered' || o.status === 'Out of Stock (Cancelled)'}
                                  className={`border border-white/10 text-white rounded-lg p-2 text-xs focus:outline-none w-full disabled:opacity-50 disabled:cursor-not-allowed ${
                                    o.status === 'Out of Stock (Cancelled)' ? 'bg-red-950/20 text-red-400 border-red-500/20' : 'bg-[#1b1b1b]'
                                  }`}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Out for Delivery">Out for Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Out of Stock (Cancelled)">Out of Stock (Cancelled)</option>
                                </select>
                                <div className="flex flex-wrap gap-1">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')}
                                    disabled={o.status === 'Shipped' || o.status === 'Out for Delivery' || o.status === 'Delivered' || o.status === 'Out of Stock (Cancelled)'}
                                    className="px-2 py-0.5 border border-white/5 hover:border-gold/30 hover:bg-gold/5 rounded text-[8px] uppercase tracking-wider font-semibold disabled:opacity-20 text-ivory/60 hover:text-white transition-all cursor-pointer"
                                    title="Mark as Shipped"
                                  >
                                    Ship
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.id, 'Out for Delivery')}
                                    disabled={o.status === 'Out for Delivery' || o.status === 'Delivered' || o.status === 'Out of Stock (Cancelled)'}
                                    className="px-2 py-0.5 border border-white/5 hover:border-gold/30 hover:bg-gold/5 rounded text-[8px] uppercase tracking-wider font-semibold disabled:opacity-20 text-ivory/60 hover:text-white transition-all cursor-pointer"
                                    title="Mark Out for Delivery"
                                  >
                                    Out
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')}
                                    disabled={o.status === 'Delivered' || o.status === 'Out of Stock (Cancelled)'}
                                    className="px-2 py-0.5 border border-white/5 hover:border-gold/30 hover:bg-gold/5 rounded text-[8px] uppercase tracking-wider font-semibold disabled:opacity-20 text-ivory/60 hover:text-white transition-all cursor-pointer"
                                    title="Mark as Delivered"
                                  >
                                    Deliver
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 text-right flex gap-1.5 justify-end">
                              <button
                                onClick={() => setViewingInvoice(o)}
                                className="p-2 border border-white/5 hover:border-gold/20 text-ivory/40 hover:text-gold rounded-lg transition-colors flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                                title="View PDF Invoice"
                              >
                                <FileText size={13} /> Invoice
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(o.id)}
                                className="p-2 border border-white/5 hover:border-red-500/20 text-ivory/40 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB 3: MEMBERS */}
            {activeTab === 'members' && (
              <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 overflow-x-auto animate-fadeIn">
                {members.length === 0 ? (
                  <div className="text-center py-20 text-ivory/40 text-xs uppercase tracking-widest">
                    No members are currently registered in SQLite.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-ivory/40 uppercase tracking-widest text-[9px]">
                        <th className="pb-4">User</th>
                        <th className="pb-4">Email</th>
                        <th className="pb-4">Tier Status</th>
                        <th className="pb-4">Card Number</th>
                        <th className="pb-4">Joined Date</th>
                        <th className="pb-4">Activity Stats</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {members.map((m) => (
                        <tr key={m.id} className="hover:bg-white/[0.01]">
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold">
                                {m.name ? m.name[0].toUpperCase() : 'M'}
                              </div>
                              <span className="font-semibold text-white">{m.name || 'Anonymous Member'}</span>
                            </div>
                          </td>
                          <td className="py-5 text-ivory/60 font-mono">{m.email}</td>
                          <td className="py-5">
                            <select
                              value={m.tier}
                              onChange={(e) => handleUpdateMemberTier(m.id, e.target.value)}
                              className="bg-[#1b1b1b] border border-white/10 text-white rounded-lg p-2 text-xs focus:outline-none"
                            >
                              <option value="None">None (Unassigned)</option>
                              <option value="Silver">Silver</option>
                              <option value="Gold">Gold</option>
                            </select>
                          </td>
                          <td className="py-5">
                            {m.cardNumber ? (
                              <span className="font-mono text-gold bg-gold/5 px-2 py-1 border border-gold/15 rounded text-[10px] tracking-widest whitespace-nowrap">
                                {m.cardNumber}
                              </span>
                            ) : (
                              <span className="text-ivory/20">—</span>
                            )}
                          </td>
                          <td className="py-5 font-sans text-ivory/40 flex items-center gap-1.5">
                            <Calendar size={12} /> {new Date(m.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-5 text-ivory/50">
                            <div className="space-y-0.5">
                              <p>{m._count.orders} order requests placed</p>
                              <p>{m._count.savedItems} items wishlisted</p>
                            </div>
                          </td>
                          <td className="py-5 text-right">
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-2 border border-white/5 hover:border-red-500/20 text-ivory/40 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB: CARDS REGISTRY */}
            {activeTab === 'cards' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Metric 1 */}
                  <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-ivory/40 uppercase tracking-widest">Total Cards in Catalog</p>
                      <h4 className="text-3xl font-serif font-light text-white">{cardSummary.total}</h4>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <CreditCard size={64} className="text-white" />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gold/60 uppercase tracking-widest">Already Assigned</p>
                      <h4 className="text-3xl font-serif font-light text-gold">{cardSummary.assigned}</h4>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <Users size={64} className="text-gold" />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-green-400/60 uppercase tracking-widest">Remaining Available</p>
                      <h4 className="text-3xl font-serif font-light text-green-400">{cardSummary.left}</h4>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <ShieldCheck size={64} className="text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Cards List Table */}
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-ivory/40 uppercase tracking-widest text-[9px]">
                        <th className="pb-4">Card Number</th>
                        <th className="pb-4">Tier</th>
                        <th className="pb-4">Access PIN</th>
                        <th className="pb-4">Validity</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Assigned To</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {cardsList.map((card, i) => (
                        <tr key={i} className="hover:bg-white/[0.01]">
                          <td className="py-4 font-mono text-white text-[11px] tracking-wider font-semibold">
                            {card.cardNumber}
                          </td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 text-[8px] font-bold rounded-full border ${
                              card.tier === 'Gold' 
                                ? 'border-gold/25 bg-gold/5 text-gold' 
                                : 'border-slate-400/25 bg-slate-400/5 text-slate-300'
                            }`}>
                              {card.tier}
                            </span>
                          </td>
                          <td className="py-4 font-mono text-ivory/60">{card.pin}</td>
                          <td className="py-4 text-ivory/40 tracking-wider font-serif uppercase text-[9px]">{card.validThru}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded ${
                              card.status === 'Assigned' 
                                ? 'bg-gold/10 text-gold border border-gold/15' 
                                : 'bg-green-500/5 text-green-400 border border-green-500/10'
                            }`}>
                              {card.status}
                            </span>
                          </td>
                          <td className="py-4">
                            {card.assignedTo ? (
                              <div className="space-y-0.5">
                                <p className="font-semibold text-white">{card.assignedTo.name || 'Anonymous'}</p>
                                <p className="text-[10px] text-ivory/40 font-mono">{card.assignedTo.email}</p>
                              </div>
                            ) : (
                              <span className="text-ivory/20">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: JOURNALS */}
            {activeTab === 'journals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {journals.map((j) => (
                  <div key={j.id} className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:border-gold/25 transition-all duration-300 shadow-xl group">
                    <div className="space-y-4">
                      {/* Thumbnail */}
                      <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative">
                        <img src={j.image} alt={j.title} className="w-full h-full object-cover opacity-80" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 border border-white/10 rounded-full text-[7px] uppercase tracking-widest bg-black/50 text-white/50">{j.category}</span>
                      </div>

                      <div className="space-y-1 text-left">
                        <span className="text-[8px] uppercase tracking-widest text-gold">{j.date} · {j.readTime}</span>
                        <h3 className="font-serif text-base text-white group-hover:text-gold transition-colors duration-300 line-clamp-2">{j.title}</h3>
                        <p className="text-[10px] text-ivory/40 line-clamp-1">AR: {j.titleAr}</p>
                      </div>

                      <p className="text-xs text-ivory/50 font-sans leading-relaxed line-clamp-2">{j.excerpt}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => openEditJournal(j)}
                        className="flex-1 py-3 bg-[#1e1e1e] hover:bg-gold hover:text-black rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={12} /> Edit Entry
                      </button>
                      <button
                        onClick={() => deleteJournal(j.id)}
                        className="px-3 py-3 border border-white/5 hover:border-red-500/35 text-ivory/50 hover:text-red-400 rounded-xl transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Modal Product Edit Panel */}
        <AnimatePresence>
          {(editingProduct || isAdding) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                data-lenis-prevent
                className="bg-[#121212] border border-white/10 max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl relative scrollbar-thin text-left"
              >
                <button
                  onClick={() => { setEditingProduct(null); setIsAdding(false); }}
                  className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-ivory/60 hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  <X size={18} />
                </button>

                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                    {isAdding ? 'Register New Shirt Item' : `Edit: ${editingProduct?.name}`}
                  </h2>
                  <p className="text-[10px] text-gold uppercase tracking-widest mt-1">Configure specification details</p>
                </div>

                {uploading && (
                  <div className="p-4 bg-gold/10 border border-gold/25 rounded-2xl flex items-center gap-3 text-gold text-xs font-sans animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
                    Uploading selected image to public assets...
                  </div>
                )}

                <form onSubmit={handleShirtSubmit} className="space-y-8 text-sm">
                  {/* Section: Core Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2">1. Core Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Product ID (URL Slug)*</label>
                        <input
                          type="text"
                          disabled={!isAdding}
                          required
                          value={formId}
                          onChange={(e) => setFormId(e.target.value)}
                          placeholder="e.g., royal-blue"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 disabled:opacity-40"
                        />
                        <span className="text-[8px] text-ivory/30">Unique path in URL (lowercase, hyphens only).</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Shirt Name*</label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g., The Midnight Indigo"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Display name in the shop catalog.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Price (USD)*</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          placeholder="e.g., 195"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Retail price in US Dollars.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Color Label</label>
                        <input
                          type="text"
                          value={formColorName}
                          onChange={(e) => setFormColorName(e.target.value)}
                          placeholder="e.g., Midnight Blue"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Specific shade name.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Collection Category*</label>
                        <select
                          value={formSection}
                          onChange={(e) => setFormSection(e.target.value)}
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none"
                        >
                          <option value="bestseller">Most Loved (Bestseller)</option>
                          <option value="newarrival">Just Landed (New Arrival)</option>
                          <option value="limited">Exclusive Drop (Limited Edition)</option>
                        </select>
                        <span className="text-[8px] text-ivory/30">Where to place this shirt in the storefront.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Card Promo Badge</label>
                        <input
                          type="text"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="e.g., Rare Silk, Back in Stock"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Small overlay tag on product card.</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Shop Presentation */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2">2. Shop Presentation</h3>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Editorial Tagline</label>
                      <input
                        type="text"
                        value={formTagline}
                        onChange={(e) => setFormTagline(e.target.value)}
                        placeholder="e.g., Silent luxury. Crafted for leadership."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                      />
                      <span className="text-[8px] text-ivory/30">A short high-end statement summarizing the vibe.</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Full Description</label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Describe the shirt's build, aesthetic, drape, and story in detail..."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 resize-none font-sans"
                      />
                      <span className="text-[8px] text-ivory/30">Detailed overview shown on the main details page.</span>
                    </div>
                  </div>

                  {/* Section: Materials & Craftsmanship */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2">3. Materials &amp; Craftsmanship</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Fabric Material</label>
                        <input
                          type="text"
                          value={formMaterial}
                          onChange={(e) => setFormMaterial(e.target.value)}
                          placeholder="e.g., 100% Giza Cotton"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Specific weave / fabric blend composition.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Atelier Origin</label>
                        <input
                          type="text"
                          value={formOrigin}
                          onChange={(e) => setFormOrigin(e.target.value)}
                          placeholder="e.g., Como, Italy"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Where the shirt is manufactured or tailored.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Wash &amp; Care Details</label>
                        <input
                          type="text"
                          value={formWashCare}
                          onChange={(e) => setFormWashCare(e.target.value)}
                          placeholder="e.g., Dry clean only. Warm iron."
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                        />
                        <span className="text-[8px] text-ivory/30">Quick cleaning guidelines.</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Key Features (Comma-separated)</label>
                      <input
                        type="text"
                        value={formFeaturesText}
                        onChange={(e) => setFormFeaturesText(e.target.value)}
                        placeholder="e.g., French seams, Pearl buttons, Curved cuffs"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                      />
                      <span className="text-[8px] text-ivory/30">Individual selling points shown as bullet points.</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Testimonial Quote</label>
                      <input
                        type="text"
                        value={formTestimonial}
                        onChange={(e) => setFormTestimonial(e.target.value)}
                        placeholder='e.g., "The softest cotton I have ever worn." - Arthur K.'
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                      />
                      <span className="text-[8px] text-ivory/30">A customer quote highlighting quality.</span>
                    </div>
                  </div>

                  {/* Section: Product Images */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2">4. Product Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Primary Image Path</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="e.g., /assets/shirt_white.png"
                            className="flex-1 bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-3 py-3 text-ivory focus:outline-none placeholder-white/20 font-mono text-xs"
                          />
                          <label className="px-4 py-3 bg-[#222] hover:bg-gold hover:text-black rounded-xl text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                            Upload File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'primary')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <span className="text-[8px] text-ivory/30">Main display photo.</span>
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Detail Images Rack (Comma-separated paths)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formImagesText}
                            onChange={(e) => setFormImagesText(e.target.value)}
                            placeholder="e.g., /assets/shirt_white.png, /assets/shirt_white_collar.png"
                            className="flex-1 bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-3 py-3 text-ivory focus:outline-none placeholder-white/20 font-mono text-xs"
                          />
                          <label className="px-4 py-3 bg-[#222] hover:bg-gold hover:text-black rounded-xl text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                            Upload View
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'rack')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <span className="text-[8px] text-ivory/30">Alternate angles shown on the details page.</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: 3D Interactive Studio Config */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2">5. 3D Studio Configurations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Accent Color Hex</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formAccent}
                            onChange={(e) => setFormAccent(e.target.value)}
                            className="w-10 h-10 border border-white/10 rounded-lg cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={formAccent}
                            onChange={(e) => setFormAccent(e.target.value)}
                            className="flex-1 bg-[#1b1b1b] border border-white/5 rounded-xl px-2.5 text-xs text-ivory font-mono focus:outline-none"
                          />
                        </div>
                        <span className="text-[8px] text-ivory/30">Interactive highlighting color.</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 md:col-span-3">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">Spotlight Studio Backdrop Gradient (Tailwind/CSS classes)</label>
                        <input
                          type="text"
                          value={formGradient}
                          onChange={(e) => setFormGradient(e.target.value)}
                          placeholder="from-[#111] via-[#090909] to-[#040404]"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 font-mono text-xs"
                        />
                        <span className="text-[8px] text-ivory/30">Backdrop colors behind the shirt's detail view page.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Background Gradient (Tailwind/CSS classes)</label>
                        <input
                          type="text"
                          value={formBgGradient}
                          onChange={(e) => setFormBgGradient(e.target.value)}
                          placeholder="from-[#111111] to-[#080808]"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 font-mono text-xs"
                        />
                        <span className="text-[8px] text-ivory/30">Color gradient behind the 3D viewer model canvas.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Interactive Glow Color (RGBA/CSS)</label>
                        <input
                          type="text"
                          value={formAccentColor}
                          onChange={(e) => setFormAccentColor(e.target.value)}
                          placeholder="rgba(180,180,180,0.5)"
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 font-mono text-xs"
                        />
                        <span className="text-[8px] text-ivory/30">Interactive color glow overlay for 3D model highlights.</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Studio "Story" Tab Overview</label>
                        <textarea
                          rows={2}
                          value={formStory}
                          onChange={(e) => setFormStory(e.target.value)}
                          placeholder="A brief editorial story about this shirt's inspiration..."
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 resize-none font-sans"
                        />
                        <span className="text-[8px] text-ivory/30">Narrative shown under "Story" inside the 3D Viewer.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Studio "Atmosphere" Tab Details</label>
                        <textarea
                          rows={2}
                          value={formAtmosphere}
                          onChange={(e) => setFormAtmosphere(e.target.value)}
                          placeholder="e.g., Deep emerald shading with high specular highlights."
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 resize-none font-sans"
                        />
                        <span className="text-[8px] text-ivory/30">Information shown under "Atmosphere" inside the 3D Viewer.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Studio "Fit" Tab Details</label>
                        <textarea
                          rows={2}
                          value={formFitInfo}
                          onChange={(e) => setFormFitInfo(e.target.value)}
                          placeholder="Describe the shape, collar style, and arm drape profile..."
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 resize-none font-sans"
                        />
                        <span className="text-[8px] text-ivory/30">Sizing/Shape info shown under "Fit" inside the 3D Viewer.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-ivory/40">3D Studio "Care" Tab Details</label>
                        <textarea
                          rows={2}
                          value={formCareInfo}
                          onChange={(e) => setFormCareInfo(e.target.value)}
                          placeholder="e.g., Cold wash, mild detergent, low iron if needed..."
                          className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 resize-none font-sans"
                        />
                        <span className="text-[8px] text-ivory/30">Maintenance instructions shown under "Care" inside the 3D Viewer.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setIsAdding(false); }}
                      className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gold text-[#050505] hover:bg-white hover:text-black rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Save size={12} /> Save Product
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Journal Edit Panel */}
        <AnimatePresence>
          {(editingJournal || isAddingJournal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                data-lenis-prevent
                className="bg-[#121212] border border-white/10 max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl relative scrollbar-thin text-left"
              >
                <button
                  onClick={() => { setEditingJournal(null); setIsAddingJournal(false); }}
                  className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-ivory/60 hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  <X size={18} />
                </button>

                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                    {isAddingJournal ? 'Write New Journal Entry' : `Edit Entry: ${editingJournal?.title}`}
                  </h2>
                  <p className="text-[10px] text-gold uppercase tracking-widest mt-1">Configure editorial article &amp; translations</p>
                </div>

                {uploading && (
                  <div className="p-4 bg-gold/10 border border-gold/25 rounded-2xl flex items-center gap-3 text-gold text-xs font-sans animate-pulse">
                    <div className="w-3.5 h-3.5 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
                    Uploading selected image to public assets...
                  </div>
                )}

                <form onSubmit={handleJournalSubmit} className="space-y-6 text-sm">
                  {/* Slug / Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Article ID (Slug)*</label>
                      <input
                        type="text"
                        disabled={!isAddingJournal}
                        required
                        value={jId}
                        onChange={(e) => setJId(e.target.value)}
                        placeholder="e.g. art-of-shirtmaking"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20 disabled:opacity-40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Category (English)*</label>
                      <input
                        type="text"
                        required
                        value={jCategory}
                        onChange={(e) => setJCategory(e.target.value)}
                        placeholder="e.g. Sartorial Art"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Category (Arabic)*</label>
                      <input
                        type="text"
                        required
                        value={jCategoryAr}
                        onChange={(e) => setJCategoryAr(e.target.value)}
                        placeholder="e.g. فن الخياطة"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none placeholder-white/20"
                      />
                    </div>
                  </div>

                  {/* Title Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Article Title (English)*</label>
                      <input
                        type="text"
                        required
                        value={jTitle}
                        onChange={(e) => setJTitle(e.target.value)}
                        placeholder="e.g. The Art of Modern Shirtmaking"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Article Title (Arabic)*</label>
                      <input
                        type="text"
                        required
                        value={jTitleAr}
                        onChange={(e) => setJTitleAr(e.target.value)}
                        placeholder="e.g. فن صناعة القمصان الحديثة"
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Excerpts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Summary Excerpt (English)*</label>
                      <textarea
                        rows={2}
                        required
                        value={jExcerpt}
                        onChange={(e) => setJExcerpt(e.target.value)}
                        placeholder="A short visual summary..."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Summary Excerpt (Arabic)*</label>
                      <textarea
                        rows={2}
                        required
                        value={jExcerptAr}
                        onChange={(e) => setJExcerptAr(e.target.value)}
                        placeholder="ملخص قصير للبطاقة..."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none resize-none"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Author & Info Rows */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Author (EN)</label>
                      <input type="text" value={jAuthor} onChange={(e) => setJAuthor(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Author (AR)</label>
                      <input type="text" value={jAuthorAr} onChange={(e) => setJAuthorAr(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Read Time (EN)</label>
                      <input type="text" value={jReadTime} onChange={(e) => setJReadTime(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Read Time (AR)</label>
                      <input type="text" value={jReadTimeAr} onChange={(e) => setJReadTimeAr(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Publish Date (EN)</label>
                      <input type="text" value={jDate} onChange={(e) => setJDate(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Publish Date (AR)</label>
                      <input type="text" value={jDateAr} onChange={(e) => setJDateAr(e.target.value)} className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                  </div>

                  {/* Image & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Featured Image Path</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={jImage}
                          onChange={(e) => setJImage(e.target.value)}
                          placeholder="/assets/blog_shirtmaking.png"
                          className="flex-1 bg-[#1b1b1b] border border-white/5 rounded-xl px-3 py-3 text-ivory text-xs font-mono focus:outline-none"
                        />
                        <label className="px-4 py-3 bg-[#222] hover:bg-gold hover:text-black rounded-xl text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center whitespace-nowrap">
                          Upload
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'journal')} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Tags (EN - Comma separated)</label>
                      <input type="text" value={jTagsText} onChange={(e) => setJTagsText(e.target.value)} placeholder="Tailoring, Craftsmanship" className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Tags (AR - Comma separated)</label>
                      <input type="text" value={jTagsArText} onChange={(e) => setJTagsArText(e.target.value)} placeholder="خياطة, حرفية" className="w-full bg-[#1b1b1b] border border-white/5 rounded-xl px-4 py-3 text-ivory focus:outline-none" />
                    </div>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Article Body Paragraphs (EN - Separate with double line break)</label>
                      <textarea
                        rows={6}
                        value={jContentText}
                        onChange={(e) => setJContentText(e.target.value)}
                        placeholder="Paragraph 1...\n\nParagraph 2..."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none resize-y"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-ivory/40">Article Body Paragraphs (AR - Separate with double line break)</label>
                      <textarea
                        rows={6}
                        value={jContentArText}
                        onChange={(e) => setJContentArText(e.target.value)}
                        placeholder="الفقرة الأولى...\n\nالفقرة الثانية..."
                        className="w-full bg-[#1b1b1b] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-ivory focus:outline-none resize-y"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Form Controls */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => { setEditingJournal(null); setIsAddingJournal(false); }}
                      className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gold text-[#050505] hover:bg-white hover:text-black rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Save size={12} /> Save Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {viewingInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
              <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #printable-invoice-area, #printable-invoice-area * {
                    visibility: visible !important;
                  }
                  #printable-invoice-area {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    background: white !important;
                    color: black !important;
                    padding: 40px !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}} />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0b0b0b] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl text-left shadow-2xl relative space-y-6"
              >
                {/* Header Actions */}
                <div className="flex justify-between items-center no-print border-b border-white/5 pb-4">
                  <h3 className="font-serif text-lg text-white uppercase tracking-wider">Order Invoice PDF</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-gold hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      Print / Save PDF
                    </button>
                    <button
                      onClick={() => setViewingInvoice(null)}
                      className="px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Invoice Area */}
                <div id="printable-invoice-area" className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 md:p-10 space-y-8 text-white font-sans">
                  {/* Branding row */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-6">
                    <div>
                      <h1 className="font-serif text-3xl font-light uppercase tracking-widest text-gold leading-none">Ink &amp; Cotton Club</h1>
                      <p className="text-[10px] text-ivory/50 uppercase tracking-widest mt-2 font-medium">Tailored Essentials Atelier</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase tracking-widest font-bold rounded-full">
                        Invoice
                      </span>
                      <p className="font-mono text-xs text-white/50 mt-2">No: {viewingInvoice.trackingNumber}</p>
                    </div>
                  </div>

                  {/* Billing Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-white/5 pb-6">
                    <div className="space-y-1.5 text-left">
                      <h4 className="text-[9px] uppercase tracking-widest text-gold font-bold">Client Information</h4>
                      {viewingInvoice.user ? (
                        <>
                          <p className="font-semibold text-white text-sm">{viewingInvoice.user.name}</p>
                          <p className="text-white/60">{viewingInvoice.user.email}</p>
                          <p className="text-white/60">Tier Level: {viewingInvoice.user.tier}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-white text-sm">{viewingInvoice.customerName || 'Guest'}</p>
                          <p className="text-white/60">{viewingInvoice.contactEmail || 'No Email'}</p>
                          <p className="text-white/60">Status: Guest Checkout</p>
                        </>
                      )}
                      {viewingInvoice.contactPhone && (
                        <p className="text-white/60 font-mono">Tel: {viewingInvoice.contactPhone}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 text-left md:text-right">
                      <h4 className="text-[9px] uppercase tracking-widest text-gold font-bold">Shipping Details</h4>
                      <p className="text-white/80 leading-relaxed max-w-xs md:ml-auto">{viewingInvoice.shippingAddress || 'Atelier Pickup'}</p>
                      {viewingInvoice.pincode && (
                        <p className="text-white/60 font-mono">Pincode: {viewingInvoice.pincode}</p>
                      )}
                      <p className="text-white/60 mt-1 uppercase tracking-wider text-[10px] font-semibold">Method: {viewingInvoice.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Items Ordered Table */}
                  <div className="space-y-3">
                    <h4 className="text-[9px] uppercase tracking-widest text-gold font-bold border-b border-white/5 pb-2 text-left">Line Items</h4>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[8px] font-bold">
                          <th className="pb-2 text-left">Description</th>
                          <th className="pb-2 text-center" style={{ width: '15%' }}>Qty</th>
                          <th className="pb-2 text-right" style={{ width: '25%' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(() => {
                          let parsedItems: any[] = [];
                          try {
                            parsedItems = JSON.parse(viewingInvoice.items || '[]');
                          } catch (e) {
                            console.error(e);
                          }
                          return parsedItems.map((it: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-3 text-left">
                                <p className="font-medium text-white">{it.name}</p>
                                <span className="text-[10px] text-white/50">Color: {it.colorName}</span>
                              </td>
                              <td className="py-3 text-center font-mono text-white/80">{it.quantity}</td>
                              <td className="py-3 text-right font-serif text-gold">${(it.price * it.quantity).toFixed(2)}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Pricing summary */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div className="text-[10px] text-white/40 leading-relaxed font-sans max-w-xs text-left">
                      <p>Thank you for choosing Ink &amp; Cotton Club. All bespoke pieces are carefully curated and finished at our local atelier.</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold block">Grand Total</span>
                      <span className="font-serif text-2xl text-gold font-semibold">${viewingInvoice.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
