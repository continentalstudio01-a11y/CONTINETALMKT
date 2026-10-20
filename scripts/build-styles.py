from pathlib import Path
root=Path(__file__).resolve().parent.parent
files=['base.css','brand.css','enhancements.css']
content='\n'.join('/* '+name+' */\n'+(root/'styles'/name).read_text() for name in files)
(root/'dist/continental.css').write_text(content)
print('Built dist/continental.css ('+str(len(content.encode()))+' bytes)')
