import {
  getActiveSubscriptions,
  MOCK_SUBSCRIPTIONS,
} from "@/components/account/account-manage-subscription/manageSubscriptionData";
import { MOCK_ONGOING_SERVICE_REQUESTS } from "@/components/account/account-service-requests/serviceRequestsData";

/** Sidebar badges until subscription / service-request APIs are wired */
export function getAccountSidebarCounts() {
  return {
    activeSubscriptions: getActiveSubscriptions(MOCK_SUBSCRIPTIONS).length,
    activeServiceRequests: MOCK_ONGOING_SERVICE_REQUESTS.length,
  };
}

export type AccountSidebarCountKey = keyof ReturnType<
  typeof getAccountSidebarCounts
>;
