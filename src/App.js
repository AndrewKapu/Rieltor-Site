import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Для плавного скролла
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactsRef = useRef(null);
  const requestRef = useRef(null);
  // Состояния для формы
  const [form, setForm] = useState({ name: '', phone: '', district: '', price: '' });
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Можно менять это значение для точной подстройки
  const FACE_POSITION_Y = 35; // процент от верха
  const FACE_POSITION_X_MOBILE = 'center';
  const FACE_POSITION_X_DESKTOP = '55%'; // чуть правее центра для десктопа

  // Плавный скролл по якорям
  const handleNavClick = (ref) => {
    setMenuOpen(false);
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const bgNode = bgRef.current; // фикс для ESLint
    const getBgPosition = (offset = 0) => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const x = isDesktop ? FACE_POSITION_X_DESKTOP : FACE_POSITION_X_MOBILE;
      return `${x} calc(${FACE_POSITION_Y}% - ${offset * 0.4}px)`;
    };
    if (isMobile) return;
    if (bgNode) {
      bgNode.style.backgroundPosition = getBgPosition(0);
    }
    const handleScroll = () => {
      if (!heroRef.current || !bgNode) return;
      const rect = heroRef.current.getBoundingClientRect();
      const offset = Math.max(0, -rect.top);
      bgNode.style.backgroundPosition = getBgPosition(offset);
    };
    const handleResize = () => {
      if (bgNode) {
        bgNode.style.backgroundPosition = getBgPosition();
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Обработчик отправки формы
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('');
    setLoading(true);
    // Валидация
    if (!form.name || !form.phone) {
      setFormStatus('Пожалуйста, заполните имя и телефон.');
      setLoading(false);
      return;
    }
    // Telegram Bot API
    const TOKEN = '7589078106:AAGo9VVAB2m1LUYmKNACwb_uttfvvzEmjXQ'; // <-- Ваш токен
    const CHAT_ID = '6616180546';
    const text = `Новая заявка с сайта:\nИмя: ${form.name}\nТелефон: ${form.phone}\nРайон: ${form.district}\nЦена: ${form.price}`;
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
      if (res.ok) {
        setFormStatus('Заявка отправлена! Я свяжусь с вами в ближайшее время.');
        setForm({ name: '', phone: '', district: '', price: '' });
      } else {
        setFormStatus('Ошибка отправки. Попробуйте позже.');
      }
    } catch {
      setFormStatus('Ошибка отправки. Попробуйте позже.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">
      {/* Header */}
      <header className="w-full bg-[#f8f7f4] border-b border-[#e0e0e0] shadow-sm z-30 fixed top-0 left-0 right-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#e0e4ea] flex items-center justify-center text-2xl font-serif text-[#1a2a3a] border border-[#bfcad6]">АК</div>
            <div>
              <div className="font-serif text-xl text-[#1a2a3a] font-semibold">Андрей Капустин</div>
              <div className="text-[#4d5a6a] text-sm">Риелтор по аренде жилья</div>
            </div>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 text-[#4d5a6a] font-medium">
            <button onClick={() => handleNavClick(heroRef)} className="hover:text-[#1a2a3a] transition">Главная</button>
            <button onClick={() => handleNavClick(aboutRef)} className="hover:text-[#1a2a3a] transition">Обо мне</button>
            <button onClick={() => handleNavClick(servicesRef)} className="hover:text-[#1a2a3a] transition">Услуги</button>
            <button onClick={() => handleNavClick(requestRef)} className="hover:text-[#1a2a3a] transition">Оставить заявку</button>
            <button onClick={() => handleNavClick(contactsRef)} className="hover:text-[#1a2a3a] transition">Контакты</button>
          </nav>
          {/* Mobile burger */}
          <button className="md:hidden flex flex-col justify-center items-center w-10 h-10" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            <span className={`block h-0.5 w-6 bg-[#1a2a3a] mb-1 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-[#1a2a3a] mb-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-[#1a2a3a] transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden bg-[#f8f7f4] border-t border-[#e0e0e0] px-4 py-4 flex flex-col gap-4 animate-fade-in-down">
            <button onClick={() => handleNavClick(heroRef)} className="text-left text-[#4d5a6a] text-lg font-medium hover:text-[#1a2a3a] transition">Главная</button>
            <button onClick={() => handleNavClick(aboutRef)} className="text-left text-[#4d5a6a] text-lg font-medium hover:text-[#1a2a3a] transition">Обо мне</button>
            <button onClick={() => handleNavClick(servicesRef)} className="text-left text-[#4d5a6a] text-lg font-medium hover:text-[#1a2a3a] transition">Услуги</button>
            <button onClick={() => handleNavClick(requestRef)} className="text-left text-[#4d5a6a] text-lg font-medium hover:text-[#1a2a3a] transition">Оставить заявку</button>
            <button onClick={() => handleNavClick(contactsRef)} className="text-left text-[#4d5a6a] text-lg font-medium hover:text-[#1a2a3a] transition">Контакты</button>
          </nav>
        )}
      </header>

      {/* Hero Section с параллаксом и фокусом на лице */}
      <section ref={heroRef} className="relative flex-1 flex items-center justify-center w-full min-h-[90vh] bg-[#e0e4ea] overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{
            backgroundImage: "url('/images/agent.jpg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${FACE_POSITION_X_MOBILE} ${FACE_POSITION_Y}%`,
            transform: 'translateZ(0)',
            zIndex: 1,
            transition: 'background-position 0.2s',
          }}
          aria-hidden="true"
        />
        {/* затемнение для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a3a]/70 via-[#1a2a3a]/30 to-transparent" style={{zIndex: 2}}></div>
        <div className="relative z-10 flex flex-col items-center md:items-start justify-center w-full px-4 py-12 md:py-24 md:max-w-3xl md:ml-16">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 text-center md:text-left drop-shadow-lg">Андрей Капустин</h1>
          <h2 className="text-lg md:text-2xl text-[#e0e4ea] font-light mb-6 text-center md:text-left drop-shadow">Риелтор по аренде жилья в Москве</h2>
          <p className="text-white/90 text-base md:text-lg mb-8 text-center md:text-left max-w-2xl drop-shadow">
            Помогаю снять или сдать квартиру в Москве быстро, безопасно и с максимальной выгодой. Индивидуальный подход, честность и поддержка на каждом этапе сделки.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start w-full md:w-auto justify-center md:justify-start">
            <a href="tel:+79933360563" className="bg-[#e0e4ea]/90 hover:bg-[#bfcad6] text-[#1a2a3a] font-medium py-3 px-8 rounded-full transition text-center shadow-lg">Позвонить: +7 (993) 336-05-63</a>
            <a href="mailto:ya@rekapustina.ru" className="border border-[#e0e4ea] hover:bg-[#f5f6f8] text-white font-medium py-3 px-8 rounded-full transition text-center shadow-lg">Написать на почту</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        {/* About Section */}
        <section ref={aboutRef} id="about" className="w-full max-w-6xl md:w-11/12 bg-[#f8f7f4]/95 rounded-2xl shadow p-8 md:p-14 border border-[#e0e0e0] mb-8 mt-8">
          <h3 className="text-2xl md:text-3xl font-serif text-[#1a2a3a] mb-4">Обо мне</h3>
          <p className="text-[#3a3a2e] mb-4 text-lg md:text-xl">Более 7 лет помогаю клиентам находить идеальное жильё в Москве. Работаю честно, прозрачно и всегда в интересах клиента. Гарантирую безопасность сделки и индивидуальный подход.</p>
          <ul className="list-disc list-inside text-[#4d5a6a] text-base md:text-lg pl-4">
            <li>Эксперт по аренде квартир и апартаментов</li>
            <li>Большая база проверенных объектов</li>
            <li>Сопровождение на всех этапах сделки</li>
          </ul>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} id="services" className="w-full max-w-6xl md:w-11/12 bg-[#f8f7f4]/95 rounded-2xl shadow p-8 md:p-14 border border-[#e0e0e0] mb-8">
          <h3 className="text-2xl md:text-3xl font-serif text-[#1a2a3a] mb-4">Услуги</h3>
          <ul className="space-y-2 text-[#3a3a2e] text-base md:text-lg pl-4 list-disc">
            <li>Поиск и подбор квартир под ваши требования</li>
            <li>Проверка документов и юридическая чистота</li>
            <li>Переговоры с собственниками</li>
            <li>Сдача вашей квартиры надёжным арендаторам</li>
            <li>Консультации по рынку недвижимости</li>
          </ul>
        </section>

        {/* Request Form Section */}
        <section ref={requestRef} id="request" className="w-full max-w-6xl md:w-11/12 bg-[#f8f7f4]/95 rounded-2xl shadow p-8 md:p-14 border border-[#e0e0e0] mb-8">
          <h3 className="text-2xl md:text-3xl font-serif text-[#1a2a3a] mb-6">Оставить заявку</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[#1a2a3a] font-medium">Имя*</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleFormChange} className="rounded-lg border border-[#e0e0e0] px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#bfcad6]" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[#1a2a3a] font-medium">Телефон*</label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleFormChange} className="rounded-lg border border-[#e0e0e0] px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#bfcad6]" required />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="district" className="text-[#1a2a3a] font-medium">Район</label>
              <input type="text" id="district" name="district" value={form.district} onChange={handleFormChange} className="rounded-lg border border-[#e0e0e0] px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#bfcad6]" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="price" className="text-[#1a2a3a] font-medium">Цена</label>
              <input type="text" id="price" name="price" value={form.price} onChange={handleFormChange} className="rounded-lg border border-[#e0e0e0] px-4 py-3 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#bfcad6]" />
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center mt-2">
              <button type="submit" disabled={loading} className="bg-[#e0e4ea] hover:bg-[#bfcad6] text-[#1a2a3a] font-semibold py-3 px-8 rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Отправка...' : 'Оставить заявку'}
              </button>
              {formStatus && <span className="text-[#4d5a6a] text-base">{formStatus}</span>}
            </div>
          </form>
        </section>

        {/* Contacts Section */}
        <section ref={contactsRef} id="contacts" className="w-full max-w-6xl md:w-11/12 bg-[#f8f7f4]/95 rounded-2xl shadow p-8 md:p-14 border border-[#e0e0e0] mb-8">
          <h3 className="text-2xl md:text-3xl font-serif text-[#1a2a3a] mb-4">Контакты</h3>
          <div className="flex flex-col gap-2 text-[#3a3a2e] text-base md:text-lg">
            <span>Телефон: <a href="tel:+79933360563" className="underline hover:text-[#1a2a3a]">+7 (993) 336-05-63</a></span>
            <span>Email: <a href="mailto:ya@rekapustina.ru" className="underline hover:text-[#1a2a3a]">ya@rekapustina.ru</a></span>
            <span>Москва, Россия</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f8f7f4] border-t border-[#e0e0e0] py-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-[#bfcad6] text-sm">
          © {new Date().getFullYear()} Андрей Капустин. Все права защищены.
        </div>
      </footer>
    </div>
  );
}

export default App;
