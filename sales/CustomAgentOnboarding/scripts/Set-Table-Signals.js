/* Recommended Actions - set ranking signals for a table (browser version).
 *
 * Run it in the browser, on any Dynamics 365 page of the target environment:
 *   1. Open Sales Hub in the environment (you must be signed in as an admin).
 *   2. Press F12 -> Console. (Edge/Chrome may ask you to type "allow pasting" first.)
 *   3. Paste this whole script and press Enter, then answer the prompts.
 *
 * What it does: adds (or updates) the fields Recommended Actions uses to rank suggestions for one table:
 *   - a VALUE field   -> how important a record is (impact)
 *   - a DUE-DATE field -> how urgent it is (urgency)
 * For a new table it also adds exclusion rules (inactive records, records with no value) and a value benchmark.
 * For Opportunity, Lead, Contact and Account it only adds/updates two extra signals (custom_value, custom_due_date)
 * and never removes the shipped ones.
 *
 * Safety: shows a preview and asks before saving; downloads a backup of the current settings first; saves with an
 * ETag check so it never overwrites someone else's change; reads the result back. It only changes the Recommended
 * Actions settings record, never business data. Uses your existing browser sign-in; nothing is sent anywhere else.
 *
 * Optional (for testing/automation): set window.RAA_SIGNALS_INPUT = { table, valueColumn, dateColumn, confirm: true }
 * before running to skip the prompts.
 */
