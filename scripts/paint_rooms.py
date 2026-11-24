"""Illustrated cutaway micro-interiors for three previously duplicated wagons."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]/'assets'
rooms={
 'library':{'wall':'#644c5e','floor':'#745047','lamp':'#f6d39b','deco':'#9b8cab'},
 'diner':{'wall':'#95634f','floor':'#5b3a36','lamp':'#f9d699','deco':'#b47b60'},
 'workshop':{'wall':'#526575','floor':'#514a43','lamp':'#fae09f','deco':'#8eaaaf'}
}
for name,d in rooms.items():
 parts=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="276" height="226" viewBox="0 0 276 226"><defs><linearGradient id="room" x2="0" y2="1"><stop stop-color="{d['wall']}"/><stop offset="1" stop-color="#2c2838"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="{d['floor']}"/><stop offset="1" stop-color="#2c242c"/></linearGradient></defs>''',
 '<rect x="6" y="22" width="264" height="170" rx="17" fill="#16242c" stroke="#dcb27e" stroke-width="5"/><path d="M15 37Q138 9 261 37V170H15Z" fill="url(#room)"/><path d="M16 152H260v39H16Z" fill="url(#floor)"/>',
 '<path d="M28 31H248M24 47H252" stroke="#efc382" stroke-opacity=".56" stroke-width="3"/><path d="M20 184h236" stroke="#e8b67c" stroke-width="5"/>',
 '<path d="M32 35v24m102-24v24m104-24v24" stroke="#e6bc82" stroke-width="2"/><circle cx="32" cy="63" r="6" fill="#ffe9af"/><circle cx="134" cy="63" r="6" fill="#ffe9af"/><circle cx="238" cy="63" r="6" fill="#ffe9af"/>',
 '<path d="M12 193h252" stroke="#33313b" stroke-width="13"/><path d="M24 207h230" stroke="#d8a25f" stroke-width="5"/><circle cx="53" cy="207" r="12" fill="#35303a" stroke="#dba965" stroke-width="5"/><circle cx="220" cy="207" r="12" fill="#35303a" stroke="#dba965" stroke-width="5"/>']
 if name=='library':
  parts+=['<rect x="30" y="73" width="70" height="83" rx="3" fill="#463844" stroke="#c39463" stroke-width="4"/><rect x="177" y="73" width="65" height="84" fill="#453643" stroke="#c39463" stroke-width="4"/>']
  for x0 in (38,184):
   for row in range(3):
    for i in range(6):
     x=x0+i*9;y=78+row*26
     parts.append(f'<rect x="{x}" y="{y}" width="{7+(i%3)}" height="{14+(i%4)*2}" fill="{["#d69c72","#8aa7a0","#c9b17c","#b18eaa"][i%4]}" stroke="#372d37" stroke-width=".7"/>')
  parts+=['<path d="M111 136h58v9h-58z" fill="#bb936b"/><path d="M120 145v25m40-25v25" stroke="#cda571" stroke-width="5"/><path d="M126 130h30l8 8h-46Z" fill="#f5dcac"/><circle cx="139" cy="114" r="11" fill="#e4b594"/><path d="M128 127q11-5 21 0v30h-21" fill="#9aa5bb"/>']
 elif name=='diner':
  parts+=['<path d="M23 91h79v64H23Z" fill="#76474c" stroke="#cda071" stroke-width="3"/><path d="M174 91h78v64h-78Z" fill="#774547" stroke="#cda071" stroke-width="3"/>',
  '<path d="M107 113h60v10h-60Z" fill="#f1d09e"/><path d="M115 125v35m45-35v35" stroke="#bd845e" stroke-width="5"/><ellipse cx="137" cy="110" rx="13" ry="7" fill="#e1bb8e"/>',
  '<circle cx="79" cy="98" r="13" fill="#eab893"/><path d="M65 112h30l9 38H56Z" fill="#64838d"/><circle cx="206" cy="99" r="13" fill="#e1ab84"/><path d="M192 112h29v38h-35Z" fill="#d49875"/>',
  '<path d="M112 85q25-22 49 0" fill="none" stroke="#f6d195" stroke-width="3"/><circle cx="138" cy="85" r="6" fill="#fcddb8"/>']
 else:
  parts+=['<rect x="23" y="78" width="62" height="83" rx="3" fill="#34485a" stroke="#d6a971" stroke-width="3"/><path d="M29 85h51v9H29m0 12h51m-51 12h51" stroke="#859c99" stroke-width="4"/>',
  '<rect x="178" y="80" width="70" height="80" fill="#43566a" stroke="#cda16e" stroke-width="3"/>']
  for i in range(5):
   parts.append(f'<circle cx="{187+i*12}" cy="{96+(i%2)*22}" r="{5+i%3}" fill="#ccac7b" stroke="#506477" stroke-width="3"/>')
  parts+=['<path d="M88 140h86v9H88Z" fill="#d3a36e"/><path d="M96 149v27m69-27v27" stroke="#bd875e" stroke-width="5"/><path d="M114 131l24-30 22 30Z" fill="#9bb7bd" stroke="#e4c596" stroke-width="3"/><circle cx="131" cy="115" r="11" fill="#e1b68e"/><path d="M118 126h27v31h-27Z" fill="#8baba5"/>']
 parts+=['<rect x="19" y="36" width="238" height="7" fill="#e7bc84" opacity=".6"/><path d="M0 204H276" stroke="#463a39" stroke-width="9"/></svg>']
 out=root/f'car-{name}.svg';out.write_text('\n'.join(parts));print(out.name,out.stat().st_size)
