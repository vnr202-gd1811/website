import { useEffect, useState, useRef, useCallback } from 'react';
import './index.css';

/* ─── Cấu hình điều hướng hệ thống các phần ─── */
const sections = [
  { id: 'hero',          label: 'Trang chủ' },
  { id: 'stats',         label: 'Thống kê' },
  { id: 'mat-tran',      label: 'Mặt trận ngoại giao' },
  { id: 'context',       label: 'Bối cảnh' },
  { id: 'timeline',      label: 'Lộ trình đàm phán' },
  { id: 'treaty-content', label: 'Nội dung Hiệp định' },
  { id: 'comparison',    label: 'So sánh & Ý nghĩa' },
  { id: 'lessons',       label: 'Bài học kinh nghiệm' },
  { id: 'real-world',    label: 'Kiến trúc sư VN' },
  { id: 'secret-talks',  label: 'Đàm phán bí mật' },
  { id: 'opposing-side', label: 'Phía đối lập' },
  { id: 'references',    label: 'Tư liệu tham khảo' },
  { id: 'team',          label: 'Thành viên nhóm' },
];

/* ─── Đường dẫn hình ảnh cục bộ (Local Assets) ─── */
const getImg = (name) => {
  const isProd = import.meta.env.PROD;
  const base = isProd ? '/website' : '';
  return `${base}/images/${name}`;
};

/* ─── Biểu tượng Ngôi sao vàng Việt Nam ─── */
function VNStar({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="#ffcd00">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </svg>
  );
}

