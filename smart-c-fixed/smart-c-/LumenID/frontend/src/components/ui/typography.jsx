import * as React from "react";
import { cn } from "./utils";

export function H1({ className, children, ...props }) {
    return (
        <h1
            className={cn("text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground", className)}
            {...props}
        >
            {children}
        </h1>
    );
}

export function H2({ className, children, ...props }) {
    return (
        <h2
            className={cn("text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground", className)}
            {...props}
        >
            {children}
        </h2>
    );
}

export function H3({ className, children, ...props }) {
    return (
        <h3
            className={cn("text-2xl md:text-3xl font-semibold tracking-tight text-foreground", className)}
            {...props}
        >
            {children}
        </h3>
    );
}

export function H4({ className, children, ...props }) {
    return (
        <h4
            className={cn("text-xl md:text-2xl font-semibold tracking-tight text-foreground", className)}
            {...props}
        >
            {children}
        </h4>
    );
}

export function P({ className, children, ...props }) {
    return (
        <p
            className={cn("text-base leading-relaxed text-muted-foreground", className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function Large({ className, children, ...props }) {
    return (
        <div className={cn("text-lg font-semibold", className)} {...props}>
            {children}
        </div>
    );
}

export function Small({ className, children, ...props }) {
    return (
        <small className={cn("text-sm font-medium leading-none", className)} {...props}>
            {children}
        </small>
    );
}

export function Muted({ className, children, ...props }) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)} {...props}>
            {children}
        </p>
    );
}

export const Typography = {
    H1,
    H2,
    H3,
    H4,
    P,
    Large,
    Small,
    Muted,
};