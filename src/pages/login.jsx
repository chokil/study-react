import { useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "src/components/Layout";
import classes from "src/styles/Login.module.css";
import { useApp } from "src/contexts/AppContext";

const Login = () => {
  const router = useRouter();
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    
    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "ログインに成功しました！",
          type: "success"
        }
      });
      
      // Store user info in context (simplified)
      // Admin users have email ending with @admin.com for demo purposes
      const isAdmin = formData.email.endsWith('@admin.com');
      dispatch({
        type: "SET_USER",
        payload: {
          email: formData.email,
          isLoggedIn: true,
          isAdmin: isAdmin
        }
      });
      
      router.push("/reservation");
    }, 1000);
  };

  return (
    <Layout title="ログイン">
      <div className={classes.loginContainer}>
        <div className={classes.loginBox}>
          <h1 className={classes.title}>ログイン</h1>
          <p className={classes.subtitle}>予約システムへようこそ</p>
          
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="email" className={classes.label}>
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${classes.input} ${errors.email ? classes.error : ""}`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <span className={classes.errorMessage}>{errors.email}</span>
              )}
            </div>
            
            <div className={classes.formGroup}>
              <label htmlFor="password" className={classes.label}>
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${classes.input} ${errors.password ? classes.error : ""}`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <span className={classes.errorMessage}>{errors.password}</span>
              )}
            </div>
            
            <button
              type="submit"
              className={classes.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={classes.loadingSpinner}>ログイン中...</span>
              ) : (
                "ログイン"
              )}
            </button>
          </form>
          
          <div className={classes.divider}>
            <span>または</span>
          </div>
          
          <button className={classes.socialButton}>
            <span className={classes.socialIcon}>G</span>
            Googleでログイン
          </button>
          
          <p className={classes.footer}>
            アカウントをお持ちでない方は
            <a href="#" className={classes.link}> 新規登録</a>
          </p>
          
          <p className={classes.hint}>
            ヒント: 管理者としてログインするには、メールアドレスを @admin.com で終わるようにしてください
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;