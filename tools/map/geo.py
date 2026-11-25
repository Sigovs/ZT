import json,math
from shapely.geometry import Polygon,MultiPolygon,LineString,MultiLineString,box
from shapely.ops import unary_union,linemerge
import sys
# python3 geo.py <folder with us.json, world.json, counties.json> <output southeast.json>
T=sys.argv[1].rstrip('/')+'/'; OUT=sys.argv[2]
CX,CY=585,445
def topo(f):
    t=json.load(open(T+f)); tr=t.get('transform'); arcs=[]
    for a in t['arcs']:
        if tr:
            x=y=0;o=[]
            for d in a: x+=d[0];y+=d[1];o.append((x*tr['scale'][0]+tr['translate'][0],y*tr['scale'][1]+tr['translate'][1]))
        else: o=[tuple(p[:2]) for p in a]
        arcs.append(o)
    return t,arcs
def ring(arcs,r):
    o=[]
    for i in r:
        p=arcs[i] if i>=0 else arcs[~i][::-1]; o+=p if not o else p[1:]
    return o
def polys(arcs,g):
    P=g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]
    return [[ring(arcs,r) for r in p] for p in P]
r=math.radians;s0=math.sin(r(29.5));n=(s0+math.sin(r(45.5)))/2;c=1+s0*(2*n-s0);r0=math.sqrt(c)/n
def raw(l,p):
    q=math.sqrt(max(0,c-2*n*math.sin(p)))/n; return q*math.sin(l*n), r0-q*math.cos(l*n)
cx,cy=raw(r(-0.6),r(38.7))
def proj(lon,lat):
    x,y=raw(r(lon+96),r(lat)); return 487.5+1300*(x-cx), 305-1300*(y-cy)
W=box(-60,150,1180,980)
t,arcs=topo('us.json')
ZT={'48':'TX','01':'AL','13':'GA','12':'FL','37':'NC'}
states={};ctx=[]
for g in t['objects']['states']['geometries']:
    if str(g['id']).zfill(2) in ('02','15','72'): continue
    ps=[Polygon(p[0],p[1:]).buffer(0) for p in polys(arcs,g) if len(p[0])>3]
    m=unary_union(ps)
    if not m.intersects(W): continue
    k=ZT.get(str(g['id']).zfill(2))
    if k: states[k]=m
    else: ctx.append(m)
tw,wa=topo('world.json')
nb=[]
for g in tw['objects']['countries']['geometries']:
    if str(g.get('id')).zfill(3) in ('484','192','044','796','332','214','388','084','320','222','340','558'):
        for p in polys(wa,g):
            if len(p[0])<4: continue
            q=Polygon([proj(*pt) for pt in p[0]]).buffer(0)
            if q.intersects(W): nb.append(q)
land=unary_union(list(states.values())+ctx+nb)
P1=lambda p:[round(p[0]-CX,2),round(p[1]-CY,2)]
def parts(g):
    if g.is_empty: return []
    return list(g.geoms) if hasattr(g,'geoms') else [g]
def flat(line): return [v for p in line.coords for v in P1(p)]
out={'states':{},'ctx':[],'counties':{},'coast':[],'grid':[],'par34':[]}
for k,m in states.items():
    m=m.simplify(.22)
    out['states'][k]={'polys':[[v for p in q.exterior.coords[:-1] for v in P1(p)] for q in parts(m) if q.area>1.2],'c':P1(m.representative_point().coords[0])}
cm=unary_union(ctx+nb).intersection(W)
out['land']=[]
for q in parts(unary_union(ctx+nb).simplify(.3).intersection(W)):
    if q.geom_type=='Polygon' and q.area>1.5: out['land'].append([flat(LineString(q.exterior.coords))[:-2]]+[flat(LineString(i.coords))[:-2] for i in q.interiors if Polygon(i).area>1.5])
# context borders as lines
bl=unary_union([m.boundary for m in ctx+nb]).simplify(.3).intersection(W.buffer(-1))
for q in parts(bl):
    if q.geom_type=='LineString' and q.length>2: out['ctx'].append(flat(q))
for d in (3,7,12.5,19.5,28,38):
    b=land.buffer(d,quad_segs=6).simplify(.45).boundary.intersection(W.buffer(-2))
    out['coast'].append([flat(q) for q in parts(b) if q.geom_type=='LineString' and q.length>14])
# county mesh of the five states: interior borders only
t2,a2=topo('counties.json')
fips={k:v for k,v in ZT.items()}
for f,k in fips.items():
    use={}
    for g in t2['objects']['counties']['geometries']:
        if str(g['id']).zfill(5)[:2]!=f or not g.get('arcs'): continue
        for p in (g['arcs'] if g['type']=='MultiPolygon' else [g['arcs']]):
            for rr in p:
                for i in rr: j=i if i>=0 else ~i; use[j]=use.get(j,0)+1
    ls=[LineString(a2[j]) for j,cnt in use.items() if cnt==2 and len(a2[j])>1]
    mm=linemerge(MultiLineString(ls)).simplify(.35)
    out['counties'][k]=[flat(q) for q in parts(mm) if q.length>.6]
for la in range(24,41,2):
    if la==34: continue
    out['grid'].append([v for lo in range(-110,-69) for v in P1(proj(lo,la))])
for lo in range(-110,-69,4): out['grid'].append([v for la in range(22,42) for v in P1(proj(lo,la))])
out['par34']=[v for i in range(0,73) for v in P1(proj(-107.5+i*.5,34))]
C={'Alvin':(-95.244,29.424,'TX',4),'Florence':(-87.677,34.800,'AL',3),'Tuscumbia':(-87.703,34.731,'AL',1),'Smyrna':(-84.514,33.884,'GA',1),'Fort Walton Beach':(-86.619,30.406,'FL',4),'Brooksville':(-82.388,28.555,'FL',1),'New Port Richey':(-82.719,28.244,'FL',1),'Tampa':(-82.459,27.951,'FL',2),'Charlotte':(-80.843,35.227,'NC',5)}
out['cities']=[{'n':k,'s':v[2],'d':v[3],'p':P1(proj(v[0],v[1]))} for k,v in C.items()]
s=json.dumps(out,separators=(',',':'))
open(OUT,'w').write(s);print(len(s),{k:sum(len(x) for x in v['polys']) for k,v in out['states'].items()},{k:sum(map(len,v)) for k,v in out['counties'].items()},[len(x) for x in out['coast']],len(out['land']),out['cities'])
