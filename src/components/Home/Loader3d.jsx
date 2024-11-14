"use client";
import Spinner from "@/lib/reusable/Spinner";
import { Html } from "@react-three/drei";
import { useEffect } from "react";

function Loader3d({ load }) {
  useEffect(() => {
    return () => load(false);
  }, []);
  return (
    <Html>
      <Spinner />
    </Html>
  );
}

export default Loader3d;
