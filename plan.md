# Infinite Motion Implementation Plan

Add subtle, continuous, and engaging animations across the landing page to create an "infinite motion" feel.

## 1. Global Styles & Utilities
- No major changes needed, but will ensure `framer-motion` is used effectively.

## 2. Component Enhancements

### src/components/Hero.tsx
- **Floating Hero Image**: Add a continuous vertical bobbing motion to the main image.
- **Rotating Backgrounds**: Add slow, infinite rotation to the decorative background blur circles.
- **Pulsing Badge**: Add a subtle glow/pulse effect to the "100% Free Messaging" tag.
- **Animated Status**: Keep and enhance the "Online Now" pulse.

### src/components/ProblemSection.tsx
- **Infinite Background Icons**: The `XCircle` icons in the background of cards will slowly rotate and scale.
- **Image Parallax/Zoom**: The "Locked Feature" image will have a very slow, infinite zoom-in/out effect.

### src/components/SolutionSection.tsx
- **Floating Image Card**: The main solution image will have a subtle floating motion.
- **Enhanced Heart Pulse**: Refine the central heart animation to be more fluid.
- **List Entrance**: Use staggered animations for the benefits list.

### src/components/Features.tsx
- **Floating Feature Icons**: Icons will have a subtle individual "float" or "wiggle" on hover/idle.
- **Moving Gradient**: The "Founding Member" section will have a slow-moving radial gradient background.

### src/components/Safety.tsx
- **Pulsing Shield/Icons**: Add subtle "breathing" animations to safety icons.
- **Staggered Reveals**: Ensure all safety points animate in sequence.

### src/components/Navbar.tsx
- **Sticky Blur**: Ensure the backdrop blur feels "active" with a slight transition on scroll.

## 3. Implementation Strategy
- Use `framer-motion`'s `animate` prop with `repeat: Infinity` and `repeatType: "mirror"` or `"reverse"`.
- Use `transition={{ duration: ..., ease: "easeInOut", repeat: Infinity }}` for smooth loops.
- Avoid performance hits by animating transforms (scale, rotate, translate) rather than layout properties.
