import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// jsdom has no IntersectionObserver; framer-motion's whileInView needs one to exist.
window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// jsdom doesn't implement scrollIntoView; the Consultation Booking calls it when
// a ?book= deep link arrives. Stub it to a no-op so tests don't log jsdom errors.
Element.prototype.scrollIntoView = () => {};
