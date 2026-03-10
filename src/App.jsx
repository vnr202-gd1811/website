import { useEffect, useState, useRef, useCallback } from 'react';
import './index.css';

/* ─── Section nav config ─── */
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
  { id: 'opposing-side', label: 'Phía đối lập' },
  { id: 'references',    label: 'Tư liệu tham khảo' },
  { id: 'team',          label: 'Thành viên nhóm' },
];

/* ─── Vietnamese 5-point star SVG ─── */
function VNStar({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="#ffcd00">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </svg>
  );
}

/* ─── Floating particle system ─── */
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

/* ─── Animated counter ─── */
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

/* ─── Scroll-reveal wrapper ─── */
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

/* ─── Marquee ticker ─── */
const TICKER_ITEMS = [
  '⚔ Điện Biên Phủ 7/5/1954',
  '✦ Hội nghị Giơ-ne-vơ 8/5/1954',
  '★ Hiệp định Giơ-ne-vơ 20/7/1954',
  '⚔ Hội nghị Pa-ri khai mạc 13/5/1968',
  '✦ Điện Biên Phủ trên không 12/1972',
  '★ Hiệp định Pa-ri 27/1/1973',
  '⚔ Đại thắng mùa Xuân 30/4/1975',
  '✦ Vừa đánh vừa đàm',
  '★ Độc lập – Tự do – Hạnh phúc',
];

