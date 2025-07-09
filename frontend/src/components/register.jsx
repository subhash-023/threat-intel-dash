import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import styles from "./css/login.module.css";

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  return (
    <section className={styles.login_cont}>
      <p className={styles.welcome_text}>Welcome!</p>
      <p className={styles.subtitle}>We're so excited to have you here!</p>
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
          const errorMessage = await register(email, password);
          if (errorMessage) {
            setErrors([errorMessage]);
          } else {
            navigate("/login");
          }
        }}
        className={styles.login_form}
      >
        <label htmlFor="email">
          email address <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">
          password <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button}>continue</button>
        <p className={styles.redirect}>
          Have an account?{" "}
          <Link className={styles.redirect_text} to="/login">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;