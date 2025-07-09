import React, { useState } from 'react';
import { Layout } from 'src/components/Layout';
import styles from './CouponPage.module.css';

const CouponPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email);
    }
  };

  const coupons = [
    {
      id: 1,
      title: '10%OFF クーポン',
      description: '全商品10%割引',
      code: 'SAVE10',
      expiry: '2025-12-31',
      discount: '10%',
      color: 'blue'
    },
    {
      id: 2,
      title: '送料無料クーポン',
      description: '1000円以上で送料無料',
      code: 'FREESHIP',
      expiry: '2025-12-31',
      discount: '送料無料',
      color: 'green'
    },
    {
      id: 3,
      title: '20%OFF クーポン',
      description: '5000円以上で20%割引',
      code: 'SAVE20',
      expiry: '2025-12-31',
      discount: '20%',
      color: 'purple'
    }
  ];

  return (
    <Layout title="クーポン取得ページ">
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>🎫 お得なクーポンをゲット！</h1>
          <p className={styles.subtitle}>
            メールアドレスを登録して、特別なクーポンを受け取ろう
          </p>
        </div>

        {!isSubmitted ? (
          <div className={styles.signupSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                クーポンを受け取る
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h3>登録完了！</h3>
            <p>クーポンコードをメールでお送りしました。</p>
          </div>
        )}

        <div className={styles.couponsSection}>
          <h2 className={styles.sectionTitle}>利用可能なクーポン</h2>
          <div className={styles.couponsGrid}>
            {coupons.map((coupon) => (
              <div key={coupon.id} className={`${styles.couponCard} ${styles[coupon.color]}`}>
                <div className={styles.couponHeader}>
                  <h3 className={styles.couponTitle}>{coupon.title}</h3>
                  <span className={styles.discount}>{coupon.discount}</span>
                </div>
                <p className={styles.couponDescription}>{coupon.description}</p>
                <div className={styles.couponCode}>
                  <span className={styles.codeLabel}>クーポンコード:</span>
                  <code className={styles.code}>{coupon.code}</code>
                </div>
                <div className={styles.couponExpiry}>
                  有効期限: {coupon.expiry}
                </div>
                <button className={styles.copyButton}>
                  コードをコピー
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.howToUse}>
          <h2 className={styles.sectionTitle}>クーポンの使い方</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>商品を選択</h3>
                <p>お好みの商品をカートに追加してください</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>チェックアウト</h3>
                <p>購入手続きページに進んでください</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>クーポンコード入力</h3>
                <p>クーポンコードを入力して割引を適用してください</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CouponPage;