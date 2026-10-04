"""Generate the Memo tool contract from an official OpenAPI export (PyYAML required)."""
import sys, json, re, hashlib
from pathlib import Path
import yaml

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
raw = source.read_bytes()
spec = yaml.safe_load(raw)

def resolve(value):
    if isinstance(value, list):
        return [resolve(v) for v in value]
    if not isinstance(value, dict):
        return value
    if '$ref' in value:
        target = spec
        for part in value['$ref'].split('/')[1:]:
            target = target[part]
        # Export sometimes labels enum refs as object. The referenced type wins.
        value = {**{k: v for k, v in value.items() if k != '$ref'}, **target}
    result = {k: resolve(v) for k, v in value.items() if k not in ('example', 'format')}
    if 'properties' in result:
        result.setdefault('type', 'object')
        result['additionalProperties'] = False
    return result

tools = []
reads = {'GetStudyProgress', 'GetTodayItems', 'QueryStudyRecords', 'ListVocabulary'}
for path, item in spec['paths'].items():
    if not path.startswith('/api/v1/memo/'):
        continue
    for method, op in item.items():
        if method not in ('get', 'post', 'patch', 'put', 'delete'):
            continue
        operation = op['operationId'].split('.')[-1]
        name = 'maimemo_' + re.sub(r'(?<!^)(?=[A-Z])', '_', operation).lower()
        read = method == 'get' or operation in reads
        properties, required, params = {}, [], []
        for p in op.get('parameters', []):
            properties[p['name']] = resolve(p['schema'])
            params.append({'name': p['name'], 'in': p['in']})
            if p.get('required'):
                required.append(p['name'])
        body = op.get('requestBody', {}).get('content', {}).get('application/json', {}).get('schema')
        if body:
            properties['body'] = resolve(body)
            required.append('body')
        if not read:
            properties['confirm'] = {'type': 'boolean', 'const': True, 'description': '用户已明确授权本次写入。须为 true。'}
            required.append('confirm')
        tools.append({'name': name, 'description': op['summary'] + '\n' + op.get('description', ''),
                      'inputSchema': {'type': 'object', 'properties': properties, 'required': required, 'additionalProperties': False},
                      'annotations': {'readOnlyHint': read, 'destructiveHint': not read, 'idempotentHint': read, 'openWorldHint': True},
                      'route': path, 'method': method.upper(), 'parameters': params, 'hasBody': bool(body)})
out = {'source': 'https://open.maimemo.com/api_bundle.yaml', 'sourceSha256': hashlib.sha256(raw).hexdigest(), 'generatedOn': '2026-10-04', 'tools': tools}
(root / 'server').mkdir(exist_ok=True)
(root / 'server/catalog.json').write_text(json.dumps(out, ensure_ascii=False, indent=2, default=str) + '\n', encoding='utf-8')
print(f'Generated {len(tools)} Memo tools.')
