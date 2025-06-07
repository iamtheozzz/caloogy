import './App.css';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Suspense } from 'react';
import backgroundImage from './assets/painting1.jpeg';
import { auth } from './firebase';
import AuthModal from './components/AuthModal';
import AuthButton from './components/AuthButton';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import StudentVerificationModal from './components/StudentVerificationModal';
import FYSAVerificationModal from './components/FYSAVerificationModal';


function Navbar({ isAuthModalOpen, setIsAuthModalOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({top: y, behavior: 'smooth'});
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="logo">CALOOGY</a>
        <div className="nav-links">
          <a href="#student">Student</a>
          <a href="#services">Services</a>
          <a href="#stories">Stories</a>
         
          <AuthButton onShowAuthModal={() => setIsAuthModalOpen(true)} />
        </div>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>Caloogy AI</h3>
          <p>Shaping the future of Artificial Intelligence</p>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#careers">Careers</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <a href="#docs">Documentation</a>
          <a href="#blog">Blog</a>
          <a href="#support">Support</a>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2025 Caloogy LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// 鼠标跟踪动画
function MouseTracker({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
      <motion.div
        style={{
          position: 'absolute',
          top: mousePosition.y,
          left: mousePosition.x,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {children}
    </div>
  );
}

// 粒子动画效果
function ParticleEffect() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
          animate={{
            x: [0, Math.random() * window.innerWidth],
            y: [0, Math.random() * window.innerHeight],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}



// 修改 ResearchVideo 组件，恢复原来的动画效果
function ResearchVideo({ title, desc, video }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, 
    [0, 0.2, 0.5, 0.8],
    [0.5, 1.5, 1.5, 0]
  );
  
  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.5, 0.8],
    [0, 1, 1, 0]
  );

  return (
    <div ref={containerRef} style={{ height: '200vh' }}>
      <motion.div 
        className="research-video-wrapper"
        style={{
          scale,
          opacity,
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          zIndex: 10
        }}
      >
        <video 
          className="research-video"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={video.mp4} type="video/mp4" />
          <source src={video.webm} type="video/webm" />
        </video>
        <motion.h2 
          className="research-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h2>
      </motion.div>
    </div>
  );
}

// 更新研究项目数据，添加两个新视频
const researchItems = [
  {
    title: "Intelligent City Around Us",
    desc: "Using AI to build a smart city",
    video: {
      mp4: "/videos/city.mp4",
      webm: "/videos/city.webm"
    }
  },
  {
    title: "Risk Management",
    desc: "Advanced algorithms for market prediction",
    video: {
      mp4: "/videos/stock.mp4",
      webm: "/videos/stock.webm"
    }
  },
  {
    title: "AI Education System",
    desc: "Personalized learning through artificial intelligence",
    video: {
      mp4: "/videos/education.mp4",
      webm: "/videos/education.webm"
    }
  },
  
  {
    title: "Environmental Friendly",
    desc: "Sustainable AI solutions for a better future",
    video: {
      mp4: "/videos/sky.mp4",
      webm: "/videos/sky.webm"
    }
  }
];

// 更新Bubble组件
function Bubble({ text, delay, index, total }) {
  const itemsPerRow = 3; // 每行3个气泡
  const rows = Math.ceil(total / itemsPerRow);
  const row = Math.floor(index / itemsPerRow);
  const col = index % itemsPerRow;
  
  // 增加间距，确保气泡分布更均匀
  const position = {
    left: `${(col + 0.5) * (60 / itemsPerRow) + 20}%`, // 减小横向分布范围，增加边距
    top: `${(row + 0.5) * (50 / rows) + 25}%`, // 减小纵向分布范围，增加边距
    transform: 'translate(-50%, -50%)'
  };

  return (
    <motion.div
      className="bubble"
      style={position}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1, 0.8],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.2
      }}
    >
      {text}
    </motion.div>
  );
}

