import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <QueryClientProvider client={queryClient}>
            <AppRoutes />
          </QueryClientProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
