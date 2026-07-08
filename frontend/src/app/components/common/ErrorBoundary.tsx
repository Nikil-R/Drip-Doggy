import { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-14 h-14 bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
              <span className="text-xl font-black text-red-500">!</span>
            </div>
            <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-3">Something Went Wrong</h1>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="border border-neutral-300 text-neutral-700 px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase hover:bg-neutral-100 transition-colors"
              >
                Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mt-6 p-4 bg-neutral-100 border border-neutral-200 text-[9px] text-left font-mono overflow-auto max-h-48">
                {this.state.error.message}
                {this.state.error.stack?.split("\n").slice(1, 6).join("\n")}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
