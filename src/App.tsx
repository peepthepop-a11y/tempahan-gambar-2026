import React, { useState, useEffect } from 'react';
import {
  ClassItem,
  Student,
  PhotoPackage,
  Order,
  StudentPhoto,
  ClassPhoto,
  SystemSettings,
  AdminUser,
} from './types';
import { StorageService } from './lib/storage';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { GalleryPage } from './components/public/GalleryPage';
import { BookingWizard } from './components/public/BookingWizard';
import { CheckOrderPage } from './components/public/CheckOrderPage';
import { PackagesPage } from './components/public/PackagesPage';
import { ContactPage } from './components/public/ContactPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrdersManager } from './components/admin/OrdersManager';
import { StudentsManager } from './components/admin/StudentsManager';
import { ClassesManager } from './components/admin/ClassesManager';
import { PackagesManager } from './components/admin/PackagesManager';
import { PaymentsManager } from './components/admin/PaymentsManager';
import { PhotosManager } from './components/admin/PhotosManager';
import { PrintingManager } from './components/admin/PrintingManager';
import { ReportsManager } from './components/admin/ReportsManager';
import { SettingsManager } from './components/admin/SettingsManager';
import { UsersManager } from './components/admin/UsersManager';
import { ReceiptModal } from './components/common/ReceiptModal';

// Helper to extract route from current URL hash/path
function getInitialRoute(): string {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const queryRoute = searchParams.get('route') || searchParams.get('page') || searchParams.get('tab');

  const candidate = hash || queryRoute || path;
  if (!candidate) return 'home';

  if (candidate === 'booking' || candidate === 'tempah' || candidate === 'tempahan') return 'booking';
  if (candidate === 'gallery' || candidate === 'galeri') return 'gallery';
  if (candidate === 'packages' || candidate === 'pakej') return 'packages';
  if (candidate === 'check-order' || candidate === 'semak' || candidate === 'status') return 'check-order';
  if (candidate === 'contact' || candidate === 'hubungi') return 'contact';
  if (candidate === 'admin' || candidate === 'admin-login' || candidate === 'login') return 'admin-login';
  if (candidate === 'admin-dashboard' || candidate === 'dashboard') return 'admin-dashboard';

  return 'home';
}

