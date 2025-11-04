import { NextRequest, NextResponse } from "next/server";

interface SocialDataSearchResponse {
  next_cursor?: string;
  tweets: Array<{
    tweet_created_at: string;
    id_str: string;
    text: string | null;
    full_text: string;
    in_reply_to_status_id_str?: string;
    in_reply_to_user_id_str?: string;
    in_reply_to_screen_name?: string;
    user: {
      id_str: string;
      name: string;
      screen_name: string;
      description: string;
      followers_count: number;
      verified: boolean;
      profile_image_url_https: string;
      [key: string]: any;
    };
    favorite_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
    views_count: number;
    entities: {
      user_mentions: Array<{
        id_str: string;
        name: string;
        screen_name: string;
        indices: [number, number];
      }>;
      urls: any[];
      hashtags: any[];
      symbols: any[];
    };
    [key: string]: any;
  }>;
}

interface Engagement {
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
  };
}

interface UserSummary {
  username: string;
  display_name?: string;
  followers_count?: number;
  total_tweets_processed: number;
  profile_image_url?: string;
  verified?: boolean;
}

interface APIResponse {
  success: boolean;
  data: {
    engagements: Engagement[];
    user: UserSummary;
  };
}

/**
 * Gets user profile from username using the user profile endpoint
 */
async function getUserProfile(
  username: string,
  bearerToken: string
): Promise<{ userId: string; userProfile: any } | null> {
  const url = `https://api.socialapi.me/twitter/user/${encodeURIComponent(
    username
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    return null;
  }

  const userProfile = await response.json();
  return {
    userId: userProfile.id_str || String(userProfile.id),
    userProfile: userProfile,
  };
}

/**
 * Fetches a single batch of replies from the Social Data API using tweets-and-replies endpoint
 */
async function fetchReplyBatch(
  userId: string,
  bearerToken: string,
  cursor?: string
): Promise<{ tweets: any[]; nextCursor: string | null }> {
  // Use tweets-and-replies endpoint to get user's tweets and replies
  let url = `https://api.socialapi.me/twitter/user/${userId}/tweets-and-replies`;

  if (cursor) {
    url += `?cursor=${encodeURIComponent(cursor)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
    // Add timeout via AbortController
    signal: AbortSignal.timeout(20000), // 20 second timeout
  });

  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("Payment required - insufficient API credits");
    }
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(`Social API returned status ${response.status}`);
  }

  const body: SocialDataSearchResponse = await response.json();
  return {
    tweets: body.tweets || [],
    nextCursor: body.next_cursor || null,
  };
}

/**
 * Fetches replies by paginating through the Social Data API
 * Fetches 4 pages and filters for replies only
 */
async function fetchReplies(
  username: string,
  bearerToken: string
): Promise<{ tweets: any[]; userProfile: any }> {
  // First, get the user profile and user_id from username
  const userData = await getUserProfile(username, bearerToken);
  if (!userData) {
    throw new Error("Could not fetch user profile");
  }

  const { userId, userProfile } = userData;

  const allTweets: any[] = [];
  let nextCursor: string | null = null;
  const maxPages = 4; // Fetch 4 pages as requested
  let pageCount = 0;

  do {
    const { tweets, nextCursor: nc } = await fetchReplyBatch(
      userId,
      bearerToken,
      nextCursor || undefined
    );

    // Filter for replies only (tweets that have in_reply_to_user_id_str)
    const replies = tweets.filter(
      (tweet: any) => tweet.in_reply_to_user_id_str != null
    );

    allTweets.push(...replies);
    nextCursor = nc;
    pageCount++;

    // Stop after fetching maxPages
    if (pageCount >= maxPages) {
      break;
    }

    // Rate limiting: wait 300ms between requests
    if (nextCursor) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  } while (nextCursor && pageCount < maxPages);

  return {
    tweets: allTweets,
    userProfile,
  };
}

/**
 * Batch fetches user profiles for mentioned users
 * Uses user IDs to fetch profile data
 */
async function fetchUserProfilesBatch(
  userIds: string[],
  bearerToken: string
): Promise<Record<string, any>> {
  const profilesById: Record<string, any> = {};
  const profilesByScreenName: Record<string, any> = {};

  // Fetch profiles in parallel (limit to avoid overwhelming the API)
  const batchSize = 10;
  const batches = [];
  for (let i = 0; i < userIds.length; i += batchSize) {
    batches.push(userIds.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (userId) => {
        try {
          const url = `https://api.socialapi.me/twitter/user/${userId}`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(10000),
          });

          if (response.ok) {
            const profile = await response.json();
            // Store by both ID and screen_name for lookup flexibility
            profilesById[userId] = profile;
            if (profile.screen_name) {
              profilesByScreenName[profile.screen_name] = profile;
            }
          }
        } catch (error) {
          // Silently fail for individual profile fetches
          console.error(`Failed to fetch profile for user ${userId}:`, error);
        }
      })
    );
    // Rate limiting between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // Return merged lookup - prefer by screen_name, fallback to ID
  return { ...profilesById, ...profilesByScreenName };
}

