import '@fontsource-variable/noto-kufi-arabic';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import './styles/main.css';
import { initStory } from './story/story-controller';
import { initDutyCalculator } from './ui/duty-calculator';
import { initContactForm, initMenu } from './ui/site-chrome';

const query = <T extends Element>(selector: string) => document.querySelector<T>(selector);

const story = query<HTMLElement>('.story');
const canvas = query<HTMLCanvasElement>('.story__canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** three.js loads after the text has painted; without WebGL the chapters still read as a normal page. */
const startStage = async (story: HTMLElement, canvas: HTMLCanvasElement) => {
  try {
    const { createStage } = await import('./scene/stage');
    const stage = createStage(canvas, { reducedMotion });
    new IntersectionObserver(([entry]) => stage.setVisible(entry.isIntersecting)).observe(story);
    initStory(story, stage.setProgress);
    story.classList.add('has-stage');
  } catch (error) {
    console.warn('3D stage unavailable', error);
    initStory(story, () => undefined);
  }
};

if (story && canvas) void startStage(story, canvas);

const calculator = query<HTMLFormElement>('[data-duty-calculator]');
if (calculator) initDutyCalculator(calculator);

const contactForm = query<HTMLFormElement>('[data-contact-form]');
const contactStatus = query<HTMLElement>('[data-contact-status]');
if (contactForm && contactStatus) initContactForm(contactForm, contactStatus);

const menuToggle = query<HTMLButtonElement>('.menu-toggle');
const nav = query<HTMLElement>('.site-nav');
if (menuToggle && nav) initMenu(menuToggle, nav);
