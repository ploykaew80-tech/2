import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { isGeneralOrAccessory } from './productUtils';
import type {
  Product,
  ProductType,
  Category,
  Promotion,
  StoreSettings,
  User,
  Order,
  ActivityLog,
  AdminStats,
  ProductStatus,
  OrderStatus
} from '../types';

// ==================== DEFAULT INITIAL SEED DATA ====================
export const INITIAL_STORE_SETTINGS: StoreSettings = {
  id: 'store-main',
  store_name: 'PURPLE PUFF',
  logo_url: '/uploads/store_logo_purple_heart.jpg',
  banner_url: '/uploads/store_logo_purple_heart.jpg',
  description: 'PURPLE PUFF — Cosmic & Premium Dispensary Store ดอกคัดเกรดพรีเมียม สดใหม่ กลิ่นแน่น คัดเฉพาะสายพันธุ์ชั้นนำ พร้อมบริการจัดส่งด่วนถึงที่',
  opening_time: '10:00',
  closing_time: '02:00',
  contact: '0902743754',
  line_username: '@798shear',
  instagram_username: '',
  delivery_available: true,
  facebook: 'PurplePuffOfficial',
  google_maps: 'https://maps.app.goo.gl/CyT3Fp4SpJW27sYF8?g_st=ic',
  location_address: 'Pathum, Thailand (ให้บริการหน้าร้าน & จัดส่ง Express)',
  store_policies: 'ผู้ซื้อต้องมีอายุตั้งแต่ 20 ปีบริบูรณ์ขึ้นไป ห้ามสตรีมีครรภ์หรือให้นมบุตรใช้งาน สินค้าเพื่อการผ่อนคลายและดูแลสุขภาวะเท่านั้น',
  updated_at: new Date().toISOString()
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-pop',
    name: '🌸 ดอก POP',
    icon: '🌸',
    description: 'ดอกไซส์ Popcorn ราคาสบายกระเป๋า คุณภาพเต็มเม็ด',
    display_order: 1,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-top',
    name: '👑 ดอก TOP',
    icon: '👑',
    description: 'Top Shelf ระดับพรีเมียม กลิ่นแน่น คัดเกรดพิเศษ',
    display_order: 2,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-greenhouse',
    name: '🌿 ดอก GREEN HOUSE',
    icon: '🌿',
    description: 'ปลูกระบบ Green House ควบคุมแสงธรรมชาติ คุณภาพคงที่',
    display_order: 3,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-trim',
    name: '✂️ TRIM',
    icon: '✂️',
    description: 'Trim Sugar Leaves คัดพิเศษ เหมาะสำหรับสกัดหรือผสม',
    display_order: 4,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-preroll',
    name: '🚬 พันลำ',
    icon: '🚬',
    description: 'Pre-rolls พันสดพร้อมสูบ ดอกล้วนไม่มีก้าน',
    display_order: 5,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-general',
    name: '🛍️ ของทั่วไป',
    icon: '🛍️',
    description: 'อุปกรณ์ บ้อง กระดาษโรล ไฟแช็ค และแอคเซสเซอรี่',
    display_order: 6,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-promotion',
    name: '🔥 PROMOTION',
    icon: '🔥',
    description: 'ดีลเด็ดและเซ็ตสุดคุ้มประจำสัปดาห์',
    display_order: 7,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-edible',
    name: '🍭 ขนม',
    icon: '🍭',
    description: 'เยลลี่ คุกกี้ และขนมผสมสูตรพิเศษ อร่อยกลมกล่อม',
    display_order: 8,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-001',
    title: '💜 3 free 1',
    description: 'คละได้ทั้ง หมด ยกเว้นโรลไม่รวมโปร',
    image_url: '/uploads/store_logo_purple_heart.jpg',
    start_date: '2026-09-01',
    end_date: '2026-10-31',
    status: 'ACTIVE',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Super Admin Ploy',
    email: 'admin@purplepuff.com',
    role: 'SUPER ADMIN',
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-002',
    name: 'Store Manager Mark',
    email: 'manager@purplepuff.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2026-02-15T00:00:00.000Z'
  }
];

// ==================== INITIALIZATION FUNCTION ====================
let isInitializing = false;
let isInitialized = false;

/**
 * Ensures Firestore is populated with initial data if collections are empty.
 */
