"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  MOCK_SUBSCRIPTION_ACTIONS,
  MOCK_SUBSCRIPTION_SUMMARY,
  MOCK_SUBSCRIPTIONS,
  formatDuesStatusLabel,
  formatInr,
  formatMonthlySpend,
  getActiveSubscriptions,
  getInactiveSubscriptions,
  hasOutstandingDues,
  type Subscription,
  type SubscriptionAction,
} from "@/components/account/account-manage-subscription/manageSubscriptionData";

type SubscriptionTabId = "active" | "inactive";

const SUBSCRIPTION_TABS: { id: SubscriptionTabId; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export default function AccountManageSubscription() {
  const summary = MOCK_SUBSCRIPTION_SUMMARY;
  const duesPending = hasOutstandingDues(summary.outstandingDues);
  const activeSubscriptions = getActiveSubscriptions(MOCK_SUBSCRIPTIONS);
  const inactiveSubscriptions = getInactiveSubscriptions(MOCK_SUBSCRIPTIONS);
  const [activeTab, setActiveTab] = useState<SubscriptionTabId>("active");

  const visibleSubscriptions =
    activeTab === "active" ? activeSubscriptions : inactiveSubscriptions;
  const isInactiveTab = activeTab === "inactive";

  return (
    <div className="account-manage-subscription w-full min-w-0">
      <section
        className={`account-manage-subscription__overview${duesPending ? " account-manage-subscription__overview--due" : " account-manage-subscription__overview--clear"}`}
        aria-label="Account overview"
      >
        <div className="account-manage-subscription__overview-dues">
          <i
            className={`icon account-manage-subscription__overview-icon ${duesPending ? "icon-ReceiptX" : "icon-CheckCircle"}`}
            aria-hidden
          />
          <div className="account-manage-subscription__overview-dues-text">
            <span className="account-manage-subscription__overview-label cl-text-2">
              {duesPending ? "Outstanding dues" : "Payment status"}
            </span>
            <span
              className={`account-manage-subscription__overview-amount fw-semibold${duesPending ? "" : " account-manage-subscription__overview-amount--clear"}`}
            >
              {duesPending
                ? formatInr(summary.outstandingDues)
                : "All dues paid"}
            </span>
          </div>
          <div className="account-manage-subscription__overview-cta">
            {duesPending ? (
              <button
                type="button"
                className="tf-btn small account-manage-subscription__pay-btn"
              >
                Pay now
              </button>
            ) : null}
            <Link
              href={summary.duesDetailsHref}
              className="account-manage-subscription__details-link fw-medium"
            >
              View details
            </Link>
          </div>
        </div>

        <div
          className="account-manage-subscription__overview-stats"
          role="list"
          aria-label="Account summary"
        >
          <OverviewStat label="Active" value={String(summary.activeCount)} />
          <OverviewStat
            label="Monthly spend"
            value={formatMonthlySpend(summary.monthlySpend)}
          />
          <OverviewStat
            label="Dues"
            value={formatDuesStatusLabel(summary.outstandingDues)}
            variant={duesPending ? "due" : "success"}
          />
        </div>
      </section>

      <div className="account-manage-subscription__layout">
        <aside
          className="account-manage-subscription__quick-panel"
          aria-labelledby="quick-actions-heading"
        >
          <h6
            id="quick-actions-heading"
            className="account-manage-subscription__quick-title fw-medium mb-0"
          >
            Quick actions
          </h6>
          <ul className="account-manage-subscription__quick-list">
            {MOCK_SUBSCRIPTION_ACTIONS.map((action) => (
              <li key={action.id}>
                <QuickActionTile action={action} />
              </li>
            ))}
          </ul>
        </aside>

        <div className="account-manage-subscription__main">
          <section
            className="account-manage-subscription__subscriptions"
            aria-labelledby="subscriptions-heading"
          >
            <h6
              id="subscriptions-heading"
              className="account-manage-subscription__section-title fw-medium mb-12"
            >
              Your subscriptions
            </h6>

            <div
              className="account-manage-subscription__tabs"
              role="tablist"
              aria-label="Subscription status"
            >
              {SUBSCRIPTION_TABS.map((tab) => {
                const count =
                  tab.id === "active"
                    ? activeSubscriptions.length
                    : inactiveSubscriptions.length;
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`account-manage-subscription__tab${isSelected ? " is-active" : ""}${tab.id === "inactive" ? " account-manage-subscription__tab--inactive-type" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="account-manage-subscription__tab-label fw-medium">
                      {tab.label}
                    </span>
                    <span className="account-manage-subscription__tab-count fw-medium">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className="account-manage-subscription__tab-panel"
              role="tabpanel"
            >
              {visibleSubscriptions.length > 0 ? (
                <ul
                  className={`account-manage-subscription__subscription-list${isInactiveTab ? " account-manage-subscription__subscription-list--inactive" : ""}`}
                >
                  {visibleSubscriptions.map((subscription) => (
                    <li key={subscription.id}>
                      <SubscriptionCard
                        subscription={subscription}
                        inactive={isInactiveTab}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="account-manage-subscription__empty cl-text-2 mb-0">
                  {isInactiveTab
                    ? "No inactive subscriptions."
                    : "No active subscriptions."}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function OverviewStat({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "due" | "success";
}) {
  return (
    <div
      className={`account-manage-subscription__overview-stat${variant !== "default" ? ` account-manage-subscription__overview-stat--${variant}` : ""}`}
      role="listitem"
    >
      <span className="account-manage-subscription__overview-stat-label cl-text-2">
        {label}
      </span>
      <span className="account-manage-subscription__overview-stat-value fw-semibold">
        {value}
      </span>
    </div>
  );
}

function QuickActionTile({ action }: { action: SubscriptionAction }) {
  const inner = (
    <>
      <span className="account-manage-subscription__quick-icon" aria-hidden>
        <i className={`icon ${action.icon}`} />
      </span>
      <span className="account-manage-subscription__quick-label fw-medium">
        {action.title}
      </span>
      {action.offer ? (
        <span className="account-manage-subscription__quick-offer">
          {action.offer}
        </span>
      ) : null}
    </>
  );

  if (action.href) {
    return (
      <Link
        href={action.href}
        className="account-manage-subscription__quick-tile"
        title={action.description}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="account-manage-subscription__quick-tile"
      title={action.description}
    >
      {inner}
    </button>
  );
}

function SubscriptionCard({
  subscription,
  inactive,
}: {
  subscription: Subscription;
  inactive?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `subscription-panel-${subscription.id}`;

  return (
    <article
      className={`account-manage-subscription__subscription${inactive ? " account-manage-subscription__subscription--inactive" : ""}${expanded ? " is-expanded" : ""}`}
    >
      <button
        type="button"
        className="account-manage-subscription__subscription-trigger"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className="account-manage-subscription__subscription-media">
          <Image
            src={subscription.image}
            alt=""
            width={56}
            height={56}
            className="account-manage-subscription__subscription-image"
          />
        </span>
        <span className="account-manage-subscription__subscription-body">
          <span className="account-manage-subscription__subscription-title fw-medium">
            {subscription.title}
          </span>
          <span className="account-manage-subscription__subscription-line cl-text-2">
            <span>{subscription.plan}</span>
            <span className="account-manage-subscription__dot" aria-hidden>
              ·
            </span>
            <span>{subscription.billing}</span>
          </span>
        </span>
        <span className="account-manage-subscription__subscription-end">
          <span className="account-manage-subscription__cost-pill fw-semibold">
            {formatMonthlySpend(subscription.costPerMonth)}
          </span>
          <i
            className="icon icon-CaretDown account-manage-subscription__subscription-caret"
            aria-hidden
          />
        </span>
      </button>

      <div
        id={panelId}
        className="account-manage-subscription__subscription-panel"
        aria-hidden={!expanded}
      >
        <div className="account-manage-subscription__subscription-panel-inner">
          <table className="account-manage-subscription__details-table">
            <thead>
              <tr>
                <th scope="col">Rented from</th>
                <th scope="col">{subscription.renewalLabel}</th>
                <th scope="col">Billing date</th>
                <th scope="col">Deposit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{subscription.rentedFrom}</td>
                <td>{subscription.renewalDate}</td>
                <td>{subscription.billingDate}</td>
                <td>{formatInr(subscription.amountDeposited)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
