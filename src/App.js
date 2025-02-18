import './App.css';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Suspense } from 'react';
import backgroundImage from './assets/painting1.jpeg';

function Navbar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    window.scrollTo({top: y, behavior: 'smooth'});
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a href="#" className="logo">CALOOGY AI</a>
        <div className="nav-links">
          <a href="#vision">Vision</a>
          <a href="#technology">Technology</a>
          <a href="#solutions">Solutions</a>
          <a href="#services">Services</a>
          <a href="#impact">Impact</a>
          <a href="#stories">Stories</a>
          <a href="#ailab">AI Lab</a>
        </div>
      </div>
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

// 更新技术卡片数据
const techCards = [
  { 
    title: "Focus on Climate Change", 
    desc: "Using AI to predict climate change and help people to reduce their carbon footprint." 
  },
  { 
    title: "Stock  Prediction and Risk Analysis", 
    desc: "Using Advanced machine learning to predict trends and draw charts without internet connection" 
  },
  { 
    title: "Embedded on MacPad offline", 
    desc: "Tiny language model running on your devices without internet connection, fully protect your security and privacy." 
  },
  { 
    title: "Low Cost AI Creation", 
    desc: "Open source AI platform created from scratch, with a focus on human-oriented and community collaboration." 
  }
];

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
          <source src={video} type="video/mp4" />
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
    title: "Focus on Climate Change",
    desc: "Using AI to monitor and analyze climate patterns",
    video: `${process.env.PUBLIC_URL}/videos/climate.mp4`
  },
  {
    title: "Stock Prediction and Risk Analysis",
    desc: "Advanced algorithms for market prediction",
    video: `${process.env.PUBLIC_URL}/videos/stock.mp4`
  },
  {
    title: "AI Education System",
    desc: "Personalized learning through artificial intelligence",
    video: `${process.env.PUBLIC_URL}/videos/education.mp4`
  },
  {
    title: "Human-oriented",
    desc: "AI technology that puts humans first",
    video: `${process.env.PUBLIC_URL}/videos/human.mp4`
  },
  {
    title: "Environmental Friendly",
    desc: "Sustainable AI solutions for a better future",
    video: `${process.env.PUBLIC_URL}/videos/tree.mp4`
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
            <source src={`${process.env.PUBLIC_URL}/videos/stock-analysis.mp4`} type="video/mp4" />
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

function TypewriterText() {
  const text = "One AI, endless possibilities";
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.h1>
  );
}

// 更新服务数据
const services = [
  {
    icon: "🌐",
    title: "Website Development",
    desc: "Professional website development with modern technologies and responsive design. We create stunning, fast-loading websites that drive results.",
    features: ["Custom Design", "SEO Optimization", "Mobile First", "24/7 Support"]
  },
  {
    icon: "📈",
    title: "AI Stock Analysis",
    desc: "Advanced stock market analysis powered by artificial intelligence. Get real-time insights and predictions for smarter investment decisions.",
    features: ["Real-time Analysis", "Risk Assessment", "Portfolio Optimization", "Market Predictions"]
  },
  {
    icon: "🌍",
    title: "Climate Change Action",
    desc: "Join our mission to combat climate change. We provide AI-powered solutions to help reduce carbon footprint and promote sustainability.",
    features: ["Carbon Tracking", "Green Solutions", "Impact Analysis", "Community Projects"]
  },
  {
    icon: "📱",
    title: "iOS Development",
    desc: "Custom iOS application development with cutting-edge features. We build intuitive, powerful apps that users love.",
    features: ["Native Apps", "Swift UI", "Cloud Integration", "App Store Support"]
  },
  {
    icon: "🧠",
    title: "AI Brain-Computer Interface Therapy",
    desc: "Revolutionary psychological treatment using AI-powered brain-computer interface technology for better mental health outcomes.",
    features: ["Neural Feedback", "Personalized Treatment", "Real-time Monitoring", "Safe & Non-invasive"]
  },
  {
    icon: "🤖",
    title: "Companion Robots",
    desc: "Advanced AI companion robots designed to provide emotional support and assistance in daily life.",
    features: ["Emotional Intelligence", "24/7 Companionship", "Task Assistance", "Adaptive Learning"]
  }
];

// 修改 mathTutorials 数组，移除测试视频
const mathTutorials = [
  {
    title: "Matrix",
    description: "Caloogy can help with matrix and linear algebra operations",
    video: "/videos/matrix.mp4"
  },
  {
    title: "Trigonometry",
    description: "It can also help with trigonometry, hypobolic functions and Maclaurin series",
    video: "/videos/trigonometry.mp4"
  },
  {
    title: "Calculus",
    description: "Derivatives, integrals and differential equations",
    video: "/videos/calculus.mp4"
  },
  {
    title: "Statistics & Probability",
    description: "Learn data analysis, probability distributions and statistical inference with practical examples",
    video: "/videos/statistics.mp4"
  },
  {
    title: "Complex Analysis and Polar Coordinates",
    description: "Complex numbers, polar coordinates and their calculations",
    video: "/videos/complex.mp4"
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
      console.log(`Video metadata loaded: ${video}`);
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
      console.error(`Video error for ${video}:`, e);
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
        preload="auto"
        poster="/images/video-placeholder.jpg" // 添加占位图
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '20px'
        }}
      >
        <source src={`${process.env.PUBLIC_URL}${video}`} type="video/mp4" />
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

