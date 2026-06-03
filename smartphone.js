/* ============================================================
 * Flywings 小手机 — 桌面 → KakaoTalk / YouTube
 * 词条含日期，按世界时间过滤显示
 * ============================================================ */

const CSS = `
<style>
.phone { width:375px; max-width:100%; height:700px; max-height:min(700px, calc(100vh - 16px)); margin:0 auto; background:#000; border-radius:32px; overflow:hidden; display:flex; flex-direction:column; font-family:-apple-system,sans-serif; color:#fff; flex-shrink:0; }
.phone-status { display:flex; justify-content:space-between; padding:14px 28px 8px; font-size:11px; font-weight:600; color:rgba(255,255,255,0.6); flex-shrink:0; }
.phone-body { flex:1; overflow-y:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
.phone-body::-webkit-scrollbar { display:none; }

.desktop { padding:20px 24px; display:grid; grid-template-columns:repeat(4,1fr); gap:24px 12px; }
.desktop-app { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; }
.desktop-app-icon { width:62px; height:62px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:28px; }
.desktop-app-label { font-size:11px; color:rgba(255,255,255,0.7); text-align:center; }

.chat-item { display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.04); }
.chat-item:active { background:rgba(255,255,255,0.05); }
.chat-avatar { width:48px; height:48px; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; flex-shrink:0; }
.chat-info { flex:1; min-width:0; }
.chat-name { font-size:14px; font-weight:600; }
.chat-preview { font-size:12px; color:rgba(255,255,255,0.45); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.chat-time { font-size:11px; color:rgba(255,255,255,0.3); flex-shrink:0; }
.chat-locked { opacity:0.3; pointer-events:none; }

.chat-detail-header { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
.chat-detail-back { cursor:pointer; font-size:20px; color:#6c5ce7; padding:4px 2px; user-select:none; }
.chat-detail-name { font-size:14px; font-weight:600; }
.chat-detail-msgs { padding:12px 16px; display:flex; flex-direction:column; }
.chat-bubble { max-width:78%; padding:9px 13px; border-radius:16px; margin-bottom:8px; font-size:13px; line-height:1.45; word-break:break-word; }
.chat-bubble.in { background:rgba(255,255,255,0.08); align-self:flex-start; border-bottom-left-radius:4px; }
.chat-bubble.out { background:#6c5ce7; align-self:flex-end; border-bottom-right-radius:4px; }
.chat-bubble-time { font-size:9px; color:rgba(255,255,255,0.25); margin-top:2px; }
.chat-bubble.in .chat-bubble-time { text-align:left; }
.chat-bubble.out .chat-bubble-time { text-align:right; }

.yt-video { padding:12px 16px; display:flex; gap:12px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.04); }
.yt-video:active { background:rgba(255,255,255,0.05); }
.yt-thumb { width:140px; height:80px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.yt-info { flex:1; min-width:0; }
.yt-title { font-size:13px; font-weight:600; line-height:1.3; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.yt-channel { font-size:11px; color:rgba(255,255,255,0.4); }
.yt-meta { font-size:10px; color:rgba(255,255,255,0.3); margin-top:2px; }
.yt-locked { opacity:0.25; pointer-events:none; }

.phone-navbar { display:flex; align-items:center; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
.phone-navbar-back { cursor:pointer; font-size:20px; color:#6c5ce7; margin-right:12px; user-select:none; }
.phone-navbar-title { font-size:16px; font-weight:700; }
.phone-empty { text-align:center; color:rgba(255,255,255,0.25); padding:60px 20px; font-size:13px; }
.future-tag { font-size:10px; background:rgba(108,92,231,0.3); color:#6c5ce7; padding:1px 6px; border-radius:6px; margin-left:6px; }
.cal-header { display:flex; justify-content:space-between; align-items:center; padding:4px 8px 12px; }
.cal-month { font-size:15px; font-weight:700; }
.cal-nav { cursor:pointer; font-size:18px; color:#6c5ce7; padding:4px 8px; user-select:none; }
.cal-weekdays { display:grid; grid-template-columns:repeat(7,1fr); text-align:center; font-size:10px; color:rgba(255,255,255,0.35); padding:0 4px 6px; }
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; padding:0 4px; }
.cal-day { aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:50%; font-size:12px; cursor:pointer; position:relative; }
.cal-day.other { color:rgba(255,255,255,0.15); }
.cal-day.today { background:#6c5ce7; color:#fff; font-weight:700; }
.cal-day.selected { background:rgba(108,92,231,0.3); }
.cal-dot { width:4px; height:4px; border-radius:50%; background:#6c5ce7; position:absolute; bottom:3px; }
.cal-day.today .cal-dot { background:#fff; }
.cal-events { margin-top:10px; padding:0 8px; }
.cal-event { padding:10px 12px; border-radius:10px; margin-bottom:6px; background:rgba(255,255,255,0.04); border-left:3px solid #6c5ce7; }
.cal-event.past { opacity:0.3; border-left-color:#333; }
.cal-event-title { font-size:13px; font-weight:600; }
.cal-event-date { font-size:10px; color:rgba(255,255,255,0.35); margin:2px 0 3px; }
.cal-event-desc { font-size:11px; color:rgba(255,255,255,0.45); line-height:1.3; }
</style>
`;

