#!/usr/bin/env python3
"""Generate complete Omix SMS utility CSS from Tailwind classes used in source."""
import os, re

src_dir = "/home/oliver/omix-sms/src"
classes_set = set()
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if not f.endswith(('.tsx', '.ts')): continue
        try:
            content = open(os.path.join(root, f)).read()
        except: continue
        for m in re.finditer(r'className="([^"]*)"', content):
            for c in m.group(1).strip().split():
                classes_set.add(c.strip())

def esc(cls):
    return cls.replace(':', r'\:')

def sv(key):
    """Spacing value from tailwind key"""
    specials = {'px':'1px','auto':'auto','full':'100%','screen':'100vw','fit':'fit-content','max':'max-content','min':'min-content'}
    if key in specials: return specials[key]
    if '/' in key:
        a,b = key.split('/')
        return f"{int(a)/int(b)*100}%"
    try: return f"{float(key)*0.25}rem"
    except: return key

def hex2rgba(hex_color, opacity):
    hex_color = hex_color.lstrip('#')
    r,g,b = int(hex_color[0:2],16), int(hex_color[2:4],16), int(hex_color[4:6],16)
    return f"rgba({r},{g},{b},{opacity})"

def parse_opacity(base):
    """Check for opacity suffix like omix-500/10, returns (clean_base, opacity_val)"""
    if '/' in base and not base.startswith('['):
        parts = base.rsplit('/', 1)
        try:
            op = int(parts[1]) / 100
            return parts[0], op
        except:
            pass
    return base, None

L = []  # CSS lines

# ===== RESET =====
L.append("/* Omix SMS - Complete Utility CSS */")
L.append("*,*::before,*::after{box-sizing:border-box}")
L.append("")

# ===== LAYOUT =====
L.append("/* Layout */")
displays = {'flex':'flex','inline-flex':'inline-flex','block':'block','inline-block':'inline-block','inline':'inline','hidden':'none','contents':'contents','grid':'grid'}
positions = {'static':'static','fixed':'fixed','absolute':'absolute','relative':'relative','sticky':'sticky'}
overflows = {'overflow-auto':'auto','overflow-hidden':'hidden','overflow-visible':'visible','overflow-scroll':'scroll','overflow-x-auto':'auto','overflow-y-auto':'auto','overflow-x-hidden':'hidden','overflow-y-hidden':'hidden'}
overscrolls = {'overscroll-auto':'auto','overscroll-contain':'contain','overscroll-none':'none'}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    # Handle state prefixes for hover/focus etc
    if ':' in c:
        prefix = ':'.join(c.split(':')[:-1])
    else:
        prefix = ''
    
    if b in displays:
        L.append(f".{e}{{display:{displays[b]}}}")
    elif b in positions:
        L.append(f".{e}{{position:{positions[b]}}}")
    elif b in overflows:
        if 'x' in b: L.append(f".{e}{{overflow-x:{overflows[b]}}}")
        elif 'y' in b: L.append(f".{e}{{overflow-y:{overflows[b]}}}")
        else: L.append(f".{e}{{overflow:{overflows[b]}}}")
    elif b in overscrolls:
        if 'x' in b: L.append(f".{e}{{overscroll-behavior-x:{overscrolls[b]}}}")
        elif 'y' in b: L.append(f".{e}{{overscroll-behavior-y:{overscrolls[b]}}}")
        else: L.append(f".{e}{{overscroll-behavior:{overscrolls[b]}}}")
    elif b == 'visible':
        L.append(f".{e}{{visibility:visible}}")
    elif b == 'invisible':
        L.append(f".{e}{{visibility:hidden}}")
    elif b == 'inset-0':
        L.append(f".{e}{{inset:0}}")
    elif b == 'z-10': L.append(f".{e}{{z-index:10}}")
    elif b == 'z-20': L.append(f".{e}{{z-index:20}}")
    elif b == 'z-30': L.append(f".{e}{{z-index:30}}")
    elif b == 'z-40': L.append(f".{e}{{z-index:40}}")
    elif b == 'z-50': L.append(f".{e}{{z-index:50}}")
    elif b == 'z-[60]': L.append(f".{e}{{z-index:60}}")
    elif b == 'aspect-square':
        L.append(f".{e}{{aspect-ratio:1/1}}")
    elif b == 'shrink-0':
        L.append(f".{e}{{flex-shrink:0}}")
    elif b == 'grow':
        L.append(f".{e}{{flex-grow:1}}")
    elif b == 'grow-0':
        L.append(f".{e}{{flex-grow:0}}")

# TRBL positions
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    val = b.split('-',1)[1] if '-' in b else '0'
    sv_val = sv(val) if not val.startswith('[') else val[1:-1]
    
    for prop_name, css_prop in [('top-','top'),('bottom-','bottom'),('left-','left'),('right-','right')]:
        if b.startswith(prop_name) and css_prop in ('top','bottom','left','right'):
            sv_val = sv(val) if not val.startswith('[') else val[1:-1]
            L.append(f".{e}{{{css_prop}:{sv_val}}}")
            break

