import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Базовый набор для легковесной конфигурации

export const Background = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Конфигурация частиц, соответствующая вашей цветовой схеме
  const particlesOptions = {
 
    particles: {
      color: {
        value: ["#404040", "#991b1b"], // neutral-700 и red-800
      },
      opacity: {
        value: { min: 0.3, max: 0.5 }, // Разная прозрачность для вариативности
      },
      number: {
        value: 80, // Количество частиц
        density: {
          enable: true,
          area: 800,
        },
      },
      size: {
        value: { min: 1, max: 3 }, // Разный размер частиц
      },
      move: {
        enable: true,
        speed: 0.8, // Медленное движение
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      links: {
        enable: true, // Включить соединения между частицами
        color: "#525252", // neutral-600
        opacity: 0.1,
        distance: 150,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", // Режим при наведении
        },
        onClick: {
          enable: true,
          mode: "push", // Режим при клике
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3, // Увеличить непрозрачность связей
            color: "#dc2626" // Покрасить связи в красный
          }
        },
        push: {
          quantity: 2, // Количество добавляемых частиц при клике
        },
      },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

