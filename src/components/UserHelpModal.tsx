import React from 'react';
import {
  HelpCircle,
  RotateCw,
  ZoomIn,
  Compass,
  Palette,
  Type,
  UploadCloud,
  Save,
  RefreshCw,
  MessageCircle,
  X,
} from 'lucide-react';

interface UserHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserHelpModal: React.FC<UserHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-user-help"
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bantuan 3D Configurator
              </h3>
              <p className="text-[11px] text-slate-500">Panduan mudah merancang jersey kustom Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup Bantuan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: User Guide Points */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-[13px] text-slate-700 leading-relaxed divide-y divide-slate-100">
          {/* 1. Memutar Model */}
          <div className="flex items-start gap-3.5 pt-3 first:pt-0">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Memutar Model</h4>
              <p className="text-slate-600 mt-0.5">
                Klik dan geser (drag) menggunakan mouse atau sentuh layar smartphone ke kiri dan kanan. Jersey akan berputar mulus pada porosnya sehingga Anda bisa melihat setiap detail pakaian.
              </p>
            </div>
          </div>

          {/* 2. Zoom */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <ZoomIn className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Zoom (Perbesar / Perkecil)</h4>
              <p className="text-slate-600 mt-0.5">
                Gunakan roda scroll pada mouse komputer atau lakukan gerakan mencubit dua jari (pinch-to-zoom) di layar sentuh untuk melihat jersey lebih dekat atau lebih jauh.
              </p>
            </div>
          </div>

          {/* 3. Melihat Front / Back / Left / Right */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Melihat Front / Back / Left / Right</h4>
              <p className="text-slate-600 mt-0.5">
                Klik tombol preset sudut pandang di pojok kiri atas area 3D (<strong>Front</strong>, <strong>Back</strong>, <strong>Left</strong>, <strong>Right</strong>) untuk langsung beralih ke tampak depan, belakang, atau sisi jersey dengan cepat.
              </p>
            </div>
          </div>

          {/* 4. Mengubah Warna */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Mengubah Warna</h4>
              <p className="text-slate-600 mt-0.5">
                Buka menu pilihan warna di panel samping atau bawah. Anda dapat memilih warna preset yang populer atau memilih warna bebas untuk badan jersey, lengan, dan kerah secara langsung.
              </p>
            </div>
          </div>

          {/* 5. Mengubah Nama dan Nomor */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Mengubah Nama dan Nomor</h4>
              <p className="text-slate-600 mt-0.5">
                Ketik nama punggung dan nomor pemain yang Anda inginkan di kolom yang disediakan. Anda juga bisa mengatur gaya tulisan melengkung/lurus, serta posisi nomor dada di tengah atau sejajar logo.
              </p>
            </div>
          </div>

          {/* 6. Upload Logo */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Upload Logo</h4>
              <p className="text-slate-600 mt-0.5">
                Pilih logo contoh yang tersedia atau klik tombol <strong>Upload Logo</strong> untuk menggunakan logo tim Anda sendiri (format PNG atau JPG disarankan dengan latar belakang transparan).
              </p>
            </div>
          </div>

          {/* 7. Menyimpan Desain */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Cara Menyimpan Desain</h4>
              <p className="text-slate-600 mt-0.5">
                Klik tombol <strong>SAVE DESIGN</strong> atau <strong>SAVE & ORDER SUMMARY</strong> untuk melihat rincian lengkap desain jersey Anda, mengunduh data spesifikasi, atau langsung mengirimkan pesanan ke WhatsApp admin.
              </p>
            </div>
          </div>

          {/* 8. Jika Model / Desain Tidak Tampil */}
          <div className="flex items-start gap-3.5 pt-3">
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Jika Model / Desain Tidak Tampil</h4>
              <p className="text-slate-600 mt-0.5">
                Klik tombol <strong>Reset</strong> di pojok kanan atas tampilan 3D. Jika koneksi internet Anda sempat terputus saat memuat halaman, lakukan penyegaran (refresh) browser Anda.
              </p>
            </div>
          </div>

          {/* 9. Hubungi Admin Jika Membutuhkan Bantuan */}
          <div className="flex items-start gap-3.5 pt-3 pb-1">
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-sm">Hubungi Admin Jika Membutuhkan Bantuan</h4>
              <p className="text-slate-600 mt-0.5">
                Tim DIGID siap membantu kebutuhan desain jersey, pemilihan bahan, dan produksi pesanan custom tim Anda.
              </p>
              <div className="mt-2.5">
                <a
                  href="https://wa.me/6285141396021?text=Halo%20Admin%20DIGID%2C%20saya%20butuh%20bantuan%20terkait%20penggunaan%203D%20Configurator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp Admin</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">DIGID 3D Apparel Configurator</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
          >
            Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
