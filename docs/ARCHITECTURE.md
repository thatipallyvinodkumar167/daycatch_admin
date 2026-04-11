# DayCatch Admin Architecture

## Layers

- `app` - App shell, providers, router composition
- `core` - API clients, auth/session bootstrap, configs, constants
- `features` - Business modules (dashboard, stores, products, orders, users, delivery, payments, reports, settings)
- `shared` - Design system components, hooks, utilities, theme
- `tests` - Test setup, mocks, integration scenarios

## Module Convention

Each feature follows:

- `components/` - UI pieces local to the feature
- `pages/` - Route-level pages
- `services/` - Feature-specific API adapters

## Routing

- Define route constants in `src/core/constants/routes.js`
- Compose route objects in `src/app/router/AppRouter.jsx`
- Wrap authentication and permission guards at router/layout level

## API

- Use one HTTP client from `src/core/api/httpClient.js`
- Feature services must not instantiate their own axios client
- Handle token refresh and error normalization centrally
