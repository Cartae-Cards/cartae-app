interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#e5e1d8] rounded-2xl p-6 ${
        hover ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
