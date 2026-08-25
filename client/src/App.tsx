/*
  Online Click & Collect — app routes.
  Public storefront uses Bazaar Atelier navigation; owner operations use a separate sidebar workspace.
*/
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import ProductDetail from "@/pages/ProductDetail";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Favorites from "@/pages/Favorites";
import Signup from "@/pages/Signup";
import TrackOrder from "@/pages/TrackOrder";
import DesignTemplates from "@/pages/DesignTemplates";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeToggle from "./components/ThemeToggle";
import MobileMenu from "./components/MobileMenu";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/admin" component={Admin} /><Route path="/faq" component={FAQ} /><Route path="/contact" component={Contact} /><Route path="/product/:id" component={ProductDetail} /><Route path="/profile" component={Profile} /><Route path="/login" component={Login} /><Route path="/favorites" component={Favorites} /><Route path="/signup" component={Signup} /><Route path="/track-order" component={TrackOrder} /><Route path="/design-templates" component={DesignTemplates} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster /><Router /><ThemeToggle /><MobileMenu /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
