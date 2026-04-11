# DayCatch Frontend Monorepo Structure

This repository contains two UI applications:

- `daycatch_admin` - Admin control panel
- `daycatch_admin/user_pannel` - Customer-facing panel

Both projects follow the same architecture pattern:

- `src/app` - App bootstrap, providers, route shell
- `src/core` - Cross-cutting concerns (config, API, auth foundation)
- `src/features` - Domain modules grouped by business feature
- `src/shared` - Reusable UI/components/hooks/utilities
- `src/assets` - Static assets
- `src/tests` - Test setup and integration test helpers

## Admin Target Feature Modules

- `auth`
- `dashboard`
- `stores`
- `products`
- `categories`
- `orders`
- `users`
- `delivery`
- `payments`
- `reports`
- `settings`

## User Panel Target Feature Modules

- `auth`
- `home`
- `catalog`
- `stores`
- `cart`
- `checkout`
- `orders`
- `tracking`
- `profile`
- `notifications`
- `wishlist`

## Engineering Conventions

- Feature-first separation with local components per feature
- API calls isolated inside `core/api` and feature services
- Shared UI tokens and theming in `shared/theme`
- Route-level code splitting for performance
- Strong linting and typed contracts (recommended TypeScript migration)