export default function App() {
  // Navigation Route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => getInitialRoute());
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<string>('');
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<string>('');

  // Domain Data States
  const [settings, setSettings] = useState<SystemSettings>(StorageService.getSettings());
  const [classes, setClasses] = useState<ClassItem[]>(StorageService.getClasses());
  const [packages, setPackages] = useState<PhotoPackage[]>(StorageService.getPackages());
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [orders, setOrders] = useState<Order[]>(StorageService.getOrders());
  const [photos, setPhotos] = useState<StudentPhoto[]>(StorageService.getPhotos());
  const [classPhotos, setClassPhotos] = useState<ClassPhoto[]>(StorageService.getClassPhotos());

  // Admin Session State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(StorageService.getAdminSession());
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Order | null>(null);

  // Sync state when storage changes
  const refreshAllData = () => {
    setSettings(StorageService.getSettings());
    setClasses(StorageService.getClasses());
    setPackages(StorageService.getPackages());
    setStudents(StorageService.getStudents());
    setOrders(StorageService.getOrders());
    setPhotos(StorageService.getPhotos());
    setClassPhotos(StorageService.getClassPhotos());
    setAdminUser(StorageService.getAdminSession());
  };

  useEffect(() => {
    // Cross-device sync & static config preload on startup
    StorageService.initSync().then(() => {
      refreshAllData();
    });

    const handleStorageUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('stsp_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('stsp_storage_updated', handleStorageUpdate);
    };
  }, []);

  // Listen for browser URL / hash changes (supports back/forward & direct links)
  useEffect(() => {
    const handlePopOrHash = () => {
      const route = getInitialRoute();
      setCurrentRoute(route);
    };

    window.addEventListener('hashchange', handlePopOrHash);
    window.addEventListener('popstate', handlePopOrHash);
    return () => {
      window.removeEventListener('hashchange', handlePopOrHash);
      window.removeEventListener('popstate', handlePopOrHash);
    };
  }, []);

  // Handle route change with hash updating
  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const newHash = route === 'home' ? '' : `#${route}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash || window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct package selection from home / packages catalog
  const handleSelectPackageForBooking = (packageId: string) => {
    setSelectedPackageForBooking(packageId);
    navigateTo('booking');
  };

  // Direct class booking from gallery
  const handleSelectClassForBooking = (classId: string) => {
    setSelectedClassForBooking(classId);
    navigateTo('booking');
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    StorageService.logout();
    setAdminUser(null);
    navigateTo('home');
  };

  // Determine if viewing an Admin page
  const isAdminView =
    currentRoute.startsWith('admin-') && currentRoute !== 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] text-slate-800">
      {/* If viewing Admin panel and logged in */}
      {isAdminView && adminUser ? (
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          adminUser={adminUser}
          settings={settings}
          onLogout={handleAdminLogout}
          onViewPublicSite={() => navigateTo('home')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              orders={orders}
              students={students}
              classes={classes}
              packages={packages}
              onSelectTab={(tab) => setAdminTab(tab)}
              onViewOrder={(ord) => setViewingReceiptOrder(ord)}
            />
          )}

          {adminTab === 'orders' && (
            <OrdersManager
              orders={orders}
              classes={classes}
              packages={packages}
              settings={settings}
            />
          )}

          {adminTab === 'students' && (
            <StudentsManager
              students={students}
              classes={classes}
              orders={orders}
            />
          )}

          {adminTab === 'classes' && (
            <ClassesManager
              classes={classes}
              students={students}
              orders={orders}
            />
          )}

          {adminTab === 'packages' && (
            <PackagesManager packages={packages} />
          )}

          {adminTab === 'payments' && (
            <PaymentsManager orders={orders} settings={settings} />
          )}

          {adminTab === 'photos' && (
            <PhotosManager
              classPhotos={classPhotos}
              classes={classes}
            />
          )}

          {adminTab === 'printing' && (
            <PrintingManager
              orders={orders}
              classes={classes}
              packages={packages}
              settings={settings}
            />
          )}

          {adminTab === 'reports' && (
            <ReportsManager
              orders={orders}
              classes={classes}
              packages={packages}
              settings={settings}
            />
          )}

          {adminTab === 'settings' && (
            <SettingsManager settings={settings} />
          )}

          {adminTab === 'users' && (
            <UsersManager currentAdmin={adminUser} />
          )}
        </AdminLayout>
      ) : (
        /* Public Parent Portal & Login Views */
        <>
          {currentRoute !== 'admin-login' && (
            <Navbar
              currentRoute={currentRoute}
              onNavigate={navigateTo}
              isAdminLoggedIn={Boolean(adminUser)}
            />
          )}

          <main className="flex-1">
            {/* PUBLIC HOMEPAGE */}
            {currentRoute === 'home' && (
              <HomePage
                settings={settings}
                packages={packages}
                onNavigate={navigateTo}
                onSelectPackageForBooking={handleSelectPackageForBooking}
              />
            )}

            {/* PUBLIC CLASS PHOTOS GALLERY TAB (REVIEW SEBELUM BELI + LARGE VIEW) */}
            {currentRoute === 'gallery' && (
              <GalleryPage
                classes={classes}
                photos={classPhotos}
                settings={settings}
                onNavigate={navigateTo}
                onBookClass={handleSelectClassForBooking}
              />
            )}

            {/* PUBLIC PACKAGES CATALOG */}
            {currentRoute === 'packages' && (
              <PackagesPage
                packages={packages}
                settings={settings}
                onNavigate={navigateTo}
                onSelectPackage={handleSelectPackageForBooking}
              />
            )}

            {/* PUBLIC 5-STEP BOOKING WIZARD */}
            {currentRoute === 'booking' && (
              <BookingWizard
                classes={classes}
                packages={packages}
                settings={settings}
                initialPackageId={selectedPackageForBooking}
                initialClassId={selectedClassForBooking}
                onNavigate={navigateTo}
              />
            )}

            {/* PUBLIC STATUS CHECKER */}
            {currentRoute === 'check-order' && (
              <CheckOrderPage
                settings={settings}
                onNavigate={navigateTo}
              />
            )}

            {/* PUBLIC CONTACT PAGE */}
            {currentRoute === 'contact' && (
              <ContactPage settings={settings} />
            )}

            {/* ADMIN LOGIN */}
            {currentRoute === 'admin-login' && (
              <AdminLogin
                settings={settings}
                onLoginSuccess={(user) => {
                  setAdminUser(user);
                  navigateTo('admin-dashboard');
                }}
                onNavigateHome={() => navigateTo('home')}
              />
            )}
          </main>

          {currentRoute !== 'admin-login' && (
            <Footer settings={settings} onNavigate={navigateTo} />
          )}
        </>
      )}

      {/* Global Receipt Modal trigger */}
      {viewingReceiptOrder && (
        <ReceiptModal
          order={viewingReceiptOrder}
          settings={settings}
          onClose={() => setViewingReceiptOrder(null)}
        />
      )}
    </div>
  );
}
