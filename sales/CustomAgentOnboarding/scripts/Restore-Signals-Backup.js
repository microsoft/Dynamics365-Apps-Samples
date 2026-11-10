/* Recommended Actions - restore ranking settings from a backup (browser version).
 *
 * Use this to undo a change made with Set-Table-Signals.js.
 *   1. Open Sales Hub in the same environment, press F12 -> Console.
 *   2. Paste this script and press Enter.
 *   3. If you're still in the same browser tab where you made the change, it offers to restore that backup directly.
 *      Otherwise a box appears: open your raa-settings-backup-*.json file in Notepad, copy everything, paste it in
 *      the box, and select Restore.
 * It saves with an ETag check and reads the result back. It only changes the Recommended Actions settings record.
 */
(async () => {
  const api = location.origin + '/api/data/v9.2';
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' };
  const call = async (url, opts = {}) => {
    const r = await fetch(api + url, { credentials: 'same-origin', ...opts, headers: { ...headers, ...(opts.headers || {}) } });
    if (!r.ok) { const e = new Error(`${r.status}: ${(await r.text()).slice(0, 300)}`); e.status = r.status; throw e; }
    return r.status === 204 ? null : r.json();
  };
  const restore = async (raw) => {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.salesconfig) throw new Error('This is not a Recommended Actions settings backup (no salesconfig).');
    const row = (await call('/msdyn_salesagentconfigurationsv2?$select=msdyn_salesagentconfigurationv2id&$filter=msdyn_microagenttype eq 11')).value[0];
    if (!row) throw new Error('No Recommended Actions settings record found.');
    try {
      await call(`/msdyn_salesagentconfigurationsv2(${row.msdyn_salesagentconfigurationv2id})`, {
        method: 'PATCH', headers: { 'If-Match': row['@odata.etag'] }, body: JSON.stringify({ msdyn_microagentconfiguration: raw })
      });
    } catch (e) {
      if (e.status === 412) throw new Error('The settings changed while restoring. Nothing was saved. Run it again.');
      throw e;
    }
    const back = (await call(`/msdyn_salesagentconfigurationsv2(${row.msdyn_salesagentconfigurationv2id})?$select=msdyn_microagentconfiguration`)).msdyn_microagentconfiguration;
    if (back !== raw) throw new Error('Saved, but the read-back does not match the backup.');
    return 'Restored and verified. Ranking uses it within about 60 minutes.';
  };
  try {
    if (window.RAA_SIGNALS_BACKUP && (window.RAA_RESTORE_AUTO || confirm('Restore the backup taken earlier in this tab?'))) {
      const msg = await restore(window.RAA_SIGNALS_BACKUP);
      window.RAA_RESTORE_RESULT = 'restored';
      if (!window.RAA_RESTORE_AUTO) alert(msg);
      return console.log('[RAA restore] ' + msg);
    }
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:10% 20%;z-index:99999;background:#fff;border:2px solid #0f6cbd;border-radius:10px;padding:16px;font:14px Segoe UI;box-shadow:0 10px 40px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:8px';
    box.innerHTML = '<b>Restore Recommended Actions settings</b><span>Paste the full content of your raa-settings-backup-*.json file:</span>' +
      '<textarea style="flex:1;font:12px Consolas"></textarea><div><button>Restore</button> <button>Cancel</button></div>';
    document.body.appendChild(box);
    const [restoreBtn, cancelBtn] = box.querySelectorAll('button');
    cancelBtn.onclick = () => box.remove();
    restoreBtn.onclick = async () => {
      try { alert(await restore(box.querySelector('textarea').value.trim())); box.remove(); }
      catch (e) { alert('Not restored: ' + e.message); }
    };
  } catch (e) {
    window.RAA_RESTORE_RESULT = 'error: ' + e.message;
    alert('Not restored: ' + e.message);
  }
})();
