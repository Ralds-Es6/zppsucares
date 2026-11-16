import React from 'react';
import { Check } from 'lucide-react';

interface VerifiedBadgeProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showLabel?: boolean;
    className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
    size = 'md',
    showLabel = false,
    className = ''
}) => {
    const sizeMap = {
        sm: { icon: 20, text: 'text-xs', stroke: 2.6 },
        md: { icon: 24, text: 'text-sm', stroke: 2.8 },
        lg: { icon: 30, text: 'text-base', stroke: 3.0 },
        xl: { icon: 36, text: 'text-lg', stroke: 3.2 }
    };

    const currentSize = sizeMap[size] || sizeMap.md;

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[#1877F2] font-semibold select-none group relative cursor-help shrink-0 ${className}`}
            title="Verified ZPPSU Student — GCTSO Identity & COR Certified"
        >
            <svg
                width={currentSize.icon}
                height={currentSize.icon}
                viewBox="0 0 24 24"
                className="shrink-0 transition-transform duration-200 group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(24,119,242,0.45)]"
            >
                {/* 12-point scalloped verified badge */}
                <path
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                    fill="#1877F2"
                />
                {/* Bold, crisp white checkmark */}
                <path
                    d="m8.5 12.2 2.6 2.6 4.9-5.1"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={currentSize.stroke}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {showLabel && (
                <span className={`${currentSize.text} font-black tracking-tight text-[#1877F2]`}>
                    Verified Student
                </span>
            )}

            {/* Micro Tooltip */}
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50">
                <span className="bg-gray-900 text-white text-xs font-semibold py-1.5 px-3 rounded-xl shadow-2xl whitespace-nowrap border border-gray-800 flex items-center gap-1.5">
                    <Check size={14} className="text-green-400 shrink-0" strokeWidth={3} /> Verified ZPPSU Student (GCTSO Certified)
                </span>
                <span className="w-2.5 h-2.5 bg-gray-900 rotate-45 -mt-1.5"></span>
            </span>
        </span>
    );
};

export default VerifiedBadge;