(async () => {
  const say = (m) => console.log('%c[RAA signals] ' + m, 'color:#0f6cbd;font-weight:600');
  try {
    if (!/\.(crm[0-9]*\.dynamics\.com)$/i.test(location.hostname)) {
      throw new Error('Open a Dynamics 365 page of your environment (https://<org>.crm.dynamics.com) and run this there.');
    }
    const api = location.origin + '/api/data/v9.2';
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8', 'OData-MaxVersion': '4.0', 'OData-Version': '4.0' };
    const call = async (url, opts = {}) => {
      const r = await fetch(api + url, { credentials: 'same-origin', ...opts, headers: { ...headers, ...(opts.headers || {}) } });
      if (!r.ok) {
        const text = await r.text();
        const err = new Error(`${r.status}: ${(text.match(/"message"\s*:\s*"([^"]+)/) || [, text])[1]}`);
        err.status = r.status;
        throw err;
      }
      return r.status === 204 ? null : r.json();
    };

    // Ready-made defaults. Opportunity/lead/contact/account have shipped signals; others get a new section.
    const presets = {
      quote: { value: 'totalamount', date: 'effectiveto' },
      salesorder: { value: 'totalamount', date: 'requestdeliveryby' },
      invoice: { value: 'totalamount', date: 'duedate' },
      incident: { value: '', date: 'followupby' },
      email: { value: '', date: 'scheduledend' },
      appointment: { value: '', date: 'scheduledend' },
      task: { value: '', date: 'scheduledend' },
      phonecall: { value: '', date: 'scheduledend' }
    };
    const shipped = ['opportunity', 'lead', 'contact', 'account'];
    const input = window.RAA_SIGNALS_INPUT || {};
    const ask = (key, question, fallback) => (key in input ? String(input[key] ?? '') : (prompt(question, fallback) ?? null));
    const name = /^[a-z][a-z0-9_]{1,99}$/;

    let table = ask('table', 'Table logical name (for example: quote, opportunity, cr123_project):', '');
    if (table === null) return say('Cancelled.');
    table = table.trim().toLowerCase();
    if (!name.test(table)) throw new Error(`"${table}" is not a valid logical name.`);
    const isShipped = shipped.includes(table);
    const p = presets[table] || { value: '', date: '' };

    let valueCol = ask('valueColumn', `VALUE column logical name on ${table} (a currency or number column).\n` +
      (isShipped ? 'Leave empty to keep the shipped value signal unchanged.' : 'Leave empty if the table has none.'), p.value);
    if (valueCol === null) return say('Cancelled.');
    let dateCol = ask('dateColumn', `DUE-DATE column logical name on ${table} (a date column).\n` +
      (isShipped ? 'Leave empty to keep the shipped urgency signals unchanged.' : 'Leave empty if the table has none.'), p.date);
    if (dateCol === null) return say('Cancelled.');
    valueCol = valueCol.trim().toLowerCase();
    dateCol = dateCol.trim().toLowerCase();
    for (const c of [valueCol, dateCol]) if (c && !name.test(c)) throw new Error(`"${c}" is not a valid column logical name.`);
    if (isShipped && !valueCol && !dateCol) return say(`${table} already has shipped signals and you gave no column. Nothing to do.`);

    // Check table and columns.
    say(`Checking ${table}...`);
    const entity = await call(`/EntityDefinitions(LogicalName='${table}')?$select=LogicalName,IsActivity`);
    const types = { [valueCol]: ['Money', 'Decimal', 'Double', 'Integer', 'BigInt'], [dateCol]: ['DateTime'] };
    for (const c of [valueCol, dateCol].filter(Boolean)) {
      const a = await call(`/EntityDefinitions(LogicalName='${table}')/Attributes(LogicalName='${c}')?$select=LogicalName,AttributeType`);
      if (!types[c].includes(a.AttributeType)) throw new Error(`Column ${c} is ${a.AttributeType}; expected ${types[c].join(' / ')}.`);
    }

    // Read settings with ETag.
    const rows = (await call('/msdyn_salesagentconfigurationsv2?$select=msdyn_salesagentconfigurationv2id,msdyn_microagentconfiguration&$filter=msdyn_microagenttype eq 11')).value;
    if (rows.length !== 1) throw new Error(`Expected one Recommended Actions settings record; found ${rows.length}. Set up Recommended Actions first.`);
    const row = rows[0];
    const raw = row.msdyn_microagentconfiguration;
    if (!raw) throw new Error('The Recommended Actions settings are empty. Open Recommended Actions in AI hub, save once, then run again.');
    const config = JSON.parse(raw);
    const sales = config.salesconfig;
    if (!sales) throw new Error('Unexpected settings shape (no salesconfig).');

    const valueSignal = (n) => ({ name: n, type: 'number', source: table, dimension_influence: { impact: 'strong' },
      interpretation: 'Compare against org benchmarks. Higher-value records increase impact.', reliability: 'high',
      fetch_info: { fetch_type: 'entity_field', crm_entity: table, crm_field: valueCol } });
    const dateSignal = (n) => ({ name: n, type: 'number', source: 'derived', dimension_influence: { urgency: 'strong' },
      interpretation: 'Negative = overdue. Low positive = deadline pressure. >30 = low urgency.', reliability: 'high',
      fetch_info: { fetch_type: 'derived', crm_entity: table, crm_field: dateCol, derivation: 'days_until_date' } });

    const summary = [];
    if (isShipped) {
      // Update mode: add or replace only our two named signals; keep everything shipped.
      const sec = sales[table];
      if (!sec || !Array.isArray(sec.signals)) throw new Error(`No shipped settings found for ${table}.`);
      const upsert = (sig) => {
        const i = sec.signals.findIndex((s) => s.name === sig.name);
        if (i >= 0) { sec.signals[i] = sig; summary.push(`update signal ${sig.name} -> ${sig.fetch_info.crm_field}`); }
        else { sec.signals.push(sig); summary.push(`add signal ${sig.name} -> ${sig.fetch_info.crm_field}`); }
      };
      if (valueCol) upsert(valueSignal('custom_value'));
      if (dateCol) upsert(dateSignal('custom_due_date'));
      summary.push('shipped signals and rules are kept');
    } else {
      if (sales[table]) {
        const go = 'replace' in input ? input.replace : confirm(`Ranking settings for "${table}" already exist.\nReplace them with the new value/date setup?`);
        if (!go) return say('Nothing changed.');
      }
      const activity = !!entity.IsActivity;
      const signals = [{ name: 'record_state', type: 'number', source: table, dimension_influence: { confidence: 'weak' },
        fetch_info: { fetch_type: 'entity_field', crm_entity: table, crm_field: 'statecode' } }];
      const floor = [activity
        ? { id: 'F-RAA-STATE', reason: 'Activity was canceled', expression: { field: 'record_state', op: 'eq', value: 2 } }
        : { id: 'F-RAA-STATE', reason: 'Record is no longer active', expression: { field: 'record_state', op: 'gt', value: 0 } }];
      if (valueCol) {
        signals.push({ ...valueSignal('record_value'), required: true });
        floor.push({ id: 'F-RAA-VALUE', reason: 'Record has no value assigned - impact is not material', expression: { field: 'record_value', op: 'lte', value: 0 } });
      }
      if (dateCol) signals.push(dateSignal('due_date_days'));
      sales[table] = { signals, prefilter_rules: { floor, ceiling: [] } };
      summary.push(`signals: ${signals.map((s) => s.name).join(', ')}`, `exclusion rules: ${floor.map((f) => f.id).join(', ')}`);
      if (valueCol) {
        const id = `${table}_estimated_value`;
        sales.benchmark_definitions = (sales.benchmark_definitions || []).filter((b) => b && b.id !== id);
        sales.benchmark_definitions.push({ id, target_entity: table, crm_entity: table, crm_field: valueCol,
          base_filter: { field: 'statecode', op: 'eq', value: 0 }, lookback_days: 365, min_count: 10,
          fallback: { P10: 5000, P50: 50000, P75: 250000, P90: 1000000 } });
        summary.push(`benchmark: ${id} on ${valueCol}`);
      } else summary.push('no value column: no benchmark, no value rule');
      if (!valueCol && !dateCol) summary.push('WARNING: no value or date column - suggestions will mostly be filtered out');
    }

    const preview = `Table: ${table}${isShipped ? ' (shipped table - update mode)' : ''}\n- ${summary.join('\n- ')}\n\nA backup of the current settings will be downloaded first.\nSave these changes?`;
    console.log(preview);
    const ok = 'confirm' in input ? !!input.confirm : confirm(preview);
    if (!ok) return say('Preview only. Nothing changed.');

    // Backup first.
    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    a.download = `raa-settings-backup-${stamp}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    window.RAA_SIGNALS_BACKUP = raw;
    say(`Backup downloaded: raa-settings-backup-${stamp}.json (also kept in window.RAA_SIGNALS_BACKUP)`);

    try {
      await call(`/msdyn_salesagentconfigurationsv2(${row.msdyn_salesagentconfigurationv2id})`, {
        method: 'PATCH', headers: { 'If-Match': row['@odata.etag'] },
        body: JSON.stringify({ msdyn_microagentconfiguration: JSON.stringify(config) })
      });
    } catch (e) {
      if (e.status === 412) throw new Error('Someone else changed the settings while this ran. Nothing was saved. Run it again.');
      throw e;
    }
    const check = JSON.parse((await call(`/msdyn_salesagentconfigurationsv2(${row.msdyn_salesagentconfigurationv2id})?$select=msdyn_microagentconfiguration`)).msdyn_microagentconfiguration);
    if (!check.salesconfig[table]) throw new Error('Saved, but the table was not found on read-back.');
    const msg = `Saved and verified for ${table}. Ranking picks this up within about 60 minutes.`;
    say(msg);
    if (!('confirm' in input)) alert(msg);
    window.RAA_SIGNALS_RESULT = 'saved';
  } catch (e) {
    console.error('[RAA signals] ' + e.message);
    window.RAA_SIGNALS_RESULT = 'error: ' + e.message;
    if (!window.RAA_SIGNALS_INPUT) alert('Not saved: ' + e.message);
  }
})();
