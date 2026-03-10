import { useEffect, useState, useRef, useCallback } from 'react';
import './index.css';

/* ─── Cấu hình điều hướng các phần ─── */
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

/* ─── Biểu tượng Ngôi sao vàng Việt Nam ─── */
function VNStar({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="#ffcd00">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </svg>
  );
}

/* ─── Hệ thống hạt trôi nổi ─── */
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

/* ─── Bộ đếm số chuyển động ─── */
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

/* ─── Khối hiệu ứng xuất hiện khi cuộn ─── */
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

/* ─── Dòng chữ chạy (Marquee) ─── */
const TICKER_ITEMS = [
  '⚔ Chiến thắng Điện Biên Phủ 7/5/1954',
  '✦ Khai mạc Hội nghị Giơ-ne-vơ 8/5/1954',
  '★ Ký kết Hiệp định Giơ-ne-vơ 20/7/1954',
  '⚔ Hội nghị Pa-ri chính thức khai mạc 13/5/1968',
  '✦ Thắng lợi Điện Biên Phủ trên không 12/1972',
  '★ Ký kết Hiệp định Pa-ri 27/1/1973',
  '⚔ Đại thắng mùa Xuân 30/4/1975',
  '✦ Sách lược "Vừa đánh vừa đàm"',
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
    <div className="min-h-screen">

      {/* ── Thanh điều hướng dạng bong bóng ── */}
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
          PHẦN MỞ ĐẦU (HERO)
      ════════════════════════════════ */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center bg-hero-pattern bg-cover bg-center bg-fixed relative overflow-hidden red-scanline noise-layer"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#3b0000]/60 to-black/90 z-0" />
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

          <div className="border-2 border-vn-red p-8 md:p-16 bg-black/50 backdrop-blur-md max-w-5xl rounded-sm shadow-2xl animate-pulse-red">
            <p className="text-vn-red font-bold uppercase tracking-[0.4em] text-sm mb-6">
              Chương II · Giáo trình Lịch sử Đảng Cộng sản Việt Nam (VNR202)
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
            Khám phá tiến trình lịch sử ↓
          </button>
        </div>
      </section>

      <MarqueeTicker />

      {/* ════════════════════════════════
          SỐ LIỆU THỐNG KÊ
      ════════════════════════════════ */}
      <section id="stats" className="py-20 bg-vn-red relative overflow-hidden noise-layer">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b0000] via-vn-red to-[#8b0000] animate-grad-shift" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl text-vn-gold text-center font-serif font-bold uppercase tracking-wider mb-4">
              Số liệu Thống kê Lịch sử
            </h2>
            <p className="text-center text-red-200 text-sm mb-12 uppercase tracking-widest">Hội nghị Pa-ri (1968–1973)</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: 201,  suffix: '',    label: 'Phiên họp công khai',    icon: '🏛️' },
              { val: 45,   suffix: '',    label: 'Cuộc gặp riêng cấp cao', icon: '🤝' },
              { val: 500,  suffix: '+',   label: 'Cuộc họp báo chuyên đề', icon: '📰' },
              { val: 1000, suffix: '+',   label: 'Cuộc phỏng vấn báo chí', icon: '🎙️' },
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
                <div className="text-red-200 text-sm uppercase tracking-widest">Tổng thời gian tiến trình đàm phán Pa-ri</div>
              </div>
            </Reveal>
            <Reveal dir="right">
              <div className="bg-black/30 border border-vn-gold/20 p-6 rounded-sm text-center">
                <div className="text-3xl font-serif font-bold text-vn-gold mb-2">75 ngày · 8 phiên rộng · 23 phiên hẹp</div>
                <div className="text-red-200 text-sm uppercase tracking-widest">Thời gian diễn ra Hội nghị Giơ-ne-vơ (1954)</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* ════════════════════════════════
          MẶT TRẬN NGOẠI GIAO TRONG KHÁNG CHIẾN
      ════════════════════════════════ */}
      <section id="mat-tran" className="py-24 bg-history-dark text-white relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b09] via-[#1a0505] to-[#0d0b09]" />
        <Particles count={20} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center relative pb-4 uppercase tracking-wider font-serif font-bold mb-4">
              Vai trò của Mặt trận Ngoại giao
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic text-lg">
              "Trong chiến tranh cách mạng, ngoại giao không phải là hoạt động phụ trợ mà là một mặt trận chiến lược có ý nghĩa quyết định."
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {[
              {
                icon: '🌍',
                title: 'Tranh thủ dư luận quốc tế',
                text: 'Ngoại giao góp phần quan trọng trong việc tranh thủ sự đồng tình và ủng hộ của nhân dân thế giới, đặc biệt là các nước xã hội chủ nghĩa, phong trào giải phóng dân tộc và các lực lượng tiến bộ, yêu chuộng hòa bình toàn cầu.',
                color: 'border-vn-red',
              },
              {
                icon: '🛡️',
                title: 'Cô lập các lực lượng xâm lược',
                text: 'Mặt trận ngoại giao thực hiện nhiệm vụ cô lập đối phương về phương diện chính trị và pháp lý trên trường quốc tế, đồng thời khẳng định mạnh mẽ tính chính nghĩa của cuộc kháng chiến dân tộc.',
                color: 'border-vn-gold',
              },
              {
                icon: '⚔️',
                title: 'Chuyển hóa thắng lợi quân sự',
                text: 'Ngoại giao đóng vai trò chuyển hóa các kết quả giành được trên chiến trường thành thắng lợi thực chất trên bàn đàm phán. Chiến thắng Điện Biên Phủ tạo vị thế tại Giơ-ne-vơ; thắng lợi năm 1972 tạo tiền đề tại Pa-ri.',
                color: 'border-vn-red',
              },
              {
                icon: '📜',
                title: 'Khẳng định quyền dân tộc cơ bản',
                text: 'Thông qua các văn kiện quốc tế, ngoại giao xác lập cơ sở pháp lý vững chắc cho các quyền dân tộc cơ bản của Việt Nam bao gồm: Độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ.',
                color: 'border-vn-gold',
              },
            ].map((item, i) => (
              <Reveal key={i} dir={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                <div className={`bg-white/5 border-l-4 ${item.color} p-8 rounded-sm backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group`}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="text-xl text-vn-gold font-serif font-bold mb-3 uppercase tracking-wide">{item.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="animated-border rounded-sm p-1">
              <div className="bg-black/70 backdrop-blur-sm p-10 text-center rounded-sm">
                <div className="text-vn-red text-xs font-bold uppercase tracking-[0.5em] mb-4">Nghệ thuật ngoại giao độc sắc của Đảng</div>
                <div className="text-4xl md:text-6xl font-serif font-bold text-vn-gold mb-6 animate-fire uppercase">
                  "Vừa Đánh, Vừa Đàm"
                </div>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed font-serif italic">
                  Việt Nam không thực hiện đàm phán từ vị thế yếu để tìm kiếm sự nhượng bộ, mà tiến hành thương lượng dựa trên thực lực hiện hữu tại chiến trường. 
                  Kiên định về nguyên tắc chiến lược nhưng linh hoạt và sắc bén trong sách lược ngoại giao.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BỐI CẢNH LỊCH SỬ
      ════════════════════════════════ */}
      <section id="context" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6e3] via-white to-[#fff5f5]" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="section-title">Bối Cảnh Lịch Sử</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
              Ngoại giao thời chiến là một cấu phần trong mặt trận tổng hợp chiến lược gắn liền với quân sự và chính trị.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Giơ-ne-vơ card */}
            <Reveal dir="left">
              <div className="bg-white border-t-8 border-vn-red shadow-2xl rounded-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="relative overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Dien_Bien_Phu_May_1954.jpg" alt="Điện Biên Phủ 1954" className="w-full h-52 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wider">Chiến thắng Điện Biên Phủ · 7/5/1954</div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-vn-red/20">
                    <span className="text-6xl text-vn-red font-serif font-bold drop-shadow text-glow-red">1954</span>
                    <div>
                      <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Giơ-ne-vơ</h3>
                      <p className="text-vn-red font-semibold text-sm">Giai đoạn xác lập quyền dân tộc cơ bản</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    {[
                      ['Thời kỳ kháng chiến', 'Kháng chiến chống thực dân Pháp (1946 – 1954)'],
                      ['Đối tượng tác chiến', 'Thực dân Pháp xâm lược, có sự can thiệp và hỗ trợ từ Hoa Kỳ'],
                      ['Thời điểm đàm phán', 'Khai mạc ngày 8/5/1954 - ngay sau thắng lợi tại Điện Biên Phủ'],
                      ['Thời điểm ký kết', 'Chính thức vào ngày 20/7/1954'],
                      ['Bối cảnh quốc tế', 'Sự xác lập của Trật tự Hai cực trong Chiến tranh Lạnh'],
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
                      <p className="text-yellow-600 font-semibold text-sm">Giai đoạn buộc Hoa Kỳ rút khỏi chiến tranh</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    {[
                      ['Thời kỳ kháng chiến', 'Chống Mỹ, cứu nước (1954 – 1975), trọng tâm đàm phán 1968–1973'],
                      ['Đối tượng tác chiến', 'Đế quốc Mỹ và chính quyền Việt Nam Cộng hòa (VNCH)'],
                      ['Thời điểm đàm phán', 'Khai mạc ngày 13/5/1968 tại Trung tâm Hội nghị Kléber, Paris'],
                      ['Thời điểm ký kết', 'Chính thức vào ngày 27/1/1973'],
                      ['Bối cảnh quốc tế', 'Hoa Kỳ sa lầy quân sự; phong trào phản chiến lan rộng toàn cầu'],
                    ].map(([k, v], i) => (
                      <li key={i}><strong className="font-bold uppercase text-[10px] tracking-wider mr-2 text-yellow-600">{k}:</strong>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div className="bg-gradient-to-r from-[#fff5f5] to-white border-l-4 border-vn-red p-8 rounded-sm shadow-lg">
              <h3 className="text-xl font-serif font-bold text-history-dark uppercase tracking-wider mb-4 font-serif">
                Thách thức chiến lược sau năm 1954
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Sau Hiệp định Giơ-ne-vơ, đất nước tạm thời bị chia làm hai miền với hai chế độ chính trị - xã hội khác biệt.
                Chính phủ Hoa Kỳ đã từng bước thay thế thực dân Pháp, thiết lập chính quyền tay sai tại miền Nam và thực hiện các hoạt động phá hoại Hiệp định, 
                đặc biệt là việc từ chối tổ chức hiệp thương tổng tuyển cử thống nhất đất nước. Trước tình hình đó, Phái đoàn Việt Nam đã chuyển trọng tâm sang đấu tranh
                pháp lý và dư luận quốc tế để bảo vệ tính chính đáng của công cuộc thống nhất.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          LỘ TRÌNH ĐÀM PHÁN (TIMELINE)
      ════════════════════════════════ */}
      <section id="timeline" className="py-24 bg-history-dark text-white border-y-4 border-vn-red relative overflow-hidden red-scanline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0505_0%,_#0d0b09_70%)]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Lộ Trình Đàm Phán Lịch Sử
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic text-sm md:text-base">
              Hành trình chuyển hóa từ thực lực quân sự sang văn kiện pháp lý quốc tế.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-vn-red/40" />
              <span className="bg-vn-red text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">Hội nghị Giơ-ne-vơ (1954)</span>
              <div className="h-px flex-1 bg-vn-red/40" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4">
            {[
              { year: '8/5/1954',  tag: 'Khai mạc',  tagColor: 'bg-vn-red',  title: 'Khai mạc Hội nghị Giơ-ne-vơ', desc: 'Diễn ra chỉ một ngày sau chiến thắng lịch sử Điện Biên Phủ. Việt Nam bước vào bàn hội nghị với tư thế người thắng trận, tạo cơ sở thực lực mạnh mẽ cho mặt trận ngoại giao.', align: 'left', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Geneva_Conference_1954.jpg' },
              { year: '20/7/1954', tag: 'Ký kết',    tagColor: 'bg-vn-gold text-black', title: 'Ký kết Hiệp định Giơ-ne-vơ', desc: 'Chấm dứt hoàn toàn sự hiện diện quân sự của Pháp tại Đông Dương về mặt pháp lý quốc tế. Tuy nhiên, đất nước bị chia cắt tạm thời tại vĩ tuyến 17.', align: 'right' },
              { year: '21/7/1954', tag: 'Tuyên bố',  tagColor: 'bg-vn-red',  title: 'Thông qua Tuyên bố chung Hội nghị', desc: 'Đặt ra các khung pháp lý về đình chỉ chiến sự và dự kiến tổng tuyển cử thống nhất. Đây là thắng lợi lớn nhưng chưa trọn vẹn do các ràng buộc của trật tự Chiến tranh Lạnh.', align: 'left' },
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

          <Reveal>
            <div className="flex items-center gap-4 mt-4 mb-8">
              <div className="h-px flex-1 bg-vn-gold/40" />
              <span className="bg-vn-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">Tiến trình Pa-ri (1968–1973)</span>
              <div className="h-px flex-1 bg-vn-gold/40" />
            </div>
          </Reveal>

          <div className="relative timeline-line py-4">
            {[
              { year: '10/5/1968',    tag: 'Tiền trạm',  tagColor: 'bg-blue-700', title: 'Tiếp xúc sơ bộ qua trung gian', desc: 'Đại sứ Hà Văn Lâu và cố vấn Việt Nam chuẩn bị các điều kiện cần thiết cho phiên họp chính thức, thể hiện sự chuyên nghiệp trong khâu tiền trạm đàm phán.', align: 'left' },
              { year: '13/5/1968',    tag: 'Khai mạc',   tagColor: 'bg-vn-red',   title: 'Khai mạc đàm phán chính thức', desc: 'Bắt đầu giai đoạn đấu trí công khai tại Paris giữa Phái đoàn Việt Nam Dân chủ Cộng hòa (VNDCCH) và chính phủ Hoa Kỳ.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Le_Duc_Tho_and_Xuan_Thuy_at_the_Paris_Peace_Talks.jpg' },
              { year: '25/1/1969',    tag: 'Hội nghị 4 bên',tagColor: 'bg-vn-red',   title: 'Chuyển sang đàm phán bốn bên', desc: 'Vấn đề miền Nam được đưa vào chương trình nghị sự với sự tham gia của Phái đoàn Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam (CP CMLT CHMN VN).', align: 'left' },
              { year: '12/6/1969',    tag: 'Chính danh', tagColor: 'bg-red-800',  title: 'Xác lập vị thế của CP CMLT CHMN VN', desc: 'Góp phần tăng cường tính chính danh và đại diện của lực lượng cách mạng miền Nam trên diễn đàn quốc tế dưới sự lãnh đạo của bà Nguyễn Thị Bình.', align: 'right' },
              { year: '21/2/1970',    tag: 'Tiếp xúc riêng',tagColor: 'bg-gray-700', title: 'Bắt đầu đàm phán bí mật', desc: 'Cuộc gặp kín đầu tiên giữa cố vấn Lê Đức Thọ – Bộ trưởng Xuân Thủy với Henry Kissinger để xử lý các vấn đề cốt lõi của thỏa thuận.', align: 'left' },
              { year: '26/6–1/7/1971',tag: 'Sáng kiến', tagColor: 'bg-vn-red',   title: 'Chủ động đưa ra các giải pháp hòa bình', desc: 'Phái đoàn Việt Nam đưa ra các sáng kiến 9 điểm và 7 điểm nhằm gây sức ép ngoại giao và tranh thủ dư luận quốc tế.', align: 'right' },
              { year: '30/3/1972',    tag: 'Thắng lợi quân sự',tagColor: 'bg-orange-700','title': 'Cuộc tiến công chiến lược Xuân – Hè 1972', desc: 'Những bước tiến quan trọng trên chiến trường đã buộc phía Hoa Kỳ phải đi vào thảo luận thực chất từ giữa năm 1972.', align: 'left' },
              { year: '8/10/1972',    tag: 'Dự thảo',    tagColor: 'bg-vn-gold text-black', title: 'Trình dự thảo Hiệp định đầu tiên', desc: 'Việt Nam chủ động trình bày dự thảo "Hiệp định về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam", đưa cuộc đàm phán vào giai đoạn quyết định.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Signing_the_Paris_Peace_Accords_1973.jpg' },
              { year: '20/10/1972',   tag: 'Thỏa thuận', tagColor: 'bg-vn-gold text-black', title: 'Xác lập khung thỏa thuận cơ bản', desc: 'Chính phủ Hoa Kỳ cơ bản chấp thuận các nguyên tắc cốt lõi, nhưng sau đó đã trì hoãn và thực hiện hành động leo thang quân sự.', align: 'left' },
              { year: '18–30/12/1972',tag: 'Chiến thắng',tagColor: 'bg-vn-red',   title: 'Chiến thắng "Điện Biên Phủ trên không"', desc: 'Đập tan cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ, buộc đối phương phải chấm dứt phá hoại miền Bắc và quay lại bàn hội nghị.', align: 'right', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Hanoi_B-52_wreckage.jpg' },
              { year: '8–23/1/1973',  tag: 'Ký tắt',     tagColor: 'bg-gray-700', title: 'Hoàn tất văn bản và ký tắt', desc: 'Các bên hoàn thiện các điều khoản sau gần 5 năm đấu trí căng thẳng, bảo vệ thành công các nguyên tắc độc lập dân tộc.', align: 'left' },
              { year: '27/1/1973',    tag: 'Chính thức', tagColor: 'bg-vn-gold text-black', title: 'Ký kết chính thức Hiệp định Pa-ri', desc: 'Buộc Hoa Kỳ phải chấm dứt chiến tranh và rút toàn bộ quân đội viễn chinh, mở đường cho cuộc tổng tiến công năm 1975.', align: 'right' },
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
          NỘI DUNG CỐT LÕI CỦA HIỆP ĐỊNH
      ════════════════════════════════ */}
      <section id="treaty-content" className="py-24 bg-[#fdf6e3] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-60" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">

          <Reveal>
            <h2 className="section-title">Nội Dung Hai Hiệp Định</h2>
            <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
              Các điều khoản pháp lý trọng yếu phản ánh thắng lợi của sự kết hợp giữa mặt trận chính trị, quân sự và ngoại giao.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
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
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4 font-sans">Các nội dung trọng tâm</p>
                  <ul className="space-y-4">
                    {[
                      { num: '01', title: 'Chấm dứt chiến sự', text: 'Thực hiện đình chỉ chiến sự tại Đông Dương - khẳng định sự thất bại của thực dân Pháp trên phương diện pháp lý.' },
                      { num: '02', title: 'Quyền dân tộc cơ bản', text: 'Các bên cam kết tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia.' },
                      { num: '03', title: 'Phân chia quân sự tạm thời', text: 'Thực hiện tập kết và chuyển quân theo vĩ tuyến 17 - được xác định là giới tuyến quân sự tạm thời, không phải ranh giới lãnh thổ.' },
                      { num: '04', title: 'Hướng tới thống nhất', text: 'Xác lập lộ trình tổng tuyển cử thống nhất đất nước vào năm 1956 - nội dung sau đó bị chính quyền Mỹ - Diệm phá hoại.' },
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
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4 font-sans">Các nội dung trọng tâm</p>
                  <ul className="space-y-4">
                    {[
                      { num: '01', title: 'Tôn trọng chủ quyền toàn vẹn', text: 'Hoa Kỳ và các nước tham gia cam kết tôn trọng tuyệt đối độc lập, chủ quyền và toàn vẹn lãnh thổ Việt Nam.' },
                      { num: '02', title: 'Rút quân đội viễn chinh', text: 'Hoa Kỳ thực hiện chấm dứt dính líu quân sự và rút toàn bộ quân đội cùng quân chư hầu ra khỏi lãnh thổ Việt Nam.' },
                      { num: '03', title: 'Giải quyết vấn đề tù binh', text: 'Thực hiện ngừng bắn tại chỗ và trao trả toàn bộ tù binh, dân thường bị bắt giữ giữa các bên.' },
                      { num: '04', title: 'Quyền tự quyết chính trị', text: 'Khẳng định nhân dân miền Nam có quyền tự quyết tương lai chính trị mà không có sự can thiệp từ thế lực bên ngoài.' },
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

          <Reveal>
            <div className="bg-history-dark text-white rounded-sm shadow-2xl overflow-hidden mb-10">
              <div className="bg-vn-red px-8 py-4">
                <h3 className="font-serif font-bold uppercase tracking-wider text-white text-lg">
                  Nguyên tắc chiến lược của Việt Nam tại Hội nghị Pa-ri
                </h3>
                <p className="text-red-200 text-xs mt-1">Lập trường kiên định xuyên suốt tiến trình đàm phán</p>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                {[
                  { icon: '🛡️', title: 'Yêu cầu Hoa Kỳ chấm dứt chiến tranh', text: 'Đây là nguyên tắc tiên quyết không thể nhân nhượng, buộc Mỹ phải thừa nhận tính chất xâm lược của cuộc chiến.' },
                  { icon: '✊', title: 'Rút toàn bộ lực lượng quân sự nước ngoài', text: 'Đòi hỏi Mỹ và các quốc gia đồng minh phải rút hết quân đội, không chấp nhận các giải pháp rút quân từng phần.' },
                  { icon: '🗺️', title: 'Bảo vệ tính toàn vẹn của lãnh thổ', text: 'Chủ quyền quốc gia và sự thống nhất của đất nước phải được ghi nhận rõ ràng, bác bỏ mọi âm mưu chia cắt vĩnh viễn.' },
                  { icon: '🗳️', title: 'Xác lập quyền tự quyết của nhân dân', text: 'Tương lai chính trị miền Nam phải do nhân dân Việt Nam tự quyết định, không chịu sự áp đặt từ Washington hay Sài Gòn.' },
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

          <div className="grid md:grid-cols-2 gap-8">
            <Reveal dir="left">
              <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-8 h-full">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-vn-red">
                  <span className="text-2xl font-serif font-bold text-vn-red">1954</span>
                  <h3 className="font-serif font-bold text-history-dark uppercase tracking-wider">Ý nghĩa của Hiệp định Giơ-ne-vơ</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700 leading-relaxed font-sans">
                  {[
                    'Đánh dấu thắng lợi ngoại giao đa phương đầu tiên của nhà nước Việt Nam Dân chủ Cộng hòa (VNDCCH).',
                    'Chấm dứt hoàn toàn sự thống trị của thực dân Pháp, giải phóng miền Bắc làm hậu phương chiến lược.',
                    'Xác lập cơ sở pháp lý quốc tế vững chắc cho công cuộc đấu tranh thống nhất đất nước sau này.',
                    'Xác lập vị thế chính danh của nước Việt Nam mới trên trường quốc tế.',
                    <span className="text-vn-red font-semibold">Hạn chế khách quan: Tình trạng đất nước bị chia cắt tạm thời gây khó khăn cho tiến trình thống nhất ngay lập tức.</span>,
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
                  <h3 className="font-serif font-bold text-vn-gold uppercase tracking-wider">Ý nghĩa của Hiệp định Pa-ri</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-300 leading-relaxed font-sans">
                  {[
                    'Đỉnh cao nghệ thuật ngoại giao của Đảng, góp phần đè bẹp hoàn toàn ý chí xâm lược của đế quốc Mỹ.',
                    'Hoàn thành mục tiêu chiến lược "Đánh cho Mỹ cút", tạo chuyển biến căn bản về tương quan lực lượng.',
                    'Xác lập tư thế của người chiến thắng, tạo tiền đề quyết định cho cuộc Tổng tiến công và nổi dậy năm 1975.',
                    { text: 'Hiện thực hóa mục tiêu "Đánh cho Mỹ cút" để tiến tới "Đánh cho ngụy nhào", thống nhất Tổ quốc.', bold: true },
                    'Pa-ri không chỉ là kết quả của một cuộc đàm phán mà là một mốc son chói lọi trong lịch sử ngoại giao dân tộc.',
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
          SO SÁNH CHIẾN LƯỢC
      ════════════════════════════════ */}
      <section id="comparison" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-vn-red via-vn-gold to-vn-red" />
        <div className="container mx-auto px-4 max-w-6xl">
          <Reveal>
            <h2 className="section-title">So Sánh Chiều Sâu Chiến Lược</h2>
          </Reveal>

          <Reveal className="mb-12">
            <div className="bg-gradient-to-r from-[#fff5f5] via-white to-[#fffbeb] border border-gray-200 rounded-sm p-6 shadow-lg">
              <h3 className="text-center text-lg font-serif font-bold text-history-dark uppercase tracking-wider mb-4">
                Các thuộc tính chung của hai Hiệp định
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  'Đều là những thắng lợi ngoại giao mang tính thời đại gắn liền với các thành tựu quân sự trên thực địa.',
                  'Đều xác lập nền tảng pháp lý cho độc lập, chủ quyền và tính toàn vẹn lãnh thổ của dân tộc Việt Nam.',
                  'Đều thể hiện bản lĩnh và sự lãnh đạo tài tình của Đảng trong việc kết hợp sức mạnh dân tộc và sức mạnh thời đại.',
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
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red w-1/4 uppercase tracking-wider">Tiêu chí đối chiếu</th>
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold uppercase">
                      Giơ-ne-vơ (1954)
                    </th>
                    <th className="p-6 font-serif text-lg border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold uppercase">
                      Pa-ri (1973)
                    </th>
                  </tr>
                </thead>
                <tbody className="font-sans text-base">
                  {[
                    ['Vị thế ngoại giao', 'Đàm phán đa phương, chịu sự chi phối nhất định từ quan hệ của các cường quốc.', 'Đàm phán song phương và bốn bên - Việt Nam hoàn toàn giữ thế chủ động chiến lược.', true],
                    ['Thực lực quân sự', 'Diễn ra ngay sau chiến thắng Điện Biên Phủ, làm sụp đổ ý chí xâm lược của Pháp.', 'Kết quả của sự kết hợp giữa chiến thắng quân sự 1972 và "Điện Biên Phủ trên không".', true],
                    ['Tính tự chủ chiến lược', 'Phụ thuộc vào sự thỏa hiệp giữa các nước lớn trong bối cảnh Chiến tranh Lạnh.', 'Việt Nam tự quyết định tiến trình đàm phán, tranh thủ sự hỗ trợ của đồng minh.', false],
                    ['Hệ quả rút quân', 'Thực hiện tập kết quân sự của cả hai bên ra hai khu vực ngăn cách bởi vĩ tuyến 17.', 'Chỉ có lực lượng Hoa Kỳ rút quân, quân đội cách mạng giữ vững vị thế tại miền Nam.', true],
                    ['Tiến trình thống nhất', 'Tạo ra sự chia cắt tạm thời và không giải quyết dứt điểm mục tiêu thống nhất quốc gia.', 'Xác lập bàn đạp thực tiễn và tạo thời cơ chiến lược để thống nhất đất nước hoàn toàn.', true],
                    ['Ý nghĩa lịch sử', 'Kết thúc giai đoạn kháng chiến chống Pháp, giải phóng miền Bắc xã hội chủ nghĩa.', 'Xác lập bước ngoặt buộc Mỹ rút quân, tạo tiền đề giải phóng miền Nam năm 1975.', true],
                  ].map(([criteria, gnv, pri, highlight], i) => (
                    <tr key={i} className={`border-b border-gray-200 hover:bg-red-50/50 transition-colors ${i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                      <td className="p-5 font-bold text-gray-800 text-xs uppercase tracking-wide bg-gray-50">{criteria}</td>
                      <td className="p-5 text-gray-600 border-l border-gray-200 text-sm leading-relaxed">{gnv}</td>
                      <td className={`p-5 border-l border-gray-200 text-sm leading-relaxed ${highlight ? 'text-vn-red font-semibold bg-red-50/30' : 'text-gray-600'}`}>{pri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <div className="bg-history-dark text-center p-10 rounded-sm border-l-4 border-r-4 border-vn-red shadow-2xl">
              <p className="text-vn-gold font-serif italic text-xl md:text-2xl leading-relaxed">
                "Nếu Hiệp định Giơ-ne-vơ là mốc kết thúc chiến tranh với Pháp nhưng để lại tình trạng chia cắt,
                thì Hiệp định Pa-ri là mốc buộc Mỹ rút khỏi cuộc chiến và mở ra con đường hiện thực để thống nhất Tổ quốc."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          BÀI HỌC KINH NGHIỆM ĐỐI NGOẠI
      ════════════════════════════════ */}
      <section id="lessons" className="py-24 bg-gradient-to-b from-[#1a0505] to-history-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none" />
        <Particles count={15} />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <Reveal>
            <h2 className="section-title">Bài Học Kinh Nghiệm</h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
              Những giá trị cốt lõi từ lịch sử vẫn mang tính thời đại trong công cuộc hội nhập quốc tế hiện nay.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: '01', icon: '✊',
                title: 'Xác lập vị thế dựa trên thực lực dân tộc',
                text: 'Các hội nghị ngoại giao cho thấy bàn đàm phán luôn gắn liền với thực địa chiến trường. Ngày nay, thực lực chính là sự phát triển bền vững của nội lực kinh tế, tạo nền tảng vững chắc để có tiếng nói trọng lượng trong các tổ chức quốc tế như WTO, CPTPP.',
                color: 'border-vn-red',
              },
              {
                num: '02', icon: '🎋',
                title: 'Sách lược "Dĩ bất biến, ứng vạn biến"',
                text: 'Giữ vững mục tiêu độc lập dân tộc và lợi ích quốc gia làm "bất biến", đồng thời ứng dụng linh hoạt các biện pháp sách lược. Bài học này vẫn nguyên giá trị trong đàm phán kinh tế, xử lý các quan hệ quốc tế phức tạp hiện nay.',
                color: 'border-vn-gold',
              },
              {
                num: '03', icon: '⚙️',
                title: 'Sự phối hợp đồng bộ của hệ thống chính trị',
                text: 'Công tác đàm phán đòi hỏi sự phối hợp chặt chẽ giữa các cấp, từ tham mưu, an ninh đến truyền thông và hậu cần. Làm việc lớn đòi hỏi sự đồng thuận và sức mạnh của cả hệ thống thay vì những nỗ lực cá nhân đơn lẻ.',
                color: 'border-vn-red',
              },
              {
                num: '04', icon: '🌍',
                title: 'Kết hợp sức mạnh dân tộc và sức mạnh thời đại',
                text: 'Biết cách tranh thủ sự ủng hộ của môi trường quốc tế nhưng luôn giữ vững tính độc lập và tự chủ. Quyết định cuối cùng luôn phải xuất phát từ lợi ích dân tộc và bản lĩnh của người làm chủ vận mệnh quốc gia.',
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

          <Reveal className="mt-12">
            <div className="text-center border-t border-vn-red/30 pt-12">
              <p className="text-2xl md:text-3xl font-serif italic text-vn-gold animate-fire leading-relaxed max-w-4xl mx-auto uppercase">
                "Hòa bình không phải là sự ban phát, mà là kết quả của bản lĩnh, trí tuệ và sức mạnh dân tộc."
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          NHÀ NGOẠI GIAO VIỆT NAM (KIẾN TRÚC SƯ)
      ════════════════════════════════ */}
      <section id="real-world" className="py-24 bg-history-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#1a0505]" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-4 relative pb-4 uppercase tracking-wider font-serif font-bold">
              Các Nhà Ngoại Giao Tiêu Biểu
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-vn-red" />
            </h2>
            <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
              Sức mạnh - Sự linh hoạt - Chính nghĩa: Sự phối hợp hoàn hảo của phái đoàn Việt Nam tại Hội nghị Pa-ri.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Lê Đức Thọ', title: 'Cố vấn Đặc biệt', color: 'border-vn-gold', glow: 'hover:shadow-[0_10px_40px_rgba(255,205,0,0.2)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Le_Duc_Tho.jpg',
                nameColor: 'text-vn-gold',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Đại diện đàm phán bí mật - người trực tiếp đấu trí với Henry Kissinger. Ông nổi tiếng với phong thái điềm tĩnh nhưng vô cùng quyết liệt trong việc giữ vững các nguyên tắc cốt lõi của dân tộc. Từ chối giải Nobel Hòa bình 1973.',
              },
              {
                name: 'Xuân Thủy', title: 'Bộ trưởng Ngoại giao', color: 'border-gray-400', glow: 'hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Xuan_Thuy.jpg',
                nameColor: 'text-white',
                tagStyle: 'text-gray-400 bg-gray-800',
                desc: 'Trưởng đoàn Việt Nam Dân chủ Cộng hòa (VNDCCH) tại diễn đàn công khai. Ông đảm nhiệm vai trò cầm nhịp và điều phối các phiên họp, tạo ra không gian chiến thuật cho các cuộc tiếp xúc bí mật đạt kết quả.',
              },
              {
                name: 'Nguyễn Thị Bình', title: 'Bộ trưởng Ngoại giao', color: 'border-vn-red', glow: 'hover:shadow-[0_10px_40px_rgba(218,37,29,0.2)]',
                img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Nguyen_Thi_Binh.jpg',
                nameColor: 'text-white',
                tagStyle: 'text-vn-red bg-vn-red/10',
                desc: 'Trưởng đoàn Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam (CP CMLT CHMN VN). Bà là biểu tượng của tính chính nghĩa và sức mạnh phụ nữ Việt Nam, góp phần lan tỏa tiếng vang của cuộc kháng chiến trên trường quốc tế.',
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
                icon: '🤝', name: 'Đại sứ Hà Văn Lâu', tag: 'Công tác chuẩn bị đàm phán',
                desc: 'Thực hiện nhiệm vụ tiếp xúc sơ bộ và chuẩn bị các điều kiện kỹ thuật cho Hội nghị Pa-ri. Sự tỉ mỉ và chuyên nghiệp trong khâu tiền trạm đã góp phần quan trọng vào thành công chung của phái đoàn.',
                border: 'hover:border-vn-gold/50',
              },
              {
                icon: '🛡️', name: 'Lực lượng Cận vệ', tag: 'Công tác bảo vệ bí mật',
                desc: 'Đảm bảo an toàn tuyệt đối và bảo mật thông tin liên lạc cho phái đoàn trong suốt tiến trình đàm phán dài ngày. Đây là minh chứng cho sự phối hợp tổng lực trong công tác đối ngoại.',
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
          PHÍA ĐỐI LẬP (USA & CHÍNH QUYỀN SÀI GÒN)
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
              Các cá nhân đại diện cho các quyết sách của phía Hoa Kỳ và chính quyền Việt Nam Cộng hòa (VNCH).
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Richard Nixon', role: 'Tổng thống Mỹ',
                img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Richard_Nixon_presidential_portrait.jpg',
                border: 'border-blue-800', hoverBorder: 'hover:border-blue-500/50',
                desc: 'Người đề ra "Học thuyết Nixon" và chiến lược "Việt Nam hóa chiến tranh". Ông là người đưa ra các quyết định leo thang quân sự khốc liệt nhằm tìm kiếm vị thế trên bàn hội nghị.',
              },
              {
                name: 'Henry Kissinger', role: 'Cố vấn An ninh Quốc gia Hoa Kỳ',
                img: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Henry_Kissinger_1974.jpg',
                border: 'border-blue-600', hoverBorder: 'hover:border-blue-400/50',
                desc: 'Nhà ngoại giao kỳ cựu đại diện phía Hoa Kỳ trong các cuộc gặp riêng. Ông đã phải thừa nhận sự kiên định không thể lay chuyển của Phái đoàn Việt Nam trước các sức ép quân sự của Mỹ.',
              },
              {
                name: 'Ngô Đình Diệm', role: 'Tổng thống VNCH (1955-1963)',
                img: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Ngo_Dinh_Diem_-_Color_Portrait.jpg',
                border: 'border-blue-900', hoverBorder: 'hover:border-blue-700/50',
                desc: 'Đại diện cho giai đoạn hậu 1954 tại miền Nam. Liên minh Mỹ - Diệm bị lịch sử ghi nhận với các hành động phá hoại Hiệp định Giơ-ne-vơ và từ chối hiệp thương tổng tuyển cử quốc gia.',
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
          DANH MỤC TƯ LIỆU THAM KHẢO
      ════════════════════════════════ */}
      <section id="references" className="py-24 bg-[#fdf6e3] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-50" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="section-title">Tư Liệu Tham Khảo</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {[
              { icon: '📖', title: 'Giáo trình Lịch sử Đảng Cộng sản Việt Nam (VNR202)', desc: 'Nội dung cốt lõi thuộc Chương 2 về sự lãnh đạo của Đảng trong kháng chiến chống ngoại xâm (1945–1975).' },
              { icon: '🏛️', title: 'Cổng thông tin điện tử Bộ Ngoại giao Việt Nam', desc: 'Các báo cáo chính thống về ý nghĩa và bài học ngoại giao của Hiệp định Pa-ri và Hiệp định Giơ-ne-vơ.' },
              { icon: '📰', title: 'Chuyên mục Lịch sử - Báo Nhân Dân', desc: 'Hệ thống lưu trữ timeline và các văn kiện quan trọng phục vụ công tác nghiên cứu học tập.' },
              { icon: '🇺🇸', title: 'Office of the Historian (Bộ Ngoại giao Hoa Kỳ)', desc: 'Cung cấp góc nhìn quốc tế và các tài liệu giải mật về tiến trình đàm phán từ phía chính phủ Mỹ.' },
              { icon: '🏆', title: 'Hệ thống giải Nobel (NobelPrize.org)', desc: 'Tài liệu về quyết định từ chối giải Nobel Hòa bình năm 1973 của cố vấn Lê Đức Thọ.' },
              { icon: '🏛️', title: 'Bảo tàng Lịch sử Quốc gia Việt Nam', desc: 'Tư liệu về các hoạt động hỗ trợ thầm lặng của lực lượng phục vụ và bảo vệ phái đoàn tại Paris.' },
            ].map((ref, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white p-6 border-l-4 border-vn-gold shadow-lg flex gap-5 items-start hover:-translate-y-1 hover:shadow-xl transition-all duration-300 rounded-sm">
                  <div className="text-3xl mt-1">{ref.icon}</div>
                  <div>
                    <h4 className="font-bold text-history-dark text-base mb-2 font-serif">{ref.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">{ref.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          DANH SÁCH THÀNH VIÊN NHÓM
      ════════════════════════════════ */}
      <section id="team" className="py-24 bg-white border-t-4 border-vn-red relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Reveal>
            <h2 className="section-title">Thành Viên Nhóm</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { name: 'Nguyễn Văn A', role: 'Thuyết trình viên 1', task: 'Phần 1–2 · Nội dung & Bố cục', slides: 'Nội dung Slide 1–2' },
              { name: 'Trần Thị B',   role: 'Thuyết trình viên 2', task: 'Phần 3–4 · Nghiên cứu tư liệu', slides: 'Nội dung Slide 3–4' },
              { name: 'Lê Văn C',     role: 'Thuyết trình viên 3', task: 'Phần 5–7 · Thiết kế kỹ thuật',      slides: 'Nội dung Slide 5–7' },
              { name: 'Phạm Thị D',   role: 'Thuyết trình viên 4', task: 'Phần 8–10 · Tổng hợp bài học', slides: 'Nội dung Slide 8–10' },
            ].map((member, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#fcfcfc] p-6 text-center border-t-4 border-vn-red shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-sm group">
                  <div className="w-16 h-16 mx-auto bg-history-dark text-vn-gold flex items-center justify-center rounded-full text-2xl font-serif font-bold mb-4 group-hover:bg-vn-red group-hover:text-white transition-colors duration-300 shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="font-serif font-bold text-history-dark text-base mb-1">{member.name}</h4>
                  <p className="text-vn-red text-xs font-bold uppercase tracking-wider mb-1">{member.role}</p>
                  <p className="text-vn-gold text-xs font-bold uppercase tracking-wide mb-2">{member.slides}</p>
                  <p className="text-gray-500 text-xs font-sans">{member.task}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* ── Chân trang ── */}
      <footer className="bg-history-dark border-t-2 border-vn-red text-center py-10 relative">
        <div className="flex justify-center mb-4">
          <VNStar size={36} className="animate-flicker" />
        </div>
        <p className="text-gray-500 text-xs font-sans tracking-widest uppercase mb-2">
          © 2026 Nội dung phục vụ học tập học phần
          <span className="text-vn-gold"> Lịch sử Đảng Cộng sản Việt Nam (VNR202)</span>
        </p>
        <p className="text-gray-600 text-xs italic font-serif">
          "Độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ là những quyền dân tộc cơ bản bất biến của Việt Nam."
        </p>
      </footer>
    </div>
  );
}

export default App;