// 添加3D视差效果
const Parallax = ({ children, offset = 50 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (window.innerWidth / 2 - clientX) / offset;
    const y = (window.innerHeight / 2 - clientY) / offset;
    setPosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{
        perspective: 1000,
      }}
      animate={{
        rotateX: position.y,
        rotateY: position.x,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// 添加文字动画效果
const AnimatedText = ({ text }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          whileHover={{
            scale: 1.2,
            color: '#1DB954',
            transition: { duration: 0.2 }
          }}
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

function CountUpAnimation({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef);

  useEffect(() => {
    if (isInView) {
      let startTime;
      let animationFrame;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return (
    <motion.div
      ref={nodeRef}
      className="stat-number"
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {count}
    </motion.div>
  );
}

function PartnerCard({ title, description }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className="partner-card"
      onMouseMove={handleMouseMove}
      animate={{
        rotateY: mousePosition.x * 20,
        rotateX: -mousePosition.y * 20,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

// 添加新的TechCard组件
function TechCard({ title, description, index }) {
  return (
    <motion.div 
      className="tech-card"
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ 
        x: 0, 
        opacity: 1,
        transition: {
          delay: index * 0.1,
          type: "spring",
          stiffness: 50
        }
      }}
      viewport={{ once: false }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

// 添加新的 StockTicker 组件
function StockTicker() {
  const [stocks, setStocks] = useState([]);
  const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD'];

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const responses = await Promise.all(
          stockSymbols.map(symbol =>
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cunkhbpr01qokt71tsi0cunkhbpr01qokt71tsig`)
          )
        );
        
        const data = await Promise.all(responses.map(res => res.json()));
        
        const stockData = stockSymbols.map((symbol, index) => ({
          symbol,
          price: data[index].c || 0,
          change: data[index].d || 0,
          percentChange: data[index].dp || 0
        }));
        
        setStocks(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000); // 改回1分钟更新一次

    return () => clearInterval(interval);
  }, []);

  if (stocks.length === 0) {
    return (
      <div className="stock-ticker">
        <div className="stock-ticker-track">
          <div className="stock-item">
            Loading stock data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-ticker">
      <div className="stock-ticker-track">
        {stocks.map((stock, index) => (
          <div 
            key={`${stock.symbol}-${index}`}
            className={`stock-item ${stock.change >= 0 ? 'positive' : 'negative'}`}
          >
            <span className="stock-symbol">{stock.symbol}</span>
            <span className="stock-price">${stock.price.toFixed(2)}</span>
            <span className="stock-change">
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
              ({stock.change >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 在 StockTicker 组件后添加
function StockVideo() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, 
    [0, 0.2, 0.5, 0.8],
    [0.3, 2.0, 2.0, 0]
  );
  
  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.5, 0.8],
    [0, 1, 1, 0]
  );

  // 添加视频加载处理
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log('Stock video loaded successfully');
      setIsLoaded(true);
    };

    const handleError = (e) => {
      console.error('Stock video error:', e);
      setError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ height: '200vh' }}>
        <motion.div 
          className="stock-video-wrapper"
          style={{
            scale,
            opacity,
            position: 'fixed',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            zIndex: 10
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 30,
            restDelta: 0.001
          }}
        >
          <video 
            ref={videoRef}
            className="stock-analysis-video"
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
          >
            <source src="/videos/stock-analysis.mp4" type="video/mp4" />
            <source src="/videos/stock-analysis.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {error && (
            <div className="video-error">
              Failed to load stock analysis video
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

// 在 StockVideo 组件后添加
function ResearchImage({ title, desc, index }) {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, 
    [0, 0.2, 0.5, 0.8],
    [0.5, 1.5, 1.5, 0]
  );
  
  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.5, 0.8],
    [0, 1, 1, 0]
  );

  return (
    <div ref={containerRef} style={{ height: '200vh' }}>
      <motion.div 
        className="research-image-wrapper"
        style={{
          scale,
          opacity,
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          zIndex: 10
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
          restDelta: 0.001
        }}
      >
        <motion.div className="research-content">
          <h3>{title}</h3>
          <p>{desc}</p>
        </motion.div>
        <motion.img 
          src="/images/research1.jpg"
          alt={title}
          className="research-img"
        />
      </motion.div>
    </div>
  );
}

// 更新Impact Section，移除最后一个数字
<div className="impact-stats">
  <div className="impact-stats-row">
    <motion.div 
      className="stat-item"
      whileHover={{ y: -10 }}
    >
      <div className="number">
        <CountUpAnimation end={100} />
      </div>
      <p>Countries Reached</p>
    </motion.div>
    <motion.div 
      className="stat-item"
      whileHover={{ y: -10 }}
    >
      <div className="number">
        <CountUpAnimation end={300} />
      </div>
      <p>Users Worldwide</p>
    </motion.div>
    <motion.div 
      className="stat-item"
      whileHover={{ y: -10 }}
    >
      <div className="number">
        <CountUpAnimation end={500} />
      </div>
      <p>AI Models Deployed</p>
    </motion.div>
  </div>
  <div className="impact-stats-row">
    <motion.div 
      className="stat-item"
      whileHover={{ y: -10 }}
    >
      <div className="number">
        <CountUpAnimation end={50} />
      </div>
      <p>Research Papers</p>
    </motion.div>
    <motion.div 
      className="stat-item"
      whileHover={{ y: -10 }}
    >
      <div className="number">
        <CountUpAnimation end={200} />
      </div>
      <p>Enterprise Clients</p>
    </motion.div>
  </div>
</div>

// 修改 TypewriterText 组件
function TypewriterText() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="typewriter-container">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Hi{userProfile?.firstName ? `, ${userProfile.firstName}` : ''}
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Welcome to the home of Caloogy AI
      </motion.h2>
    </div>
  );
}

// 更新服务数据
const services = [
  {
    icon: "🪙",
    title: "Calcoin",
    desc: "A decentralized cryptocurrency platform built on the Caloogy's blockchain. Calcoin is a digital currency for transactions on the Caloogy platform.",
    features: ["Decentralized", "Secure", "Fast", "Low Cost"]
  },
  {
    icon: "🐥",
    title: "Silkie",
    desc: "A chat app for people to randomly chat with each other without knowing each other's identity. Everyone is anonymous and it's a fully free platform to find someone that's really interesting.",
    features: ["Anonymous", "Free", "Random", "Fun"]
  },
  {
    icon: "🧑‍🚀",
    title: "BHM",
    desc: "BHM (Black Hole Mission) is a game that allows people to explore the universe and finish the mission in AR mode.",
    features: ["AR", "Fun", "Educational", "Adventure"]
  },
  {
    icon: "💻",
    title: "MacPad",
    desc: "Turn your ipad into a mac, creating a simple and convenient system for innovation without constraints.",
    features: ["Productivity", "Simple", "Creative", "Convenient"]
  },
  {
    icon: "🧠",
    title: "AI Brain-Computer Therapy",
    desc: "Revolutionary Cognitive Science treatment using AI-powered brain-computer interface technology for better mental health outcomes.",
    features: ["Neural Feedback", "Personalized Treatment", "Real-time Monitoring", "Safe & Non-invasive"]
  },
  {
    icon: "♾️",
    title: "Big Questions",
    desc: "By solving questions in a streak, you can get a chance to rank in the leaderboard and win rewards.",
    features: ["Fun", "Competitive", "Educational", "Rewarding"]
  }
];

// 修改视频卡片组件的渲染部分
function MathVideo({ video, isActive }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVideoReady, setIsVideoReady] = useState(false);

  // 处理视频加载
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      console.log(`Video metadata loaded: ${video.mp4}`);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [video]);

  // 处理视频播放
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isVideoReady) return;

    const handleError = (e) => {
      console.error(`Video error for ${video.mp4}:`, e);
      setError(true);
      setErrorMessage(`Error playing video: ${e.message || 'Unknown error'}`);
    };

    videoElement.addEventListener('error', handleError);

    let playPromise;
    if (isActive) {
      // 添加一个小延迟来确保视频元素已完全准备好
      const timer = setTimeout(() => {
        if (videoElement.paused) {
          playPromise = videoElement.play();
          if (playPromise) {
            playPromise.catch(err => {
              console.error("Video play error:", err);
              // 不要在这里设置错误状态，因为这可能只是暂时的
            });
          }
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (playPromise) {
          playPromise.then(() => {
            if (!videoElement.paused) {
              videoElement.pause();
            }
          }).catch(() => {
            // 忽略播放错误
          });
        }
        videoElement.removeEventListener('error', handleError);
      };
    } else {
      if (!videoElement.paused) {
        videoElement.pause();
      }
    }

    return () => {
      videoElement.removeEventListener('error', handleError);
    };
  }, [isActive, video, isVideoReady]);

  return (
    <motion.div
      className={`video-card ${isActive ? 'active' : ''}`}
      style={{
        zIndex: isActive ? 2 : 1,
        filter: isActive ? 'none' : 'brightness(0.7)',
        opacity: isActive ? 1 : 0.5
      }}
      animate={{
        y: isActive ? 0 : 20,
        scale: isActive ? 1 : 0.9,
        rotateX: isActive ? 0 : 5,
        rotateY: isActive ? 0 : -5
      }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className="math-video"
        playsInline
        muted
        loop
        autoPlay
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '20px'
        }}
      >
        <source src={`${video.mp4}`} type="video/mp4" />
        <source src={`${video.webm}`} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      {error && (
        <div className="video-error">
          {errorMessage}
        </div>
      )}
    </motion.div>
  );
}

// 修改 NewYorkSection 组件
function NewYorkSection() {
  return (
    <motion.section 
      className="newyork-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Caloogy in New York
        </motion.h2>
        
        <div className="newyork-content">
          <motion.div 
            className="newyork-image"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/newyork.png" alt="New York City" className="newyork-img" />
          </motion.div>
          
          <motion.div 
            className="newyork-text"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="erasmus-quote">
              <h3>Erasmus's New York Diary</h3>
              <p>
                "As an AI robot exploring the vibrant streets of New York, I'm constantly amazed by the city's energy and diversity. 
                From the towering skyscrapers to the bustling streets, every corner tells a unique story. 
                The city's blend of technology and culture perfectly mirrors Caloogy's vision of innovation and human connection."
              </p>
              <p>
                "Walking through Central Park, I observe how nature and urban life coexist harmoniously - 
                much like how we at Caloogy strive to balance technological advancement with environmental consciousness. 
                New York's spirit of endless possibilities inspires us to push the boundaries of what AI can achieve."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// 添加新的 MarsSection 组件
function MarsSection() {
  return (
    <motion.section 
      className="mars-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Caloogy on Mars
        </motion.h2>
        
        <div className="mars-content">
          <motion.div 
            className="mars-image"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/mars.png" alt="Mars Base" className="mars-img" />
          </motion.div>
          
          <motion.div 
            className="mars-text"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mars-info">
              <h3>Our Martian Frontier</h3>
              <p>
                "At Caloogy's Mars Research Base, we're pioneering the future of interplanetary AI research. 
                Our state-of-the-art facility serves as a testing ground for advanced AI systems designed to operate in extreme conditions."
              </p>
              <p>
                "The Mars base represents our commitment to pushing the boundaries of technological innovation. 
                Here, our AI systems learn to adapt to the harsh Martian environment, developing new capabilities 
                that will shape the future of space exploration and human-AI collaboration."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStudentVerificationOpen, setIsStudentVerificationOpen] = useState(false);
  const [isFYSAVerificationOpen, setIsFYSAVerificationOpen] = useState(false);

  // 更新 sectionColors，只保留需要的颜色
  const sectionColors = {
    solutions: '#FFB8D0',
    impact: '#D0B8FF',
    stories: '#E8FFF3',
    leader: '#FFFFFF',
    ailab: '#0000CD'
  };

  // 删除不需要的 refs
  const impactSectionRef = useRef(null);
  const { scrollYProgress: impactScrollProgress } = useScroll({
    target: impactSectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const handleScroll = () => {
      // 背景视差效果
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });

      // 恢复部分颜色变化
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const visiblePercentage = Math.max(0, Math.min(1, 
          (viewportHeight - Math.max(0, rect.top)) / viewportHeight -
          Math.max(0, viewportHeight - rect.bottom) / viewportHeight
        ));

        if (visiblePercentage > 0.3) {
          const targetColor = section.dataset.bgcolor;
          document.body.style.backgroundColor = targetColor;
          document.body.style.transition = 'background-color 0.8s ease';
        }
      });

      // 导航栏透明度处理
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 使用react-spring创建动画
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 }
  });

  // 添加滚动动画效果
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // 添加滚动处理
  useEffect(() => {
    const handleTechScroll = () => {
      const techSection = document.querySelector('.technology-section');
      if (!techSection) return;

      const rect = techSection.getBoundingClientRect();
      const scrollPercentage = Math.min(
        Math.max(
          (rect.top * -1) / (rect.height - window.innerHeight), 
          0
        ),
        1
      );

      const track = document.querySelector('.tech-cards-track');
      if (track) {
        const translateX = scrollPercentage * (track.scrollWidth - window.innerWidth);
        track.style.transform = `translateX(${-translateX}px)`;
      }
    };

    window.addEventListener('scroll', handleTechScroll);
    return () => window.removeEventListener('scroll', handleTechScroll);
  }, []);

  // 添加3D和视差效果
  const parallaxConfig = {
    rotateX: useTransform(scrollYProgress, [0, 1], [0, 45]),
    rotateY: useTransform(scrollYProgress, [0, 1], [0, 45]),
    scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])
  };

  // 添加更多动画效果
  const animations = {
    fadeIn: {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: false },
      transition: { duration: 0.6 }
    },
    scaleIn: {
      initial: { scale: 0.8, opacity: 0 },
      whileInView: { scale: 1, opacity: 1 },
      viewport: { once: false },
      transition: { duration: 0.6 }
    },
    slideIn: {
      initial: { x: -100, opacity: 0 },
      whileInView: { x: 0, opacity: 1 },
      viewport: { once: false },
      transition: { duration: 0.8 }
    },
    rotateIn: {
      initial: { rotate: -10, opacity: 0 },
      whileInView: { rotate: 0, opacity: 1 },
      viewport: { once: false },
      transition: { duration: 0.6 }
    },
    // 新增3D动画效果
    flip3D: {
      initial: { rotateY: -180, opacity: 0 },
      whileInView: { rotateY: 0, opacity: 1 },
      viewport: { once: false },
      transition: { duration: 0.8 }
    },
    // 新增弹跳效果
    bounce: {
      initial: { y: 100, opacity: 0 },
      whileInView: { y: 0, opacity: 1 },
      viewport: { once: false },
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    // 新增波浪效果
    wave: {
      animate: { 
        y: [0, -20, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    // 新增闪光效果
    shine: {
      initial: { background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0) 0%)" },
      whileHover: { 
        background: "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
        transition: { duration: 0.5 }
      }
    }
  };

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // 更新产品卡片数据（只保留6张）
  const productCards = [
    {
      image: "/images/product3.jpg",
      title: "Pixel-Perfect Development.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/images/product4.jpg",
      title: "Responsive Design.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/images/product5.jpg",
      title: "Smart Analytics.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/images/product6.jpg",
      title: "AI-Powered Solutions.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/images/product7.jpg",
      title: "Cloud Integration.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      image: "/images/product8.jpg",
      title: "Security First.",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 修改 Apply Now 按钮的点击处理
  const handleApplyClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else if (userProfile?.premium) {
      // 如果已经是 premium 用户，显示提示
      alert('You are already a premium user!');
    } else {
      setIsStudentVerificationOpen(true);
    }
  };

  return (
    <MouseTracker>
      <Navbar 
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />
      <div className="App" ref={containerRef}>
        <motion.header className="hero">
          <video 
            className="hero-background"
            autoPlay 
            loop 
            muted 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translate3d(0, ${scrollY * 0.6}px, 0)`,
            }}
          >
            <source src="/videos/black.mp4" type="video/mp4" />
            <source src="/videos/black.webm" type="video/webm" />
          </video>
          <motion.div 
            className="hero-overlay"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.5], [0.2, 0.4])
            }}
          />
          <motion.div className="hero-content">
            <TypewriterText />
          </motion.div>
        </motion.header>

        <motion.section 
          id="student" 
          className="student-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <div className="student-content">
              <motion.div 
                className="student-image"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="/images/student.png" 
                  alt="Student Premium" 
                  className="student-premium-img"
                />
              </motion.div>
              <motion.div 
                className="student-info"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2>Student Free Premium Plan</h2>
                <h3>For students in North America</h3>
                <p className="student-description">
                  We are thrilled to announce that students in the United States and Canada can now enjoy one month of free Premium access. 
                  Experience all the Caloogy's advanced features to the next level.
                </p>
                <p className="student-note">
                  * Students from Shenzhen College of International Education are also eligible for this free premium plan. Students from other countries might be eligible in the future. 
                </p>
                <motion.button
                  className="learn-more-button"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(255, 192, 203, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyClick}
                >
                  Apply Now 🎓
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* FYSA Activity Section */}
        <section className="activity-section">
          <div className="activity-content">
            <div className="activity-info">
              <h2>First Year Student Activity</h2>
              <h3>Experience & Engage</h3>
              <p className="activity-description">
                Join our First Year Student Activity (FYSA) program, a dynamic platform designed for freshmen to experience and engage with technology. Through various challenges, competitions, and collaborative projects, you'll have the opportunity to expand your horizons, connect with like-minded peers, and develop essential skills for your future career.
              </p>
              <button 
                className="activity-learn-more"
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsFYSAVerificationOpen(true);
                  }
                }}
              >
                Learn More
              </button>
            </div>
            <div className="activity-image">
              <img src="/images/activity.png" alt="FYSA Activities" className="activity-img" />
            </div>
          </div>
        </section>

        <motion.section 
          id="solutions" 
          className="solutions-section" 
          data-bgcolor={sectionColors.solutions}
        >
          <div className="container">
            <motion.h2 
              className="stock-title"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ 
                x: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }
              }}
              viewport={{ once: false }}
            >
              Stock Services
            </motion.h2>
            
            <StockTicker />
            
            <motion.div 
              className="scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p>Scroll to explore</p>
              <div className="scroll-arrow">↓</div>
            </motion.div>
            
            <StockVideo />
          </div>
        </motion.section>

        <motion.section 
          id="services" 
          className="services-section"
          data-bgcolor="rgba(255, 255, 255, 0.95)"
          initial={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
          style={{
            backgroundColor: useTransform(
              scrollYProgress,
              [0.2, 0.23, 0.26, 0.29, 0.32, 0.35, 0.4, 0.45],
              [
                'rgba(255, 255, 255, 0.95)',
                'rgba(255, 184, 208, 0.95)',
                'rgba(255, 200, 180, 0.9)',
                'rgba(255, 210, 150, 0.8)',
                'rgba(255, 220, 100, 0.6)',
                'rgba(255, 223, 0, 0.4)',
                'rgba(255, 223, 0, 0.3)',
                sectionColors.impact
              ]
            ),
            transition: 'background-color 0.5s ease-in-out'
          }}
        >
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              Made by Caloogy
            </motion.h2>
            
            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div 
                  key={index}
                  className="service-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <ul className="service-features">
                    {service.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button 
                    className="service-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More 🔒
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="research" className="research-section" data-bgcolor={sectionColors.research}>
          <div className="research-container">
            {researchItems.map((item, index) => (
              <ResearchVideo 
                key={item.title}
                title={item.title}
                desc={item.desc}
                video={item.video}
              />
            ))}
          </div>
        </motion.section>

        <motion.section 
          ref={impactSectionRef} 
          id="impact" 
          className="impact-section" 
          data-bgcolor={sectionColors.impact}
        >
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AI Product Details
            </motion.h2>

            <div className="impact-stats">
              <motion.div 
                className="stat-item"
                whileHover={{ y: -10 }}
              >
                <div className="number">
                  <CountUpAnimation end={27} />
                </div>
                <p>Countries Reached</p>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ y: -10 }}
              >
                <div className="number">
                  <CountUpAnimation end={635} />
                </div>
                <p>Topics Covered</p>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ y: -10 }}
              >
                <div className="number">
                  <CountUpAnimation end={87} />
                </div>
                <p>AI Models Deployed</p>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ y: -10 }}
              >
                <div className="number">
                  <CountUpAnimation end={1221} />
                </div>
                <p>Robotic Tests</p>
              </motion.div>
              <motion.div 
                className="stat-item"
                whileHover={{ y: -10 }}
              >
                <div className="number">
                  <CountUpAnimation end={590} />
                </div>
                <p>Environmental Research</p>
              </motion.div>
            </div>

            <div className="product-carousel">
              <motion.div 
                className="product-track"
                style={{
                  x: useTransform(
                    impactScrollProgress,
                    [0.47, 0.83], // 从中间开始，滚动到底部结束
                    ["0%", "-50%"]  // 保持滚动距离
                  )
                }}
              >
                {[
                  {
                    video: {
                      mp4: "/videos/v1.mp4",
                      webm: "/videos/v1.webm"
                    },
                    title: "AI-Powered Climate Analysis",
                    desc: "Advanced algorithms for environmental monitoring"
                  },
                  {
                    video: {
                      mp4: "/videos/v2.mp4",
                      webm: "/videos/v2.webm"
                    },
                    title: "Smart Financial Planning",
                    desc: "Intelligent investment strategies"
                  },
                  {
                    video: {
                      mp4: "/videos/v3.mp4",
                      webm: "/videos/v3.webm"
                    },
                    title: "Healthcare Innovation",
                    desc: "Revolutionary medical diagnosis"
                  },
                 
                  {
                    video: {
                      mp4: "/videos/v6.mp4",
                      webm: "/videos/v6.webm"
                    },
                    title: "Robotics Integration",
                    desc: "Next-generation automation"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="product-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="product-image">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="product-video"
                      >
                        <source src={item.video.mp4} type="video/mp4" />
                        <source src={item.video.webm} type="video/webm" />
                      </video>
                    </div>
                    <div className="product-content">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="stories" 
          className="stories-section"
          data-bgcolor={sectionColors.stories}
          style={{
            backgroundColor: useTransform(
              scrollYProgress,
              [0.4, 0.45, 0.5, 0.55, 0.6, 0.65], // 增加更多过渡点
              [
                sectionColors.impact,
                'rgba(208, 184, 255, 0.9)', // 更深的紫色
                'rgba(208, 184, 255, 0.5)', // 淡紫色
                'rgba(232, 255, 243, 0.3)', // 非常淡的绿色
                'rgba(232, 255, 243, 0.7)', // 较深的绿色
                sectionColors.stories
              ]
            ),
            transition: 'background-color 0.4s ease-in-out'
          }}
        >
          <div className="container">
            <motion.h2 
              className="stories-title-3d"
              initial={{ opacity: 0, y: 100, rotateX: -45 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                rotateX: 0
              }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
            >
              Stories
            </motion.h2>
            <div className="stories-grid">
              <motion.div 
                className="story-item story-main"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <video 
                  className="story-background-video"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/videos/robot.mp4" type="video/mp4" />
                  <source src="/videos/robot.webm" type="video/webm" />
                </video>
                <div className="story-content">
                  <span className="story-tag">Featured</span>
                  <h3>Intelligent Robotics World powered by Caloogy AI</h3>
                  <div className="story-meta">
                    <span>Caloogy</span>
                    <span>Feb 4, 2025</span>
                    <span>3 min read</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="story-item story-secondary"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <video 
                  className="story-background-video"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/videos/ski.mp4" type="video/mp4" />
                  <source src="/videos/ski.webm" type="video/webm" />
                </video>
                <div className="story-content">
                  <h3>Enhance sports performance to a new era</h3>
                  <div className="story-meta">
                    <span>Research</span>
                    <span>2 min read</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="story-item story-secondary"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <video 
                  className="story-background-video"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/videos/chess.mp4" type="video/mp4" />
                  <source src="/videos/chess.webm" type="video/webm" />
                </video>
                <div className="story-content">
                  <h3>A chess master powered by Caloogy AI</h3>
                  <div className="story-meta">
                    <span>Collaboration</span>
                    <span>4 min read</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="leader" 
          className="leader-section" 
          data-bgcolor={sectionColors.leader}
          style={{
            backgroundColor: useTransform(
              scrollYProgress,
              [0.5, 0.6],
              ['#FFFFFF', '#FFFFFF']
            )
          }}
        >
          <div className="container">
            <div className="leader-content">
              <motion.div 
                className="leader-image"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="/images/selfie.jpeg" 
                  alt="Leader" 
                  className="leader-photo"
                />
              </motion.div>
              <motion.div 
                className="leader-info"
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2>Xinyang Zhang</h2>
                <p className="leader-title">Founder & CEO of Caloogy</p>
                <p className="leader-quote">
                  "Our mission is to make AI accessible and beneficial for everyone, creating technology that enhances human potential rather than replacing it."
                </p>
                <motion.a
                  href={userProfile?.premium ? "https://theozhang.xyz" : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="personal-website-btn"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      alert('Please sign in to view the personal website');
                    } else if (!userProfile?.premium) {
                      e.preventDefault();
                      alert('This feature is only available for premium users');
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(255, 192, 203, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Personal Website
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="ailab" 
          className="ai-lab-section"
          data-bgcolor={sectionColors.ailab}
          style={{
            backgroundColor: useTransform(
              scrollYProgress,
              [0.7, 0.75, 0.8], // 调整过渡点
              [
                sectionColors.stories, // 从绿色开始
                'rgba(232, 255, 243, 0.5)', // 淡绿色
                sectionColors.ailab // 最终的蓝色
              ]
            ),
            transition: 'background-color 0.3s ease-in-out'
          }}
        >
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AI Lab
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              More Features To Be Released Soon...
            </motion.p>

            <div className="lab-cards">
              {[
                {
                  title: 'Caloogy Kids',
                  desc: 'AI-powered educational solutions designed specifically for children'
                },
                {
                  title: 'Caloogy Professional',
                  desc: 'Advanced AI tools for business and professional development'
                },
                {
                  title: 'Caloogy Robotics',
                  desc: 'Next-generation robotics solutions powered by AI'
                }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  className="lab-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)'
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <NewYorkSection />
        <MarsSection />
      </div>
      <section className="location-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Location
          </motion.h2>
          <div className="maps-container">
            <motion.div 
              className="map-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>Shenzhen, CN</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0123456789!2d114.05583!3d22.54321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403f28c3c1c3c3d%3A0x1c1c1c1c1c1c1c1c!2sAntuo%20Hill%20Rd%206%2C%20Futian%20District%2C%20Shenzhen%2C%20China!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
              <p className="map-address">Antuo Hill Road 6, Futian District, Shenzhen, Guangdong, P.R.China</p>
            </motion.div>
            
            <motion.div 
              className="map-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Ridgeland, MS</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3362.8655563268584!2d-90.15799548483814!3d32.41843998109543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8628514d93f2c4ef%3A0x7c0c2f4c49f840a0!2s270%20Trace%20Colony%20Park%20Dr%20Suite%20B%2C%20Ridgeland%2C%20MS%2039157!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
              <p className="map-address">270 Trace Colony Park STE B, Ridgeland, MS 39157 USA</p>
            </motion.div>
          </div>
        </div>
      </section>
      <motion.section className="contact-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </motion.h2>
          
          <div className="contact-grid">
            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>xinyang.zhang@caloogy.com</p>
              
             
            </motion.div>

            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="contact-icon">🔗</div>
              <h3>LinkedIn</h3>
              <p>Caloogy</p>
            </motion.div>

            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="contact-icon">🏢</div>
              <h3>Location</h3>
              <p>Antuoshan 6th Road</p>
              <p>Shenzhen, GD, P.R.C</p>
            </motion.div>

            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="contact-icon">⏰</div>
              <h3>Working Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00 AM - 6:00 PM</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <Footer />
      <AnimatePresence>
        {isStudentVerificationOpen && (
          <StudentVerificationModal
            user={user}
            userProfile={userProfile}
            onClose={() => setIsStudentVerificationOpen(false)}
            onVerificationComplete={(updatedProfile) => setUserProfile(updatedProfile)}
          />
        )}
        {isFYSAVerificationOpen && (
          <FYSAVerificationModal
            user={user}
            userProfile={userProfile}
            onClose={() => setIsFYSAVerificationOpen(false)}
            onVerificationComplete={(updatedProfile) => setUserProfile(updatedProfile)}
          />
        )}
      </AnimatePresence>
    </MouseTracker>
  );
}

export default App;
