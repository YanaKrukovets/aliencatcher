const Starfield = () => {
  const stars = Array.from({ length: 70 });

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {stars.map((_, i) => {
        const size = `${Math.floor(Math.random() * 2) + 2}px`; // 6 to 12px
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.floor(Math.random() * 5) + 1}s`;
        const duration = `${Math.floor(Math.random() * 10) + 15}s`; // Random duration (15s to 25s)
        return (
          <div
            key={i}
            className={`absolute bottom-[50px] bg-white  animate-rise animation-delay-${delay}`}
            style={{
              width: size,
              height: size,
              left,
              animationDuration: duration,
            }}
          />
        );
      })}
    </div>
  );
};

export default Starfield;
