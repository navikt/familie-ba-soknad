#!/usr/bin/env python3

from os import getenv
from subprocess import run
from pathlib import Path


out_dir = Path(getenv("KEY_OUTPUT_DIRECTORY"))
app_keys_comma_separated: str = getenv("APPS")
app_keys = app_keys_comma_separated.split(',')

for app in app_keys:
    output_file_name = f"{app}.json"
    output_file = out_dir / output_file_name

    if output_file.exists():
        # Only need to generate keys once, rewriting could cause problems
        print(f"Skipping key for {app} as it already exists")
        continue

    print(f"Generating JWK for {app}")
    result = run("/jwker", capture_output=True)
    as_text = result.stdout.decode()
    # Remove the info-text about copying the file to a certain location, we only want the JWK
    jwk = "\n".join(as_text.split('\n')[1:])

    if not out_dir.is_dir():
        out_dir.mkdir()

    with open(output_file, 'w') as fp:
        fp.write(jwk)
        print(f"Wrote JWK to {output_file}")
