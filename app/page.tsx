'use client';

import Link from 'next/link';
import styles from './HomePage.module.css';
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="./HomePage.css" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff8c2d" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ff8c2d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ff8c2d" />

        <title>Duck it! — Instant AI writing assistant</title>
        <meta name="title" content="Duck it! — Instant AI writing assistant" />
        <meta name="description" content="Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.useduckit.app/" />
        <meta property="og:title" content="Duck it! — Instant AI writing assistant" />
        <meta property="og:description" content="Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut." />
        <meta property="og:image" content="/OGImage.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.useduckit.app/" />
        <meta property="twitter:title" content="Duck it! — Instant AI writing assistant" />
        <meta property="twitter:description" content="Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut." />
        <meta property="twitter:image" content="/OGImage.jpg" />
      </Head>

      <div className={`${styles.homePage} ${styles.container}`}>
        <p className={styles.logo}><img src="/duck-it-app-icon.png" alt="Duck it!" width="120" /></p>

        <div className={styles.headline}>
          <h1><i>Duck it!</i> away all your writing <span className={styles.under}>troubls</span>.</h1>
          <p>Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut.</p>
          <p>
          <Link href="/#download">
            <span>Download free trial</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" fill="none">
                <path fill="#fff" d="M8.857 2.556C8.322 3.21 7.416 3.69 6.695 3.69c-.087 0-.164-.01-.219-.021a1.34 1.34 0 0 1-.032-.284c0-.83.426-1.65.873-2.174C7.897.535 8.868.032 9.677 0c.021.087.032.208.032.317 0 .83-.36 1.638-.852 2.239Zm.568 1.31c.459 0 2.097.044 3.167 1.595-.087.065-1.725.983-1.725 3.036 0 2.38 2.075 3.222 2.14 3.244-.01.054-.327 1.146-1.092 2.271-.688.972-1.408 1.966-2.49 1.966-1.092 0-1.376-.633-2.62-.633-1.224 0-1.661.655-2.655.655-.994 0-1.693-.917-2.479-2.031C.743 12.647 0 10.605 0 8.66 0 5.559 2.02 3.91 4.008 3.91c1.06 0 1.933.688 2.6.688.633 0 1.616-.732 2.817-.732Z" style={{fill:'#fff', fillOpacity:1}} />
              </svg>
            </span>
        </Link>
          </p>
          <div id="faq" ></div>
        </div>

        <div style={{ backgroundColor: '#0e1628', paddingTop: '40px' , marginTop: '80px'}}>  
          <div className={styles.headline}>
              <h2 className={styles.title}>Why? <i>Duck it!</i></h2>
          </div>
          <div className={styles.features} style={{ marginTop: '40px', paddingBottom: '40px'}}>
          <div>
            <p className={styles.title}>"I already have X extension on my browser and Y subscription."</p>
            <p className={styles.desc}>Duck it! works anywhere. Wherever you have an input field, you can use Duck it! A single macOS app that works on your browser, mail composer, or notes... you name it. Say goodbye to multiple apps.</p>
          </div>
          <div>
            <p className={styles.title}>"Free AI tools do the job when I copy and paste what I work on."</p>
            <p className={styles.desc}>Indeed! They work well until they don't. Should you favor avoiding context switching, refrain from manual copying and pasting, and wish not to train the AI bot using your prompts while it provides you with subpar results, Duck it! is here for you.</p>
          </div>
          <div>
            <p className={styles.title}>"How quick are your results ?"</p>
            <p className={styles.desc}>Duck it! delivers immediate results within a second for most inputs, unlike comparable tools that make you wait as they type out the results word by word.</p>
          </div>
          <div>
            <p className={styles.title}>"Which technologies do you use underneath?"</p>
            <p className={styles.desc}>"Duck it! combines various LLMs and cross-verifies the outcomes among them to guarantee the optimal result for any given input when correcting, rerphrasing, and translating to another language."</p>
          </div>
          </div>
          <div id="download" ></div>
        </div>

        <div className={`${styles.headline} ${styles.footer}`}>
          <h1>Get started with <i>Duck it!</i>.</h1>
          <p>"Duck it! is currently available only on macOS. However, versions for Windows, iOS, and Android are in development."</p>
          <p>
          <Link href="/Duck_it.dmg">
            <span>Download free trial</span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" fill="none">
                <path fill="#fff" d="M8.857 2.556C8.322 3.21 7.416 3.69 6.695 3.69c-.087 0-.164-.01-.219-.021a1.34 1.34 0 0 1-.032-.284c0-.83.426-1.65.873-2.174C7.897.535 8.868.032 9.677 0c.021.087.032.208.032.317 0 .83-.36 1.638-.852 2.239Zm.568 1.31c.459 0 2.097.044 3.167 1.595-.087.065-1.725.983-1.725 3.036 0 2.38 2.075 3.222 2.14 3.244-.01.054-.327 1.146-1.092 2.271-.688.972-1.408 1.966-2.49 1.966-1.092 0-1.376-.633-2.62-.633-1.224 0-1.661.655-2.655.655-.994 0-1.693-.917-2.479-2.031C.743 12.647 0 10.605 0 8.66 0 5.559 2.02 3.91 4.008 3.91c1.06 0 1.933.688 2.6.688.633 0 1.616-.732 2.817-.732Z" style={{fill:'#fff', fillOpacity:1}} />
              </svg>
            </span>
        </Link>
          </p>
          <div id="faq" ></div>
        </div>
      </div>
    </>
  );
}