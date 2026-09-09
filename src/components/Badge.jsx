const MAP = {
  new: ["b-new", "New"],
  failed: ["b-failed", "Failed"],
  replied: ["b-replied", "Replied"],
  pending: ["b-pending", "Pending"],
  accepted: ["b-accepted", "Accepted"],
  rejected: ["b-rejected", "Rejected"],
  open: ["b-open", "Open"],
  resolved: ["b-replied", "Resolved"],
  connected: ["b-replied", "Connected"],
  None: ["b-channel", "No order"],
  Pending: ["b-pending", "Pending"],
  Accepted: ["b-accepted", "Accepted"],
  Rejected: ["b-rejected", "Rejected"],
};

export function Badge({ status }) {
  const [cls, label] = MAP[status] || ["b-channel", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}
