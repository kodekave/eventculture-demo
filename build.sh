#!/bin/sh
# Rebuilds the single-file demo from the source parts in src/
cd "$(dirname "$0")"
python3 - <<'PY'
css=open('src/styles.css').read()
js=''.join(open('src/'+f).read()+'\n' for f in ["data.js","art.js","app1.js","app2.js","app3.js","app4.js","app5.js"])
shell=open('src/shell.html').read()
open('index.html','w').write(shell.replace('/*CSS*/',css).replace('/*JS*/',js.replace('</script>','<\\/script>')))
PY
echo "built index.html"
