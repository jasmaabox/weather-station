MAX_INT = 9007199254740991 # Sync this value with `receiver/src/utils.js`

def zeroPad(value, targetLen):
    value = str(value)
    pad = targetLen - len(value)
    if (pad < 0):
        return value
    return "0"*pad + value


def timestamp2key(timestamp):
    targetLen = len(str(MAX_INT))
    diff = MAX_INT - timestamp
    return zeroPad(diff, targetLen)


def build_multipart_form(data, boundary):
    payload = ""
    for k in data:
        payload += f"--{boundary}\r\n"
        payload += f"Content-Disposition: form-data; name=\"{k}\"\r\n\r\n"
        payload += f"{data[k]}\r\n"
    payload += f"--{boundary}--\r\n"
    return payload.encode()
