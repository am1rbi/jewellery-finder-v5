import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaCamera } from 'react-icons/fa';
import { useFunnelContext } from './FunnelContext';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);


const LandingPage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setUploadedImages } = useFunnelContext();

  const newWaySectionRef = useRef<HTMLElement>(null);
  const [headerText, setHeaderText] = useState('');
  const [showParagraph, setShowParagraph] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const slides = [
    {
      background: {
        backgroundColor: 'hsla(0,0%,0%,1)',
        backgroundImage: `
        radial-gradient(at 100% 5%, hsla(43,74%,49%,0.52) 0px, transparent 50%),
radial-gradient(at 27% 65%, hsla(107,75%,27%,0.37) 0px, transparent 50%)
        `
      },
      textColor: 'white',
      title: 'בתכלס, היא כבר בחרה את התכשיט שהיא רוצה. תן לנו למצוא אותו בשבילך.',
      content: 'Gold & Gem כאן כדי לחסוך לך זמן וכאב ראש. שתף איתנו תמונות של התכשיט שהיא בחרה, ותן לאפליקציה מבוססת ה AI שלנו למצוא לך אותו ברבע מהזמן שלוקח לך להגיע לבורסה ברמת גן.',
      buttonColor: 'white',
      frameColor: 'white',
    },
    {
      background: { backgroundColor: '#FFB6C1' },
      textColor: '#2a2a2a',
      title: 'את יודעת איזה תכשיט את רוצה?',
      content: 'Gold & Gem כאן כדי לחסוך לך זמן וכאב ראש. שתפי איתנו תמונות של התכשיט שאת מחפשת, ותני לאפליקציה מבוססת ה AI שלנו למצוא לך אותו בדיוק כמו שחלמת.',
      buttonColor: '#2a2a2a',
      frameColor: '#2a2a2a',
    },
  ];
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP animations
    if (headerRef.current && paragraphRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: newWaySectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: newWaySectionRef.current,
            start: 'top 60%',
            end: 'top 20%',
            scrub: true,
          },
        }
      );
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  useEffect(() => {
    const fullHeaderText = 'יש דרך חדשה לרכוש תכשיטים';
    let currentIndex = 0;
    let animationFrameId: number;

    const animateText = () => {
      if (currentIndex <= fullHeaderText.length) {
        setHeaderText(fullHeaderText.slice(0, currentIndex));
        currentIndex++;
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        setShowParagraph(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateText();
        } else {
          cancelAnimationFrame(animationFrameId);
          setHeaderText('');
          setShowParagraph(false);
          currentIndex = 0;
        }
      },
      { threshold: 0.5 }
    );

    if (newWaySectionRef.current) {
      observer.observe(newWaySectionRef.current);
    }

    return () => {
      if (newWaySectionRef.current) {
        observer.unobserve(newWaySectionRef.current);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const resizedImage = await resizeImage(file);
          newImages.push(resizedImage);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
      setSelectedImages(prevImages => [...prevImages, ...newImages]);
      setUploadedImages(prevImages => [...prevImages, ...newImages]);
      setIsPaused(true);
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleContinueClick = () => {
    if (selectedImages.length > 0) {
      navigate('/funnel');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div 
      className="landing-page noto-sans-hebrew" 
      dir="rtl" 
      style={{ 
        ...(currentSlide === 0 ? slides[0].background : { backgroundColor: slides[currentSlide].background.backgroundColor }),
        color: slides[currentSlide].textColor
      }}
    >
      <header>
        <div className="logo">Gold & Gem</div>
        <nav>
          <a href="#features">תכונות</a>
          <a href="#about">אודות</a>
        </nav>
      </header>
      <main className="hero-slider">
        <div className="content-section">
          <div className="text-content">
            <h1 className="main-title">{slides[currentSlide].title}</h1>
            <p>{slides[currentSlide].content}</p>
            <div className="cta-buttons">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
              />
              <button 
                className="icon-btn upload-btn" 
                onClick={handleUploadClick} 
                aria-label="העלאת תמונות"
                style={{ backgroundColor: slides[currentSlide].buttonColor, color: slides[currentSlide].background.backgroundColor }}
              >
                <FaUpload />
              </button>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                ref={cameraInputRef}
                style={{ display: 'none' }}
                multiple
              />
              <button 
                className="icon-btn camera-btn" 
                onClick={handleCameraClick} 
                aria-label="צילום תמונה"
                style={{ backgroundColor: slides[currentSlide].buttonColor, color: slides[currentSlide].background.backgroundColor }}
              >
                <FaCamera />
              </button>
              {selectedImages.length > 0 && (
                <button 
                  className="continue-button" 
                  onClick={handleContinueClick}
                  style={{ backgroundColor: slides[currentSlide].buttonColor, color: slides[currentSlide].background.backgroundColor }}
                >
                  קדימה לעבודה!
                </button>
              )}
            </div>
          </div>
          <div 
            className="image-preview-frame"
            style={{ borderColor: slides[currentSlide].frameColor, color: slides[currentSlide].frameColor }}
          >
            {selectedImages.length > 0 ? (
              <div className="image-preview">
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button className="remove-image" onClick={() => handleRemoveImage(index)}>
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-frame-text">העלה או צלם תמונות של התכשיט הרצוי</div>
            )}
          </div>
        </div>
      </main>
      <div className="scrolling-text-container">
        <div className="scrolling-text">
          <span>
            תכשיטים • טבעות • שרשראות • עגילים • יהלומים • זהב • כסף • פנינים • טבעת אירוסין • טבעת נישואין • טבעת יהלום • אבני חן • צמידים • עיצובים • אופנה • קלאסי • מודרני • אירוסין • נישואין • חתונה • מתנה • סמליות • שיבוץ • חריטה • עיצוב אישי • מתנות יוקרה • אבן חן • טבעת יוקרה • טבעות קלאסיות • טבעת מודרנית • חיתוך יהלומים • תכשיטי יוקרה • תכשיטים בעבודת יד • זהב לבן • זהב צהוב • זהב אדום • תכשיטים מעוצבים • תכשיטים לגברים • תכשיטים לנשים • טבעת חתונה • יהלום עגול • יהלום מרובע • צמיד יהלומים • עגילי זהב • שרשרת יהלומים • תכשיטי זהב • שרשרת זהב • טבעות זהב • צמיד זהב • קולקציה חדשה • אירועים • אירוע יוקרתי • הצעת נישואין • טבעות מעוצבות • טבעות יוקרתיות • טבעות נוצצות • מעצב תכשיטים • עיצוב יוקרתי • עגילי יוקרה • שרשראות יוקרתיות • סגנון אישי • עגילים מעוצבים • עיצוב טבעות • יהלומים משובצים • טבעות וינטאג' • יוקרה • טוהר • איכות • מעצב • חנות תכשיטים • מעצבת תכשיטים • טבעות ייחודיות • טבעת זהב לבן • אבן חן יוקרתית • עיצוב קלאסי • טבעת מרשימה • טבעת נוצצת • יהלום יוקרתי • חנות יוקרה • תכשיטים יוקרתיים • טבעות קלאסיות
          </span>
        </div>
      </div>
        <section className="new-way-section" ref={newWaySectionRef}>
        <h2 ref={headerRef} className="animate-text">
          {Array.from('יש דרך חדשה לרכוש תכשיטים').map((char, index) => (
            <span key={index} className="char">
              {char}
            </span>
          ))}
        </h2>
        <p ref={paragraphRef} className="animate-paragraph">
          טקסט מקום שומר שיוחלף בעתיד. כאן יהיה תיאור מפורט יותר על הדרך החדשה לרכישת תכשיטים.
        </p>
      </section>
      <footer>
        <div className="footer-content">
          <p>&copy; 2023 Gold & Gem</p>
          <p>רחוב הזהב 123, תל אביב</p>
          <p>טלפון: 03-1234567</p>
          <p>info@goldandgem.com</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;