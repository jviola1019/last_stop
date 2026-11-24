"""Original vector locomotive silhouettes. Deliberately retain the hand-painted original as default."""
from pathlib import Path
from random import Random
root=Path(__file__).resolve().parents[1]/'assets'
styles=[('express','#55706a','#d3af71','M14 171 L14 91 Q16 55 65 55 H211 Q260 57 296 130 L305 171Z', 'M47 72H105V116H47Z M115 72H153V116H115Z',False),('diesel','#895b4d','#e2c287','M15 171V100H29V53H120V85H279L307 108V171Z','M43 65H73V98H43Z M81 65H109V98H81Z',False),('electric','#4a647c','#d9ca97','M12 171V81L45 51H263L304 87V171Z','M25 84L49 61H80V109H25Z M246 61H263L291 86V109H246Z',True),('mountain','#64724d','#d6b175','M12 171V75H86V58H119V85H223V65H247V87H289L307 125V171Z','M28 84H69V120H28Z M122 101H150V127H122Z',False),('artdeco','#814c57','#e6c88d','M12 171V115Q22 53 89 42H205Q266 43 308 151V171Z','M30 106Q47 69 78 65H128V106Z M137 65H190V106H137Z',False),('alpine','#526e79','#e0d3a2','M12 171V103L35 61H105L118 85H248L300 64V171Z','M29 102L49 73H91V112H29Z M263 90L289 74V111H263Z',True),('horizon','#647976','#e8dcaf','M12 171V111Q20 70 69 58H218Q265 60 309 133L307 171Z','M35 102Q52 76 80 72H211Q249 75 270 104Z',True)]
for name,body,trim,shape,windows,pantograph in styles:
    modern=name in ('diesel','electric','alpine','horizon')
    axles=(54,99,220,264) if modern else (73,143,252)
    radius=17 if modern else 22
    wheels=''.join(f'<circle cx="{x}" cy="196" r="{radius}" fill="#172027" stroke="#bfa987" stroke-width="2.5"/><circle cx="{x}" cy="196" r="{radius-5}" fill="url(#wheel)" stroke="#262830" stroke-width="2"/>' for x in axles)
    vents=''.join(f'<path d="M{x} 122v22" stroke="#292d31" opacity=".7" stroke-width="2"/>' for x in range(170,241,8))
    pant='<path d="M147 52l23 -35 28 35m-42-20h34m-30-15h24" fill="none" stroke="#b9b19a" stroke-width="4"/>' if pantograph else '<path d="M159 55v-12h33v12" fill="#3e3a36" stroke="#bfa879" stroke-width="2"/>'
    label={'express':'PACIFIC','diesel':'CONTINENTAL','electric':'LUMEN','horizon':'HORIZON','mountain':'MOUNTAINEER','artdeco':'SILVER ARROW','alpine':'ALPINE'}[name]
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="318" height="226" viewBox="0 0 318 226"><defs><linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f2d7aa"/><stop offset=".07" stop-color="{trim}"/><stop offset=".19" stop-color="{body}"/><stop offset=".42" stop-color="{body}"/><stop offset=".68" stop-color="#343e42"/><stop offset=".84" stop-color="{body}"/><stop offset="1" stop-color="#17242e"/></linearGradient><linearGradient id="wheel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c3a785"/><stop offset=".48" stop-color="#45484a"/><stop offset="1" stop-color="#252d32"/></linearGradient><linearGradient id="shine" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f1cb8f" stop-opacity=".38"/><stop offset=".3" stop-color="#f1cb8f" stop-opacity=".08"/><stop offset=".7" stop-color="#112430" stop-opacity=".02"/><stop offset="1" stop-color="#112430" stop-opacity=".55"/></linearGradient><clipPath id="shell"><path d="{shape}"/></clipPath><clipPath id="glassclip"><path d="{windows}"/></clipPath><linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d1e3dd"/><stop offset=".5" stop-color="#708f9e"/><stop offset="1" stop-color="#253d4b"/></linearGradient></defs><ellipse cx="160" cy="218" rx="150" ry="6" fill="#181e23" opacity=".4"/>{pant}<path d="{shape}" fill="url(#body)" stroke="#342c2c" stroke-width="3"/><path d="{windows}" fill="url(#glass)" stroke="{trim}" stroke-width="3"/><path d="M17 150h280M17 157h286" stroke="{trim}" stroke-width="3" fill="none"/>{vents}<rect x="17" y="169" width="284" height="16" rx="4" fill="#303034" stroke="#ad8d59" stroke-width="2"/><rect x="91" y="125" width="127" height="19" rx="3" fill="#282d31" stroke="{trim}"/><text x="154" y="138" font-family="Georgia,serif" font-size="10" letter-spacing="2" fill="#f8e5ba" text-anchor="middle">{label}</text><circle cx="294" cy="132" r="7" fill="#fff2b9" stroke="{trim}" stroke-width="3"/>{wheels}<path d="M9 180h-8m310 0h7" stroke="#554637" stroke-width="5"/></svg>'''
    # Distinct mechanical details and layered shading, drawn as authored rail-art rather than UI glyphs.
    rng=Random(name);detail=[]
    # Three-dimensional shell lighting and window reflections, clipped to real body geometry.
    body_detail=[f'<g clip-path="url(#shell)"><rect x="8" y="42" width="302" height="130" fill="url(#shine)"/><path d="M7 59Q154 43 315 75" stroke="#ffe0ac" stroke-width="2.5" fill="none" opacity=".6"/><path d="M5 166H316" stroke="#101d2a" stroke-width="8" opacity=".48"/>']
    for i in range(95):
        xx=rng.randint(15,302);yy=rng.randint(55,169);body_detail.append(f'<path d="M{xx} {yy}h{rng.randint(1,5)}" stroke="{trim if i%4 else "#1c2833"}" stroke-width="1" opacity="{rng.uniform(.08,.19):.2f}"/>')
    body_detail.append('</g>')
    svg=svg.replace(f'<path d="{windows}" fill="url(#glass)"', ''.join(body_detail)+f'<path d="{windows}" fill="url(#glass)"',1)
    glass_detail='<g clip-path="url(#glassclip)"><path d="M20 65L95 65 35 126 7 126Z M126 58L145 58 84 129 66 129Z M200 57L220 57 158 129 137 129Z M282 66L295 66 249 119 232 119Z" fill="#f3e7cc" opacity=".29"/><path d="M0 117H318" stroke="#152630" stroke-width="5" opacity=".7"/><path d="M0 84H318" stroke="#f0d4ad" stroke-width="1" opacity=".35"/></g>'
    svg=svg.replace('<path d="M17 150',glass_detail+'<path d="M17 150',1)
    for xx in range(25,296,24):
        detail.append(f'<path d="M{xx} 172v8" stroke="#161e28" opacity=".8" stroke-width="1.4"/><path d="M{xx+1} 172v7" stroke="{trim}" opacity=".6" stroke-width="1"/>')
    # Front marker, buffers, couplers, steps and distinct running gear.
    detail.append(f'<path d="M294 131h10" stroke="#f9dba4" stroke-width="2.5"/><circle cx="295" cy="132" r="2.8" fill="#fff6d0"/><path d="M23 168v19h15m242-19v19h-13" fill="none" stroke="#b59b78" stroke-width="2"/>')
    if modern:
        for start in (34,200):
            detail.append(f'<rect x="{start}" y="180" width="85" height="7" rx="2" fill="#252c31" stroke="#bfa884" stroke-width="1.2"/><path d="M{start+8} 188h69" stroke="#8d8069" stroke-width="2"/>')
        detail.append('<rect x="125" y="186" width="68" height="14" rx="3" fill="#333c40" stroke="#847762" stroke-width="1.5"/><path d="M132 191h54m-49 4h44" stroke="#6d7776" stroke-width="1"/>')
    else:
        detail.append('<path d="M50 184L163 184 177 193 56 193Z" fill="#6b665e" stroke="#bca37e" stroke-width="1.5"/>')
    for i in range(75):
        xx=rng.randint(25,280);yy=rng.randint(148,167);detail.append(f'<path d="M{xx} {yy}h{rng.randint(2,8)}" stroke="{trim if i%3 else "#2d3036"}" opacity=".28" stroke-width="1"/>')
    for x in axles:
        for i in range(8):
            import math
            ang=i*math.pi/4;detail.append(f'<path d="M{x} 196L{x+math.cos(ang)*(radius-7):.1f} {196+math.sin(ang)*(radius-7):.1f}" stroke="#b3a18b" stroke-width="1.8"/>')
        detail.append(f'<circle cx="{x}" cy="196" r="5" fill="#cfb083" stroke="#2a282b" stroke-width="2"/>')
    if not modern:detail.append('<path d="M44 191H171" stroke="#977f63" stroke-width="4"/><path d="M44 190H171" stroke="#e0c194" stroke-width="1.2"/>')
    detail.append(f'<path d="M20 173h280M31 180h260" stroke="{trim}" opacity=".55" stroke-width="1.4"/>')
    for x in range(24,296,18):detail.append(f'<circle cx="{x}" cy="165" r="1.2" fill="{trim}" opacity=".9"/>')
    for x in [23,281]:detail.append(f'<path d="M{x} 170v12m-5 0h10" stroke="#d1b389" stroke-width="2"/>')
    if name in ('diesel','mountain','alpine'):
        for x in [172,204,235]:detail.append(f'<rect x="{x}" y="94" width="26" height="25" rx="1" fill="#353c41" stroke="{trim}" stroke-width="1.2"/><path d="M{x+4} 101h18m-18 5h18m-18 5h18" stroke="#788589" stroke-width="1.3"/>')
    if name in ('express','artdeco','horizon'):
        detail.append(f'<path d="M157 70Q247 64 291 126" stroke="{trim}" stroke-width="2" opacity=".8" fill="none"/><path d="M160 77Q246 74 285 124" stroke="#e0d2aa" stroke-width="1" opacity=".55" fill="none"/>')
    if name=='electric':
        detail.append(f'<path d="M87 77h144M90 84h138" stroke="{trim}" opacity=".75" stroke-width="2"/>')
    svg=svg.replace('</svg>',''.join(detail)+'</svg>')
    (root/f'engine-{name}.svg').write_text(svg)
