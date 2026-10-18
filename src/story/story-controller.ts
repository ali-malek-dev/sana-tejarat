import { CHAPTER_ORDER, Chapter, STORY_END } from '../constants/story';
import { clamp01 } from '../scene/timing';

/** Stations on the route rail, in the order the shipment passes them. */
const ROUTE_STATIONS: readonly Chapter[] = [Chapter.IMPORT, Chapter.UNLOAD, Chapter.CUSTOMS, Chapter.EXPORT];
const FIRST_STATION_U = CHAPTER_ORDER.indexOf(Chapter.IMPORT);
const LAST_STATION_U = CHAPTER_ORDER.indexOf(Chapter.EXPORT);

/**
 * Maps the story section's scroll position to story time u (chapter i is centred at u = i),
 * ticks each step as the model reaches it, and moves the shipment marker on the route rail.
 */
export const initStory = (story: HTMLElement, onProgress: (u: number) => void) => {
  const steps = [...story.querySelectorAll<HTMLElement>('[data-done-at]')].map((element) => ({
    element,
    at: Number(element.dataset.doneAt),
  }));
  const stations = [...story.querySelectorAll<HTMLElement>('[data-station]')];

  const update = () => {
    const rect = story.getBoundingClientRect();
    const u = clamp01(-rect.top / (rect.height - window.innerHeight)) * STORY_END;
    onProgress(u);
    steps.forEach(({ element, at }) => element.classList.toggle('is-done', u >= at));
    story.style.setProperty('--route-progress', String(clamp01((u - FIRST_STATION_U) / (LAST_STATION_U - FIRST_STATION_U))));
    story.classList.toggle('is-travelling', u > FIRST_STATION_U - 0.5 && u < LAST_STATION_U + 0.5);
    const current = CHAPTER_ORDER[Math.round(u)];
    stations.forEach((station) =>
      station.classList.toggle('is-current', station.dataset.station === current && ROUTE_STATIONS.includes(current)),
    );
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
};