// ===================== 世界书读写 =====================

function getEntry(key) {
    const ctx = SillyTavern.getContext();
    const char = ctx.characters?.[ctx.characterId];
    const entries = char?.data?.character_book?.entries || {};
    return Object.values(entries).find(e => e.comment === key);
}

function setEntry(key, content) {
    const ctx = SillyTavern.getContext();
    const char = ctx.characters?.[ctx.characterId];
    const book = char?.data?.character_book;
    if (!book?.entries) return;
    const existing = Object.values(book.entries).find(e => e.comment === key);
    if (existing) { existing.content = content; return; }
    const ids = Object.keys(book.entries).map(Number).filter(n => !isNaN(n));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 0;
    book.entries[nextId] = {
        keys:[], secondary_keys:[], comment:key, content,
        constant:true, selective:true, enabled:false,
        position:'before_char', insertion_order:100, id:nextId,
        extensions:{
            position:0, exclude_recursion:false, probability:100, useProbability:true,
            selectiveLogic:0, group:'', group_override:false, group_weight:100,
            prevent_recursion:false, delay_until_recursion:false, scan_depth:null,
            match_whole_words:null, use_group_scoring:false, case_sensitive:null,
            automation_id:'', vectorized:false, sticky:0, cooldown:0, delay:0,
            display_index:nextId, role:0, depth:4,
            match_persona_description:false, match_character_description:false,
            match_character_personality:false, match_character_depth_prompt:false,
            match_scenario:false, match_creator_notes:false
        }
    };
    SillyTavern.saveSettingsDebounced();
}

// ===================== 日期 & 过滤 =====================

function getNowDate() {
    try {
        const mvu = Mvu?.getMvuData?.({ type:'message', message_id:'latest' });
        return _.get(mvu, 'stat_data.世界.日期') || '';
    } catch(e) { return ''; }
}

function dateNum(d) { return d ? parseInt(d.replace(/-/g, '')) : 0; }

function isAvailable(entryDate) {
    const now = getNowDate();
    if (!now || !entryDate) return true; // 无日期 = 始终可见
    return dateNum(entryDate) <= dateNum(now);
}

function daysUntil(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const n = new Date(getNowDate() || Date.now());
    const diff = Math.ceil((d - n) / 86400000);
    if (diff <= 0) return '';
    if (diff === 1) return '明天';
    if (diff <= 7) return `${diff}天后`;
    return `${Math.ceil(diff/7)}周后`;
}

// ===================== KakaoTalk =====================

