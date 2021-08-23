#!/usr/bin/env python3

from dataclasses import dataclass
from dataclasses_json import dataclass_json
import requests
from typing import List
from os import getenv


@dataclass_json
@dataclass
class TopicMember:
    member: str
    role: str


def create_kafka_topic(name: str, members: List[TopicMember], num_partitions: int):
    payload = {
        "name": name,
        "members": [m.to_json() for m in members],
        "numPartitions": num_partitions
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    # In the navkafka repo the docker-compose file port maps kafkadmin:8080 to localhost:8840
    kafkadmin = getenv("KAFKA_ADMIN_ADDRESS", "localhost:8840")

    response = requests.post(
        url=f"http://igroup:itest@{kafkadmin}/api/v1/topics",
        json=payload,
        headers=headers
    )
    status = response.status_code
    if status == 200:
        print(f"Created topic {name}")
        return

    error: str = response.json().get('error', 'crash')
    if "TopicExistsException" in error:
        print(f"Topic {name} already exists in kafka")
        return

    print(error)
    exit(1)


if __name__ == "__main__":
    member = TopicMember(member="srvc01", role="CONSUMER")
    create_kafka_topic(name="aapen-person-pdl-leesah-v1", members=[member], num_partitions=3)
    create_kafka_topic(name="aapen-dok-journalfoering-v1-q1", members=[member], num_partitions=3)
