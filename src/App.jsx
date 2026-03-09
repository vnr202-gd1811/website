import { useEffect, useState } from 'react';
import './index.css';

const sections = [
  { id: 'hero', label: 'Trang chủ' },
  { id: 'context', label: 'Bối cảnh' },
  { id: 'timeline', label: 'Lộ trình đàm phán' },
  { id: 'comparison', label: 'So sánh & Ý nghĩa' },
  { id: 'lessons', label: 'Bài học kinh nghiệm' },
  { id: 'real-world', label: 'Những kiến trúc sư' },
  { id: 'references', label: 'Tư liệu tham khảo' },
  { id: 'team', label: 'Thành viên nhóm' },
];

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-vn-red selection:text-white">
      {/* Bubble Sidebar */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 relative group ${
              activeSection === section.id ? 'bg-vn-red scale-125 ring-2 ring-vn-gold' : 'bg-vn-red/40 hover:bg-vn-red/70'
            }`}
            onClick={() => scrollToSection(section.id)}
          >
            <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-history-dark text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-sans shadow-lg border border-white/10">
              {section.label}
            </span>
          </div>
        ))}
      </div>

      {/* Trang chủ */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-hero-pattern bg-cover bg-center bg-fixed relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="border-4 border-vn-gold p-8 md:p-16 bg-history-dark/60 backdrop-blur-sm max-w-5xl rounded-sm shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-serif text-vn-gold font-bold mb-6 drop-shadow-lg leading-tight uppercase">
              Đảng Lãnh Đạo<br/>Hai Cuộc Kháng Chiến
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-sans font-light mb-12 tracking-wide uppercase">
              Chống ngoại xâm, thống nhất đất nước (1945-1975)
            </p>
            <div className="w-24 h-1 bg-vn-red mx-auto mb-10"></div>
            <h2 className="text-3xl md:text-5xl text-white font-serif mb-4 shadow-black drop-shadow-md uppercase tracking-wider">
              Ngoại Giao Thời Chiến
            </h2>
            <h3 className="text-2xl md:text-3xl text-vn-gold italic font-serif opacity-90">
              Từ Hiệp định Giơ-ne-vơ đến Hiệp định Pa-ri
            </h3>
          </div>
        </div>
      </section>

      {/* Bối cảnh */}
      <section id="context" className="py-24 bg-white/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="section-title">Bối Cảnh Lịch Sử</h2>
          <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
            Ngoại giao thời chiến không đứng riêng lẻ, mà là một mặt trận chiến lược, gắn với quân sự và chính trị. Sự khởi đầu đầy sóng gió tại Giơ-ne-vơ và bản lĩnh khẳng định tại Pa-ri.
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 border-t-8 border-vn-red shadow-xl rounded-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <span className="text-5xl text-vn-red font-serif font-bold drop-shadow-sm">1954</span>
                <div>
                  <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Giơ-ne-vơ</h3>
                  <p className="text-vn-red font-medium">Sự khởi đầu của Trật tự Hai cực</p>
                </div>
              </div>
              <ul className="space-y-4 text-gray-700 font-sans">
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Thời gian:</strong> 1946 – 1954</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Đối thủ:</strong> Thực dân Pháp (suy yếu), có sự can dự sâu của Mỹ.</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Hoàn cảnh:</strong> Sau "lừng lẫy năm châu" Điện Biên Phủ (7/5/1954). Hội nghị trong bối cảnh Chiến tranh Lạnh, các nước lớn dàn xếp lợi ích.</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Tính chất:</strong> Giải phóng dân tộc hậu thực dân, ngoại giao trong "vòng xoáy" cường quốc.</li>
              </ul>
            </div>

            <div className="bg-white p-8 border-t-8 border-vn-gold shadow-xl rounded-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <span className="text-5xl text-vn-gold font-serif font-bold drop-shadow-sm">1973</span>
                <div>
                  <h3 className="text-2xl text-history-dark font-serif uppercase tracking-wider">Pa-ri</h3>
                  <p className="text-yellow-600 font-medium">Sự sa lầy của Siêu cường</p>
                </div>
              </div>
              <ul className="space-y-4 text-gray-700 font-sans">
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Thời gian:</strong> 1954 – 1975 (Trọng tâm 1968-1973)</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Đối thủ:</strong> Đế quốc Mỹ và chính quyền Sài Gòn.</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Hoàn cảnh:</strong> Phong trào phản chiến dâng cao tại Mỹ, sa lầy quân sự. Quan hệ "tay ba" Mỹ - Xô - Trung phức tạp.</li>
                <li><strong className="text-gray-900 font-bold uppercase text-xs tracking-wider mr-2">Tính chất:</strong> Chống can thiệp siêu cường & thống nhất đất nước. Nghệ thuật "vừa đánh, vừa đàm".</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Lộ trình đàm phán */}
      <section id="timeline" className="py-24 bg-history-dark text-white border-y-8 border-vn-red">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-12 relative pb-4 uppercase tracking-wider font-serif font-bold">
            Lộ Trình Đàm Phán
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-vn-red"></div>
          </h2>
          <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
            Từ việc buộc Pháp chấm dứt chiến tranh đến việc buộc Mỹ rút quân; cốt lõi là kết hợp chiến trường, chính trị và bàn đàm phán.
          </p>

          <div className="relative timeline-line py-8">
            {[
              { year: '08/05/1954', tag: 'Giơ-ne-vơ', title: 'Khai mạc Hội nghị Giơ-ne-vơ', desc: 'Một ngày sau chiến thắng Điện Biên Phủ, mở ra mặt trận ngoại giao trên thế thắng.', align: 'left' },
              { year: '20/07/1954', tag: 'Giơ-ne-vơ', title: 'Ký kết Hiệp định Giơ-ne-vơ', desc: 'Chấm dứt chiến tranh xâm lược của Pháp ở Đông Dương. Đất nước tạm thời chia cắt ở vĩ tuyến 17.', align: 'right' },
              { year: '13/05/1968', tag: 'Pa-ri', title: 'Khai mạc đàm phán chính thức', desc: 'Tại Kléber (Paris), bắt đầu giai đoạn "vừa đánh, vừa đàm" công khai giữa VNDCCH và Mỹ.', align: 'left' },
              { year: '25/01/1969', tag: 'Pa-ri', title: 'Hội nghị 4 bên khai mạc', desc: 'Vấn đề miền Nam được đặt trong thế trận chính trị - pháp lý đầy đủ hơn. Có sự tham gia của CMLT CHMN VN.', align: 'right' },
              { year: '21/02/1970', tag: 'Bí mật', title: 'Lê Đức Thọ trực tiếp xuất trận', desc: 'Cuộc gặp riêng đầu tiên với Kissinger. Mở ra kênh thương lượng kín, nơi nhiều nút thắt thật sự được xử lý.', align: 'left' },
              { year: '08/10/1972', tag: 'Đột phá', title: 'Đưa ra dự thảo Hiệp định', desc: 'Lê Đức Thọ đưa ra dự thảo. Kissinger cơ bản chấp thuận: "Hòa bình đã ở trong tầm tay".', align: 'right' },
              { year: 'Tháng 12/1972', tag: 'Chiến trường', title: 'Điện Biên Phủ trên không', desc: 'Đánh bại B-52 của Mỹ vào Hà Nội. Mỹ thất bại chiến lược, buộc nối lại đàm phán.', align: 'left' },
              { year: '27/01/1973', tag: 'Thành quả', title: 'Ký chính thức Hiệp định Pa-ri', desc: 'Mỹ phải chấm dứt chiến tranh, rút quân hoàn toàn. Mở ra bước ngoặt chiến lược cho Đại thắng 1975.', align: 'right' },
            ].map((item, index) => (
              <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-12 w-full`}>
                {/* Connector Marker */}
                <div className="absolute left-[24px] md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-vn-red border-4 border-history-dark z-10 group-hover:bg-vn-gold group-hover:scale-125 transition-all duration-300 shadow-[0_0_15px_rgba(218,37,29,0.8)]"></div>
                
                {/* Content */}
                <div className={`w-[calc(100%-60px)] md:w-[45%] ml-[60px] md:ml-0 bg-white/5 p-6 md:p-8 rounded-sm backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vn-red/50 transition-all duration-300 relative shadow-xl`}>
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white/5 border-t border-r border-white/10 rotate-45 ${item.align === 'left' ? 'md:-right-2 md:left-auto -left-2 border-b-0 border-l-0 md:border-b md:border-l md:border-t-0 md:border-r-0' : '-left-2 border-b border-l border-t-0 border-r-0'}`}></div>
                  <div className="inline-block px-3 py-1 bg-vn-red text-white text-[10px] font-bold rounded-sm uppercase tracking-widest mb-4 shadow-sm">
                    {item.tag}
                  </div>
                  <h4 className="text-2xl text-vn-gold font-serif font-bold mb-2 tracking-wide">{item.title}</h4>
                  <div className="text-white/50 text-sm font-bold mb-4 font-sans tracking-widest">{item.year}</div>
                  <p className="text-gray-300 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So sánh */}
      <section id="comparison" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="section-title">So Sánh Chiều Sâu Chiến Lược</h2>
          
          <div className="overflow-x-auto mt-16 shadow-2xl rounded-sm border border-gray-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-history-dark text-white">
                  <th className="p-6 font-serif text-xl border-b-4 border-vn-red w-1/4 uppercase tracking-wider">Tiêu chí</th>
                  <th className="p-6 font-serif text-xl border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold">Giơ-ne-vơ (1954)</th>
                  <th className="p-6 font-serif text-xl border-b-4 border-vn-red border-l border-white/10 w-3/8 text-vn-gold">Pa-ri (1973)</th>
                </tr>
              </thead>
              <tbody className="bg-white font-sans text-lg">
                <tr className="border-b border-gray-200 hover:bg-red-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-800 bg-gray-50/50">Vị thế đàm phán</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 leading-relaxed">Đa phương (9 bên tham gia, dễ bị các cường quốc chi phối).</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 font-medium text-vn-red leading-relaxed bg-red-50/20">Song phương / Bốn bên (Việt Nam hoàn toàn chủ động).</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-red-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-800 bg-gray-50/50">Vai trò đồng minh</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 leading-relaxed">Ảnh hưởng quyết định đến kết quả (thỏa hiệp của các nước lớn).</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 leading-relaxed bg-red-50/20">Hỗ trợ, nhưng Việt Nam tự quyết định ("Lách qua khe cửa hẹp").</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-red-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-800 bg-gray-50/50">Kết quả rút quân</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 leading-relaxed">Cả hai bên cùng tập kết ra hai miền (Vĩ tuyến 17).</td>
                  <td className="p-6 text-gray-900 border-l border-gray-200 font-bold leading-relaxed bg-red-50/20">Chỉ có Mỹ rút quân (Quân Bắc Việt ở lại miền Nam - Mất cân bằng có lợi).</td>
                </tr>
                <tr className="hover:bg-red-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-800 bg-gray-50/50">Tính chất lịch sử</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 leading-relaxed">Kết thúc chiến tranh cục bộ chống Pháp.</td>
                  <td className="p-6 text-gray-700 border-l border-gray-200 font-medium text-vn-red leading-relaxed bg-red-50/20">Bước ngoặt buộc Mỹ rút, mở đường thực tế cho thống nhất.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bài học kinh nghiệm */}
      <section id="lessons" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h2 className="section-title">Ngoại Giao Cho Thời Đại Mới</h2>
          <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-serif italic">
            Từ Hiệp định Pa-ri đến Kinh tế số, những giá trị cốt lõi vẫn còn nguyên giá trị thực tiễn cho thế hệ sau.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Thực lực quyết định vị thế", text: "Tại Pa-ri, vị thế được củng cố bằng thắng lợi chiến trường. Ngày nay, trong hội nhập quốc tế, 'thực lực' chính là nội lực nền kinh tế tự chủ, hạ tầng hiện đại để có tiếng nói trọng lượng trong WTO, CPTPP.", icon: "✊" },
              { title: "'Dĩ bất biến, ứng vạn biến'", text: "Kiên định nguyên tắc độc lập dân tộc (Bất biến), nhưng linh hoạt trong đàm phán (Vạn biến). Ngày nay là sự đa dạng hóa đối tác, chọn chính nghĩa và lợi ích quốc gia.", icon: "🎋" },
              { title: "Tranh thủ thời cơ & dư luận", text: "Biến sự ủng hộ của thế giới thành sức ép ngoại giao. Trong kinh tế hiện đại, đây là việc xây dựng 'Thương hiệu quốc gia' an toàn, bền vững để thu hút FDI chất lượng cao.", icon: "🌍" },
              { title: "Sức mạnh của cả hệ thống", text: "Đàm phán không chỉ của vài cá nhân mà cần sự phối hợp quân sự - chính trị - ngoại giao - hậu cần. Ngày nay đòi hỏi đội ngũ am hiểu luật pháp quốc tế, 'đọc vị' tài chính toàn cầu.", icon: "⚙️" }
            ].map((lesson, idx) => (
              <div key={idx} className="bg-white p-8 md:p-10 rounded-sm shadow-xl border-t-4 border-vn-red hover:border-vn-gold hover:-translate-y-1 transition-all duration-300 relative group">
                <div className="text-4xl absolute top-6 right-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{lesson.icon}</div>
                <div className="text-vn-red font-bold text-5xl font-serif opacity-20 absolute -left-2 -top-4 select-none">0{idx + 1}</div>
                <h4 className="text-2xl font-serif font-bold text-history-dark mb-4 relative z-10">{lesson.title}</h4>
                <p className="text-gray-700 leading-relaxed text-lg relative z-10">{lesson.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Những Kiến trúc sư */}
      <section id="real-world" className="py-24 bg-history-dark text-white relative">
        {/* Background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#222]"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <h2 className="text-4xl md:text-5xl text-vn-gold text-center mb-12 relative pb-4 uppercase tracking-wider font-serif font-bold">
            Những "Kiến Trúc Sư" Lịch Sử
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-vn-red"></div>
          </h2>
          <p className="text-center text-lg text-gray-400 mb-16 max-w-3xl mx-auto font-serif italic">
            Sự phối hợp hoàn hảo: Sức mạnh (Lê Đức Thọ) - Sự linh hoạt (Xuân Thủy) - Chính nghĩa (Nguyễn Thị Bình).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Lê Đức Thọ */}
            <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-sm text-center hover:-translate-y-3 transition-transform duration-500 hover:shadow-[0_10px_30px_rgba(255,205,0,0.1)] group">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-vn-gold mb-8 shadow-[0_0_20px_rgba(255,205,0,0.2)]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Le_Duc_Tho.jpg" alt="Lê Đức Thọ" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-vn-gold mb-3 uppercase tracking-wide">Lê Đức Thọ</h3>
              <p className="text-vn-red font-bold uppercase text-sm mb-6 tracking-widest bg-vn-red/10 py-1 px-3 inline-block rounded-sm">"Vị sứ giả gang thép"</p>
              <p className="text-gray-300 text-base leading-relaxed">
                Người đối đầu trực tiếp Kissinger trong các cuộc đàm phán bí mật. Kiên quyết về nguyên tắc, buộc Mỹ phải nhượng bộ. Từ chối giải Nobel Hòa bình 1973.
              </p>
            </div>

            {/* Xuân Thủy */}
            <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-sm text-center hover:-translate-y-3 transition-transform duration-500 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)] group">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-400 mb-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Xuan_Thuy.jpg" alt="Xuân Thủy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-3 uppercase tracking-wide">Xuân Thủy</h3>
              <p className="text-gray-400 font-bold uppercase text-sm mb-6 tracking-widest bg-gray-800 py-1 px-3 inline-block rounded-sm">"Nụ cười ngoại giao"</p>
              <p className="text-gray-300 text-base leading-relaxed">
                Trưởng đoàn đàm phán VNDCCH ở diễn đàn công khai. Mềm mỏng, uyển chuyển, cầm nhịp phiên họp công khai để tạo khoảng không cho đàm phán bí mật.
              </p>
            </div>

            {/* Nguyễn Thị Bình */}
            <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-sm text-center hover:-translate-y-3 transition-transform duration-500 hover:shadow-[0_10px_30px_rgba(218,37,29,0.15)] group md:col-span-2 lg:col-span-1">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-vn-red mb-8 shadow-[0_0_20px_rgba(218,37,29,0.2)]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Nguyen_Thi_Binh.jpg" alt="Nguyễn Thị Bình" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-3 uppercase tracking-wide">Nguyễn Thị Bình</h3>
              <p className="text-vn-red font-bold uppercase text-sm mb-6 tracking-widest bg-vn-red/10 py-1 px-3 inline-block rounded-sm">"Bông hồng thép"</p>
              <p className="text-gray-300 text-base leading-relaxed">
                Đại diện Chính phủ CMLT CHMN VN. Hóa giải hình ảnh "Việt Cộng", huy động làn sóng phản chiến quốc tế, người phụ nữ duy nhất ký vào Hiệp định Pa-ri.
              </p>
            </div>
            
            {/* Lực lượng hỗ trợ - Footer cards */}
            <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-2 gap-8 mt-4">
              {/* Hà Văn Lâu */}
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-white/5 p-6 rounded-sm flex items-center gap-6 hover:border-vn-gold/50 transition-colors">
                <div className="w-20 h-20 shrink-0 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center text-3xl">🤝</div>
                <div className="text-left">
                  <h3 className="text-xl font-serif font-bold text-vn-gold mb-1">Đại sứ Hà Văn Lâu</h3>
                  <p className="text-gray-400 font-bold uppercase text-xs mb-2 tracking-wider">Người "tiền trạm"</p>
                  <p className="text-gray-400 text-sm leading-relaxed">Tham gia tiếp xúc đầu tiên (10/5/1968), chốt ngày mở đàm phán chính thức.</p>
                </div>
              </div>

              {/* Cận vệ */}
              <div className="bg-gradient-to-r from-[#222] to-[#1a1a1a] border border-white/5 p-6 rounded-sm flex items-center gap-6 hover:border-vn-red/50 transition-colors">
                 <div className="w-20 h-20 shrink-0 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center text-3xl">🛡️</div>
                <div className="text-left">
                  <h3 className="text-xl font-serif font-bold text-vn-red mb-1">Lực lượng Cận vệ</h3>
                  <p className="text-gray-400 font-bold uppercase text-xs mb-2 tracking-wider">Những người thầm lặng</p>
                  <p className="text-gray-400 text-sm leading-relaxed">Bảo đảm an ninh, hậu cần, mã hóa liên lạc bảo mật suốt 5 năm ở Paris.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tư liệu tham khảo */}
      <section id="references" className="py-24 bg-[#f8f5ed]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="section-title">Tư Liệu Tham Khảo</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {[
              { title: "Giáo trình VNR202", desc: "Chương 2: Đảng lãnh đạo hai cuộc kháng chiến chống ngoại xâm, thống nhất đất nước." },
              { title: "Cổng thông tin Bộ Ngoại giao", desc: "Tư liệu chính thống về ý nghĩa, bài học ngoại giao và các nhân vật lịch sử." },
              { title: "Báo Nhân Dân", desc: "Các chuyên trang lưu trữ về Timeline chi tiết của Hội nghị Pa-ri và Giơ-ne-vơ." },
              { title: "Office of the Historian", desc: "Tài liệu của Bộ Ngoại giao Mỹ (góc nhìn quốc tế về tiến trình đàm phán Pa-ri)." },
              { title: "NobelPrize.org", desc: "Tư liệu về giải Nobel Hòa bình 1973 và quyết định từ chối nhận giải của Lê Đức Thọ." },
            ].map((ref, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 border-l-4 border-vn-gold shadow-lg flex gap-5 items-start hover:-translate-y-1 transition-transform">
                <div className="text-3xl mt-1 opacity-80">📚</div>
                <div>
                  <h4 className="font-bold text-history-dark text-lg mb-2 font-serif">{ref.title}</h4>
                  <p className="text-base text-gray-600 leading-relaxed">{ref.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thành viên */}
      <section id="team" className="py-24 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="section-title">Thành Viên Nhóm</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { name: "Nguyễn Văn A", role: "Thuyết trình viên 1", task: "Nội dung & Bố cục" },
              { name: "Trần Thị B", role: "Thuyết trình viên 2", task: "Tìm kiếm tư liệu" },
              { name: "Lê Văn C", role: "Thuyết trình viên 3", task: "Làm slide / Thiết kế web" },
              { name: "Phạm Thị D", role: "Thuyết trình viên 4", task: "Tổng hợp bài học" }
            ].map((member, idx) => (
              <div key={idx} className="bg-[#fcfcfc] p-6 text-center border-t-4 border-vn-red shadow-md hover:shadow-xl transition-all duration-300 rounded-sm group">
                <div className="w-16 h-16 mx-auto bg-history-dark text-vn-gold flex items-center justify-center rounded-full text-2xl font-serif font-bold mb-4 group-hover:bg-vn-red group-hover:text-white transition-colors">
                  {member.name.charAt(0)}
                </div>
                <h4 className="font-serif font-bold text-history-dark text-lg mb-1">{member.name}</h4>
                <p className="text-vn-red text-sm font-bold uppercase tracking-wider mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.task}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="bg-history-dark border-t border-white/10 text-center py-8 text-gray-500 text-sm font-sans tracking-wider uppercase">
        <p>© 2026 Nội dung tham khảo phục vụ học tập <span className="text-vn-gold">Giáo trình VNR202</span>.</p>
      </footer>
    </div>
  );
}

export default App;