# Box alignment
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'items-start': L.append(f".{e}{{align-items:flex-start}}")
    elif b == 'items-end': L.append(f".{e}{{align-items:flex-end}}")
    elif b == 'items-center': L.append(f".{e}{{align-items:center}}")
    elif b == 'items-baseline': L.append(f".{e}{{align-items:baseline}}")
    elif b == 'items-stretch': L.append(f".{e}{{align-items:stretch}}")
    elif b == 'justify-start': L.append(f".{e}{{justify-content:flex-start}}")
    elif b == 'justify-end': L.append(f".{e}{{justify-content:flex-end}}")
    elif b == 'justify-center': L.append(f".{e}}{{justify-content:center}}")
    elif b == 'justify-between': L.append(f".{e}{{justify-content:space-between}}")
    elif b == 'justify-around': L.append(f".{e}{{justify-content:space-around}}")
    elif b == 'justify-evenly': L.append(f".{e}{{justify-content:space-evenly}}")
    elif b == 'align-top': L.append(f".{e}{{vertical-align:top}}")
    elif b == 'flex-row': L.append(f".{e}{{flex-direction:row}}")
    elif b == 'flex-row-reverse': L.append(f".{e}{{flex-direction:row-reverse}}")
    elif b == 'flex-col': L.append(f".{e}{{flex-direction:column}}")
    elif b == 'flex-col-reverse': L.append(f".{e}{{flex-direction:column-reverse}}")
    elif b == 'flex-wrap': L.append(f".{e}{{flex-wrap:wrap}}")
    elif b == 'flex-wrap-reverse': L.append(f".{e}{{flex-wrap:wrap-reverse}}")
    elif b == 'flex-nowrap': L.append(f".{e}{{flex-wrap:nowrap}}")
    elif b == 'flex-1': L.append(f".{e}{{flex:1 1 0%}}")
    elif b == 'flex-auto': L.append(f".{e}{{flex:1 1 auto}}")
    elif b == 'flex-initial': L.append(f".{e}{{flex:0 1 auto}}")
    elif b == 'flex-none': L.append(f".{e}{{flex:none}}")
    elif b == 'flex-shrink-0': L.append(f".{e}{{flex-shrink:0}}")

L.append("")

