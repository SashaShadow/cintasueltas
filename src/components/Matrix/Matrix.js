import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Inicializa tamaño
    resizeCanvas();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters =
      "アァイィウヴエエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let mouseX = -1000;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle ="#"+   Math.floor(Math.random()*16777215).toString(16);
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 1;
      }
    };

    const interval = setInterval(drawMatrix, 33);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: "black",
        display: "block"
      }}
    />
  );
};

export default MatrixRain;
