import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const checks = useMemo(() => ({
    length: password.length >= 8,
    caseMix: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9\s]/.test(password),
    matches: password.length > 0 && password === confirmPassword,
  }), [password, confirmPassword]);

  const strength = password.length === 0 ? "Not rated" : ["", "Weak", "Fair", "Good", "Strong"][
    Number(checks.length) + Number(checks.caseMix) + Number(checks.hasNumber) + Number(checks.hasSymbol)
  ];
  const strengthScore = Number(checks.length) + Number(checks.caseMix) + Number(checks.hasNumber) + Number(checks.hasSymbol);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!checks.length || !checks.caseMix || !checks.hasNumber || !checks.hasSymbol) {
      toast.error("Use at least 8 characters with uppercase and lowercase letters, a number, and a symbol.");
      return;
    }
    if (!checks.matches) {
      toast.error("The passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem("auth_password_reset_token");
    if (!resetToken) {
      toast.error("Your password reset session has expired. Request a new code.");
      navigate("/forgot-password", { replace: true });
      return;
    }

    try {
      await resetPassword({ resetToken, newPassword: password }).unwrap();
      setIsSuccess(true);
      sessionStorage.removeItem("auth_reset_identifier");
      sessionStorage.removeItem("auth_reset_method");
      sessionStorage.removeItem("auth_otp_verified");
      sessionStorage.removeItem("auth_otp_type");
      sessionStorage.removeItem("auth_otp_expires_at");
      sessionStorage.removeItem("auth_otp_resend_at");
      sessionStorage.removeItem("auth_password_reset_token");
      toast.success("Your password has been updated. You can now sign in.");
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string | string[] }; error?: string };
      const message = apiError?.data?.message ?? apiError?.error ?? "We could not reset your password. Please try again.";
      toast.error(Array.isArray(message) ? message.join(" ") : message);
    }
  };

  const passwordField = (confirm = false) => {
    const value = confirm ? confirmPassword : password;
    const visible = confirm ? showConfirmPassword : showPassword;
    const setValue = confirm ? setConfirmPassword : setPassword;
    const toggleVisibility = confirm ? setShowConfirmPassword : setShowPassword;
    const id = confirm ? "confirm-password" : "new-password";
    return (
      <div className="reset-field">
        <label htmlFor={id}>{confirm ? "Confirm new password" : "New password"}</label>
        <div className="reset-input-wrap">
          <Lock aria-hidden="true" />
          <input
            id={id}
            type={visible ? "text" : "password"}
            autoComplete={confirm ? "new-password" : "new-password"}
            required
            minLength={8}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={confirm ? "Repeat your password" : "Create a strong password"}
          />
          <button type="button" onClick={() => toggleVisibility(!visible)} aria-label={visible ? "Hide password" : "Show password"}>
            {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="reset-page">
      <section className="reset-card" aria-labelledby="reset-title">
        {isSuccess ? (
          <div className="reset-success" role="status">
            <Link to="/" className="reset-brand" aria-label="Shop Now home">
              <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
            </Link>
            <div className="reset-success-icon"><CheckCircle2 aria-hidden="true" /></div>
            <span className="reset-eyebrow">PASSWORD UPDATED</span>
            <h1 id="reset-title">You’re all set</h1>
            <p>Your password has been changed securely. Sign in with your new password to continue shopping.</p>
            <button type="button" className="reset-submit" onClick={() => navigate("/login", { replace: true })}>
              Go to sign in <ArrowRight aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="reset-back-link"><ArrowLeft aria-hidden="true" /> Back to sign in</Link>
            <Link to="/" className="reset-brand" aria-label="Shop Now home">
              <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
            </Link>

            <header className="reset-heading">
              <span className="reset-eyebrow">ACCOUNT RECOVERY · STEP 3</span>
              <h1 id="reset-title">Set a new password</h1>
              <p>Choose a strong password you haven’t used before.</p>
            </header>

            <form className="reset-form" onSubmit={handleSubmit}>
              {passwordField()}
              {passwordField(true)}

              <div className="reset-strength" aria-live="polite">
                <div className="reset-strength-heading"><span>Password strength</span><strong data-score={strengthScore}>{strength}</strong></div>
                <div className="reset-strength-track" aria-hidden="true">
                  {[1, 2, 3, 4].map((segment) => <span key={segment} className={strengthScore >= segment ? "filled" : ""} />)}
                </div>
                <ul>
                  {[
                    [checks.length, "At least 8 characters"],
                    [checks.caseMix, "Uppercase and lowercase letters"],
                    [checks.hasNumber, "At least one number"],
                    [checks.hasSymbol, "At least one symbol"],
                    [checks.matches, "Passwords match"],
                  ].map(([valid, label]) => (
                    <li key={String(label)} className={valid ? "valid" : ""}>
                      {valid ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}{label}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                className="reset-submit"
                disabled={isLoading || !checks.length || !checks.caseMix || !checks.hasNumber || !checks.hasSymbol || !checks.matches}
                aria-busy={isLoading}
              >
                {isLoading ? <><span className="reset-spinner" aria-hidden="true" /> Updating password…</> : <>Update password <ArrowRight aria-hidden="true" /></>}
              </button>
            </form>

            <p className="reset-footer">Need another code? <Link to="/forgot-password">Start recovery again</Link></p>
          </>
        )}
      </section>
    </main>
  );
};

export default ResetPassword;