export async function initFirestoreDataIfEmpty(): Promise<boolean> {
  if (isInitialized) return true;
  if (isInitializing) return false;

  isInitializing = true;
  try {
    // Check if products collection exists / has documents with timeout
    const productsSnap = await Promise.race([
      getDocs(collection(db, 'products')),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    ]);
    
    if (productsSnap && productsSnap.empty) {
      console.log('🌱 Firestore is empty. Seeding initial data...');
      const batch = writeBatch(db);

      // 1. Seed Store Settings in doc(db, 'settings', 'store')
      const settingsStoreRef = doc(db, 'settings', 'store');
      const settingsOldRef = doc(db, 'settings', 'store_settings');
      batch.set(settingsStoreRef, INITIAL_STORE_SETTINGS);
      batch.set(settingsOldRef, INITIAL_STORE_SETTINGS);

      // 2. Seed Categories
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(db, 'categories', cat.id), cat);
      }

      // 3. Seed Promotions
      for (const promo of INITIAL_PROMOTIONS) {
        batch.set(doc(db, 'promotions', promo.id), promo);
      }

      // 5. Seed Users
      for (const user of INITIAL_USERS) {
        batch.set(doc(db, 'users', user.id), user);
      }

      // 6. Seed initial activity log
      const initialLog: ActivityLog = {
        id: `log-${Date.now()}`,
        user_id: 'usr-001',
        user_name: 'Super Admin Ploy',
        action: 'INITIAL_SEED',
        entity_type: 'system',
        entity_id: 'cloud_firestore',
        timestamp: new Date().toISOString(),
        metadata: { note: 'Cloud Firestore seeded with default catalog and settings' }
      };
      batch.set(doc(db, 'activity_logs', initialLog.id), initialLog);

      await Promise.race([
        batch.commit(),
        new Promise<void>((resolve) => setTimeout(resolve, 3500))
      ]);
      console.log('✅ Firestore seeding completed successfully!');
    }
    isInitialized = true;
    return true;
  } catch {
    return false;
  } finally {
    isInitializing = false;
  }
}

// ==================== STORE SETTINGS ====================

export async function getFirestoreStoreSettings(): Promise<StoreSettings> {
  try {
    initFirestoreDataIfEmpty().catch(() => {});
    // Read from doc(db, 'settings', 'store') as primary
    const docSnap = await Promise.race([
      getDoc(doc(db, 'settings', 'store')),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
    ]);
    if (docSnap && docSnap.exists()) {
      return docSnap.data() as StoreSettings;
    }

    // Fallback check doc(db, 'settings', 'store_settings')
    const fallbackSnap = await Promise.race([
      getDoc(doc(db, 'settings', 'store_settings')),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
    ]);
    if (fallbackSnap && fallbackSnap.exists()) {
      return fallbackSnap.data() as StoreSettings;
    }

    return INITIAL_STORE_SETTINGS;
  } catch {
    // Graceful offline fallback without logging red error/warning banner
    return INITIAL_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getFirestoreStoreSettings();
  const updated: StoreSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString()
  };
  try {
    await Promise.race([
      Promise.all([
        setDoc(doc(db, 'settings', 'store'), updated, { merge: true }),
        setDoc(doc(db, 'settings', 'store_settings'), updated, { merge: true })
      ]),
      new Promise<void>((resolve) => setTimeout(resolve, 3500))
    ]);
  } catch {
    // Local cache will sync automatically once online
  }
  return updated;
}

export const updateFirestoreStoreSettings = saveStoreSettings;
export const saveFirestoreStoreSettings = saveStoreSettings;

// ==================== CATEGORIES ====================

