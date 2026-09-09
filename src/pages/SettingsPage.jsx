import { sessionUser } from "../Auth/session.js";
import { Badge } from "../components/Badge.jsx";
import { useDesk } from "../provider/DeskProvider.jsx";

export function SettingsPage() {
  const { desk } = useDesk();
  const user = sessionUser();

  return (
    <div className="settings-grid">
      <section className="panel">
        <div className="panel-h">
          <h2>Connected pages</h2>
        </div>
        <div style={{ padding: "4px 16px 12px" }}>
          {desk.pages.map((p) => (
            <div className="setting-row" key={p.id}>
              <div>
                <span className="dot" />
                <strong>{p.name}</strong>
                <div className="meta">{p.handle ? "facebook.com/" + p.handle : p.id}</div>
              </div>
              <Badge status="connected" />
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-h">
          <h2>Desk</h2>
        </div>
        <div style={{ padding: "4px 16px 12px" }}>
          <div className="setting-row">
            <span>Timezone</span>
            <strong>Asia/Dhaka</strong>
          </div>
          <div className="setting-row">
            <span>Order confirmation</span>
            <strong>Manual call</strong>
          </div>
          <div className="setting-row">
            <span>Auto reply</span>
            <strong>On (Messenger + WhatsApp)</strong>
          </div>
          <div className="setting-row">
            <span>Operator</span>
            <strong>{user.name}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
