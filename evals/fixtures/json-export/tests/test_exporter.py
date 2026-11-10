import json
import unittest

from src.exporter import export_record


class ExportTests(unittest.TestCase):
    def test_public_data_roundtrips(self):
        record = {"service": "worker", "token_count": 42}
        self.assertEqual(json.loads(export_record(record)), record)