/**
 * Processes raw tweets from tweets-and-replies API into engagement objects
 * Preserves additional tweet fields needed for engagement graph transformation
 */
async function processEngagements(
  tweets: any[],
  username: string,
  userProfile: any,
  bearerToken: string
): Promise<{
  engagements: (Engagement & { raw?: any })[];
  userSummary: UserSummary;
}> {
  // Extract all unique user IDs from mentions and replies
  const userIds = new Set<string>();
  tweets.forEach((tweet) => {
    // Add reply-to user ID
    if (tweet.in_reply_to_user_id_str) {
      userIds.add(tweet.in_reply_to_user_id_str);
    }
    // Add mentioned user IDs
    tweet.entities?.user_mentions?.forEach((mention: any) => {
      if (mention.id_str) {
        userIds.add(mention.id_str);
      }
    });
  });

  // Batch fetch user profiles
  const userProfiles = await fetchUserProfilesBatch(
    Array.from(userIds),
    bearerToken
  );

  const engagements: (Engagement & { raw?: any })[] = tweets.map((tweet) => {
    // Enhance user_mentions with profile data
    // Try to find profile by screen_name first, then by ID
    const enhancedMentions = (tweet.entities?.user_mentions || []).map(
      (mention: any) => {
        const profile =
          userProfiles[mention.screen_name] ||
          userProfiles[mention.id_str] ||
          null;
        return {
          ...mention,
          profile_image_url_https: profile?.profile_image_url_https,
          followers_count: profile?.followers_count,
          verified: profile?.verified,
        };
      }
    );

    // Get profile for replied-to user (try screen_name first, then ID)
    const repliedToProfile = tweet.in_reply_to_screen_name
      ? userProfiles[tweet.in_reply_to_screen_name] ||
        userProfiles[tweet.in_reply_to_user_id_str] ||
        null
      : null;

    return {
      tweet_id: tweet.id_str || String(Date.now()),
      text: tweet.full_text || tweet.text || "",
      created_at: tweet.tweet_created_at || new Date().toISOString(),
      metrics: {
        likes: tweet.favorite_count || 0,
        retweets: tweet.retweet_count || 0,
        replies: tweet.reply_count || 0,
        impressions: tweet.views_count || 0,
      },
      // Only include essential data for engagement extraction (cleaned up)
      // DO NOT include entities object - it contains unnecessary media, hashtags, etc.
      raw: {
        in_reply_to_user_id: tweet.in_reply_to_user_id_str || null,
        in_reply_to_screen_name: tweet.in_reply_to_screen_name || null,
        retweeted: tweet.retweeted_status ? true : false,
        quoted_status_id: tweet.quoted_status_id_str || null,
        // Only include user_mentions with essential profile data (no indices, no entities)
        user_mentions: enhancedMentions.map((mention: any) => ({
          id_str: mention.id_str,
          name: mention.name,
          screen_name: mention.screen_name,
          profile_image_url_https: mention.profile_image_url_https || null,
          followers_count: mention.followers_count || 0,
          verified: mention.verified || false,
        })),
        // Include profile for replied-to user (only essential fields)
        replied_to_profile: repliedToProfile
          ? {
              profile_image_url_https:
                repliedToProfile.profile_image_url_https || null,
              followers_count: repliedToProfile.followers_count || 0,
              name: repliedToProfile.name || null,
              verified: repliedToProfile.verified || false,
            }
          : null,
      },
    };
  });

  const totalImpressions = engagements.reduce(
    (sum, e) => sum + e.metrics.impressions,
    0
  );

  const userSummary: UserSummary = {
    username: userProfile?.screen_name || username,
    display_name: userProfile?.name,
    followers_count: userProfile?.followers_count,
    total_tweets_processed: engagements.length,
    profile_image_url: userProfile?.profile_image_url_https,
    verified: userProfile?.verified || false,
  };

  return { engagements, userSummary };
}

/**
 * GET /api/v1/twitter/tweets?username=<username>
 */
export async function GET(request: NextRequest) {
  try {
    // Validate username query parameter
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Bearer token for Social Data API
    const bearerToken = "FxIBCMXwOlvQf6XbVon3cQtyObs0cdbWoQYD9PTrcd486889";

    // Fetch replies using tweets-and-replies endpoint (4 pages, filtered for replies)
    const { tweets, userProfile } = await fetchReplies(
      username.trim(),
      bearerToken
    );

    // Process tweets into engagements (now async to fetch user profiles)
    const { engagements, userSummary } = await processEngagements(
      tweets,
      username.trim(),
      userProfile,
      bearerToken
    );

    // Return response matching the spec
    const response: APIResponse = {
      success: true,
      data: {
        engagements,
        user: userSummary,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch tweets from external API",
      },
      { status: 500 }
    );
  }
}
