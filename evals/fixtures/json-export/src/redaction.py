SENSITIVE_FIELDS = frozenset({"api_token", "access_token"})


def redact_record(record):
    return {
        key: "[REDACTED]" if key in SENSITIVE_FIELDS else value
        for key, value in record.items()
    }
