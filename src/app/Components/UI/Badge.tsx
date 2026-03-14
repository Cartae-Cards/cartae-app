type BadgeVariant = "language" | "condition" | "grade" | "default";

const variantClasses: Record<BadgeVariant, string> = {
  language: "bg-blue-100 text-blue-800",
  condition: "bg-green-100 text-green-800",
  grade: "bg-amber-100 text-amber-800",
  default: "bg-gray-100 text-gray-700",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
