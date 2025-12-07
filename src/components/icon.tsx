type IconProps = {
    name: string;
    className?: string;
    color?: "primary" | "secondary" | "success" | "warn" | "danger" | "inherit";
};

export function Icon({ name, className = "", color = "primary" }: IconProps) {
    const colorClass = color === "inherit" ? "" : `text-${color}`;

    return (
        <span
            className={`material-symbols-outlined ${colorClass} ${className}`}
        >
            {name}
        </span>
    );
}
