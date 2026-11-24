import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ReduxProviderWrapper from "./redux/readux-provider/reduxProviderWrapper.tsx";
import { DashboardToaster } from "./components/ui/Toaster.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ReduxProviderWrapper>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <RouterProvider router={routes} />
          <DashboardToaster />
        </ThemeProvider>
      </ReduxProviderWrapper>
    </Provider>
  </StrictMode>
);
