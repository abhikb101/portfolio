"use client";

import { useState } from "react";

export interface UserData {
  name: string;
  description: string;
  followers_count: number;
  profile_image_url: string;
  verified: boolean;
  screen_name: string;
}

export interface Engagement {
  tweet_id: string;
  engaged_with: string;
  engagement_type: string;
  content: string;
  engaged_user_profile_image: string;
  followers: number;
  description: string;
  verified: boolean;
}

export interface GraphData {
  user: UserData;
  engagements: Record<string, Engagement[]>;
}

export function useXGraphData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GraphData | null>(null);

  const searchUser = async (username: string) => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const apiResponse = await fetch(`${BASE_URL}/twitter/get_user_tweets?username=${username}`);
      // const apiResult = await apiResponse.json();

      // For now, use static data from public folder
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      const staticResponse = await fetch("/static.json");
      const staticResult = await staticResponse.json();
      setData(staticResult.data as GraphData);
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchUser,
    data,
    isLoading,
    error,
  };
}