function MarqueeTicker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-vn-red border-y-2 border-vn-gold overflow-hidden py-2 relative z-20">
      <div className="flex whitespace-nowrap animate-marquee gap-16">
        {repeated.map((item, i) => (
          <span key={i} className="text-vn-gold font-bold uppercase tracking-widest text-xs px-4">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
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
    <div className="min-h-screen">

      {/* ── Bubble sidebar ── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 relative group ${
              activeSection === s.id
                ? 'bg-vn-gold scale-150 animate-pulse-gold'
                : 'bg-vn-red/50 hover:bg-vn-red'
            }`}
          >
            <span className="absolute right-7 top-1/2 -translate-y-1/2 bg-black/90 text-vn-gold px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-vn-red/40 shadow-lg">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center bg-hero-pattern bg-cover bg-center bg-fixed relative overflow-hidden red-scanline noise-layer"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#3b0000]/60 to-black/90 z-0" />
        <Particles count={50} />

        {/* Spinning star watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-star-spin pointer-events-none z-0">
          <VNStar size={600} />
        </div>

        {/* Corner stars */}
        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} opacity-60 z-10`} style={{ animationDelay: `${i * 0.5}s` }}>
            <VNStar size={28} />
          </div>
        ))}

        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          {/* Red top bar accent */}
          <div className="w-32 h-1 bg-vn-red mb-8 animate-pulse-red rounded" />

          <div className="border-2 border-vn-red p-8 md:p-16 bg-black/50 backdrop-blur-md max-w-5xl rounded-sm shadow-2xl animate-pulse-red">
            <p className="text-vn-red font-bold uppercase tracking-[0.4em] text-sm mb-6">
              Chương II · Giáo trình VNR202
            </p>

            <div
              className="glitch-wrapper"
              data-text="Đảng Lãnh Đạo Hai Cuộc Kháng Chiến"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight uppercase gold-shimmer">
                Đảng Lãnh Đạo<br />Hai Cuộc Kháng Chiến
              </h1>
            </div>

            <p className="text-base md:text-lg text-gray-300 font-sans font-light mb-8 tracking-widest uppercase">
              Chống ngoại xâm · Thống nhất đất nước · 1945–1975
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-20 bg-vn-red" />
              <VNStar size={32} />
              <div className="h-px w-20 bg-vn-red" />
            </div>

            <h2 className="text-2xl md:text-4xl text-white font-serif mb-3 uppercase tracking-wider">
              Ngoại Giao Thời Chiến
            </h2>
            <h3 className="text-xl md:text-2xl text-vn-gold italic font-serif animate-fire">
              Từ Hiệp định Giơ-ne-vơ đến Hiệp định Pa-ri
            </h3>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-vn-red/40 pt-8">
              {[
                { n: '1954', label: 'Giơ-ne-vơ' },
                { n: '→', label: 'Vừa đánh vừa đàm' },
                { n: '1973', label: 'Pa-ri' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-serif font-bold text-vn-gold">{item.n}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scrollTo('stats')}
            className="mt-12 text-vn-gold border border-vn-gold/50 px-8 py-3 uppercase tracking-widest text-sm hover:bg-vn-gold hover:text-black transition-all duration-300 animate-pulse-gold"
          >
            Khám phá ↓
          </button>
        </div>
      </section>

      {/* ── Marquee ticker ── */}
      <MarqueeTicker />

      {/* ════════════════════════════════
          STATS COUNTER BAR
      ════════════════════════════════ */}
      <section id="stats" className="py-20 bg-vn-red relative overflow-hidden noise-layer">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000] via-vn-red to-[#8b0000] animate-grad-shift" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-vn-gold text-center font-serif font-bold uppercase tracking-wider mb-4">
              Con Số Lịch Sử
            </h2>
            <p className="text-center text-red-200 text-sm mb-12 uppercase tracking-widest">Hội nghị Pa-ri 1968–1973</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: 201,  suffix: '',    label: 'Phiên họp công khai',    icon: '🏛️' },
              { val: 45,   suffix: '',    label: 'Cuộc gặp riêng cấp cao', icon: '🤝' },
              { val: 500,  suffix: '+',   label: 'Cuộc họp báo',           icon: '📰' },
              { val: 1000, suffix: '+',   label: 'Cuộc phỏng vấn',         icon: '🎙️' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="bg-black/30 backdrop-blur-sm border border-vn-gold/30 p-6 text-center rounded-sm hover:bg-black/50 hover:border-vn-gold/70 transition-all duration-300 animate-float-card" style={{ animationDelay: `${i * 0.8}s` }}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-4xl md:text-5xl font-serif font-bold text-vn-gold mb-2">
                    <Counter target={item.val} suffix={item.suffix} />
                  </div>
                  <div className="text-xs text-red-200 uppercase tracking-wider">{item.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <Reveal dir="left">
              <div className="bg-black/30 border border-vn-gold/20 p-6 rounded-sm text-center">
                <div className="text-5xl font-serif font-bold text-vn-gold mb-2">4 năm 8 tháng 14 ngày</div>
                <div className="text-red-200 text-sm uppercase tracking-widest">Tổng thời gian đàm phán Pa-ri</div>
              </div>
            </Reveal>
            <Reveal dir="right">
              <div className="bg-black/30 border border-vn-gold/20 p-6 rounded-sm text-center">
                <div className="text-3xl font-serif font-bold text-vn-gold mb-2">75 ngày · 8 phiên rộng · 23 phiên hẹp</div>
                <div className="text-red-200 text-sm uppercase tracking-widest">Hội nghị Giơ-ne-vơ 1954</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Ticker 2 ── */}
      <MarqueeTicker />

      {/* ════════════════════════════════
          MẶT TRẬN NGOẠI GIAO (NEW)
      ════════════════════════════════ */}
      <section id="mat-tran" className="py-24 bg-history-dark text-white relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b09] via-[#1a0505] to-[#0d0b09]" />
        <Particles count={20} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Ngoại Giao Là Một Mặt Trận
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic text-lg">
              "Trên hành trình giành độc lập và thống nhất đất nước, bàn đàm phán cũng là một chiến trường."
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {[
              {
                icon: '🌍',
                title: 'Tranh thủ dư luận quốc tế',
                text: 'Ngoại giao giúp tranh thủ sự đồng tình của thế giới, nhất là các nước xã hội chủ nghĩa, phong trào giải phóng dân tộc và lực lượng tiến bộ quốc tế. Biến sức ủng hộ toàn cầu thành sức ép chính trị lên đối phương.',
                color: 'border-vn-red',
              },
              {
                icon: '🛡️',
                title: 'Cô lập kẻ thù',
                text: 'Ngoại giao góp phần cô lập đối phương về chính trị và pháp lý trên các diễn đàn quốc tế. Khẳng định tính chính nghĩa của cuộc kháng chiến trước dư luận thế giới.',
                color: 'border-vn-gold',
              },
              {
                icon: '⚔️',
                title: 'Chuyển hóa thắng lợi chiến trường',
                text: 'Ngoại giao chuyển hóa thắng lợi trên chiến trường thành thắng lợi trên bàn hội nghị. Điện Biên Phủ tạo lực cho Giơ-ne-vơ; chiến thắng 1972 tạo lực cho Pa-ri.',
                color: 'border-vn-red',
              },
              {
                icon: '📜',
                title: 'Hợp thức hóa thành quả cách mạng',
                text: 'Văn kiện quốc tế biến thắng lợi quân sự thành quyền lợi pháp lý được thừa nhận. Cả hai hiệp định đều xoay quanh hạt nhân: độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ.',
                color: 'border-vn-gold',
              },
            ].map((item, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className={`bg-white/5 border-l-4 ${item.color} p-8 rounded-sm backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group`}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="text-xl text-vn-gold font-serif font-bold mb-3 uppercase tracking-wide">{item.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* "Vừa đánh vừa đàm" highlight */}
          <Reveal>
            <div className="animated-border rounded-sm p-1">
              <div className="bg-black/70 backdrop-blur-sm p-10 text-center rounded-sm">
                <div className="text-vn-red text-xs font-bold uppercase tracking-[0.5em] mb-4">Đặc sắc của ngoại giao Việt Nam</div>
                <div className="text-4xl md:text-6xl font-serif font-bold text-vn-gold mb-6 animate-fire">
                  "Vừa Đánh, Vừa Đàm"
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed font-serif italic">
                  Ta không đàm phán từ thế yếu để xin nhượng bộ, mà đàm phán trên cơ sở thực lực chiến trường.
                  Kiên định về nguyên tắc, nhưng cực kỳ linh hoạt về sách lược.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BỐI CẢNH
      ════════════════════════════════ */}
      <section id="context" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6e3] via-white to-[#fff5f5]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="section-title">Bối Cảnh Lịch Sử</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
              Ngoại giao thời chiến không đứng riêng lẻ, mà là một mặt trận chiến lược gắn với quân sự và chính trị.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Giơ-ne-vơ card */}
            <Reveal dir="left">
              <div className="bg-white border-t-8 border-vn-red shadow-2xl rounded-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="relative overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Dien_Bien_Phu_May_1954.jpg" alt="Điện Biên Phủ 1954" className="w-full h-52 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wider">Điện Biên Phủ · 7/5/1954</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-vn-red/20">
                    <span className="text-6xl text-vn-red font-serif font-bold drop-shadow text-glow-red">1954</span>
                    <div>
                      <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Giơ-ne-vơ</h3>
                      <p className="text-vn-red font-semibold text-sm">Sự khởi đầu — Buộc Pháp chấm dứt chiến tranh</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    {[
                      ['Thời gian chiến tranh', '1946 – 1954'],
                      ['Đối tượng chính', 'Thực dân Pháp xâm lược, có can dự ngày càng sâu của Mỹ'],
                      ['Mốc mở đàm phán', '8/5/1954 — ngay sau chiến thắng Điện Biên Phủ'],
                      ['Mốc ký kết', '20/7/1954'],
                      ['Hoàn cảnh', 'Chiến tranh Lạnh lan sang châu Á; các nước lớn muốn giải pháp đình chiến Đông Dương'],
                    ].map(([k, v], i) => (
                      <li key={i}><strong className="text-gray-900 font-bold uppercase text-[10px] tracking-wider mr-2 text-vn-red">{k}:</strong>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Pa-ri card */}
            <Reveal dir="right">
              <div className="bg-white border-t-8 border-vn-gold shadow-2xl rounded-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="relative overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/B-52D_Vietnam.jpg" alt="B-52" className="w-full h-52 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wider">Điện Biên Phủ trên không · 12/1972</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-vn-gold/30">
                    <span className="text-6xl text-vn-gold font-serif font-bold drop-shadow">1973</span>
                    <div>
                      <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Pa-ri</h3>
                      <p className="text-yellow-600 font-semibold text-sm">Đỉnh cao — Buộc Mỹ rút khỏi chiến tranh</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    {[
                      ['Thời gian chiến tranh', '1954 – 1975, trọng tâm đàm phán 1968–1973'],
                      ['Đối tượng chính', 'Đế quốc Mỹ và chính quyền Sài Gòn'],
                      ['Mốc mở đàm phán', '13/5/1968 tại Trung tâm Kléber, Paris'],
                      ['Mốc ký kết', '27/1/1973'],
                      ['Hoàn cảnh', 'Mỹ sa lầy quân sự; phong trào phản chiến dâng cao; quan hệ "tay ba" Mỹ–Xô–Trung phức tạp'],
                    ].map(([k, v], i) => (
                      <li key={i}><strong className="font-bold uppercase text-[10px] tracking-wider mr-2 text-yellow-600">{k}:</strong>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Post-Geneva context */}
          <Reveal className="mt-12">
            <div className="bg-gradient-to-r from-[#fff5f5] to-white border-l-4 border-vn-red p-8 rounded-sm shadow-lg">
              <h3 className="text-xl font-serif font-bold text-history-dark uppercase tracking-wider mb-4">
                Sau Giơ-ne-vơ: Thách thức mới
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Sau Hiệp định Giơ-ne-vơ, đất nước tạm thời bị chia làm hai miền với hai chế độ chính trị - xã hội khác nhau.
                Mỹ từng bước thay chân Pháp, dựng chính quyền tay sai ở miền Nam và phá hoại Hiệp định Giơ-ne-vơ —
                từ chối hiệp thương tổng tuyển cử thống nhất đất nước. Ngoại giao của ta chuyển sang đấu tranh
                pháp lý, chính trị và dư luận quốc tế để bảo vệ quyền thống nhất đất nước.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          TIMELINE
      ════════════════════════════════ */}
      <section id="timeline" className="py-24 bg-history-dark text-white border-y-4 border-vn-red relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0505_0%,_#0d0b09_70%)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Lộ Trình Đàm Phán
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
              Từ buộc Pháp chấm dứt chiến tranh đến buộc Mỹ rút quân — cốt lõi là kết hợp chiến trường, chính trị và bàn đàm phán.
            </p>
          </Reveal>

          {/* Giơ-ne-vơ sub-header */}
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-vn-red/40" />
              <span className="bg-vn-red text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">Giơ-ne-vơ 1954</span>
              <div className="h-px flex-1 bg-vn-red/40" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4">
            {[
              { year: '8/5/1954',  tag: 'Khai mạc',  tagColor: 'bg-vn-red',  title: 'Hội nghị Giơ-ne-vơ khai mạc', desc: 'Một ngày sau chiến thắng Điện Biên Phủ. Ta bước vào đàm phán với tư thế người thắng trận. Thắng lợi quân sự lập tức tạo thế mạnh cho ngoại giao.', align: 'left', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Geneva_Conference_1954.jpg' },
              { year: '20/7/1954', tag: 'Ký kết',    tagColor: 'bg-vn-gold text-black', title: 'Ký Hiệp định Giơ-ne-vơ', desc: 'Chấm dứt chiến tranh xâm lược của Pháp ở Đông Dương. Đất nước tạm thời chia cắt ở vĩ tuyến 17. Đặt cơ sở pháp lý quốc tế cho cuộc đấu tranh tiếp theo.', align: 'right' },
              { year: '21/7/1954', tag: 'Tuyên bố',  tagColor: 'bg-vn-red',  title: 'Tuyên bố chung kết thúc Hội nghị', desc: 'Đặt ra vấn đề đình chỉ chiến sự, củng cố hòa bình và tổng tuyển cử thống nhất đất nước. Thắng lớn nhưng chưa phải thắng trọn — bài toán thống nhất chưa được giải quyết ngay.', align: 'left' },
            ].map((item, i) => (
              <Reveal key={i} dir={item.align === 'left' ? 'left' : 'right'} delay={i * 100}>
                <div className="relative flex items-start group mb-10 w-full">
                  {item.align === 'right' && <div className="hidden md:block md:w-[47%] shrink-0" />}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-vn-red border-4 border-history-dark z-10 group-hover:bg-vn-gold group-hover:scale-150 transition-all duration-300 shadow-[0_0_15px_rgba(218,37,29,0.8)]" />
                  <div className="w-[calc(100%-60px)] md:w-[47%] ml-[60px] md:ml-0 shrink-0 bg-white/5 p-5 md:p-6 rounded-sm backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vn-red/60 transition-all duration-300 shadow-xl overflow-hidden">
                    {item.img && <img src={item.img} alt={item.title} className="w-full h-28 object-cover mb-4 opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 rounded-sm" />}
                    <span className={`inline-block px-2 py-0.5 ${item.tagColor} text-[10px] font-bold rounded-sm uppercase tracking-widest mb-3`}>{item.tag}</span>
                    <h4 className="text-lg text-vn-gold font-serif font-bold mb-1 tracking-wide">{item.title}</h4>
                    <div className="text-vn-red/70 text-xs font-bold mb-2 tracking-widest">{item.year}</div>
                    <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pa-ri sub-header */}
          <Reveal>
            <div className="flex items-center gap-4 mt-4 mb-8">
              <div className="h-px flex-1 bg-vn-gold/40" />
              <span className="bg-vn-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">Pa-ri 1968–1973</span>
              <div className="h-px flex-1 bg-vn-gold/40" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4">
            {[
              { year: '10/5/1968',    tag: 'Tiền trạm',  tagColor: 'bg-blue-700', title: 'Tiếp xúc đầu tiên qua trung gian Pháp', desc: 'Hà Văn Lâu và cố vấn Nguyễn Minh Vỹ tham gia cuộc tiếp xúc đầu tiên, chốt ngày 13/5/1968 cho phiên họp chính thức đầu tiên. Đàm phán lớn bắt đầu từ những bước "tiền trạm" cực kỳ kỹ lưỡng.', align: 'left' },
              { year: '13/5/1968',    tag: 'Khai mạc',   tagColor: 'bg-vn-red',   title: 'Khai mạc đàm phán chính thức', desc: 'Tại Trung tâm Hội nghị quốc tế Kléber, Paris. Bắt đầu giai đoạn "vừa đánh, vừa đàm" công khai giữa VNDCCH và Mỹ.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Le_Duc_Tho_and_Xuan_Thuy_at_the_Paris_Peace_Talks.jpg' },
              { year: '25/1/1969',    tag: 'Mở rộng',    tagColor: 'bg-vn-red',   title: 'Hội nghị 4 bên khai mạc', desc: 'Vấn đề miền Nam được đặt trong thế trận chính trị – pháp lý đầy đủ hơn. Có sự tham gia của Chính phủ CMLT CHMN VN với bà Nguyễn Thị Bình.', align: 'left' },
              { year: '12/6/1969',    tag: 'Chính danh', tagColor: 'bg-red-800',  title: 'CMLT CHMN VN chính thức tham gia', desc: 'Bà Nguyễn Thị Bình là Trưởng đoàn. Tăng tính chính danh và sức mạnh đại diện của cách mạng miền Nam trên bàn đàm phán quốc tế.', align: 'right' },
              { year: '21/2/1970',    tag: 'Bí mật',     tagColor: 'bg-gray-700', title: 'Lê Đức Thọ trực tiếp xuất trận', desc: 'Cuộc gặp riêng đầu tiên giữa Lê Đức Thọ – Xuân Thủy với Kissinger. Mở ra kênh thương lượng kín, nơi nhiều nút thắt thực chất được xử lý.', align: 'left' },
              { year: '26/6–1/7/1971',tag: 'Sáng kiến', tagColor: 'bg-vn-red',   title: 'Ta đưa ra sáng kiến 9 điểm và 7 điểm', desc: 'Gây sức ép ngoại giao, tranh thủ dư luận quốc tế và chính giới Mỹ. Mặt trận ngoại giao chủ động ra đòn.', align: 'right' },
              { year: '30/3/1972',    tag: 'Chiến trường',tagColor: 'bg-orange-700','title': 'Tiến công chiến lược Xuân – Hè 1972', desc: 'Ta mở cuộc tiến công chiến lược quy mô lớn. Thắng lợi chiến trường kéo đàm phán vào thực chất từ tháng 7/1972.', align: 'left' },
              { year: '8/10/1972',    tag: 'Đột phá',    tagColor: 'bg-vn-gold text-black', title: 'Lê Đức Thọ đưa ra dự thảo Hiệp định', desc: 'Bước ngoặt đột phá. Kissinger thừa nhận: "Hòa bình đã ở trong tầm tay". Chuyển từ tranh luận khung sang đàm thẳng vào điều khoản.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Signing_the_Paris_Peace_Accords_1973.jpg' },
              { year: '20/10/1972',   tag: 'Thỏa thuận', tagColor: 'bg-vn-gold text-black', title: 'Hai bên đạt thỏa thuận cơ bản', desc: 'Dự kiến ký ngày 31/10. Mỹ đã chấp nhận nhiều nguyên tắc cốt lõi của ta. Song Mỹ sau đó trì hoãn và leo thang.', align: 'left' },
              { year: '18–30/12/1972',tag: 'Chiến thắng',tagColor: 'bg-vn-red',   title: '"Điện Biên Phủ trên không"', desc: 'Ta đập tan cuộc tập kích chiến lược B-52. Mỹ buộc ngừng ném bom toàn bộ miền Bắc và đề nghị nối lại đàm phán. Chiến trường đập gãy sức ép ngoại giao của Mỹ.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Hanoi_B-52_wreckage.jpg' },
              { year: '8–23/1/1973',  tag: 'Vòng cuối',  tagColor: 'bg-gray-700', title: 'Vòng đàm phán cuối — ký tắt Hiệp định', desc: 'Hoàn tất văn bản, ký tắt hiệp định. Ta giữ được các nguyên tắc lớn đã đấu tranh suốt gần 5 năm.', align: 'left' },
              { year: '27/1/1973',    tag: 'Thành quả',  tagColor: 'bg-vn-gold text-black', title: 'Ký chính thức Hiệp định Pa-ri', desc: 'Buộc Mỹ chấm dứt chiến tranh, rút hết quân viễn chinh và quân chư hầu. Mở đường cho Đại thắng mùa Xuân 1975.', align: 'right' },
            ].map((item, i) => (
              <Reveal key={i} dir={item.align === 'left' ? 'left' : 'right'} delay={i * 60}>
                <div className="relative flex items-start group mb-10 w-full">
                  {item.align === 'right' && <div className="hidden md:block md:w-[47%] shrink-0" />}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-vn-gold border-4 border-history-dark z-10 group-hover:bg-vn-red group-hover:scale-150 transition-all duration-300 shadow-[0_0_15px_rgba(255,205,0,0.8)]" />
                  <div className="w-[calc(100%-60px)] md:w-[47%] ml-[60px] md:ml-0 shrink-0 bg-white/5 p-5 rounded-sm backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vn-gold/50 transition-all duration-300 shadow-xl overflow-hidden">
                    {item.img && <img src={item.img} alt={item.title} className="w-full h-28 object-cover mb-4 opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 rounded-sm" />}
                    <span className={`inline-block px-2 py-0.5 ${item.tagColor} text-[10px] font-bold rounded-sm uppercase tracking-widest mb-3`}>{item.tag}</span>
                    <h4 className="text-lg text-vn-gold font-serif font-bold mb-1 tracking-wide">{item.title}</h4>
                    <div className="text-vn-red/70 text-xs font-bold mb-2 tracking-widest">{item.year}</div>
                    <p className="text-gray-300 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          NỘI DUNG & Ý NGHĨA HIỆP ĐỊNH
      ════════════════════════════════ */}
      <section id="treaty-content" className="py-24 bg-[#fdf6e3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-60" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">

          <Reveal>
            <h2 className="section-title">Nội Dung Hai Hiệp Định</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
              Những điều khoản cốt lõi mà Việt Nam kiên trì đấu tranh để đưa vào văn kiện pháp lý quốc tế.
            </p>
          </Reveal>

          {/* 2-column treaty content */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">

            {/* Giơ-ne-vơ content */}
            <Reveal dir="left">
              <div className="bg-white border-t-4 border-vn-red shadow-xl rounded-sm overflow-hidden">
                <div className="bg-vn-red px-6 py-4 flex items-center gap-4">
                  <span className="text-3xl font-serif font-bold text-white">1954</span>
                  <div>
                    <div className="text-white font-bold uppercase tracking-widest text-sm">Hiệp định Giơ-ne-vơ</div>
                    <div className="text-red-200 text-xs">Ký ngày 20/7/1954</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">4 điểm nội dung chính</p>
                  <ul className="space-y-4">
                    {[
                      { num: '01', title: 'Đình chỉ chiến sự', text: 'Đình chỉ chiến sự ở Đông Dương — chấm dứt chiến tranh xâm lược của Pháp về mặt pháp lý quốc tế.' },
                      { num: '02', title: 'Tôn trọng quyền dân tộc cơ bản', text: 'Tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia.' },
                      { num: '03', title: 'Tập kết — Vĩ tuyến 17', text: 'Tập kết, chuyển quân. Lấy vĩ tuyến 17 làm giới tuyến quân sự tạm thời — không phải ranh giới lãnh thổ hay chính trị.' },
                      { num: '04', title: 'Tổng tuyển cử thống nhất', text: 'Dự kiến tổng tuyển cử thống nhất đất nước vào tháng 7/1956 — điều khoản sau này bị liên minh Mỹ–Diệm phá hoại.' },
                    ].map((pt) => (
                      <li key={pt.num} className="flex gap-4 items-start">
                        <span className="text-vn-red font-serif font-bold text-xl shrink-0 leading-none mt-0.5">{pt.num}</span>
                        <div>
                          <div className="font-bold text-history-dark text-sm mb-1">{pt.title}</div>
                          <div className="text-gray-600 text-sm leading-relaxed">{pt.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Pa-ri content */}
            <Reveal dir="right">
              <div className="bg-white border-t-4 border-vn-gold shadow-xl rounded-sm overflow-hidden">
                <div className="bg-history-dark px-6 py-4 flex items-center gap-4">
                  <span className="text-3xl font-serif font-bold text-vn-gold">1973</span>
                  <div>
                    <div className="text-vn-gold font-bold uppercase tracking-widest text-sm">Hiệp định Pa-ri</div>
                    <div className="text-gray-400 text-xs">Ký ngày 27/1/1973</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">4 điểm nội dung chính</p>
                  <ul className="space-y-4">
                    {[
                      { num: '01', title: 'Tôn trọng quyền dân tộc cơ bản', text: 'Hoa Kỳ và các nước tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam.' },
                      { num: '02', title: 'Mỹ chấm dứt chiến tranh, rút quân', text: 'Hoa Kỳ chấm dứt dính líu quân sự, rút hết quân Mỹ và quân chư hầu ra khỏi miền Nam Việt Nam.' },
                      { num: '03', title: 'Ngừng bắn — trao trả tù binh', text: 'Các bên ở miền Nam ngừng bắn tại chỗ. Trao trả tù binh và dân thường bị bắt.' },
                      { num: '04', title: 'Nhân dân miền Nam tự quyết', text: 'Nhân dân miền Nam tự quyết định tương lai chính trị của mình — không có sự can thiệp từ bên ngoài.' },
                    ].map((pt) => (
                      <li key={pt.num} className="flex gap-4 items-start">
                        <span className="text-vn-gold font-serif font-bold text-xl shrink-0 leading-none mt-0.5">{pt.num}</span>
                        <div>
                          <div className="font-bold text-history-dark text-sm mb-1">{pt.title}</div>
                          <div className="text-gray-600 text-sm leading-relaxed">{pt.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Lập trường đàm phán Pa-ri */}
          <Reveal>
            <div className="bg-history-dark text-white rounded-sm shadow-2xl overflow-hidden mb-10">
              <div className="bg-vn-red px-8 py-4">
                <h3 className="font-serif font-bold uppercase tracking-wider text-white text-lg">
                  Lập Trường Đàm Phán của Ta tại Pa-ri
                </h3>
                <p className="text-red-200 text-xs mt-1">4 nguyên tắc kiên trì suốt 4 năm 8 tháng 14 ngày</p>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                {[
                  { icon: '🛡️', title: 'Mỹ phải chấm dứt chiến tranh xâm lược', text: 'Đây là nguyên tắc không thể nhân nhượng. Không có bất kỳ điều khoản nào được ký kết nếu Mỹ không thừa nhận tính xâm lược của cuộc chiến.' },
                  { icon: '✊', title: 'Rút toàn bộ quân Mỹ và quân chư hầu', text: 'Không chấp nhận giải pháp rút từng phần hay cam kết mơ hồ. Phải rút hết quân Mỹ và lính các nước đồng minh.' },
                  { icon: '🗺️', title: 'Tôn trọng độc lập, chủ quyền, thống nhất', text: 'Toàn vẹn lãnh thổ Việt Nam phải được khẳng định trong văn kiện — không chấp nhận sự chia cắt vĩnh viễn.' },
                  { icon: '🗳️', title: 'Nhân dân miền Nam tự quyết định', text: 'Tương lai chính trị của miền Nam phải do người miền Nam quyết định — không phải do Washington hay Sài Gòn.' },
                ].map((pt, i) => (
                  <div key={i} className={`p-6 flex gap-4 items-start ${i < 2 ? 'border-b border-white/10' : ''} ${i % 2 === 0 ? 'md:border-r border-white/10' : ''}`}>
                    <span className="text-2xl shrink-0">{pt.icon}</span>
                    <div>
                      <div className="text-vn-gold font-bold text-sm mb-2 font-serif">{pt.title}</div>
                      <div className="text-gray-300 text-sm leading-relaxed">{pt.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Ý nghĩa lịch sử */}
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal dir="left">
              <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-8 h-full">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-vn-red">
                  <span className="text-2xl font-serif font-bold text-vn-red">1954</span>
                  <h3 className="font-serif font-bold text-history-dark uppercase tracking-wider">Ý nghĩa Giơ-ne-vơ</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  {[
                    'Thắng lợi ngoại giao lớn đầu tiên của VNDCCH trên diễn đàn quốc tế hiện đại.',
                    'Chấm dứt chiến tranh xâm lược của Pháp ở Đông Dương — giải phóng hoàn toàn miền Bắc.',
                    'Miền Bắc trở thành hậu phương lớn, căn cứ địa vững chắc cho cả nước.',
                    'Đặt cơ sở pháp lý quốc tế cho cuộc đấu tranh tiếp theo nhằm thống nhất đất nước.',
                    <span className="text-vn-red font-semibold">Hạn chế: đất nước bị chia cắt tạm thời ở vĩ tuyến 17 — "Thắng lớn, nhưng chưa phải thắng trọn."</span>,
                  ].map((pt, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <VNStar size={14} className="shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal dir="right">
              <div className="bg-history-dark border border-vn-red/30 rounded-sm shadow-lg p-8 h-full text-white">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-vn-gold">
                  <span className="text-2xl font-serif font-bold text-vn-gold">1973</span>
                  <h3 className="font-serif font-bold text-vn-gold uppercase tracking-wider">Ý nghĩa Pa-ri</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-300 leading-relaxed">
                  {[
                    'Đỉnh cao của ngoại giao thời chiến Việt Nam — đè bẹp ý chí xâm lược của đế quốc Mỹ.',
                    'Buộc Mỹ chấm dứt chiến tranh, rút toàn bộ quân viễn chinh và quân chư hầu.',
                    'Thay đổi hẳn so sánh lực lượng — tạo thời cơ chiến lược mới.',
                    { text: 'Từ "Đánh cho Mỹ cút" → tạo bàn đạp để "Đánh cho ngụy nhào" → Đại thắng mùa Xuân 1975.', bold: true },
                    'Pa-ri không phải điểm kết thúc cuối cùng — mà là bàn đạp quyết định dẫn tới thống nhất đất nước.',
                  ].map((pt, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <VNStar size={14} className="shrink-0 mt-0.5" />
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
          SO SÁNH
      ════════════════════════════════ */}
      <section id="comparison" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-vn-red via-vn-gold to-vn-red" />
        <div className="container mx-auto px-4 max-w-6xl">
          <Reveal>
            <h2 className="section-title">So Sánh Chiều Sâu Chiến Lược</h2>
          </Reveal>

          {/* Similarity strip */}
          <Reveal className="mb-12">
            <div className="bg-gradient-to-r from-[#fff5f5] via-white to-[#fffbeb] border border-gray-200 rounded-sm p-6 shadow-lg">
              <h3 className="text-center text-lg font-serif font-bold text-history-dark uppercase tracking-wider mb-4">
                Điểm chung của cả hai Hiệp định
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  'Đều là thắng lợi lớn về ngoại giao và đều gắn chặt với thắng lợi quân sự trên chiến trường',
                  'Đều khẳng định độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ của Việt Nam',
                  'Đều biến thành quả quân sự thành văn kiện pháp lý được thừa nhận trên trường quốc tế',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-sm border border-vn-gold/30 shadow-sm">
                    <VNStar size={20} className="shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto shadow-2xl rounded-sm border border-gray-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-history-dark text-white">
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red w-1/4 uppercase tracking-wider">Tiêu chí</th>
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold">
                      Giơ-ne-vơ (1954)
                    </th>
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold">
                      Pa-ri (1973)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-sans text-base">
                  {[
                    ['Vị thế đàm phán', 'Đa phương (9 bên), dễ bị các cường quốc chi phối', 'Song phương / Bốn bên — Việt Nam hoàn toàn chủ động', true],
                    ['Bối cảnh quân sự', 'Sau chiến thắng Điện Biên Phủ — Pháp sụp đổ ý chí xâm lược', 'Sau chiến thắng Xuân–Hè 1972 và "Điện Biên Phủ trên không"', true],
                    ['Vai trò đồng minh', 'Ảnh hưởng quyết định đến kết quả — thỏa hiệp của các nước lớn', 'Hỗ trợ, nhưng Việt Nam tự quyết định ("Lách qua khe cửa hẹp")', false],
                    ['Kết quả rút quân', 'Cả hai bên cùng tập kết — vĩ tuyến 17 làm giới tuyến tạm thời', 'Chỉ có Mỹ rút quân — quân ta ở lại miền Nam (có lợi cho ta)', true],
                    ['Kết quả lãnh thổ', 'Đất nước tạm thời chia cắt — bài toán thống nhất chưa giải quyết', 'Tạo bàn đạp thực tế cho thống nhất, mở đường cho 1975', true],
                    ['Tính chất lịch sử', 'Kết thúc chiến tranh chống Pháp, giải phóng hoàn toàn miền Bắc', 'Bước ngoặt buộc Mỹ rút — mở đường thực tế cho thống nhất', true],
                  ].map(([criteria, gnv, pri, highlight], i) => (
                    <tr key={i} className={`border-b border-gray-200 hover:bg-red-50/50 transition-colors ${i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                      <td className="p-5 font-bold text-gray-800 text-sm uppercase tracking-wide bg-gray-50">{criteria}</td>
                      <td className="p-5 text-gray-600 border-l border-gray-200 text-sm leading-relaxed">{gnv}</td>
                      <td className={`p-5 border-l border-gray-200 text-sm leading-relaxed ${highlight ? 'text-vn-red font-semibold bg-red-50/30' : 'text-gray-600'}`}>{pri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Câu chốt so sánh */}
          <Reveal className="mt-10">
            <div className="bg-history-dark text-center p-10 rounded-sm border-l-4 border-r-4 border-vn-red shadow-2xl">
              <p className="text-vn-gold font-serif italic text-xl md:text-2xl leading-relaxed">
                "Nếu Giơ-ne-vơ là mốc kết thúc chiến tranh với Pháp nhưng để lại thế chia cắt tạm thời,
                thì Pa-ri là mốc buộc Mỹ rút khỏi cuộc chiến và mở đường thực tế cho thống nhất đất nước."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BÀI HỌC KINH NGHIỆM
      ════════════════════════════════ */}
      <section id="lessons" className="py-24 bg-gradient-to-b from-[#1a0505] to-history-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none" />
        <Particles count={15} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Bài Học Lịch Sử
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
              Từ Hiệp định Pa-ri đến thế hệ hôm nay — những giá trị cốt lõi vẫn còn nguyên giá trị thực tiễn.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: '01', icon: '✊',
                title: 'Phải có thực lực thì mới đàm phán có trọng lượng',
                text: 'Cả hai hội nghị đều cho thấy bàn đàm phán không thể tách khỏi chiến trường. Điện Biên Phủ tạo lực cho Giơ-ne-vơ; chiến thắng Xuân–Hè 1972 và "Điện Biên Phủ trên không" tạo lực cho Pa-ri. Không có thực lực, đàm phán dễ thành màn nghe người khác đọc điều khoản cho mình.',
                color: 'border-vn-red',
              },
              {
                num: '02', icon: '🎋',
                title: '"Dĩ bất biến, ứng vạn biến"',
                text: 'Nguồn sức mạnh ngoại giao Việt Nam là giữ rất chắc cái lõi: độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ. Nhưng cách đi, cách nói, cách chốt văn bản thì cực kỳ linh hoạt. Bài học này vẫn còn nguyên giá trị trong đối ngoại hiện đại, đàm phán kinh tế, thậm chí thương lượng doanh nghiệp.',
                color: 'border-vn-gold',
              },
              {
                num: '03', icon: '⚙️',
                title: 'Đàm phán là công việc của cả hệ thống',
                text: 'Ngoài các nhà thương lượng, còn có bộ máy tham mưu, phiên dịch, truyền thông, an ninh, bảo mật, hậu cần. Lực lượng bảo vệ an ninh âm thầm bảo vệ phái đoàn Việt Nam gần 5 năm trên đất Pháp. Làm việc lớn không có chỗ cho kiểu "anh hùng solo everything".',
                color: 'border-vn-red',
              },
              {
                num: '04', icon: '🌍',
                title: 'Tranh thủ sức mạnh quốc tế nhưng không phụ thuộc',
                text: 'Giơ-ne-vơ và Pa-ri đều chịu tác động mạnh của dư luận thế giới, phong trào phản chiến và quan hệ nước lớn. Bài học: phải biết tranh thủ môi trường quốc tế, nhưng quyết định cuối cùng vẫn phải dựa trên lợi ích dân tộc và bản lĩnh tự chủ.',
                color: 'border-vn-gold',
              },
            ].map((lesson, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className={`bg-white/5 border-l-4 ${lesson.color} p-8 rounded-sm backdrop-blur-sm hover:bg-white/10 hover:shadow-[0_0_30px_rgba(218,37,29,0.2)] transition-all duration-500 group relative overflow-hidden`}>
                  <div className="text-6xl absolute -left-2 -top-3 font-serif font-bold text-vn-red opacity-10 group-hover:opacity-20 transition-opacity select-none">{lesson.num}</div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{lesson.icon}</div>
                  <h4 className="text-xl text-vn-gold font-serif font-bold mb-4 leading-tight">{lesson.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm">{lesson.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Câu kết */}
          <Reveal className="mt-12">
            <div className="text-center border-t border-vn-red/30 pt-12">
              <p className="text-2xl md:text-3xl font-serif italic text-vn-gold animate-fire leading-relaxed max-w-4xl mx-auto">
                "Từ Giơ-ne-vơ đến Pa-ri, ngoại giao Việt Nam đã chứng minh: hòa bình không phải món quà được trao,
                mà là kết quả của bản lĩnh, trí tuệ và sức mạnh."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          KIẾN TRÚC SƯ VN
      ════════════════════════════════ */}
      <section id="real-world" className="py-24 bg-history-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a0505]" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Những "Kiến Trúc Sư" Việt Nam
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
              Sức mạnh — Sự linh hoạt — Chính nghĩa: Sự phối hợp hoàn hảo của phái đoàn Việt Nam tại Paris.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Lê Đức Thọ', title: '"Vị sứ giả gang thép"', color: 'border-vn-gold', glow: 'hover:shadow-[0_10px_40px_rgba(255,205,0,0.2)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Le_Duc_Tho.jpg',
                nameColor: 'text-vn-gold',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Cố vấn đặc biệt — đối đầu trực tiếp Kissinger trong các cuộc đàm phán bí mật. Kiên quyết về nguyên tắc, buộc Mỹ phải nhượng bộ. Đại diện cho kiểu nhà đàm phán "mềm về cách, cứng về lõi". Từ chối giải Nobel Hòa bình 1973.',
              },
              {
                name: 'Xuân Thủy', title: '"Nụ cười ngoại giao"', color: 'border-gray-400', glow: 'hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Xuan_Thuy.jpg',
                nameColor: 'text-white',
                tagStyle: 'text-gray-400 bg-gray-800',
                desc: 'Trưởng đoàn VNDCCH từ phiên khai mạc 13/5/1968. Gương mặt nổi bật ở diễn đàn công khai — mềm mỏng, uyển chuyển, cầm nhịp phiên họp để tạo khoảng không cho đàm phán bí mật.',
              },
              {
                name: 'Nguyễn Thị Bình', title: '"Bông hồng thép"', color: 'border-vn-red', glow: 'hover:shadow-[0_10px_40px_rgba(218,37,29,0.2)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Nguyen_Thi_Binh.jpg',
                nameColor: 'text-white',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Trưởng đoàn Chính phủ CMLT CHMN VN từ 6/1969. Tăng tính chính danh của cách mạng miền Nam. Hóa giải hình ảnh "Việt Cộng", huy động làn sóng phản chiến quốc tế. Người phụ nữ duy nhất ký Hiệp định Pa-ri.',
              },
            ].map((person, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={`bg-[#1a1a1a] border ${person.color} p-8 rounded-sm text-center ${person.glow} hover:-translate-y-3 transition-all duration-500 group`}>
                  <div className={`w-44 h-44 mx-auto rounded-full overflow-hidden border-4 ${person.color} mb-6 shadow-[0_0_25px_rgba(255,205,0,0.15)] relative`}>
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className={`text-2xl font-serif font-bold ${person.nameColor} mb-2 uppercase tracking-wide`}>{person.name}</h3>
                  <p className={`font-bold uppercase text-xs mb-5 tracking-widest py-1 px-3 inline-block rounded-sm ${person.tagStyle}`}>{person.title}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{person.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🤝', name: 'Đại sứ Hà Văn Lâu', tag: 'Người "tiền trạm"',
                desc: 'Ngày 10/5/1968 tham gia cuộc tiếp xúc đầu tiên với đại diện Mỹ qua trung gian Pháp. Góp phần chốt ngày 13/5/1968 cho phiên họp chính thức đầu tiên — đàm phán lớn bắt đầu từ những bước tiền trạm cực kỳ kỹ lưỡng.',
                border: 'hover:border-vn-gold/50',
              },
              {
                icon: '🛡️', name: 'Lực lượng Cận vệ', tag: 'Những người thầm lặng',
                desc: 'Âm thầm bảo vệ an ninh, hậu cần, mã hóa liên lạc cho phái đoàn Việt Nam gần 5 năm trên đất Pháp. Chiến dịch đàm phán là chiến dịch tổng lực — từ bảo mật tài liệu đến an toàn con người.',
                border: 'hover:border-vn-red/50',
              },
            ].map((item, i) => (
              <Reveal key={i} dir={i === 0 ? 'left' : 'right'}>
                <div className={`bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-white/5 p-6 rounded-sm flex items-center gap-6 ${item.border} transition-all duration-300`}>
                  <div className="w-16 h-16 shrink-0 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-vn-gold mb-1">{item.name}</h3>
                    <p className="text-gray-500 font-bold uppercase text-xs mb-2 tracking-wider">{item.tag}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PHÍA ĐỐI LẬP
      ════════════════════════════════ */}
      <section id="opposing-side" className="py-24 bg-[#0a0a12] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a0a1a_0%,_#000_80%)]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-blue-400 mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Phía Đối Lập
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-600" />
            </h2>
            <p className="text-center text-lg text-gray-500 mb-16 max-w-3xl mx-auto font-serif italic">
              Các nhân vật quyết định chính sách phía bên kia chiến tuyến.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Richard Nixon', role: 'Tổng thống Mỹ',
                img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Richard_Nixon_presidential_portrait.jpg',
                border: 'border-blue-800', hoverBorder: 'hover:border-blue-500/50',
                desc: 'Đề ra "Học thuyết Nixon" và chiến lược "Việt Nam hóa chiến tranh". Người đưa ra các quyết định quân sự khốc liệt — kể cả chiến dịch B-52 tháng 12/1972 — để tạo sức ép lên bàn đàm phán Pa-ri.',
              },
              {
                name: 'Henry Kissinger', role: 'Cố vấn An ninh Quốc gia',
                img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Henry_Kissinger_1974.jpg',
                border: 'border-blue-600', hoverBorder: 'hover:border-blue-400/50',
                desc: 'Đại diện phía Mỹ trong các cuộc đàm phán bí mật với cố vấn Lê Đức Thọ. Kissinger thừa nhận sự kiên định của phái đoàn Việt Nam là "không thể lay chuyển". Nhận Nobel Hòa bình 1973 nhưng bị chỉ trích vì chiến dịch B-52.',
              },
              {
                name: 'Ngô Đình Diệm', role: 'Chính quyền Sài Gòn',
                img: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Ngo_Dinh_Diem_-_Color_Portrait.jpg',
                border: 'border-blue-900', hoverBorder: 'hover:border-blue-700/50',
                desc: 'Đại diện giai đoạn hậu 1954. Liên minh "Mỹ–Diệm" phá hoại Hiệp định Giơ-ne-vơ — từ chối hiệp thương tổng tuyển cử, đẩy miền Nam vào tình trạng chia cắt kéo dài và kéo Mỹ can thiệp sâu hơn.',
              },
            ].map((person, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={`bg-[#111] border ${person.border} p-8 rounded-sm ${person.hoverBorder} transition-all duration-500 group`}>
                  <div className={`w-40 h-40 mx-auto rounded-full overflow-hidden border-4 ${person.border} mb-6 grayscale group-hover:grayscale-0 transition-all duration-700`}>
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-blue-400 mb-2 uppercase">{person.name}</h3>
                  <p className="text-blue-500 font-bold uppercase text-[10px] mb-4 tracking-widest bg-blue-500/10 py-1 px-3 inline-block rounded-sm">{person.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed italic">{person.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TƯ LIỆU THAM KHẢO
      ════════════════════════════════ */}
      <section id="references" className="py-24 bg-[#fdf6e3] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-50" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="section-title">Tư Liệu Tham Khảo</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {[
              { icon: '📖', title: 'Giáo trình VNR202', desc: 'Chương 2: Đảng lãnh đạo hai cuộc kháng chiến chống ngoại xâm, thống nhất đất nước (1945–1975). Nguồn số liệu chính cho thống kê Hội nghị Pa-ri.' },
              { icon: '🏛️', title: 'Cổng thông tin Bộ Ngoại giao', desc: 'Tư liệu chính thống về ý nghĩa, bài học ngoại giao, các nhân vật lịch sử và đánh giá vai trò của Lê Đức Thọ.' },
              { icon: '📰', title: 'Báo Nhân Dân', desc: 'Chuyên trang lưu trữ timeline chi tiết Hội nghị Pa-ri và Giơ-ne-vơ — nguồn dễ dùng và đáng tin cậy cho nội dung web.' },
              { icon: '🇺🇸', title: 'Office of the Historian (U.S. State Dept.)', desc: 'Tài liệu của Bộ Ngoại giao Mỹ — góc nhìn quốc tế về tiến trình đàm phán Pa-ri và các ràng buộc chiến lược từ phía Mỹ.' },
              { icon: '🏆', title: 'NobelPrize.org', desc: 'Tư liệu về giải Nobel Hòa bình 1973 và quyết định từ chối nhận giải của cố vấn Lê Đức Thọ — minh chứng cho bản lĩnh ngoại giao Việt Nam.' },
              { icon: '🏛️', title: 'Bảo tàng Lịch sử Quốc gia', desc: 'Ghi nhận các hoạt động thầm lặng của lực lượng bảo vệ an ninh cho phái đoàn Việt Nam gần 5 năm tại Paris.' },
            ].map((ref, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white p-6 border-l-4 border-vn-gold shadow-lg flex gap-5 items-start hover:-translate-y-1 hover:shadow-xl transition-all duration-300 rounded-sm">
                  <div className="text-3xl mt-1">{ref.icon}</div>
                  <div>
                    <h4 className="font-bold text-history-dark text-base mb-2 font-serif">{ref.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{ref.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          THÀNH VIÊN
      ════════════════════════════════ */}
      <section id="team" className="py-24 bg-white border-t-4 border-vn-red relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="section-title">Thành Viên Nhóm</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { name: 'Nguyễn Văn A', role: 'Thuyết trình viên 1', task: 'Slide 1–2 · Nội dung & Bố cục', slides: 'Slide 1–2' },
              { name: 'Trần Thị B',   role: 'Thuyết trình viên 2', task: 'Slide 3–4 · Tìm kiếm tư liệu', slides: 'Slide 3–4' },
              { name: 'Lê Văn C',     role: 'Thuyết trình viên 3', task: 'Slide 5–7 · Thiết kế web',      slides: 'Slide 5–7' },
              { name: 'Phạm Thị D',   role: 'Thuyết trình viên 4', task: 'Slide 8–10 · Tổng hợp bài học', slides: 'Slide 8–10' },
            ].map((member, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#fcfcfc] p-6 text-center border-t-4 border-vn-red shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-sm group">
                  <div className="w-16 h-16 mx-auto bg-history-dark text-vn-gold flex items-center justify-center rounded-full text-2xl font-serif font-bold mb-4 group-hover:bg-vn-red group-hover:text-white transition-colors duration-300 shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="font-serif font-bold text-history-dark text-base mb-1">{member.name}</h4>
                  <p className="text-vn-red text-xs font-bold uppercase tracking-wider mb-1">{member.role}</p>
                  <p className="text-vn-gold text-xs font-bold uppercase tracking-wide mb-2">{member.slides}</p>
                  <p className="text-gray-500 text-xs">{member.task}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final marquee ── */}
      <MarqueeTicker />

      {/* ── Footer ── */}
      <footer className="bg-history-dark border-t-2 border-vn-red text-center py-10 relative">
        <div className="flex justify-center mb-4">
          <VNStar size={36} className="animate-flicker" />
        </div>
        <p className="text-gray-500 text-xs font-sans tracking-widest uppercase mb-2">
          © 2026 Nội dung tham khảo phục vụ học tập
          <span className="text-vn-gold"> Giáo trình VNR202</span>
        </p>
        <p className="text-gray-600 text-xs italic font-serif">
          "Trên hành trình giành độc lập và thống nhất đất nước, bàn đàm phán cũng là một chiến trường."
        </p>
      </footer>
    </div>
  );
}

export default App;
