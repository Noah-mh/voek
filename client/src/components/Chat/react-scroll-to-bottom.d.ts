declare module "react-scroll-to-bottom" {
  import * as React from "react";

  interface ReactScrollToBottomProps {
    checkInterval?: number;
    className?: string;
    debounce?: number;
    followButtonClassName?: string;
    mode?: string;
    scrollViewClassName?: string;
    children: React.ReactNode;
    debug?: boolean;
  }

  interface ScrollOptions {
    behavior: ScrollBehavior;
  }

  interface FunctionContextProps {
    scrollTo: (scrollTo: number, options: ScrollOptions) => void;
    scrollToBottom: (options: ScrollOptions) => void;
    scrollToEnd: (options: ScrollOptions) => void;
    scrollToStart: (options: ScrollOptions) => void;
    scrollToTop: (options: ScrollOptions) => void;
  }

  const FunctionContext: React.Context<FunctionContextProps>;

  export default class ScrollToBottom extends React.PureComponent<ReactScrollToBottomProps> {}
}
