declare module 'bootstrap/js/dist/offcanvas' {
  export default class Offcanvas {
    constructor(element: Element, options?: any);
    static getInstance(element: Element): Offcanvas | null;
    toggle(): void;
    show(): void;
    hide(): void;
  }
}
