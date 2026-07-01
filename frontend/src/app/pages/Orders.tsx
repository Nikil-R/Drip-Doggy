import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Orders() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/account#orders", { replace: true });
  }, [navigate]);

  return null;
}
