import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Wishlist() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/account#wishlist", { replace: true });
  }, [navigate]);

  return null;
}
