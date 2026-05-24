export default function GlassContainer({
  children,
  className = ""
}) {
  return (
    <div
      className={`
        glass-card
        rounded-[28px]
        p-6
        glow-effect
        ${className}
      `}
    >
      {children}
    </div>
  );
}