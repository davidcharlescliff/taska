'use client'
import React from 'react'

interface IcProps extends Omit<React.SVGProps<SVGSVGElement>, 'stroke'> {
  size?: number
  stroke?: number
  d: string
}

const Ic = ({ d, size = 16, stroke = 1.6, ...rest }: IcProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d={d} />
  </svg>
)

type P = { size?: number; stroke?: number; style?: React.CSSProperties; className?: string }

export const Icons = {
  Layers:   (p: P) => <Ic {...p} d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5" />,
  Users:    (p: P) => <Ic {...p} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7a4 4 0 0 1 0 7.75" />,
  CheckSq:  (p: P) => <Ic {...p} d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  Archive:  (p: P) => <Ic {...p} d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" />,
  Settings: (p: P) => <Ic {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.13-1.4l2-1.55-2-3.46-2.36.95a7.4 7.4 0 0 0-2.42-1.4L14 2h-4l-.49 2.54a7.4 7.4 0 0 0-2.42 1.4l-2.36-.95-2 3.46 2 1.55a7.4 7.4 0 0 0 0 2.8l-2 1.55 2 3.46 2.36-.95a7.4 7.4 0 0 0 2.42 1.4L10 22h4l.49-2.54a7.4 7.4 0 0 0 2.42-1.4l2.36.95 2-3.46-2-1.55c.09-.46.13-.93.13-1.4Z" />,
  Search:   (p: P) => <Ic {...p} d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
  Plus:     (p: P) => <Ic {...p} d="M12 5v14M5 12h14" />,
  Check:    (p: P) => <Ic {...p} stroke={2.2} d="M5 12l5 5L20 7" />,
  X:        (p: P) => <Ic stroke={2} {...p} d="M6 6l12 12M18 6 6 18" />,
  Arrow:    (p: P) => <Ic {...p} d="M5 12h14M13 6l6 6-6 6" />,
  Back:     (p: P) => <Ic {...p} d="M19 12H5M11 18 5 12l6-6" />,
  More:     (p: P) => <Ic {...p} stroke={2.2} d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />,
  Kebab:    (p: P) => <Ic {...p} stroke={2.2} d="M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />,
  Bell:     (p: P) => <Ic {...p} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  Mail:     (p: P) => <Ic {...p} d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM2 7l10 7L22 7" />,
  Phone:    (p: P) => <Ic {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.94.34 1.86.66 2.74a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.34-1.23a2 2 0 0 1 2.11-.45c.88.32 1.8.54 2.74.66A2 2 0 0 1 22 16.92Z" />,
  Star:     (p: P) => <Ic {...p} d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />,
  External: (p: P) => <Ic {...p} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />,
  CreditCard: (p: P) => <Ic {...p} d="M1 4h22v16H1zM1 10h22" />,
  Camera:   (p: P) => <Ic {...p} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  Loader:   (p: P) => <Ic {...p} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />,
}
