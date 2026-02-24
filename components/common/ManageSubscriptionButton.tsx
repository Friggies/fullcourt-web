'use client';

import { useEffect, useState, useCallback } from 'react';
import { Purchases } from '@revenuecat/purchases-js';
import Button from './Button';

type Props = {
  appUserId: string;
  rcPublicApiKey: string;
  fallbackPurchaseUrl?: string;
};

export function ManageSubscriptionButton({
  appUserId,
  rcPublicApiKey,
  fallbackPurchaseUrl,
}: Props) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!Purchases.isConfigured()) {
      Purchases.configure({ apiKey: rcPublicApiKey, appUserId });
    } else {
      const p = Purchases.getSharedInstance();
      if (p.getAppUserId() !== appUserId) {
        p.changeUser(appUserId);
      }
    }
  }, [rcPublicApiKey, appUserId]);

  const openPortal = useCallback(async () => {
    setBusy(true);
    try {
      const p = Purchases.getSharedInstance();
      const info = await p.getCustomerInfo();
      const url = info.managementURL;
      console.log(p, info);
      if (url) window.location.href = url;
      else if (fallbackPurchaseUrl)
        window.location.href = fallbackPurchaseUrl + '' + appUserId;
      else alert('No active subscription found to manage.');
    } catch (e) {
      console.error(e);
      alert('Could not fetch subscription info.');
    } finally {
      setBusy(false);
    }
  }, [appUserId, fallbackPurchaseUrl]);

  return (
    <Button variant="fill" onClick={openPortal} disabled={busy}>
      {busy ? 'Opening...' : 'Manage subscription'}
    </Button>
  );
}
