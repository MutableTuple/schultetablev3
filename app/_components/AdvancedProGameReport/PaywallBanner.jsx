import React from 'react'
import { LuLock } from 'react-icons/lu';
import PaymentLink from '../AdvancedGameModal/PaymentLink';

export default function PaywallBanner({ user, userId }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 px-5 py-4 flex flex-col  justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-base-200">
          <LuLock className="w-4 h-4 text-base-content/60" />
        </div>
        <div>
          <p className="font-medium text-sm text-base-content">
            You're viewing a limited preview
          </p>
          <p className="text-xs text-base-content/50 mt-0.5 leading-relaxed">
            Full access includes all metrics, your improvement map, and complete cognitive insights.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-1 shrink-0 pl-9 sm:pl-0">
        <PaymentLink user={user} userId={userId} />
        <p className="text-[11px] text-base-content/40 tracking-wide">
          One-time purchase · No subscription
        </p>
      </div>
    </div>
  );
}