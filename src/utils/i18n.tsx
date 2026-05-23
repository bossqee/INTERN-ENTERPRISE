import { useState, createContext, useContext, ReactNode } from 'react';

type Language = 'th' | 'en';

interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}

const translations: Translations = {
  // Auth
  welcomeBack: { th: 'ยินดีต้อนรับกลับ', en: 'Welcome Back' },
  createAccount: { th: 'สร้างบัญชีใหม่', en: 'Create Account' },
  signInDashboard: { th: 'เข้าสู่ระบบเพื่อจัดการวารสารของคุณ', en: 'Sign in to access your professional dashboard' },
  joinCircle: { th: 'เข้าร่วมเครือข่ายมืออาชีพระดับแนวหน้า', en: 'Join our elite circle of high-performing professionals' },
  email: { th: 'อีเมลติดต่อ', en: 'Contact Email' },
  firstName: { th: 'ชื่อจริง', en: 'First Name' },
  lastName: { th: 'นามสกุล', en: 'Last Name' },
  employeeId: { th: 'รหัสพนักงาน (4 หลัก)', en: 'Employee ID (4 Digits)' },
  password: { th: 'รหัสผ่าน', en: 'Secure Password' },
  signInBtn: { th: 'เข้าสู่ระบบตอนนี้', en: 'Sign In Now' },
  registerBtn: { th: 'เริ่มสร้างบัญชี', en: 'Initialize Account' },
  newToPlatform: { th: 'ยังไม่มีบัญชีใช่หรือไม่?', en: 'New to the platform?' },
  alreadyHaveAccess: { th: 'มีบัญชีอยู่แล้ว?', en: 'Already have access?' },
  requestAccount: { th: 'สมัครสมาชิกใหม่', en: 'Request New Account' },
  returnLogin: { th: 'กลับไปหน้าเข้าสู่ระบบ', en: 'Return to Login' },

  // Dashboard Header
  export: { th: 'ส่งออกไฟล์', en: 'Export' },
  createLog: { th: 'เขียนบันทึก', en: 'Create Log' },
  logout: { th: 'ออกจากระบบ', en: 'Logout' },
  logoutConfirm: { th: 'ออกจากระบบ?', en: 'Logout?' },
  logoutMessage: { th: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?', en: 'Are you sure you want to sign out?' },

  // Sidebar
  filterSystem: { th: 'ระบบกรองข้อมูล', en: 'Filter System' },
  keywords: { th: 'คำค้นหา', en: 'Keywords' },
  technology: { th: 'เทคโนโลยี', en: 'Technology' },
  allTech: { th: 'ทุกเทคโนโลยี', en: 'All Technologies' },
  timelineRange: { th: 'ช่วงเวลา', en: 'Timeline Range' },
  clearFilters: { th: 'ล้างตัวกรองทั้งหมด', en: 'Clear All Parameters' },
  insights: { th: 'ข้อมูลเชิงลึก', en: 'Insights' },
  records: { th: 'บันทึก', en: 'Records' },
  stack: { th: 'เครื่องมือ', en: 'Stack' },

  // Main Feed
  timeline: { th: 'ไทม์ไลน์', en: 'Timeline' },
  liveSync: { th: 'ระบบซิงค์สด', en: 'Live Sync' },
  entriesActive: { th: 'บันทึกที่แสดงอยู่', en: 'entries active' },
  decrypting: { th: 'กำลังถอดรหัสข้อมูล...', en: 'Decrypting Records...' },
  noResults: { th: 'ไม่พบข้อมูลที่ค้นหา', en: 'No Results Found' },
  refineSearch: { th: 'ลองปรับปรุงตัวกรองของคุณเพื่อค้นหาอีกครั้ง', en: 'Try adjusting your filters to broaden your search.' },
  createInitial: { th: 'สร้างบันทึกแรกของคุณ', en: 'Create Initial Log' },

  // Notifications
  loginSuccess: { th: 'เข้าสู่ระบบสำเร็จ', en: 'Access Granted' },
  loginWelcome: { th: 'ยินดีต้อนรับสู่แดชบอร์ดมืออาชีพของคุณ', en: 'Welcome to your professional dashboard.' },
  registerSuccess: { th: 'สมัครสมาชิกสำเร็จ', en: 'Account Initialized' },
  registerMessage: { th: 'บัญชีของคุณถูกสร้างแล้ว คุณสามารถเข้าสู่ระบบได้ทันที', en: 'Registration successful. You can now sign in.' },
  authError: { th: 'ข้อผิดพลาดในการยืนยันตัวตน', en: 'Authentication Error' },
  idError: { th: 'รหัสพนักงานต้องเป็นตัวเลข 4 หลักเท่านั้น', en: 'Employee ID must be 4 digits.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('journal_lang');
    return (saved as Language) || 'th';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('journal_lang', lang);
  };

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
