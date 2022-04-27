import sys
import json
import ast
a = json.dumps(sys.argv)
b = json.loads(json.loads(a)[-1])
print(type(b))
sys.stdout.flush()