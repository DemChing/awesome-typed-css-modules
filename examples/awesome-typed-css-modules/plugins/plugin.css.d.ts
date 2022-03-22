// provide plugins that are compatible to PostCSS v6
export type Styles = {
  active: string;
  child: string;
  parent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
