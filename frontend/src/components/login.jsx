import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import styles from "./css/login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <section className={styles.login_cont}>
      <p className={styles.welcome_text}>Welcome back!</p>
      <p className={styles.subtitle}>We're so excited to see you again!</p>
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((error, index) => (
            <li key={index}>* {error}</li>
          ))}
        </ul>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErrors([]);
          const errorMessage = await login(email, password);
          if (errorMessage) {
            setErrors([errorMessage]);
          } else {
            navigate("/");
          }
        }}
        className={styles.login_form}
      >
        <label htmlFor="email">
          email address <span className={styles.required}>*</span>
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="email"
          name="email"
          className={styles.input}
        />
        <label htmlFor="password">
          password <span className={styles.required}>*</span>
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          name="password"
          className={styles.input}
        />
        <button className={styles.button}>login</button>
        <p className={styles.redirect}>
          Need an account?{" "}
          <Link className={styles.redirect_text} to="/register">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
