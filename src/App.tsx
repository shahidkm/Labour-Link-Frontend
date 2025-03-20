// src/App.tsx
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./Routes/RoutesConfig";
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <RoutesConfig /> {/* Use the RoutesConfig component */}
      </Router>

      {/* Toaster Notifications */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 2000 },
          error: { duration: 2000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 25px",
            backgroundColor: "#9333EA",
            color: "#FFF",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