export async function getFirestoreCategories(): Promise<Category[]> {
  try {
    initFirestoreDataIfEmpty().catch(() => {});
    const snap = await Promise.race([
      getDocs(query(collection(db, 'categories'), orderBy('display_order', 'asc'))),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    ]);
    if (snap && !snap.empty) return snap.docs.map(d => d.data() as Category);
    return INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function saveFirestoreCategory(category: Partial<Category>): Promise<Category> {
  const id = category.id || `cat-${Date.now()}`;
  const now = new Date().toISOString();
  const fullCategory: Category = {
    id,
    name: category.name || 'หมวดหมู่ใหม่',
    icon: category.icon || '🌿',
    description: category.description || '',
    display_order: category.display_order ?? 99,
    status: category.status || 'ACTIVE',
    created_at: category.created_at || now,
    updated_at: now
  };
  try {
    await Promise.race([
      setDoc(doc(db, 'categories', id), fullCategory, { merge: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 3500))
    ]);
  } catch (err) {
    console.warn('saveFirestoreCategory notice (will sync when online):', err);
  }
  return fullCategory;
}

// ==================== PRODUCTS ====================

export async function getFirestoreProducts(): Promise<Product[]> {
  try {
    const snap = await Promise.race([
      getDocs(collection(db, 'products')),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
    ]);
    if (snap && !snap.empty) {
      const prods = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
      prods.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
      return prods;
    }
    return [];
  } catch (err) {
    console.error('getFirestoreProducts error:', err);
    return [];
  }
}

export async function getFirestoreProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await Promise.race([
      getDoc(doc(db, 'products', id)),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
    ]);
    if (docSnap && docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Product;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveFirestoreProduct(product: Partial<Product>, userName = 'Admin'): Promise<Product> {
  const id = product.id || `prod-${Date.now()}`;
  const now = new Date().toISOString();
  
  let existing: Product | null = null;
  if (product.id) {
    existing = await getFirestoreProductById(product.id);
  }

  const categoryId = product.category_id || existing?.category_id || 'cat-top';
  const isGeneral = isGeneralOrAccessory({ ...product, category_id: categoryId });

  const savedProduct: Product = {
    id,
    product_name: product.product_name || existing?.product_name || 'ชื่อสินค้าใหม่',
    category_id: categoryId,
    type: (product.type || existing?.type || 'Hybrid') as ProductType,
    description: product.description ?? existing?.description ?? '',
    effect_1: isGeneral ? '' : (product.effect_1 ?? existing?.effect_1 ?? 'ผ่อนคลายลึก'),
    effect_2: isGeneral ? '' : (product.effect_2 ?? existing?.effect_2 ?? 'สบายตัว'),
    effect_3: isGeneral ? '' : (product.effect_3 ?? existing?.effect_3 ?? 'อารมณ์ดี'),
    price: Number(product.price) || (existing ? existing.price : 0),
    unit: product.unit || existing?.unit || (isGeneral ? 'ชิ้น' : '1G'),
    image_url: product.image_url || existing?.image_url || '/uploads/store_logo_purple_heart.jpg',
    status: product.status || existing?.status || 'AVAILABLE',
    featured: Boolean(product.featured ?? existing?.featured),
    display_order: Number(product.display_order ?? existing?.display_order ?? 99),
    created_at: existing?.created_at || product.created_at || now,
    updated_at: now,
    created_by: existing?.created_by || userName,
    updated_by: userName,
    custom_fields: product.custom_fields || existing?.custom_fields || {}
  };

  // Directly save individual document in collection(db, 'products', id) with timeout race
  try {
    await Promise.race([
      setDoc(doc(db, 'products', id), savedProduct, { merge: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 3500))
    ]);
  } catch (saveErr) {
    console.warn('Firestore setDoc notice (will sync when online):', saveErr);
  }

  // Log activity in background non-blocking
  addFirestoreActivityLog({
    user_id: 'admin',
    user_name: userName,
    action: existing ? 'PRODUCT UPDATED' : 'PRODUCT CREATED',
    entity_type: 'product',
    entity_id: id,
    metadata: { product_name: savedProduct.product_name, price: savedProduct.price }
  }).catch(() => {});

  return savedProduct;
}

export async function deleteFirestoreProduct(id: string, userName = 'Admin'): Promise<boolean> {
  const product = await getFirestoreProductById(id);
  // Delete individual product doc with timeout race
  try {
    await Promise.race([
      deleteDoc(doc(db, 'products', id)),
      new Promise<void>((resolve) => setTimeout(resolve, 3500))
    ]);
  } catch (err) {
    console.warn('deleteDoc notice:', err);
  }

  addFirestoreActivityLog({
    user_id: 'admin',
    user_name: userName,
    action: 'PRODUCT DELETED',
    entity_type: 'product',
    entity_id: id,
    metadata: { product_name: product?.product_name || id }
  }).catch(() => {});

  return true;
}

export async function updateFirestoreProductStatus(id: string, status: ProductStatus, userName = 'Admin'): Promise<Product | null> {
  const product = await getFirestoreProductById(id);
  if (!product) return null;

  const now = new Date().toISOString();
  try {
    await Promise.race([
      updateDoc(doc(db, 'products', id), {
        status,
        updated_at: now,
        updated_by: userName
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 3500))
    ]);
  } catch (err) {
    console.warn('updateDoc notice:', err);
  }

  product.status = status;
  product.updated_at = now;
  product.updated_by = userName;

  addFirestoreActivityLog({
    user_id: 'admin',
    user_name: userName,
    action: 'PRODUCT STATUS CHANGED',
    entity_type: 'product',
    entity_id: id,
    metadata: { product_name: product.product_name, status }
  }).catch(() => {});

  return product;
}

export async function duplicateFirestoreProduct(id: string, userName = 'Admin'): Promise<Product | null> {
  const orig = await getFirestoreProductById(id);
  if (!orig) return null;

  const newId = `prod-${Date.now()}`;
  const now = new Date().toISOString();
  const dup: Product = {
    ...orig,
    id: newId,
    product_name: `${orig.product_name} (Copy)`,
    created_at: now,
    updated_at: now,
    created_by: userName,
    updated_by: userName
  };

  await setDoc(doc(db, 'products', newId), dup);

  await addFirestoreActivityLog({
    user_id: 'admin',
    user_name: userName,
    action: 'PRODUCT DUPLICATED',
    entity_type: 'product',
    entity_id: newId,
    metadata: { original_id: id, product_name: dup.product_name }
  });

  return dup;
}

export async function bulkSyncFirestoreProducts(products: Partial<Product>[], userName = 'Admin'): Promise<{ success: boolean; count: number }> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  let count = 0;
  for (const p of products) {
    const id = p.id || `prod-${Date.now()}-${count}`;
    const productRef = doc(db, 'products', id);
    batch.set(productRef, {
      ...p,
      id,
      updated_at: now,
      updated_by: userName
    }, { merge: true });
    count++;
  }

  await batch.commit();

  await addFirestoreActivityLog({
    user_id: 'admin',
    user_name: userName,
    action: 'BULK PRODUCTS SYNC',
    entity_type: 'product',
    entity_id: 'bulk',
    metadata: { count }
  });

  return { success: true, count };
}

// ==================== PROMOTIONS ====================

export async function getFirestorePromotions(): Promise<Promotion[]> {
  try {
    await initFirestoreDataIfEmpty();
    const snap = await getDocs(query(collection(db, 'promotions'), orderBy('display_order', 'asc')));
    if (snap.empty) return INITIAL_PROMOTIONS;
    return snap.docs.map(d => d.data() as Promotion);
  } catch (err) {
    console.error('getFirestorePromotions error:', err);
    return INITIAL_PROMOTIONS;
  }
}

export async function saveFirestorePromotion(promo: Partial<Promotion>): Promise<Promotion> {
  const id = promo.id || `promo-${Date.now()}`;
  const now = new Date().toISOString();
  const fullPromo: Promotion = {
    id,
    title: promo.title || 'โปรโมชั่นใหม่',
    description: promo.description || '',
    image_url: promo.image_url || '/uploads/store_logo_purple_heart.jpg',
    start_date: promo.start_date || now.split('T')[0],
    end_date: promo.end_date || now.split('T')[0],
    status: promo.status || 'ACTIVE',
    display_order: Number(promo.display_order) || 99,
    created_at: promo.created_at || now,
    updated_at: now
  };
  await setDoc(doc(db, 'promotions', id), fullPromo, { merge: true });
  return fullPromo;
}

export async function deleteFirestorePromotion(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'promotions', id));
  return true;
}

