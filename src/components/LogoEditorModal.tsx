import React, { useState, useRef } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { LeedoLogo } from './LeedoLogo';
import {
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Building,
  Sparkles,
  Link,
  ShieldCheck,
} from 'lucide-react';

interface LogoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({ isOpen, onClose }) => {
  const { systemConfig, updateOrgLogo, resetOrgLogoToDefault, currentUser } = useKpi();
  const { language } = useLanguage();

  const currentConfig = systemConfig.logoConfig || {
    type: 'default',
    orgNameEn: 'LEEDO',
    orgNameBn: 'লিডো',
    orgSubtitleEn: 'Local Education & Economic Development Org.',
    orgSubtitleBn: 'স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ',
  };

  const [logoType, setLogoType] = useState<'default' | 'custom_image'>(currentConfig.type || 'default');
  const [customImageUrl, setCustomImageUrl] = useState<string>(currentConfig.customImageUrl || '');
  const [orgNameEn, setOrgNameEn] = useState<string>(currentConfig.orgNameEn || 'LEEDO');
  const [orgNameBn, setOrgNameBn] = useState<string>(currentConfig.orgNameBn || 'লিডো');
  const [orgSubtitleEn, setOrgSubtitleEn] = useState<string>(currentConfig.orgSubtitleEn || 'Local Education & Economic Development Org.');
  const [orgSubtitleBn, setOrgSubtitleBn] = useState<string>(
    currentConfig.orgSubtitleBn || 'স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ'
  );

