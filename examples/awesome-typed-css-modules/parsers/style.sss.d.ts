// provide a custom parser so that you don't need to worry the version of PostCSS using in this package
export type Styles = {
  active: string;
  child: string;
  parent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
