import { useState, useEffect } from "react";

const useMethod = () => {
  const [method, setMethod] = useState("");

  useEffect(() => {
    const storedMethod = localStorage.getItem("method");
    if (storedMethod) {
      setMethod(storedMethod);
    }
  }, []);

  const updateMethod = (value) => {
    setMethod(value);
    localStorage.setItem("method", value);
  };

  return [method, updateMethod];
};

export default useMethod;