  const [urlInput, setUrlInput] = useState<string>('');
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewTab, setPreviewTab] = useState<'header' | 'report' | 'login'>('header');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlertMsg({
        type: 'error',
        text: language === 'bn' ? 'অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, SVG, WebP) নির্বাচন করুন।' : 'Please upload an image file (PNG, JPG, SVG, WebP).',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAlertMsg({
        type: 'error',
        text: language === 'bn' ? 'ছবির সাইজ ১০ মেগাবাইটের কম হতে হবে।' : 'Image size must be under 10 MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      // Downscale and compress image for optimal performance and Firestore/LocalStorage storage
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 360;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.88);
            setCustomImageUrl(compressedUrl);
          } else {
            setCustomImageUrl(dataUrl);
          }
        } catch {
          setCustomImageUrl(dataUrl);
        }

        setLogoType('custom_image');
        setAlertMsg({
          type: 'success',
          text: language === 'bn' ? 'ছবি সফলভাবে লোড ও অপ্টিমাইজ হয়েছে! নিচে প্রিভিউ দেখুন।' : 'Image loaded & optimized successfully! See preview below.',
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setCustomImageUrl(urlInput.trim());
    setLogoType('custom_image');
    setAlertMsg({
      type: 'success',
      text: language === 'bn' ? 'ছবির ইউআরএল যুক্ত হয়েছে!' : 'Image URL linked successfully!',
    });
  };

  const handleSave = () => {
    if (logoType === 'custom_image' && !customImageUrl) {
      setAlertMsg({
        type: 'error',
        text: language === 'bn' ? 'অনুগ্রহ করে একটি ছবি আপলোড করুন অথবা ডিফল্ট লোগো নির্বাচন করুন।' : 'Please provide a logo image or select Default Logo.',
      });
      return;
    }

    const res = updateOrgLogo({
      type: logoType,
      customImageUrl: logoType === 'custom_image' ? customImageUrl : undefined,
      orgNameEn: orgNameEn.trim() || 'LEEDO',
      orgNameBn: orgNameBn.trim(),
      orgSubtitleEn: orgSubtitleEn.trim(),
      orgSubtitleBn: orgSubtitleBn.trim(),
    });

    if (res.success) {
      setAlertMsg({
        type: 'success',
        text: language === 'bn' ? 'সংস্থার লোগো ও ব্র্যান্ডিং সফলভাবে হালনাগাদ হয়েছে।' : 'Organization logo & branding saved successfully!',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleResetDefault = () => {
    resetOrgLogoToDefault();
    setLogoType('default');
    setCustomImageUrl('');
    setOrgNameEn('LEEDO');
    setOrgNameBn('লিডো');
    setOrgSubtitleEn('Local Education & Economic Development Org.');
    setOrgSubtitleBn('স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ');
    setAlertMsg({
      type: 'success',
      text: language === 'bn' ? 'ডিফল্ট লিডো অফিসিয়াল ভেক্টর লোগো পুনর্বহাল করা হয়েছে।' : 'Default official LEEDO logo restored successfully.',
    });
  };

  // Mock temporary preview object for live preview
  const livePreview = (
    <div className="flex items-center gap-3">
      {logoType === 'custom_image' && customImageUrl ? (
        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-1 shrink-0">
          <img src={customImageUrl} alt="Custom Logo" className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className="shrink-0">
          <LeedoLogo size="md" showSubtitle={false} />
        </div>
      )}

      {/* When custom image is used, show wordmark next to it */}
      {logoType === 'custom_image' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-2">
            <span className="font-black tracking-wider text-rose-600 text-2xl font-sans uppercase">
              {orgNameEn || 'LEEDO'}
            </span>
            {orgNameBn && (
              <span className="font-bold text-slate-700 text-xs">{orgNameBn}</span>
            )}
          </div>
          <span className="text-slate-600 font-semibold tracking-tight text-[11px] mt-0.5">
            {orgSubtitleEn}
          </span>
          {orgSubtitleBn && (
            <span className="text-slate-400 font-medium text-[9px] mt-0.5">
              {orgSubtitleBn}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600/30 rounded-2xl border border-rose-500/30">
              <ImageIcon className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">
                  {language === 'bn' ? 'সংস্থার লোগো ও ব্র্যান্ডিং পরিবর্তন' : 'Change Organization Logo & Branding'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  HR Only
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'bn'
                  ? 'হেডার, লগইন স্ক্রিন ও অফিশিয়াল মূল্যায়ন সনদে দৃশ্যমান লোগো পরিবর্তন করুন।'
                  : 'Customize the organization logo across Header, Login screen, and Printable appraisal certificates.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {alertMsg && (
          <div
            className={`px-6 py-3 flex items-center gap-2.5 text-xs font-semibold ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live Preview Display Section */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  {language === 'bn' ? 'লাইভ প্রিভিউ (সিস্টেমে যেভাবে দেখাবে)' : 'Live Preview (How it appears in system)'}
                </span>
              </div>
              <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('header')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    previewTab === 'header' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {language === 'bn' ? 'হেডার ভিউ' : 'Header Bar'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('report')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    previewTab === 'report' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {language === 'bn' ? 'সনদ/রিপোর্ট' : 'Report Print'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('login')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    previewTab === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {language === 'bn' ? 'লগইন স্ক্রিন' : 'Login Card'}
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs min-h-[90px] flex items-center justify-between">
              {previewTab === 'header' && (
                <div className="w-full flex items-center justify-between">
                  <div>{livePreview}</div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono">
                    <span>চলতি মাস: {systemConfig.activeMonth}</span>
                  </div>
                </div>
              )}

              {previewTab === 'report' && (
                <div className="w-full flex items-center justify-between border-b-2 border-rose-600 pb-3">
                  <div>{livePreview}</div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold uppercase">
                      অফিসিয়াল মূল্যায়ন সনদ
                    </span>
                  </div>
                </div>
              )}

              {previewTab === 'login' && (
                <div className="w-full py-2 flex flex-col items-center text-center">
                  <div className="bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-200 inline-flex items-center justify-center mb-2">
                    {livePreview}
                  </div>
                  <span className="text-xs font-bold text-slate-700">কর্মী কর্মদক্ষতা ও মূল্যায়ন পোর্টাল</span>
                </div>
              )}
            </div>
          </div>

          {/* Logo Source Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {language === 'bn' ? 'লোগো ধরন নির্বাচন করুন:' : 'Select Logo Type:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Default LEEDO Vector Logo */}
              <button
                type="button"
                onClick={() => setLogoType('default')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  logoType === 'default'
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'bn' ? 'অফিসিয়াল LEEDO ভেক্টর লোগো' : 'Official LEEDO Vector Emblem'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {language === 'bn'
                      ? 'দুই শিশুর প্রতীক সংবলিত হাই-রেজ্যুলিউশন ভেক্টর লোগো।'
                      : 'Iconic two running children emblem in official LEEDO colors.'}
                  </p>
                </div>
              </button>

              {/* Option 2: Custom Uploaded Image */}
              <button
                type="button"
                onClick={() => setLogoType('custom_image')}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  logoType === 'custom_image'
                    ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 bg-purple-100 rounded-xl text-purple-600 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'bn' ? 'কাস্টম ইমেজ লোগো আপলোড' : 'Custom Image / File Upload'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {language === 'bn'
                      ? 'আপনার কম্পিউটার থেকে সংস্থার নতুন লোগো ইমেজ আপলোড করুন।'
                      : 'Upload a custom logo image (PNG, JPG, SVG, WebP) from device.'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Upload Controls (Active when custom_image selected) */}
          {logoType === 'custom_image' && (
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  {language === 'bn' ? 'লোগো ফাইল আপলোড বা লিংক' : 'Logo File Upload or Image Link'}
                </span>
                <div className="flex items-center bg-purple-100 p-0.5 rounded-lg text-xs font-bold text-purple-800">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      inputMode === 'upload' ? 'bg-white shadow-2xs text-purple-900' : 'text-purple-600'
                    }`}
                  >
                    {language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('url')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      inputMode === 'url' ? 'bg-white shadow-2xs text-purple-900' : 'text-purple-600'
                    }`}
                  >
                    {language === 'bn' ? 'ইমেজ লিংক' : 'Image URL'}
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-6 text-center bg-white hover:bg-purple-50/30 transition cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      {language === 'bn' ? 'লোগো ফাইল নির্বাচন করতে এখানে ক্লিক করুন' : 'Click here to upload your logo file'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, SVG, WebP (Max: 3MB)
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyUrl} className="flex gap-2">
                  <div className="relative flex-1">
                    <Link className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'যুক্ত করুন' : 'Apply URL'}
                  </button>
                </form>
              )}

              {customImageUrl && (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                      <img src={customImageUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {language === 'bn' ? 'আপলোডকৃত লোগো সক্রিয়' : 'Uploaded Logo Ready'}
                      </span>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        {language === 'bn' ? '✓ প্রিভিউতে প্রদর্শিত হচ্ছে' : '✓ Active in preview'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomImageUrl('');
                      setLogoType('default');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                  >
                    {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Organization Name & Subtitle Customization */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-rose-600" />
              {language === 'bn' ? 'সংস্থার নাম ও পরিচিতি লেখা সম্পাদনা:' : 'Organization Brand Title & Subtitle:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization Name (English)
                </label>
                <input
                  type="text"
                  value={orgNameEn}
                  onChange={(e) => setOrgNameEn(e.target.value)}
                  placeholder="e.g. LEEDO"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সংস্থার নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={orgNameBn}
                  onChange={(e) => setOrgNameBn(e.target.value)}
                  placeholder="যেমন: লিডো"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle (English)
                </label>
                <input
                  type="text"
                  value={orgSubtitleEn}
                  onChange={(e) => setOrgSubtitleEn(e.target.value)}
                  placeholder="e.g. Local Education & Economic Development Org."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সাবটাইটেল (বাংলা)
                </label>
                <input
                  type="text"
                  value={orgSubtitleBn}
                  onChange={(e) => setOrgSubtitleBn(e.target.value)}
                  placeholder="যেমন: স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'bn' ? 'ডিফল্ট লিডো লোগোতে ফিরুন' : 'Reset to Default LEEDO'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
