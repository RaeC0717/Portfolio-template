/**
 * Single source of truth for hero photo position and scale.
 * Used in production and as initial values in development.
 *
 * To sync from dev to production:
 * 1. In dev, adjust the photo (drag/zoom) until it looks right.
 * 2. Copy the current values (see dev hint in Hero or run in console:
 *    JSON.parse(localStorage.getItem('portfolio-hero-photo-position'))).
 * 3. Update the object below with those values.
 * 4. Commit and deploy.
 */
export const PHOTO_POSITION_DEFAULTS: {
  x: number;
  y: number;
  scale: number;
} = {
  x: 50,
  y: 50,
  scale: 1,
};
