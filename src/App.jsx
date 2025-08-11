import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