# ===== GRID =====
L.append("/* Grid */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'grid':
        L.append(f".{e}{{display:grid}}")
    elif b.startswith('grid-cols-'):
        n = b.replace('grid-cols-','')
        try:
            if n == 'none': L.append(f".{e}{{grid-template-columns:none}}")
            else: L.append(f".{e}{{grid-template-columns:repeat({int(n)},minmax(0,1fr))}}")
        except: pass
    elif b.startswith('col-span-'):
        n = b.replace('col-span-','')
        try:
            if n == 'full': L.append(f".{e}{{grid-column:1 / -1}}")
            else: L.append(f".{e}{{grid-column:span {int(n)} / span {int(n)}}}")
        except: pass
    elif b.startswith('gap-') and not b.startswith('gap-x') and not b.startswith('gap-y'):
        v = sv(b[4:])
        L.append(f".{e}{{gap:{v}}}")
    elif b.startswith('gap-x-'):
        v = sv(b[6:])
        L.append(f".{e}{{column-gap:{v}}}")
    elif b.startswith('gap-y-'):
        v = sv(b[6:])
        L.append(f".{e}{{row-gap:{v}}}")

L.append("")

# ===== SIZING =====
L.append("/* Sizing */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b.startswith('w-') and not b.startswith('min-w') and not b.startswith('max-w'):
        v = b[2:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{width:{sv_val}}}")
        elif '/' in v: L.append(f".{e}{{width:{sv(v)}}}")
        elif v == 'auto': L.append(f".{e}{{width:auto}}")
        elif v == 'full': L.append(f".{e}{{width:100%}}")
        elif v == 'screen': L.append(f".{e}{{width:100vw}}")
        elif v == 'fit': L.append(f".{e}{{width:fit-content}}")
        elif v == 'max': L.append(f".{e}{{width:max-content}}")
        elif v == 'min': L.append(f".{e}{{width:min-content}}")
        else: L.append(f".{e}{{width:{sv(v)}}}")
    elif b.startswith('h-') and not b.startswith('min-h') and not b.startswith('max-h'):
        v = b[2:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{height:{sv_val}}}")
        elif '/' in v: L.append(f".{e}{{height:{sv(v)}}}")
        elif v == 'auto': L.append(f".{e}{{height:auto}}")
        elif v == 'full': L.append(f".{e}{{height:100%}}")
        elif v == 'screen': L.append(f".{e}{{height:100vh}}")
        elif v == 'fit': L.append(f".{e}{{height:fit-content}}")
        elif v == 'max': L.append(f".{e}{{height:max-content}}")
        elif v == 'min': L.append(f".{e}{{height:min-content}}")
        else: L.append(f".{e}{{height:{sv(v)}}}")
    elif b.startswith('min-w-'):
        v = b[6:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{min-width:{sv_val}}}")
        elif v == '0': L.append(f".{e}{{min-width:0}}")
        elif v == 'full': L.append(f".{e}{{min-width:100%}}")
        else: L.append(f".{e}{{min-width:{sv(v)}}}")
    elif b.startswith('max-w-'):
        v = b[6:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{max-width:{sv_val}}}")
        elif v == 'none': L.append(f".{e}{{max-width:none}}")
        elif v == 'xs': L.append(f".{e}{{max-width:20rem}}")
        elif v == 'sm': L.append(f".{e}{{max-width:24rem}}")
        elif v == 'md': L.append(f".{e}{{max-width:28rem}}")
        elif v == 'lg': L.append(f".{e}{{max-width:32rem}}")
        elif v == 'xl': L.append(f".{e}{{max-width:36rem}}")
        elif v == '2xl': L.append(f".{e}{{max-width:42rem}}")
        elif v == '3xl': L.append(f".{e}{{max-width:48rem}}")
        elif v == '4xl': L.append(f".{e}{{max-width:56rem}}")
        elif v == '5xl': L.append(f".{e}{{max-width:64rem}}")
        elif v == '6xl': L.append(f".{e}{{max-width:72rem}}")
        elif v == '7xl': L.append(f".{e}{{max-width:80rem}}")
        elif v == 'full': L.append(f".{e}{{max-width:100%}}")
        elif v == 'prose': L.append(f".{e}{{max-width:65ch}}")
    elif b.startswith('min-h-'):
        v = b[6:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{min-height:{sv_val}}}")
        elif v == '0': L.append(f".{e}{{min-height:0}}")
        elif v == 'full': L.append(f".{e}{{min-height:100%}}")
        elif v == 'screen': L.append(f".{e}{{min-height:100vh}}")
    elif b.startswith('max-h-'):
        v = b[6:]
        if v.startswith('['): sv_val = v[1:-1]; L.append(f".{e}{{max-height:{sv_val}}}")
        else: L.append(f".{e}{{max-height:{sv(v)}}}")

L.append("")

# ===== SPACING =====
L.append("/* Spacing */")
spacing_props = [
    ('p-',['padding']), ('px-',['padding-left','padding-right']),
    ('py-',['padding-top','padding-bottom']), ('pt-',['padding-top']),
    ('pb-',['padding-bottom']), ('pl-',['padding-left']), ('pr-',['padding-right']),
    ('m-',['margin']), ('mx-',['margin-left','margin-right']),
    ('my-',['margin-top','margin-bottom']), ('mt-',['margin-top']),
    ('mb-',['margin-bottom']), ('ml-',['margin-left']), ('mr-',['margin-right']),
]
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    for prefix, props in spacing_props:
        if b.startswith(prefix):
            v = b[len(prefix):]
            if v.startswith('['): sv_val = v[1:-1]
            else: sv_val = sv(v)
            for p in props:
                L.append(f".{e}{{{p}:{sv_val}}}")
            break

# Space between
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b.startswith('space-y-'):
        v = sv(b[8:])
        L.append(f".{e}> :not([hidden]) ~ :not([hidden]){{--tw-space-y-reverse:0;margin-top:calc({v} * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc({v} * var(--tw-space-y-reverse))}}")
    elif b.startswith('space-x-'):
        v = sv(b[8:])
        L.append(f".{e}> :not([hidden]) ~ :not([hidden]){{--tw-space-x-reverse:0;margin-right:calc({v} * var(--tw-space-x-reverse));margin-left:calc({v} * calc(1 - var(--tw-space-x-reverse)))}}")

# Divide
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'divide-y':
        L.append(f".{e}> :not([hidden]) ~ :not([hidden]){{--tw-divide-y-reverse:0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}}")
    elif b == 'divide-border':
        L.append(f".{e}> :not([hidden]) ~ :not([hidden]){{--tw-divide-y-reverse:0;border-color:rgba(99,102,241,0.15)}}")

L.append("")

# ----- Placeholder -----
L.append("/* Placeholder */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b.startswith('placeholder-'):
        color_cls = b.replace('placeholder-','text-')
        # Just map the color
        if 'gray-500' in b: L.append(f".{e}::placeholder{{color:#6b7280}}")
        elif 'gray-600' in b: L.append(f".{e}::placeholder{{color:#4b5563}}")
        elif 'gray-700' in b: L.append(f".{e}::placeholder{{color:#4b5563;opacity:1}}")

L.append("")

# ===== TYPOGRAPHY =====
L.append("/* Typography */")
ts = {'text-xs':('0.75rem','1.25'),'text-sm':('0.875rem','1.375'),'text-base':('1rem','1.5'),'text-lg':('1.125rem','1.5'),'text-xl':('1.25rem','1.5'),'text-2xl':('1.5rem','1.375'),'text-3xl':('1.875rem','1.25'),'text-4xl':('2.25rem','1.25'),'text-5xl':('3rem','1'),'text-7xl':('4.5rem','1'),'text-[9px]':('9px','1'),'text-[10px]':('10px','1'),'text-[11px]':('11px','1')}
fw = {'font-thin':'100','font-light':'300','font-normal':'400','font-medium':'500','font-semibold':'600','font-bold':'700'}
ta = {'text-left':'left','text-center':'center','text-right':'right'}
tt = {'uppercase':'uppercase','lowercase':'lowercase','capitalize':'capitalize','normal-case':'none'}
td_cls = {'underline':'underline','no-underline':'none','line-through':'line-through'}
tk = {'tracking-tighter':'-0.05em','tracking-tight':'-0.025em','tracking-normal':'0em','tracking-wide':'0.025em','tracking-wider':'0.05em','tracking-widest':'0.1em','tracking-[0.2em]':'0.2em','tracking-[1em]':'1em'}
lh = {'leading-none':'1','leading-tight':'1.25','leading-snug':'1.375','leading-normal':'1.5','leading-relaxed':'1.625','leading-loose':'2','leading-[1.1]':'1.1'}
lc = {'line-clamp-1':('1','1'),'line-clamp-2':('2','2')}

for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b in ts: L.append(f".{e}{{font-size:{ts[b][0]};line-height:{ts[b][1]}}}")
    elif b in fw: L.append(f".{e}{{font-weight:{fw[b]}}}")
    elif b in ta: L.append(f".{e}{{text-align:{ta[b]}}}")
    elif b in tt: L.append(f".{e}{{text-transform:{tt[b]}}}")
    elif b in td_cls: L.append(f".{e}{{text-decoration:{td_cls[b]}}}")
    elif b in tk: L.append(f".{e}{{letter-spacing:{tk[b]}}}")
    elif b in lh: L.append(f".{e}{{line-height:{lh[b]}}}")
    elif b in lc: L.append(f".{e}{{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:{lc[b][0]}}}")
    elif b == 'truncate': L.append(f".{e}{{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}")
    elif b == 'whitespace-nowrap': L.append(f".{e}{{white-space:nowrap}}")
    elif b == 'whitespace-pre-line': L.append(f".{e}{{white-space:pre-line}}")
    elif b == 'break-words': L.append(f".{e}{{overflow-wrap:break-word}}")
    elif b == 'break-all': L.append(f".{e}{{word-break:break-all}}")
    elif b == 'italic': L.append(f".{e}{{font-style:italic}}")
    elif b == 'font-mono': L.append(f".{e}{{font-family:ui-monospace,monospace}}")
    elif b == 'prose': pass  # handled by typography plugin, skip for now
    elif b == 'prose-invert': pass
    elif b == 'prose-sm': pass
    elif b == 'selection:bg-omix-500/30':
        L.append(f".{e}::selection{{background:rgba(99,102,241,0.3)}}")

L.append("")

# ===== COLORS =====
L.append("/* Text Colors */")
tc = {
    'text-white':'#ffffff','text-black':'#000000','text-transparent':'transparent','text-current':'currentColor',
    'text-gray-50':'#f9fafb','text-gray-100':'#f3f4f6','text-gray-200':'#e5e7eb','text-gray-300':'#d1d5db','text-gray-400':'#9ca3af','text-gray-500':'#6b7280','text-gray-600':'#4b5563','text-gray-700':'#374151','text-gray-800':'#1f2937','text-gray-900':'#111827',
    'text-red-300':'#fca5a5','text-red-400':'#f87171','text-red-500':'#ef4444',
    'text-green-400':'#4ade80','text-green-500':'#22c55e',
    'text-emerald-400':'#34d399','text-emerald-500':'#10b981',
    'text-yellow-400':'#facc15','text-amber-400':'#fbbf24','text-amber-500':'#f59e0b',
    'text-blue-400':'#60a5fa','text-blue-500':'#3b82f6',
    'text-indigo-400':'#818cf8','text-indigo-500':'#6366f1','text-indigo-600':'#4f46e5',
    'text-rose-400':'#fb7185','text-orange-400':'#fb923c','text-pink-400':'#f472b6','text-purple-400':'#c084fc','text-purple-500':'#a855f7',
    'text-omix-300':'#a5b4fc','text-omix-400':'#818cf8','text-omix-500':'#6366f1',
}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b in tc:
        L.append(f".{e}{{color:{tc[b]}}}")

# Background colors with opacity
bc = {
    'bg-white':'#ffffff','bg-black':'#000000','bg-transparent':'transparent',
    'bg-surface':'#0a0a1a','bg-surface-2':'#12122a','bg-surface-3':'#1a1a3e',
    'bg-gray-800':'#1f2937','bg-red-400':'#f87171','bg-omix-400':'#818cf8','bg-omix-500':'#6366f1',
}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    base, op = parse_opacity(b)
    
    if base in bc:
        color = bc[base]
        if op is not None and color.startswith('#'):
            L.append(f".{e}{{background-color:{hex2rgba(color,op)}}}")
        else:
            L.append(f".{e}{{background-color:{color}}}")
    
    # Arbitrary colors
    if base == 'bg-[#0A0A0B]':
        L.append(f".{e}{{background-color:#0A0A0B}}")
    elif base == 'bg-[#0A0A0B]/80':
        L.append(f".{e}{{background-color:rgba(10,10,11,0.8)}}")
    elif base.startswith('bg-white/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(255,255,255,{op2})}}")
        except: pass
    elif base.startswith('bg-surface/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:{hex2rgba('#0a0a1a',op2)}}}")
        except: pass
    elif base.startswith('bg-surface-2/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:{hex2rgba('#12122a',op2)}}}")
        except: pass
    elif base.startswith('bg-black/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(0,0,0,{op2})}}")
        except: pass
    elif base.startswith('bg-white/[0.'):
        # Arbitrary opacity like bg-white/[0.01]
        pass  # handled above
    elif base.startswith('bg-omix-') and '/' in base:
        base_color = base.split('/')[0]
        try: op2 = int(base.split('/')[1])/100
        except: op2 = None
        color_map = {'bg-omix-500':'#6366f1','bg-omix-400':'#818cf8'}
        if op2 and base_color in color_map:
            L.append(f".{e}{{background-color:{hex2rgba(color_map[base_color],op2)}}}")
    elif base.startswith('bg-emerald-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(16,185,129,{op2})}}")
        except: pass
    elif base.startswith('bg-amber-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(245,158,11,{op2})}}")
        except: pass
    elif base.startswith('bg-blue-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(59,130,246,{op2})}}")
        except: pass
    elif base.startswith('bg-indigo-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(99,102,241,{op2})}}")
        except: pass
    elif base.startswith('bg-purple-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(168,85,247,{op2})}}")
        except: pass
    elif base.startswith('bg-red-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(239,68,68,{op2})}}")
        except: pass
    elif base.startswith('bg-rose-500/'):
        try: op2 = int(base.split('/')[1])/100; L.append(f".{e}{{background-color:rgba(244,63,94,{op2})}}")
        except: pass

# Gradients
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'bg-gradient-to-r':
        L.append(f".{e}{{background-image:linear-gradient(to right,var(--tw-gradient-stops))}}")
    elif b == 'bg-gradient-to-br':
        L.append(f".{e}{{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}}")
    elif b == 'bg-gradient-to-b':
        L.append(f".{e}{{background-image:linear-gradient(to bottom,var(--tw-gradient-stops))}}")
    elif b.startswith('from-'):
        base2, op2 = parse_opacity(b[5:])
        gc = {'white':'#ffffff','indigo-500':'#6366f1','indigo-500/5':('rgba(99,102,241,0.05)'),'omix-400':'#818cf8','omix-500':'#6366f1','omix-600':'#4f46e5','omix-500/10':('rgba(99,102,241,0.1)'),'omix-600/20':('rgba(79,70,229,0.2)'),'omix-600/30':('rgba(79,70,229,0.3)'),'emerald-500':'#10b981','amber-500/10':('rgba(245,158,11,0.1)'),'surface':'#0a0a1a','white/[0.03]':('rgba(255,255,255,0.03)')}
        if isinstance(gc.get(base2), tuple) or base2 in gc:
            color_val = gc.get(base2, base2)
            if not isinstance(color_val, str): color_val = color_val[0]
            L.append(f".{e}{{--tw-gradient-from:{color_val};--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to,transparent)}}")
    elif b.startswith('to-'):
        base2, op2 = parse_opacity(b[3:])
        gc = {'transparent':'transparent','omix-400':'#818cf8','omix-500':'#6366f1','omix-600':'#4f46e5','omix-700':'#4338ca','to-omix-500/10':('rgba(99,102,241,0.1)'),'omix-500/20':('rgba(99,102,241,0.2)'),'indigo-700':'#4338ca','emerald-700':'#047857','surface-2':'#12122a'}
        color_val = gc.get(base2, base2)
        if not isinstance(color_val, str): color_val = color_val[0]
        L.append(f".{e}{{--tw-gradient-to:{color_val}}}")

L.append("")
L.append("/* Borders */")
# Border width
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'border':
        L.append(f".{e}{{border:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-0':
        L.append(f".{e}{{border-width:0}}")
    elif b == 'border-2':
        L.append(f".{e}{{border-width:2px;border-style:solid}}")
    elif b == 'border-t':
        L.append(f".{e}{{border-top:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-b':
        L.append(f".{e}{{border-bottom:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-l':
        L.append(f".{e}{{border-left:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-r':
        L.append(f".{e}{{border-right:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-y':
        L.append(f".{e}{{border-top:1px solid rgba(99,102,241,0.15);border-bottom:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-transparent':
        L.append(f".{e}{{border-color:transparent}}")
    elif b.startswith('border-') and '/' in base and not b.startswith('border-'):
        pass

# Border opacity colors
border_op_colors = {
    'border-white': '#ffffff', 'border-border': 'rgba(99,102,241,0.15)',
    'border-omix-500': '#6366f1', 'border-omix-400': '#818cf8',
    'border-emerald-500': '#10b981', 'border-red-500': '#ef4444',
    'border-rose-500': '#f43f5e', 'border-amber-500': '#f59e0b',
    'border-blue-500': '#3b82f6', 'border-indigo-500': '#6366f1',
    'border-gray-200': '#e5e7eb', 'border-gray-300': '#d1d5db',
    'border-border': 'rgba(99,102,241,0.15)', 'border-white': '#fff',
}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b.startswith('border-') and '/' in b:
        parts = b.rsplit('/', 1)
        bc_name = parts[0]
        try: op = int(parts[1]) / 100
        except: continue
        if bc_name in border_op_colors:
            base_c = border_op_colors[bc_name]
            if base_c.startswith('#'):
                rgba = hex2rgba(base_c, op)
            else:
                rgba = base_c  # already rgba
            L.append(f".{e}{{border:1px solid {rgba}}}")
    elif b == 'border-border':
        L.append(f".{e}{{border:1px solid rgba(99,102,241,0.15)}}")
    elif b == 'border-border/50':
        L.append(f".{e}{{border:1px solid rgba(99,102,241,0.075)}}")
    elif b == 'border-border/80':
        L.append(f".{e}{{border:1px solid rgba(99,102,241,0.12)}}")
    elif b == 'border-t-omix-500':
        L.append(f".{e}{{border-top:1px solid #6366f1}}")
    elif b == 'border-t-white':
        L.append(f".{e}{{border-top:1px solid #ffffff}}")

# Border radius
BR = {'rounded-none':'0','rounded-sm':'0.125rem','rounded':'0.25rem','rounded-md':'0.375rem','rounded-lg':'0.5rem','rounded-xl':'0.75rem','rounded-2xl':'1rem','rounded-3xl':'1.5rem','rounded-full':'9999px','rounded-[2rem]':'2rem','rounded-[3rem]':'3rem'}
BRTL = {'rounded-tl-md':'top-left'}
BRRF = {'rounded-r-full':'right'}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b in BR:
        L.append(f".{e}{{border-radius:{BR[b]}}}")
    elif b == 'rounded-tl-md':
        L.append(f".{e}{{border-top-left-radius:0.375rem}}")
    elif b == 'rounded-r-full':
        L.append(f".{e}{{border-top-right-radius:9999px;border-bottom-right-radius:9999px}}")

# Ring
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'ring-1':
        L.append(f".{e}{{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:rgba(99,102,241,0.05)}}")
    elif b == 'ring-2':
        L.append(f".{e}{{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-ring-color:rgba(99,102,241,0.1)}}")
    elif b == 'ring-white/5':
        L.append(f".{e}{{box-shadow:0 0 0 1px rgba(255,255,255,0.05)}}")
    elif b == 'ring-white/10':
        L.append(f".{e}{{box-shadow:0 0 0 1px rgba(255,255,255,0.1)}}")
    elif b == 'ring-omix-500':
        L.append(f".{e}{{box-shadow:0 0 0 2px #6366f1}}")
    elif b == 'ring-omix-500/20':
        L.append(f".{e}{{box-shadow:0 0 0 2px rgba(99,102,241,0.2)}}")
    elif b == 'ring-omix-500/50':
        L.append(f".{e}{{box-shadow:0 0 0 2px rgba(99,102,241,0.5)}}")
    elif b == 'ring-indigo-500':
        L.append(f".{e}{{box-shadow:0 0 0 2px #6366f1}}")

L.append("")
L.append("/* Effects */")
shadows = {'shadow-sm':'0 1px 2px rgba(0,0,0,0.05)','shadow':'0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)','shadow-lg':'0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)','shadow-xl':'0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)','shadow-2xl':'0 25px 50px -12px rgba(0,0,0,0.25)','shadow-inner':'inset 0 2px 4px 0 rgba(0,0,0,0.06)','shadow-none':'none'}
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b in shadows:
        L.append(f".{e}{{box-shadow:{shadows[b]}}}")
    elif b == 'shadow-omix-500/20':
        L.append(f".{e}{{box-shadow:0 10px 15px -3px rgba(99,102,241,0.2),0 4px 6px -2px rgba(99,102,241,0.1)}}")
    elif b == 'shadow-omix-500/25':
        L.append(f".{e}{{box-shadow:0 10px 15px -3px rgba(99,102,241,0.25),0 4px 6px -2px rgba(99,102,241,0.1)}}")
    elif b.startswith('blur-'):
        v = b[5:]
        if v.startswith('['): L.append(f".{e}{{filter:blur({v[1:-1]})}}")
        elif v == 'sm': L.append(f".{e}{{filter:blur(4px)}}")
        elif v == 'md': L.append(f".{e}{{filter:blur(8px)}}")
        elif v == 'lg': L.append(f".{e}{{filter:blur(12px)}}")
        elif v == 'xl': L.append(f".{e}{{filter:blur(16px)}}")
        elif v == '2xl': L.append(f".{e}{{filter:blur(24px)}}")
    elif b.startswith('backdrop-blur-'):
        v = b[13:]
        if v == 'sm': L.append(f".{e}{{backdrop-filter:blur(4px)}}")
        elif v == 'md': L.append(f".{e}{{backdrop-filter:blur(8px)}}")
        elif v == 'lg': L.append(f".{e}{{backdrop-filter:blur(12px)}}")
        elif v == 'xl': L.append(f".{e}{{backdrop-filter:blur(16px)}}")
        elif v == '2xl': L.append(f".{e}{{backdrop-filter:blur(24px)}}")
    elif b.startswith('opacity-'):
        try: L.append(f".{e}{{opacity:{int(b.split('-')[1])/100}}}")
        except: pass

L.append("")
L.append("/* Transitions & Animation */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'transition-all' or b == 'transition':
        L.append(f".{e}{{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}}")
    elif b == 'transition-colors':
        L.append(f".{e}{{transition-property:color,background-color,border-color;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}}")
    elif b == 'transition-transform':
        L.append(f".{e}{{transition-property:transform;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}}")
    elif b == 'transition-opacity':
        L.append(f".{e}{{transition-property:opacity;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}}")
    elif b == 'duration-300':
        L.append(f".{e}{{transition-duration:300ms}}")
    elif b == 'duration-1000':
        L.append(f".{e}{{transition-duration:1000ms}}")
    elif b == 'animate-pulse':
        L.append(f".{e}{{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}}")
    elif b == 'animate-spin':
        L.append(f".{e}{{animation:spin 1s linear infinite}}")
    elif b == 'fill-current':
        L.append(f".{e}{{fill:currentColor}}")

L.append("")
L.append("/* Transforms */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == '-rotate-90':
        L.append(f".{e}{{transform:rotate(-90deg)}}")
    elif b == '-translate-x-1/2':
        L.append(f".{e}{{transform:translateX(-50%)}}")
    elif b == '-translate-y-1/2':
        L.append(f".{e}{{transform:translateY(-50%)}}")
    elif b == 'translate-x-1':
        L.append(f".{e}{{transform:translateX(0.25rem)}}")

L.append("")
L.append("/* Interactivity */")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'cursor-pointer': L.append(f".{e}{{cursor:pointer}}")
    elif b == 'cursor-not-allowed': L.append(f".{e}}{{cursor:not-allowed}}")
    elif b == 'pointer-events-none': L.append(f".{e}{{pointer-events:none}}")
    elif b == 'resize-none': L.append(f".{e}{{resize:none}}")
    elif b == 'outline-none': L.append(f".{e}{{outline:2px solid transparent;outline-offset:2px}}")
    elif b == 'focus:outline-none': L.append(f".{e}:focus{{outline:2px solid transparent;outline-offset:2px}}")
    elif b == 'focus:ring-1': L.append(f".{e}:focus{{box-shadow:0 0 0 1px #6366f1}}")
    elif b == 'focus:ring-2': L.append(f".{e}:focus{{box-shadow:0 0 0 2px #6366f1}}")
    elif b == 'focus:ring-indigo-500': L.append(f".{e}:focus{{box-shadow:0 0 0 2px #6366f1}}")
    elif b == 'focus:ring-omix-500': L.append(f".{e}:focus{{box-shadow:0 0 0 2px #6366f1}}")
    elif b == 'focus:ring-omix-500/50': L.append(f".{e}:focus{{box-shadow:0 0 0 2px rgba(99,102,241,0.5)}}")
    elif b == 'focus:border-indigo-500': L.append(f".{e}:focus{{border-color:#6366f1}}")
    elif b == 'disabled:opacity-40': L.append(f".{e}:disabled{{opacity:0.4}}")
    elif b == 'disabled:opacity-50': L.append(f".{e}:disabled{{opacity:0.5}}")
    elif b == 'disabled:cursor-not-allowed': L.append(f".{e}:disabled{{cursor:not-allowed}}")

# Group hover
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if b == 'group':
        pass  # no CSS needed
    elif c == 'group-hover:text-indigo-400':
        L.append(f".group:hover .{e}{{color:#818cf8}}")
    elif c == 'group-hover:ring-omix-500/20':
        L.append(f".group:hover .{e}{{box-shadow:0 0 0 2px rgba(99,102,241,0.2)}}")
    elif c == 'group-hover:translate-x-1':
        L.append(f".group:hover .{e}{{transform:translateX(0.25rem)}}")

L.append("")
L.append("/*== CUSTOM CLASSES ==*/")
L.append(".glass{background:rgba(18,18,42,0.6);backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.12)}")
L.append(".glass-hover:hover{background:rgba(18,18,42,0.8);border-color:rgba(99,102,241,0.25)}")
L.append(".gradient-text{background:linear-gradient(135deg,#818cf8,#6366f1,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}")
L.append(".glow{box-shadow:0 0 30px rgba(99,102,241,0.15),0 0 60px rgba(99,102,241,0.05)}")
L.append(".glow-sm{box-shadow:0 0 15px rgba(99,102,241,0.1)}")
L.append(".hover:glow:hover{box-shadow:0 0 30px rgba(99,102,241,0.15),0 0 60px rgba(99,102,241,0.05)}")
L.append(".hover:glow-sm:hover{box-shadow:0 0 15px rgba(99,102,241,0.1)}")
L.append(".input-glow:focus{box-shadow:0 0 0 1px rgba(99,102,241,0.3),0 0 20px rgba(99,102,241,0.1)}")

L.append("")
L.append("/* Keyframes */")
L.append("@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}")
L.append("@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}")

# Responsive variants - simplified media queries
L.append("")
L.append("/* === Responsive === */")
L.append("@media(min-width:640px){")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if c.startswith('sm:'):
        if b == 'flex': L.append(f".{e}{{display:flex}}")
        elif b == 'hidden': L.append(f".{e}{{display:none}}")
        elif b == 'flex-row': L.append(f".{e}{{flex-direction:row}}")
        elif b == 'items-center': L.append(f".{e}{{align-items:center}}")
        elif b == 'grid-cols-2': L.append(f".{e}{{grid-template-columns:repeat(2,minmax(0,1fr))}}")
        elif b == 'px-6': L.append(f".{e}{{padding-left:1.5rem;padding-right:1.5rem}}")
        elif b == 'w-auto': L.append(f".{e}{{width:auto}}")
L.append("}")

L.append("@media(min-width:768px){")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if c.startswith('md:'):
        if b == 'block': L.append(f".{e}{{display:block}}")
        elif b == 'flex': L.append(f".{e}{{display:flex}}")
        elif b == 'hidden': L.append(f".{e}{{display:none}}")
        elif b == 'flex-row': L.append(f".{e}{{flex-direction:row}}")
        elif b == 'items-center': L.append(f".{e}{{align-items:center}}")
        elif b == 'justify-between': L.append(f".{e}{{justify-content:space-between}}")
        elif b == 'gap-12': L.append(f".{e}{{gap:3rem}}")
        elif b == 'grid-cols-2': L.append(f".{e}{{grid-template-columns:repeat(2,minmax(0,1fr))}}")
        elif b == 'grid-cols-3': L.append(f".{e}{{grid-template-columns:repeat(3,minmax(0,1fr))}}")
        elif b == 'grid-cols-4': L.append(f".{e}{{grid-template-columns:repeat(4,minmax(0,1fr))}}")
        elif b == 'col-span-2': L.append(f".{e}{{grid-column:span 2 / span 2}}")
        elif b == 'text-4xl': L.append(f".{e}{{font-size:2.25rem;line-height:1.25}}")
        elif b == 'w-auto': L.append(f".{e}{{width:auto}}")
L.append("}")

L.append("@media(min-width:1024px){")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if c.startswith('lg:'):
        if b == 'flex': L.append(f".{e}{{display:flex}}")
        elif b == 'hidden': L.append(f".{e}{{display:none}}")
        elif b == 'flex-row': L.append(f".{e}{{flex-direction:row}}")
        elif b == 'flex-none': L.append(f".{e}{{flex:none}}")
        elif b == 'items-center': L.append(f".{e}{{align-items:center}}")
        elif b == 'ml-64': L.append(f".{e}{{margin-left:16rem}}")
        elif b == 'px-6': L.append(f".{e}{{padding-left:1.5rem;padding-right:1.5rem}}")
        elif b == 'px-8': L.append(f".{e}{{padding-left:2rem;padding-right:2rem}}")
        elif b == 'py-20': L.append(f".{e}{{padding-top:5rem;padding-bottom:5rem}}")
        elif b == 'pt-56': L.append(f".{e}{{padding-top:14rem}}")
        elif b == 'pb-32': L.append(f".{e}{{padding-bottom:8rem}}")
        elif b == 'p-6': L.append(f".{e}{{padding:1.5rem}}")
        elif b == 'p-20': L.append(f".{e}{{padding:5rem}}")
        elif b == 'grid-cols-2': L.append(f".{e}{{grid-template-columns:repeat(2,minmax(0,1fr))}}")
        elif b == 'grid-cols-3': L.append(f".{e}{{grid-template-columns:repeat(3,minmax(0,1fr))}}")
        elif b == 'grid-cols-4': L.append(f".{e}{{grid-template-columns:repeat(4,minmax(0,1fr))}}")
        elif b == 'grid-cols-5': L.append(f".{e}{{grid-template-columns:repeat(5,minmax(0,1fr))}}")
        elif b == 'text-7xl': L.append(f".{e}{{font-size:4.5rem;line-height:1}}")
        elif b == 'w-auto': L.append(f".{e}{{width:auto}}")
L.append("}")

L.append("@media(min-width:1280px){")
for c in sorted(classes_set):
    e = esc(c)
    b = c.split(':')[-1]
    if c.startswith('xl:'):
        if b == 'grid-cols-6': L.append(f".{e}{{grid-template-columns:repeat(6,minmax(0,1fr))}}")
L.append("}")

# Write the CSS file
css_content = '\n'.join(L)
output_path = '/home/oliver/omix-sms/src/app/omix-utilities.css'
with open(output_path, 'w') as f:
    f.write(css_content)

print(f"Wrote {len(L)} lines ({len(css_content)} bytes) to {output_path}")
