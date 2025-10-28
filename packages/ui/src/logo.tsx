import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const logoVariants = cva("", {
    variants: {
        size: {
            xs: "h-4 w-auto",
            sm: "h-6 w-auto",
            default: "h-8 w-auto",
            lg: "h-12 w-auto",
            xl: "h-16 w-auto",
            "2xl": "h-20 w-auto",
            "3xl": "h-24 w-auto",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export interface LogoProps
    extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof logoVariants> {
    animated?: boolean;
}

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
    ({ className, size, animated = false, ...props }, ref) => {
        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                id="zenlands-logo"
                data-name="Zenlands Logo"
                viewBox="396.49 407.16 507.01 85.68"
                className={cn(
                    logoVariants({ size }),
                    animated && "transition-all duration-300 hover:scale-105",
                    className
                )}
                {...props}
            >
                <defs>
                    <style>
                        {`
              .logo-purple { fill: #9c66ff; }
              .logo-violet { fill: #592ce5; }
              .logo-cyan { fill: #13d3e9; }
              .logo-dark { fill: #211d2d; }
            `}
                    </style>
                </defs>

                {/* Text part */}
                <g className="logo-text">
                    <path
                        className="logo-dark"
                        d="m537.82,471.46v9.49c-12.36-5.9-26.88-8.78-40.5,0h-4.27v-7.27l2.04-2.28,30.9-34.71h-32.51v-8.56h43.96v7.7l-28.27,31.79c9.56-1.3,19.14-.02,28.65,3.84Z"
                    />
                    <path
                        className="logo-dark"
                        d="m584.48,463.52c-2.78,6.1-8.54,10.16-16.24,10.16-9.53,0-16.58-6.21-17.76-16.04h42.89c.21-1.28.21-2.67.21-3.85,0-15.4-10.8-26.73-25.99-26.73s-26.3,12.08-26.3,27.49,11.65,27.47,26.95,27.47c11.65,0,21.6-7.06,25.66-18.5h-9.42Zm-17-28.13c9.3,0,15.73,6.1,16.69,14.45h-33.48c1.71-8.77,8.25-14.45,16.79-14.45Z"
                    />
                    <path
                        className="logo-dark"
                        d="m628.13,427.06c-7.07,0-12.84,2.67-16.37,7.05v-5.98h-8.77v52.82h9.09v-29.51c0-9.63,6.1-15.82,15.08-15.82s14.22,5.87,14.22,15.82v29.51h9.09v-30.25c0-14.55-9.3-23.64-22.34-23.64Z"
                    />
                    <path
                        className="logo-dark"
                        d="m662.13,407.16v73.79h9.1v-73.79h-9.1Z"
                    />
                    <path
                        className="logo-dark"
                        d="m725.97,428.13v8.12c-4.27-5.77-11.22-9.19-19.35-9.19-15.51,0-26.95,12.08-26.95,27.49s11.44,27.47,26.95,27.47c8.13,0,15.18-3.42,19.35-9.08v8.01h8.77v-52.82h-8.77Zm-18.71,45.34c-10.7,0-18.5-7.92-18.5-18.92s7.8-18.93,18.5-18.93,18.5,7.91,18.5,18.93-7.81,18.92-18.5,18.92Z"
                    />
                    <path
                        className="logo-dark"
                        d="m772.29,427.06c-7.07,0-12.84,2.67-16.37,7.05v-5.98h-8.77v52.82h9.09v-29.51c0-9.63,6.1-15.82,15.08-15.82s14.22,5.87,14.22,15.82v29.51h9.09v-30.25c0-14.55-9.3-23.64-22.34-23.64Z"
                    />
                    <path
                        className="logo-dark"
                        d="m845.64,463.52c-2.78,6.1-8.55,10.16-16.26,10.16-9.51,0-16.57-6.21-17.75-16.04h42.89c.21-1.28.21-2.67.21-3.85,0-15.4-10.79-26.73-25.98-26.73s-26.31,12.08-26.31,27.49,11.65,27.47,26.94,27.47c11.66,0,21.61-7.06,25.67-18.5h-9.41Zm-17-28.13c9.3,0,15.72,6.1,16.69,14.45h-33.48c1.71-8.77,8.23-14.45,16.79-14.45Z"
                    />
                    <path
                        className="logo-dark"
                        d="m886.92,451.12l-4.38-.75c-7.59-1.28-11.55-2.68-11.55-7.7s4.59-7.6,10.69-7.6c7.06,0,11.23,4.5,11.88,9.32h9.19c-.43-9.21-8.77-17.33-21.07-17.33-11.01,0-19.67,5.87-19.67,15.61,0,8.98,5.02,13.37,16.47,15.29l4.38.75c7.7,1.29,11.55,2.78,11.55,7.81s-4.6,7.49-11.55,7.49-11.98-3.43-12.94-9.42h-9.2c.76,10.05,9.41,17.43,22.14,17.43,11.98,0,20.64-5.88,20.64-15.5,0-8.77-5.14-13.48-16.58-15.4Z"
                    />
                </g>

                {/* Icon part */}
                <g className="logo-icon">
                    <g>
                        <path
                            className="logo-cyan"
                            d="m467.96,425.36v23.74l-.02.02c-7.57-5.06-14.92-8.61-22.12-10.64-16.81-4.75-32.87-1.26-49.32,10.47v-24.03c11.41-5.76,23.11-8.67,34.93-8.67h.25c11.91.03,23.94,3.04,35.93,8.94.12.06.23.12.34.17Z"
                        />
                        <path
                            className="logo-cyan"
                            d="m468,449.08l-.04.05s-.02-.01-.02-.02h.02s.04-.04.04-.04Z"
                        />
                    </g>
                    <g>
                        <path
                            className="logo-violet"
                            d="m467.94,449.11l-20.64,12.58c-5.22-1.14-10.43-1.72-15.62-1.74h-.25c-11.83,0-23.53,2.91-34.94,8.67v-.1l49.32-30.06c7.2,2.03,14.55,5.58,22.12,10.64Z"
                        />
                        <path
                            className="logo-purple"
                            d="m467.96,469.07v23.77c-21.53-14.4-41.22-16.56-61.14-6.47-3.4,1.72-6.82,3.8-10.26,6.24l-.06.04v-24.02c11.41-5.76,23.11-8.67,34.93-8.67h.25c5.19.02,10.39.6,15.62,1.74,6.88,1.49,13.78,3.96,20.66,7.37Z"
                        />
                    </g>
                </g>
            </svg>
        );
    }
);
Logo.displayName = "Logo";

// Icon-only version
const LogoIcon = React.forwardRef<SVGSVGElement, LogoProps>(
    ({ className, size, animated = false, ...props }, ref) => {
        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                id="zenlands-icon"
                data-name="Zenlands Icon"
                viewBox="396.49 407.16 71.51 85.68"
                className={cn(
                    logoVariants({ size }),
                    animated && "transition-all duration-300 hover:scale-105 hover:rotate-3",
                    className
                )}
                {...props}
            >
                <defs>
                    <style>
                        {`
              .logo-purple { fill: #9c66ff; }
              .logo-violet { fill: #592ce5; }
              .logo-cyan { fill: #13d3e9; }
            `}
                    </style>
                </defs>

                <g className="logo-icon">
                    <g>
                        <path
                            className="logo-cyan"
                            d="m467.96,425.36v23.74l-.02.02c-7.57-5.06-14.92-8.61-22.12-10.64-16.81-4.75-32.87-1.26-49.32,10.47v-24.03c11.41-5.76,23.11-8.67,34.93-8.67h.25c11.91.03,23.94,3.04,35.93,8.94.12.06.23.12.34.17Z"
                        />
                        <path
                            className="logo-cyan"
                            d="m468,449.08l-.04.05s-.02-.01-.02-.02h.02s.04-.04.04-.04Z"
                        />
                    </g>
                    <g>
                        <path
                            className="logo-violet"
                            d="m467.94,449.11l-20.64,12.58c-5.22-1.14-10.43-1.72-15.62-1.74h-.25c-11.83,0-23.53,2.91-34.94,8.67v-.1l49.32-30.06c7.2,2.03,14.55,5.58,22.12,10.64Z"
                        />
                        <path
                            className="logo-purple"
                            d="m467.96,469.07v23.77c-21.53-14.4-41.22-16.56-61.14-6.47-3.4,1.72-6.82,3.8-10.26,6.24l-.06.04v-24.02c11.41-5.76,23.11-8.67,34.93-8.67h.25c5.19.02,10.39.6,15.62,1.74,6.88,1.49,13.78,3.96,20.66,7.37Z"
                        />
                    </g>
                </g>
            </svg>
        );
    }
);
LogoIcon.displayName = "LogoIcon";

export { Logo, LogoIcon, logoVariants };