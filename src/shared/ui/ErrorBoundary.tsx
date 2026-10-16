'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Component ErrorBoundary caught an error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-lg text-rose-800 space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            {this.props.fallbackTitle || 'Widget failed to render'}
          </div>
          <p className="text-xs text-rose-600">
            {this.state.error?.message || 'A client-side rendering exception occurred in this component.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline pt-1"
          >
            <RefreshCw className="w-3 h-3" /> Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
