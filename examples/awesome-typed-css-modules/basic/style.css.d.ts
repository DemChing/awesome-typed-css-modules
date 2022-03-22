// pure CSS, SASS, SCSS, Stylus and LESS files doesn't need extra config
export type Styles = {
  active: string;
  child: string;
  parent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
