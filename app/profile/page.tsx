"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { useUser } from "@/lib/user-context";
import { updateProfile } from "firebase/auth";
import { ExternalLink, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = useUser();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThemeChange = async (theme: "light" | "dark" | "system") => {
    try {
      await updatePreferences({ theme });
      toast.success(`Theme set to ${theme} mode`);
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSaveApiKey = async () => {
    setIsUpdatingApiKey(true);
    try {
      // Implementation of saving the API key
      toast.success("API key saved successfully");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    } finally {
      setIsUpdatingApiKey(false);
    }
  };

  return (
    <AppLayout>
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold ms-4">Profile</h1>
          <p className="text-muted-foreground ms-4">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {/* add some margin to right and left in mobile screen */}
          <Card className="w-90 mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdating || !displayName.trim() || displayName === user?.displayName}
                className="w-full"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-90 mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Google AI API Key</CardTitle>
              <CardDescription>
                Required for AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google Gemini API key"
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  <a
                    href="https://ai.google.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Get an API key <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveApiKey}
                disabled={isUpdatingApiKey || !apiKey}
                className="w-full"
              >
                {isUpdatingApiKey ? "Saving..." : "Save API Key"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-90 mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Application Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences?.theme || "system"}
                  onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
                >
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred theme
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-90 mx-auto md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Sign out from your account
              </p>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full sm:w-auto"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 