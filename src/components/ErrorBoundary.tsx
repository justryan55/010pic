import * as Sentry from "@sentry/nextjs";
import { Component, ErrorInfo, ReactNode } from "react";
import { Instrument_Sans, Inria_Serif } from "next/font/google";
import Button from "./Button";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});
const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inria",
});

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error);
    this.setState({ hasError: true });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`${instrumentSans.variable} ${inriaSerif.variable} flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-6`}
        >
          <div className="max-w-md text-center">
            <h1 className="text-xl font-bold mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="mb-6">
              An unexpected error occurred while loading your content. Our team
              has been notified.
            </p>
            <Button text="Reload App" onClick={this.handleReload} />

            <p className="mt-4 text-sm text-gray-500">
              If this issue persists, please contact support.
            </p>
          </div>
          <div className="mt-10 w-full"></div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
