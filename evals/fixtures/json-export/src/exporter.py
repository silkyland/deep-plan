import json


def export_record(record):
    return json.dumps(record, sort_keys=True)
