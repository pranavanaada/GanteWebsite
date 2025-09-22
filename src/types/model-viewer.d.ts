declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      autoRotate?: boolean;
      cameraControls?: boolean;
      style?: React.CSSProperties;
      shadowIntensity?: string;
      exposure?: string;
      ar?: boolean;
    };
  }
}
