/** @format */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.soq.qa";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: response.status || 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.message || data.error || "Failed to fetch user" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get user API error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}
