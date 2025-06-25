declare module "react-outside-click-handler" {
  import * as React from "react";
  export interface OutsideClickHandlerProps {
    onOutsideClick: (event: MouseEvent | TouchEvent) => void;
    disabled?: boolean;
    useCapture?: boolean;
    children?: React.ReactNode;
  }
  export default class OutsideClickHandler extends React.Component<OutsideClickHandlerProps> {}
}