// ==================== ORDERS ====================

export async function getFirestoreOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc')));
    return snap.docs.map(d => d.data() as Order);
  } catch (err) {
    console.error('getFirestoreOrders error:', err);
    return [];
  }
}

export async function submitFirestoreOrder(orderData: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: any[];
  notes?: string;
}): Promise<Order> {
  const id = `ORD-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();
  const total = orderData.items.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 1)), 0);

  const order: Order = {
    id,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    delivery_address: orderData.delivery_address,
    items: orderData.items,
    total_amount: total,
    status: 'PENDING',
    notes: orderData.notes || '',
    created_at: now,
    updated_at: now
  };

  await setDoc(doc(db, 'orders', id), order);
  return order;
}

export async function updateFirestoreOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const docSnap = await getDoc(doc(db, 'orders', id));
  if (!docSnap.exists()) return null;

  const now = new Date().toISOString();
  await updateDoc(doc(db, 'orders', id), {
    status,
    updated_at: now
  });

  const updated = { ...docSnap.data(), status, updated_at: now } as Order;
  return updated;
}

// ==================== USERS & LOGS ====================

export async function getFirestoreUsers(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) return INITIAL_USERS;
    return snap.docs.map(d => d.data() as User);
  } catch (err) {
    console.error('getFirestoreUsers error:', err);
    return INITIAL_USERS;
  }
}

export async function saveFirestoreUser(userData: Partial<User>): Promise<User> {
  const id = userData.id || `usr-${Date.now()}`;
  const now = new Date().toISOString();
  const user: User = {
    id,
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'STAFF',
    status: userData.status || 'ACTIVE',
    created_at: userData.created_at || now,
    last_login: userData.last_login
  };
  await setDoc(doc(db, 'users', id), user, { merge: true });
  return user;
}

export async function deleteFirestoreUser(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'users', id));
  return true;
}

export async function getFirestoreActivityLogs(): Promise<ActivityLog[]> {
  try {
    const snap = await getDocs(query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc')));
    return snap.docs.map(d => d.data() as ActivityLog);
  } catch (err) {
    console.error('getFirestoreActivityLogs error:', err);
    return [];
  }
}

export async function addFirestoreActivityLog(logData: {
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
}): Promise<ActivityLog> {
  try {
    const id = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const log: ActivityLog = {
      id,
      user_id: logData.user_id,
      user_name: logData.user_name,
      action: logData.action,
      entity_type: logData.entity_type,
      entity_id: logData.entity_id,
      timestamp: new Date().toISOString(),
      metadata: logData.metadata
    };
    await setDoc(doc(db, 'activity_logs', id), log);
    return log;
  } catch (err) {
    console.warn('Failed to record activity log in Firestore:', err);
    return {
      id: `log-${Date.now()}`,
      ...logData,
      timestamp: new Date().toISOString()
    };
  }
}

// ==================== REAL-TIME LISTENERS ====================

export function subscribeToFirestoreProducts(callback: (products: Product[]) => void): Unsubscribe {
  const productsColRef = collection(db, 'products');
  return onSnapshot(productsColRef, (snap) => {
    const prods = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
    prods.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    callback(prods);
  }, (err) => {
    console.error('Firestore products onSnapshot error:', err);
  });
}

export function subscribeToFirestoreCategories(callback: (categories: Category[]) => void): Unsubscribe {
  const categoriesColRef = collection(db, 'categories');
  return onSnapshot(categoriesColRef, (snap) => {
    if (!snap.empty) {
      const cats = snap.docs.map(d => ({ ...d.data(), id: d.id } as Category));
      cats.sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
      callback(cats);
    }
  }, () => {
    getFirestoreCategories().then(cats => callback(cats)).catch(() => callback(INITIAL_CATEGORIES));
  });
}

export function subscribeToFirestorePromotions(callback: (promotions: Promotion[]) => void): Unsubscribe {
  const promoColRef = collection(db, 'promotions');
  return onSnapshot(promoColRef, (snap) => {
    if (!snap.empty) {
      const promos = snap.docs.map(d => ({ ...d.data(), id: d.id } as Promotion));
      callback(promos);
    }
  }, () => {
    getFirestorePromotions().then(promos => callback(promos)).catch(() => callback(INITIAL_PROMOTIONS));
  });
}

export function subscribeToFirestoreSettings(callback: (settings: StoreSettings) => void): Unsubscribe {
  return onSnapshot(
    doc(db, 'settings', 'store'),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as StoreSettings);
      } else {
        getFirestoreStoreSettings().then(s => {
          if (s) callback(s);
        }).catch(() => {});
      }
    },
    () => {
      // Graceful offline fallback
      getFirestoreStoreSettings().then(s => {
        if (s) callback(s);
      }).catch(() => {});
    }
  );
}