/*
 格式（空行分隔每个聊天区块）:
 人名|地点|YYYY-MM-DD
 发件人|HH:MM|内容
 发件人|HH:MM|内容
*/
function parseChats(raw) {
    const sections = raw.split('\n\n');
    const chats = [];
    for (const section of sections) {
        const lines = section.trim().split('\n');
        if (lines.length < 3) continue;
        const header = lines[0].split('|');
        const name = header[0]?.trim() || '';
        const meta = header[1]?.trim() || '';
        const date = header[2]?.trim() || '';
        const msgs = [];
        for (let i = 1; i < lines.length; i++) {
            const p = lines[i].split('|');
            if (p.length >= 3) msgs.push({ from: p[0].trim(), time: p[1].trim(), text: p.slice(2).join('|').trim() });
        }
        if (msgs.length) chats.push({ name, meta, date, messages: msgs });
    }
    return chats;
}

function avColor(n) { return {'姜旻俊':'#a29bfe','相羽凉平':'#e17055','尹瑞恩':'#81ecec','旻俊哥':'#a29bfe','凉平':'#e17055','瑞恩':'#81ecec'}[n]||'#555'; }

function showKakaoTalk(dom) {
    const entry = getEntry('[手机-KakaoTalk]');
    const allChats = entry ? parseChats(entry.content) : [];
    const body = dom.querySelector('#phone-body');
    let h = '<div class="phone-navbar"><div class="phone-navbar-back" data-back="desktop">‹</div><div class="phone-navbar-title">KakaoTalk</div></div>';
    if (!allChats.length) {
        body.innerHTML = h + '<div class="phone-empty">没有消息</div>';
        bindBack(dom);
        return;
    }
    h += '<div class="chat-list">';
    allChats.forEach((c, i) => {
        const avail = isAvailable(c.date);
        const last = c.messages[c.messages.length - 1];
        const lockCls = avail ? '' : ' chat-locked';
        const futureLabel = !avail ? `<span class="future-tag">${daysUntil(c.date)||'未解锁'}</span>` : '';
        h += `<div class="chat-item${lockCls}" data-chat="${i}"><div class="chat-avatar" style="background:${avColor(c.name)}">${_.escape(c.name[0])}</div><div class="chat-info"><div class="chat-name">${_.escape(c.name)}${futureLabel}</div><div class="chat-preview">${avail ? _.escape(last?(last.from==='你'?'你: ':'')+last.text : '') : '🔒 消息将在 '+(c.date||'未来')+' 解锁'}</div></div><div class="chat-time">${_.escape(last?.time||'')}</div></div>`;
    });
    body.innerHTML = h + '</div>';
    bindBack(dom);
    dom.querySelectorAll('.chat-item:not(.chat-locked)').forEach(el => {
        el.addEventListener('click', () => showChatDetail(dom, parseInt(el.dataset.chat)));
    });
}

function showChatDetail(dom, idx) {
    const entry = getEntry('[手机-KakaoTalk]');
    const allChats = entry ? parseChats(entry.content) : [];
    const chat = allChats[idx];
    if (!chat) return;
    const body = dom.querySelector('#phone-body');
    let msgs = '';
    chat.messages.forEach(m => {
        const cls = m.from === '你' ? 'out' : 'in';
        msgs += `<div class="chat-bubble ${cls}">${_.escape(m.text)}<div class="chat-bubble-time">${_.escape(m.time)}</div></div>`;
    });
    body.innerHTML = `<div class="phone-navbar"><span class="phone-navbar-back" data-back="kakaotalk">‹</span><div class="chat-avatar" style="background:${avColor(chat.name)};width:32px;height:32px;border-radius:12px;font-size:13px;">${_.escape(chat.name[0])}</div><div><div class="chat-detail-name">${_.escape(chat.name)}</div><div style="font-size:10px;color:rgba(255,255,255,0.3);">${_.escape(chat.meta)}</div></div></div><div class="chat-detail-msgs">${msgs}</div>`;
    dom.querySelector('[data-back="kakaotalk"]')?.addEventListener('click', () => showKakaoTalk(dom));
}

// ===================== YouTube =====================

/*
 格式（每行一个视频）:
 标题 | 频道 | 播放量 | YYYY-MM-DD
 第四个字段为发布日期，无日期则始终可见
*/
function parseVideos(raw) {
    return raw.split('\n').filter(Boolean).map(line => {
        const p = line.split('|');
        return { title: p[0]?.trim(), channel: p[1]?.trim(), views: p[2]?.trim(), date: p[3]?.trim() || '' };
    });
}

