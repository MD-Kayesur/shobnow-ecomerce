import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { useExchangeOAuthCodeMutation } from "@/redux/features/auth/authApi";

const SocialAuthCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [exchange] = useExchangeOAuthCodeMutation();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const code = params.get("code");
    if (!code) {
      toast.error("Social sign-in could not be completed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    exchange({ code })
      .unwrap()
      .then(({ data }) => {
        const user = {
          ...data.user,
          role: String(data.user.role).toLowerCase() === "admin" ? "admin" as const : "user" as const,
        };
        dispatch(setUser({ user, token: data.accessToken }));
        navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Social sign-in could not be completed. Please try again.");
        navigate("/login", { replace: true });
      });
  }, [dispatch, exchange, navigate, params]);

  return (
    <main className="auth-session-loading" role="status" aria-live="polite">
      Completing secure sign-in…
    </main>
  );
};

export default SocialAuthCallback;
