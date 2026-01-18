import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Calculations from "./pages/Calculations";
import Commercial from "./pages/Commercial";
import Documents from "./pages/Documents";
import Instructions from "./pages/Instructions";
import Video from "./pages/Video";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import KPEditor from "./pages/KPEditor";
import KPPreview from "./pages/KPPreview";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/calculations" component={Calculations} />
        <Route path="/commercial" component={Commercial} />
        <Route path="/commercial/kp/edit/:id" component={KPEditor} />
        <Route path="/commercial/kp/preview/:id" component={KPPreview} />
        <Route path="/commercial/kp/new" component={KPEditor} />
        <Route path="/documents" component={Documents} />
        <Route path="/instructions" component={Instructions} />
        <Route path="/video" component={Video} />
        <Route path="/services" component={Services} />
        <Route path="/settings" component={Settings} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