/* ─── Hệ thống hạt chuyển động (Visual effects) ─── */
function Particles({ count = 40 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      dur: `${Math.random() * 10 + 6}s`,
      delay: `${Math.random() * 8}s`,
      color: Math.random() > 0.5 ? 'rgba(218,37,29,0.7)' : 'rgba(255,205,0,0.7)',
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            '--dur': p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Bộ đếm dữ liệu thống kê ─── */
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Hiệu ứng hiển thị theo tiến trình cuộn ─── */
function Reveal({ children, className = '', dir = 'up', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : 'reveal-up';

  return (
    <div
      ref={ref}
      className={`${cls} ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Dòng sự kiện tiêu biểu ─── */
const TICKER_ITEMS = [
  '⚔ Chiến thắng Điện Biên Phủ 7/5/1954',
  '✦ Khai mạc Hội nghị Giơ-ne-vơ 8/5/1954',
  '★ Ký kết Hiệp định Giơ-ne-vơ 20/7/1954',
  '⚔ Hội nghị Pa-ri chính thức khai mạc 13/5/1968',
  '✦ Chiến thắng Điện Biên Phủ trên không 12/1972',
  '★ Ký kết Hiệp định Pa-ri 27/1/1973',
  '⚔ Đại thắng mùa Xuân 30/4/1975',
  '✦ Sách lược "Vừa đánh vừa đàm"',
  '★ Độc lập – Tự do – Hạnh phúc',
];

function MarqueeTicker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-vn-red border-y-2 border-vn-gold overflow-hidden py-2 relative z-20 shadow-md">
      <div className="flex whitespace-nowrap animate-marquee gap-16">
        {repeated.map((item, i) => (
          <span key={i} className="text-vn-gold font-bold uppercase tracking-widest text-[10px] md:text-xs px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── ỨNG DỤNG CHÍNH ─── */
function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sp = window.scrollY + window.innerHeight / 3;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (sp >= offsetTop && sp < offsetTop + offsetHeight) setActiveSection(s.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen selection:bg-vn-red selection:text-white">

      {/* ── Hệ thống điều hướng trực quan ── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 relative group ${
              activeSection === s.id
                ? 'bg-vn-gold scale-150 animate-pulse-gold ring-2 ring-vn-red/40'
                : 'bg-vn-red/50 hover:bg-vn-red'
            }`}
          >
            <span className="absolute right-7 top-1/2 -translate-y-1/2 bg-black/90 text-vn-gold px-3 py-1 rounded text-[10px] uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-vn-red/40 shadow-xl">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════
          PHẦN MỞ ĐẦU (HERO SECTION)
      ════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center bg-hero-pattern bg-cover bg-center bg-fixed relative overflow-hidden red-scanline noise-layer"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#2b0000]/65 to-black/90 z-0" />
        <Particles count={50} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-star-spin pointer-events-none z-0">
          <VNStar size={600} />
        </div>

        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} opacity-60 z-10`} style={{ animationDelay: `${i * 0.5}s` }}>
            <VNStar size={28} />
          </div>
        ))}

        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="w-32 h-1 bg-vn-red mb-8 animate-pulse-red rounded" />

          <div className="border-2 border-vn-red p-8 md:p-16 bg-black/55 backdrop-blur-md max-w-5xl rounded-sm shadow-2xl">
            <p className="text-vn-red font-bold uppercase tracking-[0.4em] text-xs md:text-sm mb-6">
              Chương II · Giáo trình Lịch sử Đảng Cộng sản Việt Nam (VNR202)
            </p>

            <div className="glitch-wrapper" data-text="Đảng Lãnh Đạo Hai Cuộc Kháng Chiến">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight uppercase gold-shimmer">
                Đảng Lãnh Đạo<br />Hai Cuộc Kháng Chiến
              </h1>
            </div>

            <p className="text-sm md:text-lg text-gray-300 font-sans font-light mb-8 tracking-[0.2em] uppercase">
              Chống ngoại xâm · Thống nhất đất nước · Giai đoạn 1945–1975
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-vn-red/60" />
              <VNStar size={32} className="opacity-80" />
              <div className="h-px w-20 bg-vn-red/60" />
            </div>

            <h2 className="text-2xl md:text-4xl text-white font-serif mb-3 uppercase tracking-wider">
              Ngoại Giao Thời Chiến
            </h2>
            <h3 className="text-xl md:text-2xl text-vn-gold italic font-serif opacity-90">
              Tiến trình từ Hiệp định Giơ-ne-vơ đến Hiệp định Pa-ri
            </h3>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-vn-red/40 pt-8">
              {[
                { n: '1954', label: 'Giơ-ne-vơ' },
                { n: '→', label: 'Chiến lược Đàm phán' },
                { n: '1973', label: 'Pa-ri' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-4xl font-serif font-bold text-vn-gold">{item.n}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollTo('stats')}
            className="mt-12 text-vn-gold border border-vn-gold/50 px-10 py-3 uppercase tracking-widest text-xs hover:bg-vn-gold hover:text-black transition-all duration-500 shadow-lg"
          >
            Khám phá tư liệu lịch sử ↓
          </button>
        </div>
      </section>

      <MarqueeTicker />

      {/* ════════════════════════════════
          SỐ LIỆU THỐNG KÊ KHOA HỌC
      ════════════════════════════════ */}
      <section id="stats" className="py-20 bg-vn-red relative overflow-hidden noise-layer font-sans">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000] via-vn-red to-[#8b0000]" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-vn-gold text-center font-serif font-bold uppercase tracking-wider mb-4">
              Dữ liệu Thống kê Tiến trình
            </h2>
            <p className="text-center text-red-100 text-xs md:text-sm mb-12 uppercase tracking-[0.2em] font-medium opacity-80">Quy mô các cuộc đàm phán lịch sử tiêu biểu (1954 & 1973)</p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Thống kê Giơ-ne-vơ */}
            <Reveal dir="left">
              <div className="bg-black/20 backdrop-blur-sm border border-vn-gold/20 p-8 rounded-sm h-full">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                  <span className="text-3xl font-serif font-bold text-vn-gold">1954</span>
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Hội nghị Giơ-ne-vơ</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: 75, suffix: '',  label: 'Ngày thương lượng', icon: '⏳' },
                    { val: 8,  suffix: '',  label: 'Phiên họp rộng',    icon: '🏛️' },
                    { val: 23, suffix: '',  label: 'Phiên họp hẹp',     icon: '👥' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-serif font-bold text-vn-gold mb-1">
                        <Counter target={item.val} suffix={item.suffix} />
                      </div>
                      <div className="text-[9px] text-red-100 uppercase tracking-widest leading-tight">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 bg-white/5 p-4 rounded-sm">
                  <p className="text-red-100 text-xs italic leading-relaxed opacity-80 font-sans">
                    "Tiến trình đàm phán đa phương đầu tiên của Việt Nam Dân chủ Cộng hòa (VNDCCH) trên diễn đàn quốc tế, diễn ra trong bối cảnh cục diện Chiến tranh Lạnh đang định hình."
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Thống kê Pa-ri */}
            <Reveal dir="right">
              <div className="bg-black/20 backdrop-blur-sm border border-vn-gold/20 p-8 rounded-sm h-full">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                  <span className="text-3xl font-serif font-bold text-vn-gold">1973</span>
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm">Hội nghị Pa-ri</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { val: 201,  suffix: '',  label: 'Phiên công khai', icon: '🏛️' },
                    { val: 45,   suffix: '',  label: 'Gặp riêng cấp cao', icon: '🤝' },
                    { val: 500,  suffix: '+', label: 'Cuộc họp báo',     icon: '📰' },
                    { val: 1000, suffix: '+', label: 'Cuộc phỏng vấn',   icon: '🎙️' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl md:text-2xl font-serif font-bold text-vn-gold mb-1">
                        <Counter target={item.val} suffix={item.suffix} />
                      </div>
                      <div className="text-[9px] text-red-100 uppercase tracking-widest leading-tight">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 p-4 rounded-sm text-center">
                  <div className="text-2xl md:text-3xl font-serif font-bold text-vn-gold leading-tight">4 năm 8 tháng 14 ngày</div>
                  <div className="text-red-100 text-[10px] uppercase tracking-widest opacity-80 mt-1 font-sans">Tổng thời gian tiến trình đàm phán tại Pa-ri</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* ════════════════════════════════
          VAI TRÒ CỦA MẶT TRẬN NGOẠI GIAO
      ════════════════════════════════ */}
      <section id="mat-tran" className="py-24 bg-history-dark text-white relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b09] via-[#1a0505] to-[#0d0b09]" />
        <Particles count={20} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Mặt Trận Ngoại Giao Chiến Lược
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic text-base md:text-lg leading-relaxed">
              "Trong chiến tranh cách mạng, ngoại giao đóng vai trò là một mặt trận chiến lược, phối hợp chặt chẽ với mặt trận quân sự và chính trị nhằm tạo ra sức mạnh tổng hợp."
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {[
              {
                icon: '🌍',
                title: 'Tranh thủ sự ủng hộ quốc tế',
                text: 'Ngoại giao đóng vai trò then chốt trong việc huy động sự đồng tình của nhân dân thế giới, bao gồm các quốc gia xã hội chủ nghĩa, phong trào giải phóng dân tộc và các lực lượng tiến bộ yêu chuộng hòa bình, tạo nên sức ép chính trị toàn cầu đối với phe xâm lược.',
                color: 'border-vn-red',
              },
              {
                icon: '🛡️',
                title: 'Cô lập đối trọng ngoại giao',
                text: 'Mặt trận ngoại giao thực hiện nhiệm vụ cô lập các thế lực xâm lược về phương diện pháp lý và chính trị trên các diễn đàn đa phương, đồng thời khẳng định tính chính nghĩa tối thượng của cuộc đấu tranh dân tộc Việt Nam.',
                color: 'border-vn-gold',
              },
              {
                icon: '⚔️',
                title: 'Chuyển hóa các thành tựu thực địa',
                text: 'Ngoại giao thực hiện chức năng chuyển hóa các thắng lợi giành được trên mặt trận quân sự thành kết quả pháp lý trên bàn thương lượng. Chiến thắng Điện Biên Phủ tạo vị thế tại Giơ-ne-vơ; thắng lợi năm 1972 xác lập cục diện tại Pa-ri.',
                color: 'border-vn-red',
              },
              {
                icon: '📜',
                title: 'Xác lập khung pháp lý quốc tế',
                text: 'Thông qua các văn kiện pháp lý có giá trị quốc tế, ngoại giao Việt Nam đã xác lập và bảo vệ vững chắc các quyền dân tộc cơ bản: Độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ đất nước.',
                color: 'border-vn-gold',
              },
            ].map((item, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className={`bg-white/5 border-l-4 ${item.color} p-8 rounded-sm backdrop-blur-sm hover:bg-white/10 transition-all duration-500`}>
                  <div className="text-4xl mb-4 opacity-80">{item.icon}</div>
                  <h4 className="text-xl text-vn-gold font-serif font-bold mb-3 uppercase tracking-wide">{item.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="animated-border rounded-sm p-px shadow-2xl">
              <div className="bg-black/75 backdrop-blur-md p-10 text-center rounded-sm">
                <div className="text-vn-red text-xs font-bold uppercase tracking-[0.5em] mb-4">Phương châm ngoại giao của Đảng</div>
                <div className="text-4xl md:text-6xl font-serif font-bold text-vn-gold mb-6 animate-fire uppercase tracking-widest">
                  "Vừa Đánh, Vừa Đàm"
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed font-serif italic">
                  Tiến trình đàm phán không xuất phát từ vị thế nhượng bộ mà được xây dựng trên nền tảng thực lực chiến trường. 
                  Sách lược này thể hiện tính kiên định về mục tiêu chiến lược và sự linh hoạt tối đa về biện pháp ngoại giao.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BỐI CẢNH LỊCH SỬ KHÁCH QUAN
      ════════════════════════════════ */}
      <section id="context" className="py-24 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6e3] via-white to-[#fff5f5]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="section-title">Bối Cảnh Lịch Sử</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic leading-relaxed">
              Phân tích bối cảnh hình thành các tiến trình ngoại giao trong mối tương quan với cục diện chính trị và quân sự toàn cầu.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Giơ-ne-vơ card */}
            <Reveal dir="left">
              <div className="bg-white border-t-8 border-vn-red shadow-2xl rounded-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-500 h-full">
                <div className="relative overflow-hidden">
                  <img src={getImg('dien-bien-phu.jpg')} alt="Điện Biên Phủ 1954" className="w-full h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-5 text-white font-bold text-xs uppercase tracking-[0.2em]">Thắng lợi Điện Biên Phủ · 1954</div>
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-vn-red/15">
                    <span className="text-6xl text-vn-red font-serif font-bold drop-shadow">1954</span>
                    <div>
                      <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Giơ-ne-vơ</h3>
                      <p className="text-vn-red font-semibold text-xs uppercase tracking-widest">Xác lập các quyền dân tộc</p>
                    </div>
                  </div>
                  <ul className="space-y-4 text-gray-700 text-sm font-sans">
                    {[
                      ['Giai đoạn', 'Kháng chiến chống thực dân Pháp xâm lược (1946 – 1954)'],
                      ['Đối trọng chính', 'Thực dân Pháp, có sự hỗ trợ và can thiệp từ phía chính phủ Hoa Kỳ'],
                      ['Thời điểm', 'Khai mạc ngày 8/5/1954, ngay sau thắng lợi quân sự tại Điện Biên Phủ'],
                      ['Văn kiện', 'Hiệp định được ký kết chính thức vào ngày 20/7/1954'],
                      ['Bối cảnh', 'Sự định hình của Trật tự Hai cực trong giai đoạn đầu Chiến tranh Lạnh'],
                    ].map(([k, v], i) => (
                      <li key={i} className="flex gap-2"><strong className="text-history-dark font-bold uppercase text-[9px] tracking-widest shrink-0 mt-1 min-w-[80px] text-vn-red/80">{k}:</strong><span className="leading-tight">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Pa-ri card */}
            <Reveal dir="right">
              <div className="bg-white border-t-8 border-vn-gold shadow-2xl rounded-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-500 h-full">
                <div className="relative overflow-hidden">
                  <img src={getImg('paris-talks.jpg')} alt="Hội nghị Pa-ri 1973" className="w-full h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-5 text-white font-bold text-xs uppercase tracking-[0.2em]">Hội nghị Pa-ri · 1973</div>
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-vn-gold/25">
                    <span className="text-6xl text-vn-gold font-serif font-bold drop-shadow">1973</span>
                    <div>
                      <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Pa-ri</h3>
                      <p className="text-yellow-600 font-semibold text-xs uppercase tracking-widest">Giai đoạn đấu trí ngoại giao đỉnh cao</p>
                    </div>
                  </div>
                  <ul className="space-y-4 text-gray-700 text-sm font-sans">
                    {[
                      ['Giai đoạn', 'Kháng chiến chống Mỹ, cứu nước (1954 – 1975), trọng tâm đàm phán 1968–1973'],
                      ['Đối trọng chính', 'Đế quốc Mỹ và chính quyền Việt Nam Cộng hòa (VNCH)'],
                      ['Thời điểm', 'Khai mạc ngày 13/5/1968 tại Trung tâm Hội nghị Kléber, Paris'],
                      ['Văn kiện', 'Hiệp định được ký kết chính thức vào ngày 27/1/1973'],
                      ['Bối cảnh', 'Hoa Kỳ sa lầy quân sự; phong trào phản chiến lan rộng toàn cầu'],
                    ].map(([k, v], i) => (
                      <li key={i} className="flex gap-2"><strong className="text-history-dark font-bold uppercase text-[9px] tracking-widest shrink-0 mt-1 min-w-[80px] text-yellow-600/80">{k}:</strong><span className="leading-tight">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="bg-white/80 border-l-4 border-vn-red p-10 rounded-sm shadow-xl backdrop-blur-sm">
              <h3 className="text-xl font-serif font-bold text-history-dark uppercase tracking-widest mb-5 font-serif">
                Hệ quả chính trị sau năm 1954
              </h3>
              <p className="text-gray-700 leading-relaxed text-base font-sans">
                Sau Hiệp định Giơ-ne-vơ, thực tiễn đất nước tồn tại tình trạng chia cắt tạm thời với hai chế độ chính trị khác biệt.
                Hoa Kỳ đã thay thế vị thế của thực dân Pháp tại miền Nam, thiết lập chính quyền tay sai và thực hiện các chính sách phá hoại hiệp định, 
                đặc biệt là việc từ chối tổ chức hiệp thương tổng tuyển cử thống nhất quốc gia. Trong bối cảnh đó, Phái đoàn Việt Nam đã chuyển trọng tâm sang đấu tranh
                pháp lý và ngoại giao trên các diễn đàn quốc tế nhằm bảo vệ quyền tự quyết dân tộc và tính chính đáng của công cuộc thống nhất.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          TIẾN TRÌNH ĐÀM PHÁN (TIMELINE)
      ════════════════════════════════ */}
      <section id="timeline" className="py-24 bg-history-dark text-white border-y-4 border-vn-red relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0505_0%,_#0d0b09_70%)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Tiến Trình Đàm Phán Lịch Sử
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic text-sm md:text-base leading-relaxed">
              Sự chuyển hóa từ các thành tựu quân sự thực địa thành các cam kết pháp lý trong quan hệ quốc tế.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-vn-red/30" />
              <span className="bg-vn-red text-white px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm">Hội nghị Giơ-ne-vơ (1954)</span>
              <div className="h-px flex-1 bg-vn-red/30" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4 font-sans">
            {[
              { year: '8/5/1954',  tag: 'Khai mạc',  tagColor: 'bg-vn-red',  title: 'Khai mạc Hội nghị Giơ-ne-vơ', desc: 'Diễn ra ngay sau chiến thắng Điện Biên Phủ. Các thành tựu trên mặt trận quân sự đã trực tiếp củng cố vị thế cho mặt trận ngoại giao của Việt Nam.', align: 'left', img: getImg('geneva-conference.jpg') },
              { year: '20/7/1954', tag: 'Ký kết',    tagColor: 'bg-vn-gold text-black', title: 'Ký kết Hiệp định Giơ-ne-vơ', desc: 'Chấm dứt sự hiện diện quân sự của thực dân Pháp tại Đông Dương. Xác lập quyền độc lập, chủ quyền của ba nước Đông Dương trên phương diện pháp lý quốc tế.', align: 'right' },
              { year: '21/7/1954', tag: 'Tuyên bố',  tagColor: 'bg-vn-red',  title: 'Thông qua Tuyên bố chung Hội nghị', desc: 'Xác lập các điều khoản về đình chỉ chiến sự và dự kiến tổng tuyển cử. Đạt được những kết quả quan trọng nhưng còn tồn tại hạn chế do sự chi phối của các cường quốc.', align: 'left' },
            ].map((item, i) => (
              <Reveal key={i} dir={item.align === 'left' ? 'left' : 'right'} delay={i * 100}>
                <div className="relative flex items-start group mb-12 w-full">
                  {item.align === 'right' && <div className="hidden md:block md:w-[47%] shrink-0" />}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-vn-red border-4 border-history-dark z-10 group-hover:bg-vn-gold group-hover:scale-150 transition-all duration-500 shadow-[0_0_20px_rgba(218,37,29,0.6)]" />
                  <div className="w-[calc(100%-60px)] md:w-[47%] ml-[60px] md:ml-0 shrink-0 bg-white/5 p-6 rounded-sm backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vn-red/50 transition-all duration-500 shadow-2xl overflow-hidden">
                    {item.img && <img src={item.img} alt={item.title} className="w-full h-32 object-cover mb-5 opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 rounded-sm" />}
                    <span className={`inline-block px-2.5 py-1 ${item.tagColor} text-[9px] font-bold rounded-sm uppercase tracking-widest mb-4`}>{item.tag}</span>
                    <h4 className="text-xl text-vn-gold font-serif font-bold mb-1 tracking-wide">{item.title}</h4>
                    <div className="text-vn-red/80 text-xs font-bold mb-3 tracking-[0.2em] font-sans">{item.year}</div>
                    <p className="text-gray-300 leading-relaxed text-sm font-sans">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="flex items-center gap-4 mt-8 mb-10">
              <div className="h-px flex-1 bg-vn-gold/30" />
              <span className="bg-vn-gold text-black px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm">Hội nghị Pa-ri (1968–1973)</span>
              <div className="h-px flex-1 bg-vn-gold/30" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4">
            {[
              { year: '10/5/1968',    tag: 'Chuẩn bị',  tagColor: 'bg-blue-800', title: 'Công tác chuẩn bị và tiếp xúc sơ bộ', desc: 'Đại sứ Hà Văn Lâu và phái đoàn chuẩn bị các điều kiện cần thiết cho phiên họp chính thức, thể hiện tính chuyên nghiệp trong ngoại giao chuẩn bị.', align: 'left' },
              { year: '13/5/1968',    tag: 'Khai mạc',   tagColor: 'bg-vn-red',   title: 'Khai mạc đàm phán chính thức', desc: 'Bắt đầu tiến trình đấu trí ngoại giao công khai tại Paris giữa Phái đoàn Việt Nam Dân chủ Cộng hòa (VNDCCH) và Chính phủ Hoa Kỳ.', align: 'right', img: getImg('paris-talks.jpg') },
              { year: '25/1/1969',    tag: 'Bốn bên',    tagColor: 'bg-vn-red',   title: 'Chuyển sang cơ chế đàm phán bốn bên', desc: 'Vấn đề miền Nam được thảo luận thực chất với sự tham gia của Phái đoàn Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam (CP CMLT CHMN VN).', align: 'left' },
              { year: '12/6/1969',    tag: 'Chính danh', tagColor: 'bg-red-900',  title: 'Khẳng định vị thế của CP CMLT CHMN VN', desc: 'Tăng cường tính chính danh pháp lý và đại diện cho nguyện vọng của nhân dân miền Nam Việt Nam trên bàn hội nghị quốc tế.', align: 'right' },
              { year: '21/2/1970',    tag: 'Bí mật',     tagColor: 'bg-gray-800', title: 'Khởi đầu tiến trình đàm phán bí mật', desc: 'Các cuộc gặp kín giữa cố vấn Việt Nam và đại diện phía Mỹ bắt đầu tháo gỡ những nút thắt căn bản nhất của bản dự thảo.', align: 'left' },
              { year: '26/6–1/7/1971',tag: 'Sáng kiến', tagColor: 'bg-vn-red',   title: 'Việt Nam đưa ra các giải pháp hòa bình', desc: 'Chủ động đưa ra các sáng kiến 9 điểm và 7 điểm nhằm tranh thủ sự đồng tình của dư luận quốc tế và chính giới Hoa Kỳ.', align: 'right' },
              { year: '30/3/1972',    tag: 'Tác động',   tagColor: 'bg-orange-800','title': 'Ảnh hưởng từ cuộc Tiến công Xuân – Hè', desc: 'Thành tựu quân sự trên chiến trường buộc phía Hoa Kỳ phải chuyển sang giai đoạn thảo luận thực chất về các điều khoản rút quân.', align: 'left' },
              { year: '8/10/1972',    tag: 'Đột phá',    tagColor: 'bg-vn-gold text-black', title: 'Trình dự thảo Hiệp định đầu tiên', desc: 'Việt Nam chủ động đưa ra dự thảo toàn văn hiệp định, tạo bước ngoặt đột phá cho toàn bộ tiến trình đàm phán kéo dài nhiều năm.', align: 'right', img: getImg('signing-paris.jpg') },
              { year: '20/10/1972',   tag: 'Thỏa thuận', tagColor: 'bg-vn-gold text-black', title: 'Đạt khung thỏa thuận nguyên tắc', desc: 'Hai bên cơ bản thống nhất các nội dung chính, tuy nhiên phía Hoa Kỳ sau đó đã có các hành động trì hoãn và leo thang quân sự.', align: 'left' },
              { year: '18–30/12/1972',tag: 'Vô hiệu hóa',tagColor: 'bg-vn-red',   title: 'Vô hiệu hóa các áp lực quân sự của Mỹ', desc: 'Chiến thắng "Điện Biên Phủ trên không" đã đập tan ý đồ sử dụng sức mạnh quân sự B-52 để ép buộc Việt Nam chấp nhận các điều kiện phi lý.', align: 'right', img: getImg('b52-wreckage.jpg') },
              { year: '8–23/1/1973',  tag: 'Hoàn thiện', tagColor: 'bg-gray-800', title: 'Hoàn tất và ký tắt văn bản hiệp định', desc: 'Sau các nỗ lực đấu tranh không mệt mỏi, các điều khoản cốt lõi về độc lập dân tộc đã được bảo vệ thành công trong văn bản cuối cùng.', align: 'left' },
              { year: '27/1/1973',    tag: 'Chính thức', tagColor: 'bg-vn-gold text-black', title: 'Ký kết chính thức Hiệp định Pa-ri', desc: 'Hoa Kỳ cam kết rút toàn bộ quân đội, hoàn thành mục tiêu chiến lược "Đánh cho Mỹ cút", tạo đà cho thắng lợi hoàn toàn năm 1975.', align: 'right' },
            ].map((item, i) => (
              <Reveal key={i} dir={item.align === 'left' ? 'left' : 'right'} delay={i * 60}>
                <div className="relative flex items-start group mb-12 w-full">
                  {item.align === 'right' && <div className="hidden md:block md:w-[47%] shrink-0" />}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-vn-gold border-4 border-history-dark z-10 group-hover:bg-vn-red group-hover:scale-150 transition-all duration-500 shadow-[0_0_20px_rgba(255,205,0,0.6)]" />
                  <div className="w-[calc(100%-60px)] md:w-[47%] ml-[60px] md:ml-0 shrink-0 bg-white/5 p-6 rounded-sm backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vn-gold/50 transition-all duration-500 shadow-2xl overflow-hidden font-sans">
                    {item.img && <img src={item.img} alt={item.title} className="w-full h-32 object-cover mb-5 opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 rounded-sm" />}
                    <span className={`inline-block px-2.5 py-1 ${item.tagColor} text-[9px] font-bold rounded-sm uppercase tracking-widest mb-4`}>{item.tag}</span>
                    <h4 className="text-xl text-vn-gold font-serif font-bold mb-1 tracking-wide leading-tight">{item.title}</h4>
                    <div className="text-vn-red/80 text-xs font-bold mb-3 tracking-[0.2em]">{item.year}</div>
                    <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          NỘI DUNG VÀ Ý NGHĨA PHÁP LÝ
      ════════════════════════════════ */}
      <section id="treaty-content" className="py-24 bg-[#fdf6e3] relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-60" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">

          <Reveal>
            <h2 className="section-title">Nội Dung Hệ Thống Hiệp Định</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic leading-relaxed">
              Các điều khoản xác lập quyền lợi dân tộc Việt Nam trên phương diện pháp lý quốc tế.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <Reveal dir="left">
              <div className="bg-white border-t-4 border-vn-red shadow-xl rounded-sm overflow-hidden h-full">
                <div className="bg-vn-red px-8 py-5 flex items-center gap-5">
                  <span className="text-4xl font-serif font-bold text-white">1954</span>
                  <div>
                    <div className="text-white font-bold uppercase tracking-widest text-base">Hiệp định Giơ-ne-vơ</div>
                    <div className="text-red-100 text-xs font-medium opacity-80 italic">Ký kết chính thức ngày 20/7/1954</div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-xs text-vn-red font-bold uppercase tracking-[0.2em] mb-6 border-b border-vn-red/10 pb-2">Khung nội dung trọng tâm</p>
                  <ul className="space-y-5">
                    {[
                      { num: '01', title: 'Chấm dứt chiến sự thực địa', text: 'Thực hiện đình chỉ chiến sự tại Đông Dương, kết thúc hoàn toàn sự hiện diện quân sự của thực dân Pháp.' },
                      { num: '02', title: 'Xác lập quyền dân tộc', text: 'Các bên cam kết tôn trọng các quyền dân tộc cơ bản của Việt Nam bao gồm độc lập, chủ quyền và toàn vẹn lãnh thổ.' },
                      { num: '03', title: 'Giới tuyến quân sự tạm thời', text: 'Xác lập vĩ tuyến 17 làm giới tuyến tạm thời phục vụ công tác tập kết quân đội, không mang tính chất ranh giới lãnh thổ hay chính trị.' },
                      { num: '04', title: 'Lộ trình thống nhất quốc gia', text: 'Đề ra phương hướng tổng tuyển cử vào năm 1956 - nội dung sau đó bị các thế lực phá hoại nghiêm trọng.' },
                    ].map((pt) => (
                      <li key={pt.num} className="flex gap-5 items-start group">
                        <span className="text-vn-red font-serif font-bold text-2xl shrink-0 leading-none mt-1 opacity-80 group-hover:opacity-100 transition-opacity">{pt.num}</span>
                        <div>
                          <div className="font-bold text-history-dark text-sm mb-1 uppercase tracking-wider">{pt.title}</div>
                          <div className="text-gray-600 text-[13px] leading-relaxed">{pt.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal dir="right">
              <div className="bg-white border-t-4 border-vn-gold shadow-xl rounded-sm overflow-hidden h-full">
                <div className="bg-history-dark px-8 py-5 flex items-center gap-5">
                  <span className="text-4xl font-serif font-bold text-vn-gold">1973</span>
                  <div>
                    <div className="text-vn-gold font-bold uppercase tracking-widest text-base">Hiệp định Pa-ri</div>
                    <div className="text-gray-400 text-xs font-medium italic">Ký kết chính thức ngày 27/1/1973</div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-xs text-yellow-600 font-bold uppercase tracking-[0.2em] mb-6 border-b border-vn-gold/20 pb-2">Khung nội dung trọng tâm</p>
                  <ul className="space-y-5">
                    {[
                      { num: '01', title: 'Tôn trọng quyền dân tộc', text: 'Hoa Kỳ và các bên tham gia xác lập sự tôn trọng tuyệt đối chủ quyền và toàn vẹn lãnh thổ đất nước Việt Nam.' },
                      { num: '02', title: 'Rút toàn bộ quân đội nước ngoài', text: 'Hoa Kỳ thực hiện rút toàn bộ quân đội viễn chinh và quân đồng minh ra khỏi lãnh thổ Việt Nam vô điều kiện.' },
                      { num: '03', title: 'Chế độ ngừng bắn và tù binh', text: 'Các bên tiến hành ngừng bắn tại chỗ và thực hiện công tác trao trả toàn bộ nhân viên dân sự, quân sự bị bắt giữ.' },
                      { num: '04', title: 'Quyền tự quyết chính trị', text: 'Xác lập quyền của nhân dân miền Nam Việt Nam trong việc quyết định tương lai chính trị mà không có sự can thiệp từ bên ngoài.' },
                    ].map((pt) => (
                      <li key={pt.num} className="flex gap-5 items-start group">
                        <span className="text-vn-gold font-serif font-bold text-2xl shrink-0 leading-none mt-1 opacity-80 group-hover:opacity-100 transition-opacity">{pt.num}</span>
                        <div>
                          <div className="font-bold text-history-dark text-sm mb-1 uppercase tracking-wider">{pt.title}</div>
                          <div className="text-gray-600 text-[13px] leading-relaxed">{pt.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="bg-history-dark text-white rounded-sm shadow-2xl overflow-hidden mb-12 border border-white/5">
              <div className="bg-vn-red px-10 py-6 border-b border-vn-red/30">
                <h3 className="font-serif font-bold uppercase tracking-[0.3em] text-white text-xl">
                  Lập Trường Đàm Phán Chiến Lược (Pa-ri)
                </h3>
                <p className="text-red-100 text-[10px] uppercase tracking-widest mt-2 font-semibold opacity-80">Các nguyên tắc bất biến xuyên suốt tiến trình đàm phán</p>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                {[
                  { icon: '🛡️', title: 'Yêu cầu Hoa Kỳ chấm dứt chiến tranh', text: 'Xác lập yêu cầu Mỹ phải thừa nhận tính chất sai trái và xâm lược của cuộc chiến, chấm dứt hoàn toàn sự dính líu quân sự.' },
                  { icon: '✊', title: 'Rút quân đội viễn chinh vô điều kiện', text: 'Phải thực hiện rút hết quân đội Hoa Kỳ và đồng minh, không chấp nhận bất kỳ hình thức duy trì lực lượng quân sự nào.' },
                  { icon: '🗺️', title: 'Bảo vệ chủ quyền dân tộc cơ bản', text: 'Độc lập và toàn vẹn lãnh thổ phải được ghi nhận rõ ràng trong văn kiện pháp lý, bác bỏ mọi giải pháp phân định vĩnh viễn.' },
                  { icon: '🗳️', title: 'Khẳng định quyền tự quyết quốc gia', text: 'Tương lai chính trị miền Nam phải do chính nhân dân Việt Nam xác lập, loại bỏ mọi sự áp đặt từ các cường quốc nước ngoài.' },
                ].map((pt, i) => (
                  <div key={i} className={`p-8 flex gap-5 items-start transition-colors hover:bg-white/5 ${i < 2 ? 'border-b border-white/10' : ''} ${i % 2 === 0 ? 'md:border-r border-white/10' : ''}`}>
                    <span className="text-3xl shrink-0 opacity-80">{pt.icon}</span>
                    <div>
                      <div className="text-vn-gold font-bold text-sm mb-2 font-serif uppercase tracking-wider">{pt.title}</div>
                      <div className="text-gray-300 text-sm leading-relaxed font-sans">{pt.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            <Reveal dir="left">
              <div className="bg-white border border-gray-200 rounded-sm shadow-xl p-10 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-serif text-8xl font-bold select-none italic text-vn-red">1954</div>
                <div className="flex items-center gap-4 mb-6 pb-5 border-b-2 border-vn-red/20">
                  <VNStar size={24} className="opacity-80" />
                  <h3 className="font-serif font-bold text-history-dark uppercase tracking-widest text-lg">Ý nghĩa Hiệp định Giơ-ne-vơ</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  {[
                    'Thắng lợi ngoại giao đa phương đầu tiên của nhà nước Việt Nam Dân chủ Cộng hòa.',
                    'Kết thúc sự thống trị của thực dân Pháp tại Đông Dương, tạo căn cứ địa vững chắc cho cả nước.',
                    'Xác lập nền tảng pháp lý quốc tế cho sự nghiệp đấu tranh thống nhất quốc gia trong tương lai.',
                    'Nâng cao vị thế và uy tín chính danh của nước Việt Nam trên trường quốc tế.',
                    <span className="text-vn-red font-semibold">Thực tế lịch sử: Đất nước tạm thời chia cắt gây khó khăn cho tiến trình thống nhất quốc gia ngay lập tức.</span>,
                  ].map((pt, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-vn-red rounded-full shrink-0 mt-1.5 opacity-60" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal dir="right">
              <div className="bg-history-dark border border-white/5 rounded-sm shadow-xl p-10 h-full text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none font-serif text-8xl font-bold select-none italic text-vn-gold">1973</div>
                <div className="flex items-center gap-4 mb-6 pb-5 border-b-2 border-vn-gold/30">
                  <VNStar size={24} className="opacity-80" />
                  <h3 className="font-serif font-bold text-vn-gold uppercase tracking-widest text-lg">Ý nghĩa Hiệp định Pa-ri</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-300 leading-relaxed">
                  {[
                    'Đỉnh cao ngoại giao dân tộc, góp phần vô hiệu hóa hoàn toàn ý chí xâm lược của chính phủ Hoa Kỳ.',
                    'Hoàn thành mục tiêu chiến lược "Đánh cho Mỹ cút", làm thay đổi căn bản tương quan lực lượng.',
                    'Tạo bước ngoặt quyết định cho cuộc Tổng tiến công và nổi dậy mùa Xuân năm 1975.',
                    { text: 'Xác lập bàn đạp pháp lý và thực địa để thực hiện mục tiêu thống nhất Tổ quốc.', bold: true },
                    'Ghi dấu ấn trí tuệ và bản lĩnh của nền ngoại giao Việt Nam trong thời đại mới.',
                  ].map((pt, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-vn-gold rounded-full shrink-0 mt-1.5 opacity-60" />
                      <span className={typeof pt === 'object' ? 'text-vn-gold font-bold' : ''}>{typeof pt === 'object' ? pt.text : pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SO SÁNH ĐỐI CHIẾU CHIẾN LƯỢC
      ════════════════════════════════ */}
      <section id="comparison" className="py-24 bg-white relative font-sans overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-vn-red via-vn-gold to-vn-red" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="section-title">Đối Chiếu Chiều Sâu Chiến Lược</h2>
          </Reveal>

          <Reveal className="mb-14">
            <div className="bg-[#fcfaf2] border border-vn-gold/20 rounded-sm p-8 shadow-xl">
              <h3 className="text-center text-lg font-serif font-bold text-history-dark uppercase tracking-[0.2em] mb-6">
                Các Thuộc Tính Chung Của Hai Hiệp Định
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  'Đều là thắng lợi ngoại giao gắn liền mật thiết với các thành tựu quân sự mang tính bước ngoặt.',
                  'Đều ghi nhận đầy đủ các quyền dân tộc cơ bản của Việt Nam trên văn bản pháp lý quốc tế.',
                  'Đều thể hiện nghệ thuật kết hợp nhuần nhuyễn giữa sức mạnh dân tộc và sự ủng hộ của thời đại.',
                ].map((text, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4 p-5 bg-white rounded-sm border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <VNStar size={24} className="opacity-70" />
                    <p className="text-gray-700 text-[13px] leading-relaxed font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto shadow-2xl rounded-sm border border-gray-200">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-history-dark text-white uppercase tracking-wider text-center">
                    <th className="p-6 font-serif text-sm border-b-4 border-vn-red w-1/4">Tiêu chí đối chiếu</th>
                    <th className="p-6 font-serif text-sm border-b-4 border-vn-red border-l border-white/5 w-3/8 text-vn-gold">
                      Hiệp định Giơ-ne-vơ (1954)
                    </th>
                    <th className="p-6 font-serif text-sm border-b-4 border-vn-red border-l border-white/5 w-3/8 text-vn-gold">
                      Hiệp định Pa-ri (1973)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px] md:text-sm">
                  {[
                    ['Cơ chế đàm phán', 'Đàm phán đa phương, chịu sự chi phối mạnh mẽ từ trật tự Hai cực.', 'Cơ chế song phương và bốn bên - Việt Nam giữ quyền tự chủ tuyệt đối.', true],
                    ['Thực lực quân sự', 'Kết quả trực tiếp từ chiến thắng Điện Biên Phủ mang tính chấn động.', 'Kết quả của sự vô hiệu hóa các áp lực quân sự tối tân nhất của Mỹ năm 1972.', true],
                    ['Tính độc lập chiến lược', 'Phụ thuộc nhất định vào sự thỏa hiệp giữa các nước lớn đương thời.', 'Việt Nam hoàn toàn tự quyết tiến trình, phối hợp tranh thủ hỗ trợ đồng minh.', false],
                    ['Tính chất rút quân', 'Thực hiện tập kết quân sự của cả hai bên ra hai khu vực ngăn cách tạm thời.', 'Chỉ lực lượng Hoa Kỳ phải rút quân, lực lượng Việt Nam giữ vững vị thế tại chỗ.', true],
                    ['Tiến trình quốc gia', 'Để lại tình trạng chia cắt và chưa giải quyết dứt điểm mục tiêu thống nhất.', 'Xác lập tiền đề thực tiễn để giải phóng miền Nam, thống nhất đất nước.', true],
                    ['Vị thế chính trị', 'Kết thúc sự hiện diện của thực dân Pháp xâm lược tại miền Bắc.', 'Xác lập thất bại chiến lược của Hoa Kỳ, mở đường cho kỷ nguyên độc lập.', true],
                  ].map(([criteria, gnv, pri, highlight], i) => (
                    <tr key={i} className={`border-b border-gray-100 hover:bg-red-50/30 transition-colors ${i % 2 === 0 ? 'bg-gray-50/20' : 'bg-white'}`}>
                      <td className="p-5 font-bold text-history-dark uppercase text-[10px] tracking-widest bg-gray-50/50">{criteria}</td>
                      <td className="p-5 text-gray-600 border-l border-gray-100 leading-relaxed">{gnv}</td>
                      <td className={`p-5 border-l border-gray-100 leading-relaxed ${highlight ? 'text-vn-red font-bold bg-red-50/20' : 'text-gray-600'}`}>{pri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="bg-history-dark text-center p-12 rounded-sm border-l-8 border-r-8 border-vn-red shadow-2xl">
              <p className="text-vn-gold font-serif italic text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto uppercase tracking-wide">
                "Hiệp định Giơ-ne-vơ kết thúc sự thống trị thực dân Pháp, trong khi Hiệp định Pa-ri vô hiệu hóa sự can thiệp quân sự của Mỹ, mở đường thực chất cho sự nghiệp thống nhất quốc gia."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BÀI HỌC KINH NGHIỆM ĐỐI NGOẠI
      ════════════════════════════════ */}
      <section id="lessons" className="py-24 bg-gradient-to-b from-[#1a0505] to-history-dark text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none" />
        <Particles count={15} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Bài Học Kinh Nghiệm Đối Ngoại
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic opacity-80 leading-relaxed">
              Những giá trị cốt lõi được đúc kết từ lịch sử hiện thực hóa mục tiêu phát triển và hội nhập của dân tộc trong giai đoạn hiện nay.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: '01', icon: '✊',
                title: 'Xây dựng vị thế quốc tế dựa trên thực lực',
                text: 'Tiến trình đàm phán lịch sử chứng minh ngoại giao luôn phải song hành với sức mạnh dân tộc. Ngày nay, thực lực quốc gia được định vị bằng nội lực kinh tế bền vững và sự ổn định chính trị, tạo nền tảng để Việt Nam có tiếng nói trọng lượng trong các tổ chức như Tổ chức Thương mại Thế giới (WTO) hay Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP).',
                color: 'border-vn-red',
              },
              {
                num: '02', icon: '🎋',
                title: 'Nguyên lý "Dĩ bất biến, ứng vạn biến"',
                text: 'Kiên định mục tiêu độc lập dân tộc và lợi ích tối cao của quốc gia là nguyên tắc "bất biến", đồng thời linh hoạt trong phương thức thực hiện sách lược đối ngoại. Đây là bài học có ý nghĩa sống còn trong việc xử lý các quan hệ ngoại giao đa phương phức tạp và các cuộc đàm phán kinh tế quốc tế hiện đại.',
                color: 'border-vn-gold',
              },
              {
                num: '03', icon: '⚙️',
                title: 'Sự phối hợp đồng bộ trong hệ thống chính trị',
                text: 'Công tác đối ngoại thành công đòi hỏi sự phối hợp nhịp nhàng giữa các cấp quản lý, cơ quan tham mưu, an ninh và truyền thông báo chí. Làm việc lớn đòi hỏi sức mạnh của sự đồng thuận và tính chuyên nghiệp trong khâu triển khai thay vì các nỗ lực đơn lẻ mang tính cá nhân.',
                color: 'border-vn-red',
              },
              {
                num: '04', icon: '🌍',
                title: 'Kết hợp bản sắc dân tộc và xu thế thời đại',
                text: 'Biết cách tranh thủ các nguồn lực và sự ủng hộ từ môi trường quốc tế nhưng luôn duy trì tính độc lập, tự chủ trong mọi quyết sách. Lợi ích quốc gia và nguyện vọng nhân dân luôn là kim chỉ nam cho mọi bước tiến ngoại giao trên trường quốc tế.',
                color: 'border-vn-gold',
              },
            ].map((lesson, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className={`bg-white/5 border-l-4 ${lesson.color} p-10 rounded-sm backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group relative overflow-hidden h-full`}>
                  <div className="text-7xl absolute -left-3 -top-4 font-serif font-bold text-vn-red opacity-10 group-hover:opacity-20 transition-opacity select-none">{lesson.num}</div>
                  <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-500 inline-block">{lesson.icon}</div>
                  <h4 className="text-xl text-vn-gold font-serif font-bold mb-5 leading-snug tracking-wide">{lesson.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm opacity-90">{lesson.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="text-center border-t border-vn-red/20 pt-14">
              <p className="text-2xl md:text-3xl font-serif italic text-vn-gold animate-fire leading-relaxed max-w-4xl mx-auto uppercase tracking-widest">
                "Hòa bình không phải là sự ban phát, mà là kết quả của bản lĩnh tự chủ và thực lực dân tộc."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          NHÀ NGOẠI GIAO VIỆT NAM (KIẾN TRÚC SƯ)
      ════════════════════════════════ */}
      <section id="real-world" className="py-24 bg-history-dark text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a0505]" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Các Nhà Ngoại Giao Tiêu Biểu
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic opacity-80 leading-relaxed">
              Sự kết hợp giữa trí tuệ, bản lĩnh và tính chính nghĩa của phái đoàn Việt Nam trong tiến trình đấu trí lịch sử.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: 'Phạm Văn Đồng', title: 'Trưởng phái đoàn (1954)', color: 'border-vn-gold', glow: 'hover:shadow-[0_10px_40px_rgba(255,205,0,0.2)]',
                img: getImg('pham-van-dong.jpg'),
                nameColor: 'text-vn-gold',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Trưởng phái đoàn Việt Nam Dân chủ Cộng hòa (VNDCCH) tại Hội nghị Giơ-ne-vơ 1954. Với bản lĩnh và sự sắc sảo, ông đã đấu tranh quyết liệt để quốc tế công nhận độc lập, chủ quyền của Việt Nam.',
              },
              {
                name: 'Lê Đức Thọ', title: 'Cố vấn Đặc biệt (1973)', color: 'border-vn-gold', glow: 'hover:shadow-[0_10px_40px_rgba(255,205,0,0.2)]',
                img: getImg('le-duc-tho.jpg'),
                nameColor: 'text-vn-gold',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Đại diện đàm phán bí mật tại Pa-ri — người trực tiếp đối trọng với Henry Kissinger. Ông nổi tiếng với phong thái kiên định về nguyên tắc chiến lược nhưng linh hoạt trong sách lược ngoại giao.',
              },
              {
                name: 'Xuân Thủy', title: 'Trưởng đoàn Đàm phán (1973)', color: 'border-gray-400', glow: 'hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]',
                img: getImg('xuan-thuy.jpg'),
                nameColor: 'text-white',
                tagStyle: 'text-gray-400 bg-gray-800',
                desc: 'Trưởng đoàn VNDCCH tại các phiên họp công khai Hội nghị Pa-ri. Ông đảm nhiệm vai trò cầm nhịp và điều phối, tạo không gian chiến thuật cho các cuộc tiếp xúc bí mật đạt kết quả.',
              },
              {
                name: 'Nguyễn Thị Bình', title: 'Trưởng đoàn Đàm phán (1973)', color: 'border-vn-red', glow: 'hover:shadow-[0_10px_40px_rgba(218,37,29,0.2)]',
                img: getImg('nguyen-thi-binh.jpg'),
                nameColor: 'text-white',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Trưởng đoàn Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam (CP CMLT CHMN VN). Bà là biểu tượng cho tính chính nghĩa và nhạy bén chính trị trên trường quốc tế.',
              },
            ].map((person, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={`bg-[#1a1a1a] border ${person.color} p-10 rounded-sm text-center ${person.glow} hover:-translate-y-3 transition-all duration-700 group h-full flex flex-col`}>
                  <div className={`w-44 h-44 mx-auto rounded-full overflow-hidden border-4 ${person.color} mb-8 shadow-xl relative`}>
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className={`text-2xl font-serif font-bold ${person.nameColor} mb-2 uppercase tracking-widest`}>{person.name}</h3>
                  <p className={`font-bold uppercase text-[10px] mb-6 tracking-[0.2em] py-1.5 px-4 inline-block rounded-sm ${person.tagStyle}`}>{person.title}</p>
                  <p className="text-gray-300 text-[13px] leading-relaxed opacity-90 flex-1">{person.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-14">
            {[
              {
                icon: '🤝', name: 'Đại sứ Hà Văn Lâu', tag: 'Công tác chuẩn bị và tiếp xúc sơ bộ',
                desc: 'Thực hiện nhiệm vụ chuẩn bị kỹ thuật và các cuộc tiếp xúc sơ khai cho Hội nghị Pa-ri. Sự chuyên nghiệp trong giai đoạn đầu đã tạo nền tảng vững chắc cho hoạt động đàm phán chính thức.',
                border: 'hover:border-vn-gold/50',
              },
              {
                icon: '🛡️', name: 'Lực lượng Bảo vệ & Hỗ trợ', tag: 'An ninh và phục vụ đàm phán',
                desc: 'Đảm bảo tuyệt đối an toàn và tính bảo mật của các thông tin chiến lược trong suốt tiến trình đàm phán dài ngày. Đây là minh chứng cho sự phối hợp tổng lực trong công tác đối ngoại.',
                border: 'hover:border-vn-red/50',
              },
            ].map((item, i) => (
              <Reveal key={i} dir={i === 0 ? 'left' : 'right'}>
                <div className={`bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-white/5 p-8 rounded-sm flex items-center gap-8 ${item.border} transition-all duration-500 text-left`}>
                  <div className="w-20 h-20 shrink-0 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center text-4xl shadow-inner">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-vn-gold mb-1 tracking-wide">{item.name}</h3>
                    <p className="text-gray-500 font-bold uppercase text-[9px] mb-3 tracking-widest leading-none">{item.tag}</p>
                    <p className="text-gray-400 text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TIẾN TRÌNH ĐÀM PHÁN BÍ MẬT
      ════════════════════════════════ */}
      <section id="secret-talks" className="py-24 bg-[#0a0805] text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a0a00_0%,_#0a0805_60%)] opacity-80" />
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #da251d 0, #da251d 1px, transparent 0, transparent 50%)', backgroundSize: '30px 30px' }} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-vn-red/40" />
              <span className="text-vn-red text-[10px] font-bold uppercase tracking-[0.5em]">Phân tích đàm phán bí mật</span>
              <div className="h-px w-16 bg-vn-red/40" />
            </div>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Tiến Trình Đàm Phán Kín
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic opacity-80 leading-relaxed">
              Phân tích vai trò của kênh đàm phán bí mật — nơi các vấn đề thực chất được giải quyết một cách chuyên sâu.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-0 mb-16 rounded-sm overflow-hidden border border-white/5 shadow-2xl">
            <Reveal dir="left">
              <div className="bg-[#1a0505] border-r border-white/5 p-10 flex flex-col items-center text-center h-full group">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-vn-red mb-6 shadow-2xl relative">
                  <img src={getImg('le-duc-tho.jpg')} alt="Lê Đức Thọ"
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-vn-gold uppercase tracking-widest mb-1 leading-none">Lê Đức Thọ</h3>
                <p className="text-vn-red text-[9px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-vn-red/20 pb-2">Cố vấn Đặc biệt · Phía Việt Nam</p>
                <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                  Người đảm nhiệm toàn quyền quyết định tại kênh đàm phán bí mật. Ông đã vận dụng sách lược 
                  <span className="text-vn-gold font-semibold italic"> kiên nhẫn chiến thuật</span> nhằm khai thác các áp lực chính trị nội bộ của Hoa Kỳ, 
                  từ đó buộc đối phương phải nhượng bộ dựa trên các nguyên tắc chiến lược mà Việt Nam đặt ra.
                </p>
              </div>
            </Reveal>
            <Reveal dir="right">
              <div className="bg-[#00050f] p-10 flex flex-col items-center text-center h-full group">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-800 mb-6 shadow-2xl relative">
                  <img src={getImg('kissinger.jpg')} alt="Henry Kissinger"
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-blue-400 uppercase tracking-widest mb-1 leading-none">Henry Kissinger</h3>
                <p className="text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-blue-500/20 pb-2">Cố vấn An ninh · Phía Hoa Kỳ</p>
                <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                  Đại diện phía Hoa Kỳ với mục tiêu tìm kiếm một <span className="text-blue-400 font-semibold italic">giải pháp danh dự</span> để rút lui khỏi chiến tranh. 
                  Ông phải đối mặt với các áp lực kép từ chính phủ Nixon và sự kiên định của phái đoàn Việt Nam trên bàn thương lượng.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6 mb-16">
            {[
              {
                date: '21/2/1970',
                title: 'Khởi đầu đàm phán kín — Thăm dò lập trường căn bản',
                vn: 'Xác lập 4 nguyên tắc chiến lược không thể nhân nhượng, bác bỏ các đề xuất mang tính thỏa hiệp của phía Hoa Kỳ.',
                us: 'Thăm dò các khả năng thiết lập một khu vực trung lập hóa tại miền Nam nhằm bảo toàn lợi ích chính trị.',
                result: 'Xác lập kênh thông tin bí mật chính thức như một thực tế song hành với hội nghị công khai.',
                tag: 'Khởi đầu', tagColor: 'bg-gray-800',
              },
              {
                date: '26/6/1971',
                title: 'Đề xuất giải pháp 9 điểm — Chủ động dẫn dắt đàm phán',
                vn: 'Chủ động đưa ra lộ trình giải quyết toàn diện, tạo sức ép chính trị và tranh thủ sự ủng hộ của dư luận quốc tế.',
                us: 'Gặp nhiều khó khăn trong việc ứng phó với thế chủ động của Việt Nam trên bàn thương lượng bí mật.',
                result: 'Dư luận thế giới bắt đầu đánh giá cao thiện chí và tính xây dựng trong các đề xuất của Việt Nam.',
                tag: 'Chủ động', tagColor: 'bg-vn-red',
              },
              {
                date: '8–11/10/1972',
                title: 'Bước ngoặt đột phá — Đưa ra dự thảo hiệp định toàn văn',
                vn: 'Thực hiện bước đi táo bạo khi đưa ra toàn văn dự thảo Hiệp định, buộc Hoa Kỳ phải đi vào thảo luận chi tiết.',
                us: 'Thừa nhận các điểm đột phá và cho rằng hòa bình đã đạt được khung thỏa thuận cơ bản.',
                result: 'Các bên đạt được sự thống nhất về nguyên tắc, mở đường cho giai đoạn ký kết sau cùng.',
                tag: 'Đột phá', tagColor: 'bg-vn-gold text-black',
              },
              {
                date: '23/11–13/12/1972',
                title: 'Khủng hoảng đàm phán — Sự thay đổi lập trường của Hoa Kỳ',
                vn: 'Kiên quyết bác bỏ các yêu cầu sửa đổi phi lý từ phía Mỹ và tuyên bỏ đình chỉ các cuộc tiếp xúc bí mật.',
                us: 'Thực hiện hành động quân sự cực đoan (Linebacker II) nhằm ép buộc Việt Nam chấp nhận các điều kiện có lợi cho Mỹ.',
                result: 'Thất bại quân sự sau 12 ngày đêm đã buộc Hoa Kỳ phải từ bỏ các áp lực cưỡng chế ngoại giao.',
                tag: 'Kháng cự', tagColor: 'bg-orange-900',
              },
              {
                date: '8–23/1/1973',
                title: 'Giai đoạn kết thúc — Hoa Kỳ chấp nhận các điều khoản căn bản',
                vn: 'Giữ vững lập trường và chỉ chấp thuận các điều chỉnh mang tính kỹ thuật không ảnh hưởng đến nội dung cốt lõi.',
                us: 'Thừa nhận sự bế tắc của các áp lực quân sự và quay trở lại bản dự thảo mang tính thỏa thuận của tháng 10.',
                result: 'Văn bản ký tắt được xác lập, khẳng định thắng lợi chiến lược của nền ngoại giao Việt Nam.',
                tag: 'Thành quả', tagColor: 'bg-vn-gold text-black',
              },
            ].map((talk, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden hover:border-vn-red/30 transition-all duration-500 group">
                  <div className="flex items-center gap-4 px-8 py-4 border-b border-white/5 bg-black/40">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm ${talk.tagColor}`}>{talk.tag}</span>
                    <span className="text-vn-gold font-bold text-sm font-serif tracking-wider">{talk.date}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-sans">Địa điểm: Paris (Kín)</span>
                  </div>
                  <div className="p-8">
                    <h4 className="text-lg text-vn-gold font-serif font-bold mb-6 tracking-wide leading-snug">{talk.title}</h4>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-vn-red/5 border border-vn-red/10 rounded-sm p-5 transition-colors group-hover:bg-vn-red/10">
                        <div className="text-vn-red text-[9px] font-bold uppercase tracking-[0.2em] mb-3 border-b border-vn-red/10 pb-1">Phái đoàn Việt Nam</div>
                        <p className="text-gray-300 text-[13px] leading-relaxed opacity-90">{talk.vn}</p>
                      </div>
                      <div className="bg-blue-900/10 border border-blue-800/15 rounded-sm p-5 transition-colors group-hover:bg-blue-900/20">
                        <div className="text-blue-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 border-b border-blue-400/10 pb-1">Chính phủ Hoa Kỳ</div>
                        <p className="text-gray-300 text-[13px] leading-relaxed opacity-90">{talk.us}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 border-l-2 border-vn-gold pl-5 py-3">
                      <span className="text-vn-gold text-[10px] font-bold uppercase tracking-widest opacity-80">Kết quả đợt tiếp xúc · </span>
                      <span className="text-gray-300 text-[13px] italic font-sans opacity-90">{talk.result}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="animated-border rounded-sm p-px shadow-2xl">
              <div className="bg-black/85 rounded-sm p-10 md:p-14 text-center">
                <p className="text-[10px] text-vn-red font-bold uppercase tracking-[0.5em] mb-6">Đánh giá sử học</p>
                <p className="text-vn-gold font-serif italic text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto uppercase tracking-wide">
                  "Tại kênh đàm phán bí mật, các nhà ngoại giao Việt Nam không chỉ hướng tới một thỏa thuận đình chiến, mà đã kiến tạo một thế trận chiến lược định hình tương lai thống nhất đất nước."
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-10 text-center">
                  <div>
                    <div className="text-4xl font-serif font-bold text-vn-gold">45</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-2 font-bold leading-none">Cuộc gặp riêng cấp cao</div>
                  </div>
                  <div className="hidden md:block w-px bg-white/10" />
                  <div>
                    <div className="text-4xl font-serif font-bold text-vn-gold">~3 năm</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-2 font-bold leading-none">Hoạt động đàm phán kín</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          PHÍA ĐỐI LẬP (PHÂN TÍCH NHÂN VẬT)
      ════════════════════════════════ */}
      <section id="opposing-side" className="py-24 bg-[#0a0a12] text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a0a1a_0%,_#000_80%)]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-blue-400 mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Phía Đối Lập
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-600" />
            </h2>
            <p className="text-center text-lg text-gray-500 mb-16 max-w-3xl mx-auto font-serif italic opacity-80 leading-relaxed">
              Các nhân vật đại diện cho các quyết sách và chiến lược từ phía Pháp, Hoa Kỳ và chính quyền Việt Nam Cộng hòa (VNCH).
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Pierre Mendès France', role: 'Thủ tướng Pháp (1954)',
                img: getImg('pierre-mendes-france.jpg'),
                border: 'border-blue-900/40', hoverBorder: 'hover:border-blue-500/60',
                desc: 'Người đại diện chính phủ Pháp ký kết Hiệp định Giơ-ne-vơ. Ông đã đưa ra cam kết lịch sử về việc giải quyết hòa bình tại Đông Dương trong thời hạn 30 ngày đàm phán.',
              },
              {
                name: 'Richard Nixon', role: 'Tổng thống Hoa Kỳ',
                img: getImg('nixon.jpg'),
                border: 'border-blue-900/40', hoverBorder: 'hover:border-blue-500/60',
                desc: 'Người đề ra "Học thuyết Nixon" và triển khai chiến lược "Việt Nam hóa chiến tranh". Ông là người ra các quyết sách leo thang quân sự khốc liệt nhằm tìm kiếm vị thế đàm phán có lợi cho Mỹ.',
              },
              {
                name: 'Henry Kissinger', role: 'Cố vấn An ninh Quốc gia Mỹ',
                img: getImg('kissinger.jpg'),
                border: 'border-blue-800/40', hoverBorder: 'hover:border-blue-400/60',
                desc: 'Nhà ngoại giao kỳ cựu trực tiếp tham gia tiến trình đàm phán bí mật. Sau này, ông đã thừa nhận sự kiên định và mưu lược của phái đoàn Việt Nam vượt xa các dự báo chiến lược từ phía Mỹ.',
              },
              {
                name: 'Ngô Đình Diệm', role: 'Tổng thống VNCH (1955-1963)',
                img: getImg('ngo-dinh-diem.jpg'),
                border: 'border-blue-900/40', hoverBorder: 'hover:border-blue-700/60',
                desc: 'Nhân vật tiêu biểu cho chính sách phá hoại Hiệp định Giơ-ne-vơ sau năm 1954 tại miền Nam. Liên minh Mỹ - Diệm bị ghi nhận với các hành động từ chối hiệp thương tổng tuyển cử quốc gia.',
              },
            ].map((person, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={`bg-[#111] border ${person.border} p-10 rounded-sm ${person.hoverBorder} transition-all duration-700 group h-full flex flex-col`}>
                  <div className={`w-40 h-40 mx-auto rounded-full overflow-hidden border-4 ${person.border} mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl`}>
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-blue-400 mb-2 uppercase tracking-widest">{person.name}</h3>
                  <p className="text-blue-500 font-bold uppercase text-[9px] mb-6 tracking-[0.2em] bg-blue-500/10 py-1.5 px-4 inline-block rounded-sm">{person.role}</p>
                  <p className="text-gray-400 text-[13px] leading-relaxed italic opacity-90 flex-1">{person.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HỆ THỐNG TƯ LIỆU THAM KHẢO
      ════════════════════════════════ */}
      <section id="references" className="py-24 bg-[#fdf6e3] relative font-sans">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-50" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="section-title">Danh Mục Tư Liệu Tham Khảo</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {[
              { icon: '📖', title: 'Giáo trình Lịch sử Đảng Cộng sản Việt Nam (VNR202)', desc: 'Chương 2 về nội dung Đảng lãnh đạo hai cuộc kháng chiến chống ngoại xâm, thống nhất đất nước (1945–1975).', links: [{ label: 'Tư liệu học tập', url: '#' }] },
              { icon: '🏛️', title: 'Cổng thông tin điện tử Bộ Ngoại giao Việt Nam', desc: 'Các chuyên đề nghiên cứu về ý nghĩa và bài học ngoại giao của các Hiệp định lịch sử trong thế kỷ XX.', links: [{ label: 'Truy cập MOFA', url: 'https://www.mofa.gov.vn/' }] },
              { icon: '📰', title: 'Hệ thống lưu trữ báo chí - Báo Nhân Dân', desc: 'Các tài liệu, văn kiện và timeline chi tiết về các tiến trình đàm phán tại Giơ-ne-vơ và Pa-ri.', links: [{ label: 'Hồ sơ sự kiện', url: 'https://nhandan.vn/' }] },
              { icon: '🇺🇸', title: 'Hồ sơ giải mật - Bộ Ngoại giao Hoa Kỳ', desc: 'Cung cấp các tư liệu từ phía Mỹ phục vụ cho việc nghiên cứu đối chứng và khách quan tiến trình lịch sử.', links: [{ label: 'Foreign Relations', url: 'https://history.state.gov/' }] },
              { icon: '🏆', title: 'Tư liệu giải thưởng Nobel (NobelPrize.org)', desc: 'Ghi nhận về đề cử và quyết định từ chối giải Nobel Hòa bình năm 1973 của cố vấn Việt Nam.', links: [{ label: 'Nobel Facts 1973', url: 'https://www.nobelprize.org/prizes/peace/1973/tho/facts/' }] },
              { icon: '🏛️', title: 'Bảo tàng Lịch sử Quốc gia', desc: 'Các hiện vật và tài liệu lưu trữ về công tác hỗ trợ phục vụ đoàn đàm phán tại nước ngoài.', links: [{ label: 'Tài liệu lưu trữ', url: 'http://baotanglichsu.vn/' }] },
            ].map((ref, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white p-8 border-l-4 border-vn-gold shadow-lg flex gap-6 items-start hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 rounded-sm h-full flex flex-col">
                  <div className="flex gap-6 items-start flex-1 w-full">
                    <div className="text-4xl mt-1 opacity-70 group-hover:opacity-100">{ref.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-history-dark text-base mb-2 font-serif uppercase tracking-wider">{ref.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-sans opacity-90 mb-4">{ref.desc}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 w-full border-t border-gray-100 pt-4">
                    {ref.links?.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-vn-red text-[9px] font-bold uppercase tracking-widest hover:text-vn-gold transition-all flex items-center gap-2 border border-vn-red/20 px-3 py-2 rounded-sm hover:bg-vn-red/5 flex-1 justify-center min-w-[120px]"
                      >
                        {link.label} ➜
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          DANH SÁCH NHÂN SỰ THỰC HIỆN
      ════════════════════════════════ */}
      <section id="team" className="py-24 bg-white border-t-4 border-vn-red relative font-sans">
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <Reveal>
            <h2 className="section-title">Thành Viên Nhóm Nghiên Cứu</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
            {[
              { name: 'Nguyễn Văn A', role: 'Thuyết trình viên 1', task: 'Phần 1–2 · Phân tích bối cảnh', slides: 'Nội dung Slide 1–2' },
              { name: 'Trần Thị B',   role: 'Thuyết trình viên 2', task: 'Phần 3–4 · Nghiên cứu sử liệu', slides: 'Nội dung Slide 3–4' },
              { name: 'Lê Văn C',     role: 'Thuyết trình viên 3', task: 'Phần 5–7 · Thiết kế kỹ thuật',      slides: 'Nội dung Slide 5–7' },
              { name: 'Phạm Thị D',   role: 'Thuyết trình viên 4', task: 'Phần 8–10 · Tổng hợp bài học', slides: 'Nội dung Slide 8–10' },
            ].map((member, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#fcfcfc] p-8 text-center border-t-4 border-vn-red shadow-xl hover:-translate-y-3 transition-all duration-700 rounded-sm group flex flex-col items-center h-full">
                  <div className="w-20 h-20 bg-history-dark text-vn-gold flex items-center justify-center rounded-full text-3xl font-serif font-bold mb-6 group-hover:bg-vn-red group-hover:text-white transition-all duration-500 shadow-2xl">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="font-serif font-bold text-history-dark text-lg mb-2 uppercase tracking-wide leading-none">{member.name}</h4>
                  <p className="text-vn-red text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{member.role}</p>
                  <p className="text-vn-gold text-[9px] font-bold uppercase tracking-widest mb-4 border-b border-vn-gold/20 pb-1">{member.slides}</p>
                  <p className="text-gray-500 text-[11px] font-medium leading-relaxed italic mt-auto">{member.task}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* ── CHÂN TRANG (FOOTER) ── */}
      <footer className="bg-history-dark border-t-2 border-vn-red text-center py-12 relative overflow-hidden">
        <div className="flex justify-center mb-6">
          <VNStar size={40} className="animate-flicker" />
        </div>
        <p className="text-gray-500 text-[10px] font-sans tracking-[0.3em] uppercase mb-3">
          © 2026 Nội dung phục vụ công tác nghiên cứu học tập
          <span className="text-vn-gold"> Giáo trình VNR202</span>
        </p>
        <p className="text-gray-600 text-xs italic font-serif max-w-2xl mx-auto px-4 opacity-80 uppercase tracking-widest">
          "Độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ là những quyền dân tộc cơ bản bất biến của dân tộc Việt Nam."
        </p>
      </footer>
    </div>
  );
}

export default App;
