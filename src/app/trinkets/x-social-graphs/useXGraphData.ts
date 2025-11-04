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

interface TweetEngagement {
  tweet_id: string;
  text: string;
  created_at: string;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
  raw?: {
    in_reply_to_user_id?: string;
    in_reply_to_screen_name?: string;
    retweeted?: boolean;
    quoted_status_id?: string;
    entities?: any;
    user_mentions?: Array<{
      id_str?: string;
      name?: string;
      screen_name: string;
      indices?: [number, number];
      profile_image_url_https?: string;
      followers_count?: number;
      verified?: boolean;
    }>;
    replied_to_profile?: {
      profile_image_url_https?: string;
      followers_count?: number;
      name?: string;
      verified?: boolean;
    };
  };
}

interface APIResponse {
  success: boolean;
  data: {
    engagements: TweetEngagement[];
    user: {
      username: string;
      display_name?: string;
      followers_count?: number;
      total_tweets_processed: number;
      profile_image_url?: string;
      verified?: boolean;
    };
  };
}

/**
 * Extracts @mentions from tweet text and entities
 */
function extractMentions(
  text: string,
  userMentions?: Array<{ screen_name: string }>
): string[] {
  const mentions: string[] = [];

  // Use entities.user_mentions if available (more reliable)
  if (userMentions && userMentions.length > 0) {
    userMentions.forEach((mention) => {
      if (mention.screen_name) {
        mentions.push(mention.screen_name);
      }
    });
  }

  // Fallback to regex extraction from text
  if (mentions.length === 0) {
    const mentionRegex = /@(\w+)/g;
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Determines engagement type from tweet text and structure
 */
function getEngagementType(
  text: string,
  tweet: any
): "reply" | "mention" | "retweet" {
  // Check if it's a reply (starts with @username or has in_reply_to fields)
  if (text.trim().startsWith("@") || tweet.in_reply_to_user_id) {
    return "reply";
  }
  // Check if it's a retweet/quote
  if (tweet.retweeted || tweet.quoted_status_id) {
    return "retweet";
  }
  // Otherwise it's a mention
  return "mention";
}

/**
 * Transforms tweet data into engagement graph format
 */
function transformToGraphData(
  apiResponse: APIResponse,
  username: string
): GraphData {
  const { engagements: tweetEngagements, user: userSummary } = apiResponse.data;

  // Group engagements by username
  const engagementsByUser: Record<string, Engagement[]> = {};

  tweetEngagements.forEach((tweet) => {
    const rawData = tweet.raw || {};
    // Extract user_mentions from raw data (entities no longer included in response)
    const userMentions = rawData.user_mentions || [];

    // Extract mentions from entities (more reliable) or text
    const mentions = extractMentions(tweet.text, userMentions);
    const engagementType = getEngagementType(tweet.text, rawData);

    // Helper function to get user info from mentions array
    // Now uses profile data from API if available, otherwise falls back to unavatar.io
    const getUserInfo = (screenName: string) => {
      const mention = userMentions.find(
        (m: any) => m.screen_name === screenName
      );

      // Use profile_image_url_https from API if available (from batch fetch)
      // Otherwise fall back to unavatar.io service
      const profileImage =
        mention?.profile_image_url_https ||
        `https://unavatar.io/twitter/${encodeURIComponent(screenName)}`;

      return {
        profile_image: profileImage,
        followers: mention?.followers_count || 0,
        description: mention?.name || "",
        verified: mention?.verified || false,
      };
    };

    // Normalize username for comparison (case-insensitive)
    const normalizedUsername = username.toLowerCase();

    // For each mention, create an engagement record
    // Skip if the mentioned user is the same as the main user (to avoid duplicate nodes)
    mentions.forEach((mentionedUser) => {
      // Skip if this is the main user (case-insensitive)
      if (mentionedUser.toLowerCase() === normalizedUsername) {
        return;
      }

      if (!engagementsByUser[mentionedUser]) {
        engagementsByUser[mentionedUser] = [];
      }

      const userInfo = getUserInfo(mentionedUser);
      engagementsByUser[mentionedUser].push({
        tweet_id: tweet.tweet_id,
        engaged_with: mentionedUser,
        engagement_type: engagementType,
        content: tweet.text,
        engaged_user_profile_image: userInfo.profile_image,
        followers: userInfo.followers,
        description: userInfo.description,
        verified: userInfo.verified,
      });
    });

    // If it's a reply to a specific user (from in_reply_to fields)
    // Add that as an engagement even if not mentioned in text
    // Skip if replying to self (to avoid duplicate nodes)
    if (
      rawData.in_reply_to_screen_name &&
      !mentions.includes(rawData.in_reply_to_screen_name) &&
      rawData.in_reply_to_screen_name.toLowerCase() !== normalizedUsername
    ) {
      const repliedUser = rawData.in_reply_to_screen_name;
      if (!engagementsByUser[repliedUser]) {
        engagementsByUser[repliedUser] = [];
      }

      // Use replied_to_profile if available, otherwise try to find in mentions
      const repliedToProfile = rawData.replied_to_profile;
      const profileImage =
        repliedToProfile?.profile_image_url_https ||
        `https://unavatar.io/twitter/${encodeURIComponent(repliedUser)}`;

      engagementsByUser[repliedUser].push({
        tweet_id: tweet.tweet_id,
        engaged_with: repliedUser,
        engagement_type: "reply",
        content: tweet.text,
        engaged_user_profile_image: profileImage,
        followers: repliedToProfile?.followers_count || 0,
        description: repliedToProfile?.name || "",
        verified: repliedToProfile?.verified || false,
      });
    }
  });

  // Build user data object from API response
  const userData: UserData = {
    name: userSummary.display_name || username,
    description: "", // Description not available in current API response
    followers_count: userSummary.followers_count || 0,
    profile_image_url:
      userSummary.profile_image_url ||
      `https://unavatar.io/twitter/${username}`,
    verified: userSummary.verified || false,
    screen_name: userSummary.username || username,
  };

  return {
    user: userData,
    engagements: engagementsByUser,
  };
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
      // Call the new API endpoint
      const apiResponse = await fetch(
        `/api/v1/twitter/tweets?username=${encodeURIComponent(username.trim())}`
      );

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error || `API returned status ${apiResponse.status}`
        );
      }

      const apiResult: APIResponse = await apiResponse.json();

      if (!apiResult.success) {
        throw new Error("API request was not successful");
      }

      // Transform the API response to match the expected graph data format
      const graphData = transformToGraphData(apiResult, username.trim());
      setData(graphData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user data";
      setError(errorMessage);
      console.error("Error fetching user data:", err);
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
