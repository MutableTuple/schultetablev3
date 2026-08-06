/**
 * Single source of truth for "is this user Pro?".
 *
 * Two different shapes were being checked across the codebase — SchulteTable
 * used `user?.is_pro_user`, layout.js used `user?.[0]?.is_pro_user`. Only the
 * first is correct: fetchUserFromDB() uses `.maybeSingle()`, so it resolves to
 * a plain row object (or null), never an array. The array form silently
 * evaluated to `undefined` and every Pro gate behind it read as false.
 *
 * `purchase_plan` is also honoured because SchulteTable already treats a
 * non-null plan as Pro (see its `currentUser.purchase_plan || is_pro_user`
 * check) — keeping both here means one gate can't drift from the other.
 */
export function isProUser(user) {
  if (!user) return false;
  const u = Array.isArray(user) ? user[0] : user;
  if (!u) return false;
  return u.is_pro_user === true || Boolean(u.purchase_plan);
}