function App() {
  const containerRef = useRef(null);
  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);
  const carouselRef3 = useRef(null);
  const [width, setWidth] = useState(0);
  const { scrollYProgress } = useScroll();
  const [scrollY, setScrollY] = useState(0);
  const productCarouselRef = useRef(null);

  // 为每个section创建ref
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  // 使用framer-motion的useInView hook检测每个section是否在视图中
  const isInView1 = useInView(section1Ref, { once: false });
  const isInView2 = useInView(section2Ref, { once: false });
  const isInView3 = useInView(section3Ref, { once: false });

  // 添加卡片激活状态处理
  const [activeCardIndex, setActiveCardIndex] = useState(3); // 默认中间卡片

  // 修改初始值为 0，确保不会超出数组范围
  const [currentVideo, setCurrentVideo] = useState(0);

  // 添加 ref 和 scroll progress
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

  useEffect(() => {
    // 计算轮播图的总宽度
    const scrollWidth = carouselRef1.current.scrollWidth;
    const clientWidth = carouselRef1.current.clientWidth;
    setWidth(scrollWidth - clientWidth);

    // 自动滚动效果
    const carousel1 = carouselRef1.current;
    const carousel2 = carouselRef2.current;
    const carousel3 = carouselRef3.current;
    
    let scrollInterval1 = setInterval(() => {
      if (carousel1.scrollLeft >= carousel1.scrollWidth - carousel1.clientWidth) {
        carousel1.scrollLeft = 0;
      } else {
        carousel1.scrollLeft += 2; // 加快速度
      }
    }, 20);

    let scrollInterval2 = setInterval(() => {
      if (carousel2.scrollLeft <= 0) {
        carousel2.scrollLeft = carousel2.scrollWidth - carousel2.clientWidth;
      } else {
        carousel2.scrollLeft -= 2; // 反向滚动
      }
    }, 20);

    let scrollInterval3 = setInterval(() => {
      if (carousel3.scrollLeft >= carousel3.scrollWidth - carousel3.clientWidth) {
        carousel3.scrollLeft = 0;
      } else {
        carousel3.scrollLeft += 2;
      }
    }, 20);

    return () => {
      clearInterval(scrollInterval1);
      clearInterval(scrollInterval2);
      clearInterval(scrollInterval3);
    };
  }, []);

  // 使用react-spring创建动画
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 1000 }
  });

  // 修改卡片数据以确保每个轨道有相同数量的卡片
  const cardSets = {
    set1: [
      { number: "01", title: "Empowering Humanity", desc: "Creating AI that enhances human capabilities." },
      { number: "02", title: "Ethical Innovation", desc: "Developing responsible AI with transparency." },
      { number: "03", title: "Global Impact", desc: "Making AI accessible worldwide." },
      { number: "04", title: "Future Ready", desc: "Preparing for tomorrow's challenges." },
      { number: "05", title: "Collaborative Growth", desc: "Building together with our community." }
    ],
    set2: [
      { number: "06", title: "Data Security", desc: "Protecting information with advanced encryption." },
      { number: "07", title: "Cloud Integration", desc: "Seamless deployment across platforms." },
      { number: "08", title: "AI Learning", desc: "Continuous improvement through machine learning." },
      { number: "09", title: "Scalable Solutions", desc: "Growing with your business needs." },
      { number: "10", title: "Custom Development", desc: "Tailored solutions for unique challenges." }
    ],
    set3: [
      { number: "11", title: "AI Research", desc: "Pushing the boundaries of possibility." },
      { number: "12", title: "Community Focus", desc: "Building together with developers." },
      { number: "13", title: "Innovation Lab", desc: "Exploring new AI frontiers." },
      { number: "14", title: "Global Network", desc: "Connected worldwide expertise." },
      { number: "15", title: "Future Vision", desc: "Shaping tomorrow's technology." }
    ]
  };

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

  // 更新颜色配置
  const sectionColors = {
    vision: '#FFFFFF',
    technology: '#FFFFFF',
    solutions: '#FFB8D0',
    impact: '#D0B8FF',
    stories: '#E8FFF3',
    leader: '#FFFFFF',
    ailab: '#0000CD'
  };

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

  const scrollProducts = (direction) => {
    const container = productCarouselRef.current;
    const scrollAmount = 500; // 增加滚动距离
    
    if (container) {
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      setActiveCardIndex(prev => 
        direction === 'left' 
          ? Math.max(0, prev - 1)
          : Math.min(productCards.length - 1, prev + 1)
      );
    }
  };

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

  // 添加 handleVideoChange 函数
  const handleVideoChange = (index) => {
    if (index >= 0 && index < mathTutorials.length) {
      setCurrentVideo(index);
    }
  };

  return (
    <MouseTracker>
      <Navbar />
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
              transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
            }}
          >
            <source src={`${process.env.PUBLIC_URL}/videos/dance.mp4`} type="video/mp4" />
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

        <motion.section id="vision" className="vision-section" data-bgcolor={sectionColors.vision}>
          <div className="container">
            <motion.h2
              variants={animations.bounce}
              initial="initial"
              whileInView="whileInView"
            >
              Our Vision
            </motion.h2>
            
            <div className="cards-container" ref={carouselRef1}>
              <motion.div 
                className="cards-track"
                style={{
                  perspective: 1000,
                  transformStyle: "preserve-3d"
                }}
              >
                {[...Array(2)].map((_, setIndex) => (
                  <div key={`track1-${setIndex}`} className="cards-set">
                    {cardSets.set1.map((card, index) => (
                      <motion.div
                        key={`card1-${index}`}
                        className="vision-card"
                        whileHover={{ 
                          rotateY: 15,
                          rotateX: 15,
                          scale: 1.1,
                          boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="number">{card.number}</span>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
            
            <div className="cards-container" ref={carouselRef2}>
              <div className="cards-track">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={`track2-${setIndex}`} className="cards-set">
                    {cardSets.set2.map((card, index) => (
                      <div key={`card2-${index}`} className="vision-card">
                        <span className="number">{card.number}</span>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="cards-container" ref={carouselRef3}>
              <div className="cards-track">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={`track3-${setIndex}`} className="cards-set">
                    {cardSets.set3.map((card, index) => (
                      <div key={`card3-${index}`} className="vision-card">
                        <span className="number">{card.number}</span>
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="math-tutorials" 
          className="math-section"
          data-bgcolor="#111111"
        >
          <div className="container">
            <div className="math-content">
              <div className="math-text">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  New Feature: Maths Tutorial For All Levels
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {mathTutorials[currentVideo]?.description || 'Loading...'}
                </motion.p>
                <div className="tutorial-nav">
                  {mathTutorials.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`tutorial-button ${currentVideo === index ? 'active' : ''}`}
                      onClick={() => handleVideoChange(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index + 1}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="video-stack">
                {mathTutorials.map((tutorial, index) => (
                  <MathVideo
                    key={index}
                    video={tutorial.video}
                    isActive={currentVideo === index}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="technology" className="technology-section" data-bgcolor={sectionColors.technology}>
          <div className="tech-cards-container">
            {techCards.map((item, index) => (
              <motion.div 
                key={item.title}
                className="tech-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: index * 0.2
                  }
                }}
                viewport={{ once: false }}
              >
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section id="solutions" className="solutions-section" data-bgcolor={sectionColors.solutions}>
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
            Analysis and predict stock prices
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
              Our Services (Coming soon...)
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
                    Learn More
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
                    video: "/caloogy/videos/v1.mp4",
                    title: "AI-Powered Climate Analysis",
                    desc: "Advanced algorithms for environmental monitoring"
                  },
                  {
                    video: "/caloogy/videos/v2.mp4",
                    title: "Smart Financial Planning",
                    desc: "Intelligent investment strategies"
                  },
                  {
                    video: "/caloogy/videos/v3.mp4",
                    title: "Healthcare Innovation",
                    desc: "Revolutionary medical diagnosis"
                  },
                  {
                    video: "/caloogy/videos/v4.mp4",
                    title: "Education Technology",
                    desc: "Personalized learning experience"
                  },
                  {
                    video: "/caloogy/videos/v5.mp4",
                    title: "Smart City Solutions",
                    desc: "Urban planning optimization"
                  },
                  {
                    video: "/caloogy/videos/v6.mp4",
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
                        <source src={item.video} type="video/mp4" />
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
                  <source src={`${process.env.PUBLIC_URL}/videos/robot.mp4`} type="video/mp4" />
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
                  <source src={`${process.env.PUBLIC_URL}/videos/ski.mp4`} type="video/mp4" />
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
                  <source src={`${process.env.PUBLIC_URL}/videos/chess.mp4`} type="video/mp4" />
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
                  src={`${process.env.PUBLIC_URL}/images/selfie.jpeg`} 
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
                <h2>Theo Zhang</h2>
                <p className="leader-title">Founder of Caloogy AI</p>
                <p className="leader-quote">
                  "Our mission is to make AI accessible and beneficial for everyone, creating technology that enhances human potential rather than replacing it."
                </p>
                <motion.a
                  href="http://itsmyspace.xyz"
          target="_blank"
          rel="noopener noreferrer"
                  className="personal-website-btn"
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
              <h3>Los Angeles, CA</h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203073836!2d-118.4003!3d34.0736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
                width="100%" 
                height="400" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
              <p className="map-address">Beverly Hills, Los Angeles, California, United States</p>
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
              <p>info@aicompany.com</p>
              <p>support@aicompany.com</p>
            </motion.div>

            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>+1 (555) 987-6543</p>
            </motion.div>

            <motion.div 
              className="contact-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="contact-icon">🏢</div>
              <h3>Office</h3>
              <p>123 AI Street</p>
              <p>Tech City, TC 12345</p>
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
    </MouseTracker>
  );
}

export default App;
