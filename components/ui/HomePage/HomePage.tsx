'use client';
import Link from 'next/link';
import styles from './HomePage.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getErrorRedirect } from '@/utils/helpers';

function AnimatedText() {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const words = ['fix the grammar', 'rephrase', 'translate'];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text !== words[index]) {
        setText((prevText) => prevText + words[index][prevText.length]);
      } else {
        setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % words.length);
          setText('');
        }, 1000); // 1 second delay before the word changes
      }
    }, 100); // Change text every 200ms

    return () => clearTimeout(timeoutId); // Clean up on unmount
  }, [text, index]);

  return <span className={styles.animatedText}>{text}</span>;
}

export default function HomePage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [downloadLinkEmail, setEmail] = useState('');

  const handleDownloadClick = (event: React.MouseEvent) => {
    if (!navigator.userAgent.includes('Macintosh')) {
      event.preventDefault();
      setShowPopup(true);
    }
  };

  const handleDownloadLinkClick = async () => {
    const response = await fetch('/api/getDownloadLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: downloadLinkEmail }),
    });

    if (response.ok) {
      setShowPopup(false);
    } else {
      const errorData = await response.json();
      router.push(
        getErrorRedirect(
          '/',
          'Failed to send the download link',
          errorData.message
        )
      );
    }
  };

  const DownloadButton = () => (
    <>
    <a href="/Duck_it.dmg" onClick={handleDownloadClick}>
        <span>Download free trial</span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" fill="none">
            <path fill="#fff" d="M8.857 2.556C8.322 3.21 7.416 3.69 6.695 3.69c-.087 0-.164-.01-.219-.021a1.34 1.34 0 0 1-.032-.284c0-.83.426-1.65.873-2.174C7.897.535 8.868.032 9.677 0c.021.087.032.208.032.317 0 .83-.36 1.638-.852 2.239Zm.568 1.31c.459 0 2.097.044 3.167 1.595-.087.065-1.725.983-1.725 3.036 0 2.38 2.075 3.222 2.14 3.244-.01.054-.327 1.146-1.092 2.271-.688.972-1.408 1.966-2.49 1.966-1.092 0-1.376-.633-2.62-.633-1.224 0-1.661.655-2.655.655-.994 0-1.693-.917-2.479-2.031C.743 12.647 0 10.605 0 8.66 0 5.559 2.02 3.91 4.008 3.91c1.06 0 1.933.688 2.6.688.633 0 1.616-.732 2.817-.732Z" style={{fill:'#fff', fillOpacity:1}} />
          </svg>
        </span>
      </a>
      {showPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popupTitle}><i>Duck it!</i> is currently available on macOS, download it on your Mac</p>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={downloadLinkEmail} 
              className={styles.popupInput} 
              onChange={(e) => setEmail(e.target.value)} 
              autoFocus={true}
              />
            <a onClick={handleDownloadLinkClick} className={`${styles.popupButton} ${styles.popupButtonLink}`}>
              <span>Get Download Link</span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" fill="none">
                  <path fill="#fff" d="M8.857 2.556C8.322 3.21 7.416 3.69 6.695 3.69c-.087 0-.164-.01-.219-.021a1.34 1.34 0 0 1-.032-.284c0-.83.426-1.65.873-2.174C7.897.535 8.868.032 9.677 0c.021.087.032.208.032.317 0 .83-.36 1.638-.852 2.239Zm.568 1.31c.459 0 2.097.044 3.167 1.595-.087.065-1.725.983-1.725 3.036 0 2.38 2.075 3.222 2.14 3.244-.01.054-.327 1.146-1.092 2.271-.688.972-1.408 1.966-2.49 1.966-1.092 0-1.376-.633-2.62-.633-1.224 0-1.661.655-2.655.655-.994 0-1.693-.917-2.479-2.031C.743 12.647 0 10.605 0 8.66 0 5.559 2.02 3.91 4.008 3.91c1.06 0 1.933.688 2.6.688.633 0 1.616-.732 2.817-.732Z" style={{fill:'#fff', fillOpacity:1}} />
                </svg>
              </span>
            </a>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className={`${styles.homePage}`}>
        <p className={styles.logo}><img src="/duck-it-app-icon.png" alt="Duck it!" width="120" /></p>

        <div className={styles.headline}>
          <div id="download" ></div>
          <h1><i>Duck it!</i> away all your writing <span className={styles.under}>troubls</span>.</h1>
          <p>Improve, concise, translate with just one shortcut  <span style={{fontSize: '21px'}}> anywhere</span> on your Mac</p>
          <p>
          <DownloadButton/>
          </p>
          <div style={{marginBottom: '80px'}}></div>
        </div>

        <div className={styles.demo}>
          <div className={styles.desc}>
            <h1>Select text<span style={{ fontSize: '14px', color: 'var(--black50)', fontWeight: '500'}}>&nbsp;&nbsp;<i>or don't, it picks the last sentence for you.</i></span></h1>
            <h1>Hit your shortcut to <AnimatedText/></h1>
          </div>
          <div className={styles.videoContainer}>
            <video autoPlay loop muted playsInline>
              <source src="/demo_onboarding_fast_1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className={styles.demo}>
          <div className={styles.desc}>
            <h1>Want more control?</h1>
            <h1>Use prompt menu for customized inputs.</h1>
          </div>
          <div className={styles.videoContainer}>
            <video autoPlay loop muted playsInline>
              <source src="/demo_onboarding_fast_2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div style={{ backgroundColor: '#f2f6f9', paddingTop: '40px' , marginTop: '80px'}}>  
          <div className={styles.headline}>
              <h2 className={styles.title}>Why? <i>Duck it!</i></h2>
          </div>
          <div className={styles.features} style={{ marginTop: '40px', paddingBottom: '40px', maxWidth: '1500px'}}>
          <div>
            <p className={styles.title}>"I already have Xly on my browser and Y-GPT subscription."</p>
            <p className={styles.desc}>Unlike others, Duck it! works on your browser, mail composer, or notes... you name it. Wherever you have an input field, you can Duck it!</p>
          </div>
          <div>
            <p className={styles.title}>"Free AI tools do the job when I copy and paste what I work on."</p>
            <p className={styles.desc}>To avoid context switching, manual copying & pasting and AI training, try Duck it!</p>
          </div>
          <div>
            <p className={styles.title}>"How quick are your results?"</p>
            <p className={styles.desc}>We deliver results under one second for most inputs, unlike others that type out results word by word.</p>
          </div>
          <div>
            <p className={styles.title}>"Which technologies do you use underneath?"</p>
            <p className={styles.desc}>We combine various LLMs and cross-verify the outcomes among them to guarantee the optimal result for any given input when correcting, rerphrasing, and translating to another language.</p>
          </div>
          </div>
        </div>

        <div className={`${styles.headline} ${styles.footer}`}>
            <h1>Get started with <i>Duck it!</i></h1>
            <p>Currently available only on macOS. Other platforms are on the way.</p>
            <p>
            <DownloadButton/>
            </p>
        </div>
      </div>
    </>
  );
}