function ytColor(i) { return ['#2d2d2d','#3a1a1a','#1a2a3a','#2a1a3a','#1a2a2a','#3a2a1a'][i%6]; }

function showYouTube(dom) {
    const entry = getEntry('[手机-YouTube]');
    const allVideos = entry ? parseVideos(entry.content) : [];
    const body = dom.querySelector('#phone-body');
    let h = '<div class="phone-navbar"><div class="phone-navbar-back" data-back="desktop">‹</div><div class="phone-navbar-title">YouTube</div></div>';
    if (!allVideos.length) {
        body.innerHTML = h + '<div class="phone-empty">暂无视频</div>';
        bindBack(dom);
        return;
    }
    const visible = allVideos.filter(v => isAvailable(v.date));
    if (!visible.length) {
        body.innerHTML = h + '<div class="phone-empty">暂无已发布视频</div>';
        bindBack(dom);
        return;
    }
    h += '<div class="yt-list">';
    visible.forEach((v, i) => {
        h += `<div class="yt-video"><div class="yt-thumb" style="background:${ytColor(i)};">▶</div><div class="yt-info"><div class="yt-title">${_.escape(v.title)}</div><div class="yt-channel">${_.escape(v.channel)}</div><div class="yt-meta">${_.escape(v.views||'')}</div></div></div>`;
    });
    body.innerHTML = h + '</div>';
    bindBack(dom);
}

// ===================== Calendar (iOS style) =====================

const WEEKDAYS = ['日','一','二','三','四','五','六'];

function getEvents() {
    try {
        const mvu = Mvu?.getMvuData?.({ type:'message', message_id:'latest' });
        const schedule = _.get(mvu, 'stat_data.flywings.回归日程.日程');
        if (!schedule || _.isEmpty(schedule)) return [];
        const worldDate = getNowDate();
        const currentPhase = _.get(mvu, 'stat_data.flywings.回归日程.当前阶段') || '';
        return Object.entries(schedule).map(([name, info]) => ({
            name, current: currentPhase === name,
            start: info.开始 || info.日期 || '',
            end: info.结束 || '',
            desc: info.内容 || '',
            key: (info.开始 || info.日期 || '').replace(/-/g,'')
        }));
    } catch(e) { return []; }
}

