import { Component } from "react";
import { Button } from "@/components/common/Buttons/Button";
import { useUIStore } from "@/stores/uiStore";

class ErrorBoundaryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback(
                    this.state.error,
                    this.state.errorInfo,
                );
            }

            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>¡Algo salió mal!</h2>
                        <p className="error-message">
                            Ha ocurrido un error inesperado en la aplicación.
                        </p>

                        {process.env.NODE_ENV === "development" && (
                            <details className="error-details">
                                <summary>
                                    Detalles del error (desarrollo)
                                </summary>
                                <pre className="error-stack">
                                    {this.state.error ??
                                        this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <Button
                                onClick={() => window.location.reload()}
                                variant="primary"
                                size="small"
                            >
                                Recargar página
                            </Button>

                            <Button
                                onClick={() =>
                                    this.setState({
                                        hasError: false,
                                        error: null,
                                        errorInfo: null,
                                    })
                                }
                                className="error-button secondary"
                                type="button"
                            >
                                Intentar de nuevo
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export function ErrorBoundary({ children, fallback, onError }) {
    return (
        <ErrorBoundaryComponent fallback={fallback} onError={onError}>
            {children}
        </ErrorBoundaryComponent>
    );
}

export function ErrorDisplay({ error, onRetry, onClose }) {
    return (
        <div className="error-display">
            <div className="error-icon">⚠️</div>
            <h3>Error</h3>
            <p className="error-text">
                {error?.message || "Ha ocurrido un error inesperado"}
            </p>

            <div className="error-actions">
                {onRetry && (
                    <Button onClick={onRetry} variant="primary" size="small">
                        Reintentar
                    </Button>
                )}
                {onClose && (
                    <Button onClick={onClose} variant="secondary" size="small">
                        Cerrar
                    </Button>
                )}
            </div>
        </div>
    );
}

export function ErrorBoundaryWithStore({ children }) {
    const { setLastError, addNotification } = useUIStore();

    const handleError = (error, errorInfo) => {
        setLastError({ error, errorInfo, timestamp: new Date().toISOString() });
        addNotification({
            type: "error",
            title: "Error de aplicación",
            message:
                "Ha ocurrido un error inesperado. Por favor recarga la página.",
            autoClose: false,
        });
    };

    return <ErrorBoundary onError={handleError}>{children}</ErrorBoundary>;
}
