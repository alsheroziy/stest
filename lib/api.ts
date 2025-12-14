/** @format */

// Use Next.js API routes as proxy to avoid CORS issues
const API_BASE_URL = typeof window === "undefined" ? "https://api.soq.qa" : "";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
    username: string;
  };
}

export interface User {
  username: string;
  name: string;
  email?: string;
  balance: string;
  url: string;
}

class ApiClient {
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  }

  private setTokens(access: string, refresh: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Login failed" }));
      throw new Error(error.error || error.detail || error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();
    this.setTokens(data.access, data.refresh);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearTokens();
        throw new Error("Not authenticated");
      }
      const error = await response
        .json()
        .catch(() => ({ error: "Failed to fetch user" }));
      throw new Error(error.error || error.detail || "Failed to fetch user");
    }

    return response.json();
  }

  async getUserProfile(username: string): Promise<User> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`/api/users/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearTokens();
        throw new Error("Not authenticated");
      }
      const error = await response
        .json()
        .catch(() => ({ error: "Failed to fetch user profile" }));
      throw new Error(error.error || error.detail || "Failed to fetch user profile");
    }

    return response.json();
  }

  async updateUserProfile(
    username: string,
    data: Partial<User>
  ): Promise<User> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`/api/users/${username}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearTokens();
        throw new Error("Not authenticated");
      }
      const error = await response
        .json()
        .catch(() => ({ error: "Update failed" }));
      throw new Error(error.error || error.detail || error.message || "Update failed");
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();