function showCalendar(dom) {
    const body = dom.querySelector('#phone-body');
    const events = getEvents();

    // 初始化当月
    const todayStr = getNowDate();
    let viewDate = todayStr ? new Date(todayStr) : new Date();
    if (isNaN(viewDate.getTime())) viewDate = new Date();

    function render(view) {
        const y = view.getFullYear(), m = view.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m+1, 0).getDate();
        const daysInPrev = new Date(y, m, 0).getDate();
        const todayKey = todayStr.replace(/-/g,'');

        // 日期 → 有事件的 keys
        const eventDays = new Set();
        events.forEach(ev => {
            if (ev.start) {
                const s = new Date(ev.start);
                if (s.getFullYear()===y && s.getMonth()===m) eventDays.add(s.getDate());
            }
        });

        let h = '<div class="phone-navbar"><div class="phone-navbar-back" data-back="desktop">‹</div><div class="phone-navbar-title">Calendar</div></div>';
        h += `<div class="cal-header"><span class="cal-nav" data-nav="-1">‹</span><span class="cal-month">${y}年${m+1}月</span><span class="cal-nav" data-nav="1">›</span></div>`;
        h += `<div class="cal-weekdays">${WEEKDAYS.map(d=>`<span>${d}</span>`).join('')}</div>`;
        h += '<div class="cal-grid">';

        // 上月填充
        for (let i = firstDay-1; i >= 0; i--) {
            h += `<div class="cal-day other">${daysInPrev-i}</div>`;
        }
        // 本月
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${y}${String(m+1).padStart(2,'0')}${String(d).padStart(2,'0')}`;
            const isToday = key === todayKey;
            const hasEvent = eventDays.has(d);
            h += `<div class="cal-day${isToday?' today':''}" data-day="${key}">${d}${hasEvent?`<span class="cal-dot"></span>`:''}</div>`;
        }
        // 下月填充
        const remaining = (7 - ((firstDay + daysInMonth) % 7)) % 7;
        for (let d = 1; d <= remaining; d++) {
            h += `<div class="cal-day other">${d}</div>`;
        }
        h += '</div>';

        // 事件列表（当月有事件的）
        h += '<div class="cal-events">';
        const monthEvents = events.filter(ev => {
            if (!ev.start) return false;
            const s = new Date(ev.start);
            return s.getFullYear()===y && s.getMonth()===m;
        });
        if (!monthEvents.length) {
            h += '<div class="phone-empty" style="padding:20px;">本月暂无行程</div>';
        } else {
            monthEvents.forEach(ev => {
                const cls = ev.current ? '' : (ev.end && todayStr && dateNum(ev.end)<dateNum(todayStr) ? ' past' : '');
                h += `<div class="cal-event${cls}"><div class="cal-event-title">${ev.current?'● ':''}${_.escape(ev.name)}</div><div class="cal-event-date">${_.escape(ev.start+(ev.end?' → '+ev.end:''))}</div><div class="cal-event-desc">${_.escape(ev.desc)}</div></div>`;
            });
        }
        h += '</div>';

        body.innerHTML = h;
        bindBack(dom);

        // 导航
        dom.querySelector('[data-nav="-1"]')?.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() - 1);
            render(viewDate);
        });
        dom.querySelector('[data-nav="1"]')?.addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() + 1);
            render(viewDate);
        });
    }

    render(viewDate);
}

// ===================== 桌面 =====================

function showDesktop(dom) {
    const body = dom.querySelector('#phone-body');
    body.innerHTML = `
    <div class="desktop">
        <div class="desktop-app" data-app="kakaotalk">
            <div class="desktop-app-icon" style="background:#3c3226;">💬</div>
            <div class="desktop-app-label">KakaoTalk</div>
        </div>
        <div class="desktop-app" data-app="youtube">
            <div class="desktop-app-icon" style="background:#1a1a1a;">▶</div>
            <div class="desktop-app-label">YouTube</div>
        </div>
        <div class="desktop-app" data-app="calendar">
            <div class="desktop-app-icon" style="background:#1a1a2a;">📅</div>
            <div class="desktop-app-label">Calendar</div>
        </div>
    </div>`;
    dom.querySelectorAll('.desktop-app').forEach(el => {
        el.addEventListener('click', () => {
            if (el.dataset.app === 'kakaotalk') showKakaoTalk(dom);
            else if (el.dataset.app === 'youtube') showYouTube(dom);
            else if (el.dataset.app === 'calendar') showCalendar(dom);
        });
    });
}

function bindBack(dom) {
    dom.querySelector('[data-back="desktop"]')?.addEventListener('click', () => showDesktop(dom));
}

// ===================== 初始化：从 MVU 读取物料生成词条 =====================

function buildDefaultChats() {
    return [
        '旻俊哥|宿舍|2026-06-01',
        '姜旻俊|18:30|今晚想吃什么？我买菜',
        '你|18:32|都可以，哥做什么都好吃',
        '姜旻俊|18:33|那就大酱汤和炒猪肉吧，凉平说想吃',
        '',
        '凉平|练习室|2026-06-01',
        '相羽凉平|22:10|今天改了两小节编舞',
        '相羽凉平|22:10|[视频]',
        '你|22:15|明天一起练',
        '',
        '瑞恩|宿舍|2026-06-02',
        '尹瑞恩|14:20|哥你看今天theqoo了吗',
        '你|14:25|还没，怎么了',
        '尹瑞恩|14:25|有人拍到我们在弘大吃饭了kkk',
    ].join('\n');
}

function buildDefaultVideos() {
    const lines = [];
    try {
        const mvu = Mvu?.getMvuData?.({ type:'message', message_id:'latest' });
        const schedule = _.get(mvu, 'stat_data.flywings.回归日程.日程');
        const materials = _.get(mvu, 'stat_data.flywings.目前物料列表');
        const work = _.get(mvu, 'stat_data.flywings.目前作品详情');
        const titleName = work?.曲目 ? (Object.values(work.曲目).find(t => t.类型 === 'title')?.名称 || '主打歌') : '主打歌';

        if (schedule && !_.isEmpty(schedule)) {
            // 从回归日程中提取物料发布日期
            const filming = schedule.拍摄物料;
            const promo = schedule.回归信息发布;
            if (filming) {
                const filmStart = filming.开始 || filming.日期 || '';
                if (filmStart) {
                    const d = new Date(filmStart);
                    lines.push(`FLYWINGS 练习室 | 新曲编舞初公开 | Rainbow Ent. | 待发布 | ${filmStart}`);
                }
            }
            if (promo) {
                const promoStart = promo.开始 || promo.日期 || '';
                if (promoStart) {
                    const d = new Date(promoStart);
                    // 概念视频发布在回归信息发布阶段
                    if (materials?.概念视频?.length) {
                        materials.概念视频.forEach((v, i) => {
                            const vd = new Date(d);
                            vd.setDate(vd.getDate() + i * 2);
                            lines.push(`${v} | FLYWINGS | Rainbow Ent. | 待发布 | ${vd.toISOString().slice(0,10)}`);
                        });
                    }
                    // MV Teaser
                    if (materials?.mv_teaser?.length) {
                        const td = new Date(d);
                        td.setDate(td.getDate() + (materials.概念视频?.length||0)*2 + 2);
                        materials.mv_teaser.forEach((t, i) => {
                            const vd = new Date(td);
                            vd.setDate(vd.getDate() + i * 3);
                            lines.push(`${t} | FLYWINGS | Rainbow Ent. | 待发布 | ${vd.toISOString().slice(0,10)}`);
                        });
                    }
                    // MV
                    const mvd = new Date(d);
                    mvd.setDate(mvd.getDate() + (materials.概念视频?.length||0)*2 + (materials.mv_teaser?.length||0)*3 + 4);
                    lines.push(`${titleName} MV | FLYWINGS | Rainbow Ent. | 待发布 | ${mvd.toISOString().slice(0,10)}`);
                }
            }
        }
    } catch(e) { /* ignore */ }

    // 如果没有从 MVU 读到物料，用默认占位
    if (!lines.length) {
        const base = getNowDate() || '2026-06-01';
        lines.push(`FLYWINGS 练习室 | 蝴蝶 (Butterfly) | Rainbow Ent. | 1.2万次 | ${base}`);
        lines.push(`FLYWINGS 旻俊的厨房 | 大酱汤做法 | Rainbow Ent. | 8920次 | ${base}`);
    }
    return lines.join('\n');
}

function ensureAllEntries() {
    setEntry('[手机-KakaoTalk]', buildDefaultChats());
    setEntry('[手机-YouTube]', buildDefaultVideos());
}

// ===================== 弹窗 =====================

async function showPhone() {
    try {
        const mvu = Mvu?.getMvuData?.({ type:'message', message_id:'latest' });
        const t = _.get(mvu, 'stat_data.世界.时间', '');
        const timeStr = t ? t.substring(0,5) : new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});

        const html = CSS + `<div class="phone"><div class="phone-status"><span>${timeStr}</span><span>📶 🔋</span></div><div class="phone-body" id="phone-body"></div></div>`;

        const popup = new SillyTavern.Popup($(html), SillyTavern.POPUP_TYPE.DISPLAY, '', {
            transparent: true, animation: 'none'
        });
        const dom = popup.dlg;
        showDesktop(dom);
        await popup.show();
    } catch (err) {
        console.error('Phone error:', err?.message || err, err?.stack || '');
        toastr.error('手机加载失败: ' + ((err?.message || err?.toString())).substring(0, 80));
    }
}

// ---- 入口 ----
ensureAllEntries();
replaceScriptButtons([{ name: '📱 手机', visible: true }]);
eventOn(getButtonEvent('📱 手机'), showPhone);
toastr.success('Smartphone 已加载', 'Flywings', { timeOut: 2000 });
