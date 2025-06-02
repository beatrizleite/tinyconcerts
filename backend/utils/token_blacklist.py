blacklist = set()


def add_token_to_blacklist(jti):
    blacklist.add(jti)


def is_token_revoked(jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blacklist
