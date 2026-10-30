import fitz,re
from fontTools.ttLib.standardGlyphOrder import standardGlyphOrder
from fontTools.agl import toUnicode

def glyph(n):
    overrides={191:'fi',192:'fl',4231:'ff',3032:'−'}
    if n in overrides:return overrides[n]
    return toUnicode(standardGlyphOrder[n]) if n < len(standardGlyphOrder) else ''

def cmap(mapping,width):
    vals=[]
    for n,s in mapping.items():
        if s:vals.append(f'<{n:0{width}x}> <{s.encode("utf-16-be").hex()}>')
    chunks=['\n'.join(vals[i:i+90]) for i in range(0,len(vals),90)]
    return ('/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /Fixed def /CMapType 2 def 1 begincodespacerange <'+'0'*width+'> <'+'f'*width+'> endcodespacerange\n'+'\n'.join(f'{len(c.splitlines())} beginbfchar\n{c}\nendbfchar' for c in chunks)+'\nendcmap CMapName currentdict /CMap defineresource pop end end').encode()

def fix(doc):
    seen=set()
    for p in doc:
        for x,*rest in p.get_fonts():
            if x in seen:continue
            seen.add(x)
            kind,encoding=doc.xref_get_key(x,'Encoding')
            mapping=None;width=2
            if kind=='xref':
                enc=doc.xref_object(int(encoding.split()[0]));m=re.search(r'/Differences\s*\[(.*?)\]',enc,re.S)
                if m and '/g' in m[1]:
                    mapping={};n=0
                    for tok in re.findall(r'/[^\s/\[\]]+|\d+',m[1]):
                        if tok.isdigit():n=int(tok);continue
                        name=tok[1:];mapping[n]=glyph(int(name[1:])) if re.fullmatch('g[0-9]+',name) else toUnicode(name);n+=1
            elif encoding=='/Identity-H' and doc.xref_get_key(x,'ToUnicode')[0]=='null':
                mapping={n:glyph(n) for n in range(1,258)};width=4
            if mapping:
                new=doc.get_new_xref();doc.update_object(new,'<< >>');doc.update_stream(new,cmap(mapping,width));doc.xref_set_key(x,'ToUnicode',f'{new} 0 R')
    return fitz.open(stream=doc.tobytes(),filetype='pdf')
